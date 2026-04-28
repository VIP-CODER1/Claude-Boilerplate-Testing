const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Please provide post body'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries on creation date
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
