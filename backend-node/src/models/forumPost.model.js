import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['GENERAL', 'ADOPTION', 'RESCUE', 'HEALTH', 'BEHAVIOR', 'LOST_FOUND', 'SUCCESS_STORIES', 'ANNOUNCEMENTS'],
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  comments: [commentSchema],
  tags: [String],
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  pinned: {
    type: Boolean,
    default: false
  },
  locked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
forumPostSchema.index({ category: 1, createdAt: -1 });
forumPostSchema.index({ authorId: 1, createdAt: -1 });

const ForumPost = mongoose.model('ForumPost', forumPostSchema, 'forum_posts');

export default ForumPost;
