const express = require('express');
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController');

const router = express.Router();

// Get all posts
router.get('/', getPosts);

// Create a new post
router.post('/', createPost);

// Get a single post
router.get('/:id', getPostById);

// Update a post
router.patch('/:id', updatePost);

// Delete a post
router.delete('/:id', deletePost);

module.exports = router;
