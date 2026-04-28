import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPost, deletePost, fetchPosts, updatePost } from './postsApi';

const originalFetch = global.fetch;

describe('postsApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.fetch = originalFetch;
  });

  it('returns posts from the API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ data: [{ _id: '1', title: 'A' }] }),
    });

    await expect(fetchPosts()).resolves.toEqual([{ _id: '1', title: 'A' }]);
  });

  it('creates a post through the API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ data: { _id: '1', title: 'A' } }),
    });

    await expect(createPost({ title: 'A' })).resolves.toEqual({ _id: '1', title: 'A' });
  });

  it('throws the server error message on failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ error: 'Nope' }),
    });

    await expect(updatePost('1', { title: 'B' })).rejects.toThrow('Nope');
  });

  it('deletes a post through the API', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => null,
      },
      json: async () => null,
    });

    await expect(deletePost('1')).resolves.toBeUndefined();
  });
});
