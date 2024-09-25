const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
  const { content, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newPost = new Post({
      user: user._id,
      content,
    });

    await newPost.save();
    user.points += 10; // Gamification: Add points for posting
    await user.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'username avatar').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

