# BookBridge

Campus marketplace for university students to trade, share, and discover academic resources.

## Structure

```
BookBridge/
├── backend/     Express API, MongoDB, Socket.io
└── frontend/    React 18, Tailwind CSS, Redux Toolkit
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

API runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Features

| Area | What's included |
|------|-----------------|
| **Auth** | University email signup (@spit.ac.in), JWT sessions |
| **Marketplace** | P2P book listings with condition, pricing, meetup points |
| **Resources** | Notes and question papers (PDF upload) |
| **Giveaways** | Free book donations |
| **Search** | Full-text search by title, author, course code |
| **Recommendations** | Content-based picks by major and semester |
| **Chat** | Real-time messaging with seen receipts (Socket.io) |
| **ISBN Lookup** | Google Books API for metadata and fair pricing |
| **Uploads** | Cloudinary for images and documents |
| **Reviews** | Peer ratings for seller trust |

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required keys.

**Never commit `.env` files.** See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup and security checklist.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Socket.io Client
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Bcrypt, Socket.io, Multer, Cloudinary, Nodemailer

## Deployment

- Frontend: Vercel (`npm run build`)
- Backend: Render (set `NODE_ENV=production` for cluster mode)
