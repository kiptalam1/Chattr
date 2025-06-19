# Chattr

 *A messaging app that allows users to send messages to each other.*


🛠️ Tech Stack

    Frontend: React (with Context API)

    Backend: Node.js, Express.js

    Database: MongoDB + Mongoose

    Realtime: Socket.IO (WebSocket-based)

    Auth: JWT (JSON Web Tokens)

    Styling: CSS Modules + CSS Variables (Dark/Light Mode)

    Uploads: Multer (local or Cloudinary)


🚀 Development Roadmap (Testable Per Step)
✅ Step 1: Project Setup

    Create monorepo: client/ + server/

    Enable ESM ("type": "module")

    Setup .env files for sensitive config

    Setup basic dev script (nodemon, concurrently)

🔎 Test: Console logs run from both client and server
✅ Step 2: Express Server + MongoDB

    Install core backend deps: express, mongoose, cors, dotenv

    Connect to MongoDB using Mongoose

    Create User model schema

🔎 Test: Server runs → DB connects → sample user saved
✅ Step 3: Authentication System (JWT)

    Install: bcrypt, jsonwebtoken

    Create /auth/register and /auth/login routes

    Hash passwords with bcrypt

    Issue JWT tokens on login

    Protect routes with verifyToken middleware

🔎 Test: Register & login via Postman → secure /profile route
✅ Step 4: React Frontend + Auth Context

    Setup React app with axios, react-router-dom

    Build AuthContext to manage JWT & user state

    Forms for Register & Login

🔎 Test: Register/login from frontend → store token → redirect on success
✅ Step 5: Setup Socket.IO

    Backend: Attach Socket.IO to HTTP server

    Frontend: Connect using socket.io-client

    Store socket connection in context

🔎 Test: Open console → see unique socket ID on connect
✅ Step 6: Global Chat (One Room)

    Emit/receive send_message + receive_message events

    Display real-time message flow across tabs

🔎 Test: Two tabs exchange messages instantly
✅ Step 7: Private 1-to-1 Chat (DMs)

    On login, map userId → socket.id

    Add send_private_message handler (Socket.IO)

    Check friendship or auth

    Chat UI opens per user

🔎 Test: Direct message goes only to the target user
✅ Step 8: Group Chat / Room System

    Create/join/leave named rooms

    Use socket.join(room) and io.to(room).emit(...)

    Chat messages scoped to room

🔎 Test: Room messages are isolated between members
✅ Step 9: Friends System

    Create FriendRequest model

    Routes: send request, accept, list friends

    UI to search, add, and display friends

🔎 Test: Only accepted friends can initiate private chats
✅ Step 10: Image Messaging

    Install multer

    Backend: Accept image uploads

    Store locally or with Cloudinary

    Send image URLs via Socket.IO

    Frontend: File input + preview

🔎 Test: Upload and display image in chat bubble
✅ Step 11: Online Users Indicator

    Track online users in memory (userId ↔ socket.id)

    Broadcast presence on connect/disconnect

    Frontend: Show real-time online list

🔎 Test: Users appear/disappear in live sidebar as they connect
✅ Step 12: Deploy (Final Step)

    Backend: Render, Railway, or Fly.io

    Frontend: Netlify or Vercel

    Use CORS and environment configs

    Confirm Socket.IO works cross-origin

🔎 Test: All features work on live URLs across browsers
🔥 Extra Features (Implemented for Credit)

    🌙 Dark/Light mode via [data-theme] and CSS variables

    📸 Image uploads and real-time rendering

    🎯 Scheduled messages (optional enhancement)

    🧪 Ephemeral threads (optional enhancement)

    🛡️ Invisible mode / ghost reads (optional enhancement)