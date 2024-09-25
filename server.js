const express = require('express');   // Import express first
const mongoose = require('mongoose'); // Import mongoose for DB connection
const cors = require('cors');         // For Cross-Origin Resource Sharing
const http = require('http');         // Core module for creating HTTP server
const { Server } = require('socket.io'); // Import Socket.IO for real-time features

const app = express(); // Initialize 'app' before using it

// Middleware
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());         // Enable CORS

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/socialApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Database connection error:', err));

// Define your routes here
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
app.use('/api/auth', authRoutes);  // Use the auth routes
app.use('/api/posts', postRoutes); // Use the post routes

// Create the HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Socket.IO configuration for real-time features
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('newPost', (post) => {
    io.emit('newPostNotification', post); // Broadcast new post
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start Server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
