# BookBridge

> **A comprehensive campus marketplace designed for university students to seamlessly trade, share, and discover academic resources.**

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black.svg)](https://socket.io/)

BookBridge connects students within the same university (e.g., `@spit.ac.in`) to facilitate a peer-to-peer exchange of textbooks, notes, and previous year question papers. It fosters a collaborative academic environment while helping students save money and reduce waste.

---

## ✨ Key Features

- 🔐 **Exclusive Authentication:** Secure signup restricted to university email domains (`@spit.ac.in`) with JWT-based session management.
- 🏪 **P2P Marketplace:** Create, browse, and manage book listings. Includes condition grading, dynamic pricing, and designated campus meetup points.
- 📁 **Academic Resources Vault:** Upload, share, and download PDF notes and past question papers.
- 🎁 **Giveaways:** A dedicated section for free book donations and resource sharing.
- 🔍 **Advanced Search & Filters:** Full-text search by book title, author, or course code.
- 🎯 **Smart Recommendations:** Content-based suggestions tailored to the user's major and current semester.
- 💬 **Real-time Chat:** Instant messaging between buyers and sellers with read receipts, powered by Socket.io.
- 📖 **ISBN Lookup Integration:** Automatically fetch book metadata and fair pricing estimates using the Google Books API.
- ☁️ **Cloud Storage:** Seamless image and document uploads managed by Cloudinary and Multer.
- ⭐ **Peer Reviews & Trust:** Rating system for sellers to build a trusted campus community.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS (v4)
- **State Management:** Redux Toolkit, React-Redux
- **Routing:** React Router DOM (v7)
- **Networking:** Axios, Socket.io-client

### Backend
- **Runtime & Framework:** Node.js, Express.js
- **Database & ORM:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js
- **Real-time Communication:** Socket.io
- **File Uploads & Storage:** Multer, Cloudinary
- **Mailing Service:** Nodemailer

---

## 📁 Project Structure

```text
BookBridge/
├── backend/                  # Node.js/Express API server
│   ├── config/               # Database and third-party service configurations
│   ├── middleware/           # Custom Express middlewares (Auth, Error handling)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── services/             # Business logic and external API integrations
│   ├── utils/                # Helper functions
│   └── server.js             # Backend entry point
│
└── frontend/                 # React frontend application
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── pages/            # Page-level components
    │   ├── store/            # Redux store and slices
    │   └── App.jsx           # Main application component
    ├── package.json          # Frontend dependencies
    └── vite.config.js        # Vite configuration



🚀 Getting Started
Follow these steps to set up the project locally on your machine.

Prerequisites
Ensure you have the following installed:

Node.js (v18 or higher)
MongoDB (Local installation or a MongoDB Atlas URI)
A Cloudinary account for image uploads
A Google Cloud account with the Google Books API enabled
1. Clone the repository
bash


git clone https://github.com/yourusername/BookBridge.git
cd BookBridge
2. Backend Setup
Navigate to the backend directory and install dependencies:

bash


cd backend
npm install
Create a .env file in the backend directory and configure the following environment variables:

env


PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=1h
ALLOWED_EMAIL_DOMAIN=spit.ac.in
# Cloudinary Configuration for Image Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Google Books API
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
# SMTP Configuration for Emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
FROM_EMAIL=noreply@bookbridge.app
# Frontend URL
CLIENT_URL=http://localhost:5173
Start the backend development server:

bash


npm run dev
The backend API will run on http://localhost:5000.

3. Frontend Setup
Open a new terminal window/tab, navigate to the frontend directory, and install dependencies:

bash


cd frontend
npm install
Start the frontend Vite development server:

bash


npm run dev
The frontend application will run on http://localhost:5173.
