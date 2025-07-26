# 🎥 Videotube — Full-Stack Video Sharing Platform

**Videotube** is a YouTube-inspired full-stack video-sharing platform built entirely from scratch using the MERN stack (MongoDB, Express.js, React, Node.js), with secure authentication, media upload capabilities, and rich user interaction features.

## 🚀 Features
- 🔐 **User Auth:** Secure sign-up/login with JWT and password hashing via bcrypt
- 📹 **Video Management:** Upload videos and thumbnails to Cloudinary, with publish/unpublish functionality
- 🧑‍💻 **Dashboard:** Channel management panel to upload, edit, and manage videos/playlists
- 💬 **Community Features:** Like, comment, and subscribe to other users
- 📝 **Tweets (Posts):** In-channel micro-posts similar to YouTube Community tab
- 🗂 **Channel Tabs:** Each channel includes Videos, Playlists, Tweets, and Subscribed Channels
- 🎞️ **Playlists:** Create/delete playlists with assigned videos
- 📄 **User Pages:** Liked videos, Watch History, and Subscribers
- 🌐 **Frontend:** Built using React + Vite + Tailwind CSS
- 📡 **Backend:** Node.js + Express.js REST API, MongoDB, Mongoose, JWT, Cloudinary

## 📂 Project Structure
```bash
backend/
  ├── src/
      ├── controllers/
      ├── models/
      ├── routes/
      ├── middlewares/
      └── db/

frontend/
  ├── src/
      ├── components/
      │    └── channel/
      ├── pages/
      └── AuthContext.jsx
