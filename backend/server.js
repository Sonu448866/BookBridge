import './config/env.js';
import cluster from 'cluster';
import os from 'os';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { UPLOAD_DIR, verifyCloudinary } from './config/cloudinary.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import searchRoutes from './routes/search.js';
import recRoutes from './routes/recommendations.js';
import chatRoutes from './routes/chat.js';
import reviewRoutes from './routes/reviews.js';
import uploadRoutes from './routes/upload.js';
import Conversation from './models/Conversation.js';

const PORT = process.env.PORT || 5000;
const useCluster = process.env.NODE_ENV === 'production';

function startServer() {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
  });

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.use(express.json({ limit: '10mb' }));
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/recommendations', recRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/upload', uploadRoutes);

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
    });

    socket.on('send_message', async ({ conversationId, senderId, text }) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const message = { sender: senderId, text, seen: false };
        conversation.messages.push(message);
        conversation.lastMessage = text;
        await conversation.save();

        const newMsg = conversation.messages[conversation.messages.length - 1];
        io.to(conversationId).emit('new_message', {
          _id: newMsg._id,
          sender: senderId,
          text,
          seen: false,
          createdAt: newMsg.createdAt,
        });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('typing', ({ conversationId, userName }) => {
      socket.to(conversationId).emit('user_typing', userName);
    });

    socket.on('mark_seen', async (conversationId) => {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

      conversation.messages.forEach((msg) => {
        if (msg.sender.toString() !== socket.userId) msg.seen = true;
      });
      await conversation.save();
      io.to(conversationId).emit('messages_seen');
    });

    socket.on('disconnect', () => {
      if (socket.userId) onlineUsers.delete(socket.userId);
    });
  });

  connectDB()
    .then(async () => {
      const cloud = await verifyCloudinary();
      if (cloud.ok) {
        console.log('Cloudinary connected');
      } else if (process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn(`Cloudinary misconfigured (${cloud.reason}). Uploads will save locally.`);
      }

      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (pid ${process.pid})`);
      });
    })
    .catch((err) => {
      console.error('DB connection failed:', err.message);
      process.exit(1);
    });
}

if (useCluster && cluster.isPrimary) {
  const workers = os.cpus().length;
  console.log(`Primary ${process.pid} starting ${workers} workers`);
  for (let i = 0; i < workers; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting`);
    cluster.fork();
  });
} else {
  startServer();
}
