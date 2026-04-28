const request = require('supertest');
const app = require('../../server');
const Post = require('../../src/models/Post');
const { connectTestDB, disconnectTestDB, clearDB } = require('../setup');

describe('POST API Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'My First Post',
        body: 'This is the body of my first post',
        author: 'John Doe',
      };

      const res = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(newPost.title);
      expect(res.body.data.body).toBe(newPost.body);
      expect(res.body.data.author).toBe(newPost.author);

      const postInDB = await Post.findById(res.body.data._id);
      expect(postInDB).toBeTruthy();
    });

    it('should return 400 if missing required fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .send({ title: 'Only Title' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('title, body, and author');
    });
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      await Post.create({
        title: 'Post 1',
        body: 'Body 1',
        author: 'Author 1',
      });
      await Post.create({
        title: 'Post 2',
        body: 'Body 2',
        author: 'Author 2',
      });

      const res = await request(app).get('/api/posts').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });

    it('should return empty array if no posts exist', async () => {
      const res = await request(app).get('/api/posts').expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a single post by ID', async () => {
      const post = await Post.create({
        title: 'Test Post',
        body: 'Test Body',
        author: 'Test Author',
      });

      const res = await request(app).get(`/api/posts/${post._id}`).expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id.toString()).toBe(post._id.toString());
      expect(res.body.data.title).toBe('Test Post');
    });

    it('should return 404 if post does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app).get(`/api/posts/${fakeId}`).expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Post not found');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const res = await request(app).get('/api/posts/invalid123').expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid post ID');
    });
  });

  describe('PATCH /api/posts/:id', () => {
    it('should update a post with partial data', async () => {
      const post = await Post.create({
        title: 'Original Title',
        body: 'Original Body',
        author: 'Original Author',
      });

      const res = await request(app)
        .patch(`/api/posts/${post._id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.body).toBe('Original Body');
      expect(res.body.data.author).toBe('Original Author');
    });

    it('should return 404 if post does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .patch(`/api/posts/${fakeId}`)
        .send({ title: 'New Title' })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Post not found');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post and return 204', async () => {
      const post = await Post.create({
        title: 'To Delete',
        body: 'Body',
        author: 'Author',
      });

      await request(app).delete(`/api/posts/${post._id}`).expect(204);

      const deletedPost = await Post.findById(post._id);
      expect(deletedPost).toBeNull();
    });

    it('should return 404 if post does not exist', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app).delete(`/api/posts/${fakeId}`).expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Post not found');
    });
  });
});
