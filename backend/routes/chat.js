import express from 'express';
import Conversation from '../models/Conversation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar')
      .populate('item', 'title images price')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { recipientId, itemId } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      item: itemId,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        item: itemId,
        messages: [],
      });
    }

    const populated = await conversation.populate([
      { path: 'participants', select: 'name avatar' },
      { path: 'item', select: 'title images price' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name avatar')
      .populate('item', 'title images price')
      .populate('messages.sender', 'name');

    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(
      (p) => p._id.toString() === req.user._id.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: 'Access denied' });

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/messages', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const isParticipant = conversation.participants.some(
      (id) => id.toString() === req.user._id.toString()
    );
    if (!isParticipant) return res.status(403).json({ message: 'Access denied' });

    const message = {
      sender: req.user._id,
      text: req.body.text,
      seen: false,
    };

    conversation.messages.push(message);
    conversation.lastMessage = req.body.text;
    await conversation.save();

    const populated = await Conversation.findById(conversation._id)
      .populate('messages.sender', 'name');

    const newMsg = populated.messages[populated.messages.length - 1];
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/seen', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ message: 'Not found' });

    conversation.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.user._id.toString()) {
        msg.seen = true;
      }
    });
    await conversation.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
