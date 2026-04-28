const Post = require('../models/Post');

// Create a new post
exports.createPost = async (req, res, next) => {
  try {
    const { title, body, author } = req.body;

    // Validation
    if (!title || !body || !author) {
      return res.status(400).json({
        success: false,
        error: 'Please provide title, body, and author',
      });
    }

    const post = await Post.create({ title, body, author });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Get all posts
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single post by ID
exports.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
    }
    next(error);
  }
};

// Update a post
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, body, author } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Update only provided fields
    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (author !== undefined) post.author = author;

    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
    }
    next(error);
  }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid post ID',
      });
    }
    next(error);
  }
};
