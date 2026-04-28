const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../../src/controllers/postController');
const Post = require('../../src/models/Post');

// Mock the Post model
jest.mock('../../src/models/Post');

describe('PostController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createPost', () => {
    it('should create a post with valid data', async () => {
      const mockPost = {
        _id: '123',
        title: 'Test Post',
        body: 'This is a test',
        author: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      Post.create.mockResolvedValue(mockPost);

      req.body = { title: 'Test Post', body: 'This is a test', author: 'John Doe' };

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockPost });
    });

    it('should return 400 if missing required fields', async () => {
      req.body = { title: 'Test Post' }; // Missing body and author

      await createPost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Please provide title, body, and author',
      });
    });

    it('should call next on database error', async () => {
      const error = new Error('DB Error');
      Post.create.mockRejectedValue(error);
      req.body = { title: 'Test', body: 'Test', author: 'Test' };

      await createPost(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getPosts', () => {
    it('should return all posts', async () => {
      const mockPosts = [
        { _id: '1', title: 'Post 1', body: 'Body 1', author: 'Author 1' },
        { _id: '2', title: 'Post 2', body: 'Body 2', author: 'Author 2' },
      ];
      Post.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPosts),
      });

      await getPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockPosts,
      });
    });

    it('should return empty array if no posts exist', async () => {
      Post.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      await getPosts(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 0,
        data: [],
      });
    });

    it('should call next on database error', async () => {
      const error = new Error('DB Error');
      Post.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(error),
      });

      await getPosts(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getPostById', () => {
    it('should return a post by ID', async () => {
      const mockPost = { _id: '123', title: 'Test', body: 'Body', author: 'Author' };
      Post.findById.mockResolvedValue(mockPost);
      req.params = { id: '123' };

      await getPostById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockPost });
    });

    it('should return 404 if post not found', async () => {
      Post.findById.mockResolvedValue(null);
      req.params = { id: '999' };

      await getPostById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Post not found',
      });
    });

    it('should return 400 for invalid ObjectId', async () => {
      const error = new Error('Invalid ID');
      error.kind = 'ObjectId';
      Post.findById.mockRejectedValue(error);
      req.params = { id: 'invalid' };

      await getPostById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid post ID',
      });
    });
  });

  describe('updatePost', () => {
    it('should update a post with partial data', async () => {
      const mockPost = {
        _id: '123',
        title: 'Old Title',
        body: 'Old Body',
        author: 'Old Author',
        save: jest.fn().mockResolvedValue(null),
      };
      Post.findById.mockResolvedValue(mockPost);
      req.params = { id: '123' };
      req.body = { title: 'New Title' };

      await updatePost(req, res, next);

      expect(mockPost.title).toBe('New Title');
      expect(mockPost.body).toBe('Old Body'); // Unchanged
      expect(mockPost.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update all fields if provided', async () => {
      const mockPost = {
        _id: '123',
        title: 'Old Title',
        body: 'Old Body',
        author: 'Old Author',
        save: jest.fn().mockResolvedValue(null),
      };
      Post.findById.mockResolvedValue(mockPost);
      req.params = { id: '123' };
      req.body = { title: 'New Title', body: 'New Body', author: 'New Author' };

      await updatePost(req, res, next);

      expect(mockPost.title).toBe('New Title');
      expect(mockPost.body).toBe('New Body');
      expect(mockPost.author).toBe('New Author');
      expect(mockPost.save).toHaveBeenCalled();
    });

    it('should return 404 if post not found', async () => {
      Post.findById.mockResolvedValue(null);
      req.params = { id: '999' };
      req.body = { title: 'New Title' };

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 for invalid ObjectId', async () => {
      const error = new Error('Invalid ID');
      error.kind = 'ObjectId';
      Post.findById.mockRejectedValue(error);
      req.params = { id: 'invalid' };
      req.body = { title: 'New Title' };

      await updatePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid post ID',
      });
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return 204', async () => {
      const mockPost = { _id: '123', title: 'Test' };
      Post.findByIdAndDelete.mockResolvedValue(mockPost);
      req.params = { id: '123' };

      await deletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if post not found', async () => {
      Post.findByIdAndDelete.mockResolvedValue(null);
      req.params = { id: '999' };

      await deletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Post not found',
      });
    });

    it('should return 400 for invalid ObjectId', async () => {
      const error = new Error('Invalid ID');
      error.kind = 'ObjectId';
      Post.findByIdAndDelete.mockRejectedValue(error);
      req.params = { id: 'invalid' };

      await deletePost(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid post ID',
      });
    });
  });
});
