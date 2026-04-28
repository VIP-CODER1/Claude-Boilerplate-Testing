import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const mockFetchPosts = vi.hoisted(() => vi.fn());
const mockCreatePost = vi.hoisted(() => vi.fn());
const mockUpdatePost = vi.hoisted(() => vi.fn());
const mockDeletePost = vi.hoisted(() => vi.fn());

vi.mock('./services/postsApi', () => ({
  fetchPosts: mockFetchPosts,
  createPost: mockCreatePost,
  updatePost: mockUpdatePost,
  deletePost: mockDeletePost,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchPosts.mockResolvedValue([]);
    mockCreatePost.mockResolvedValue({
      _id: 'created-post',
      title: 'New post',
      body: 'Post body',
      author: 'Ada',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
    mockUpdatePost.mockResolvedValue({
      _id: 'post-1',
      title: 'Updated title',
      body: 'Updated body',
      author: 'Ada',
      createdAt: '2024-01-01T00:00:00.000Z',
    });
    mockDeletePost.mockResolvedValue(undefined);
  });

  it('loads posts and renders the empty state', async () => {
    render(<App />);

    expect(screen.getByText('Loading posts from the backend...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No posts yet. Create the first one to populate the feed.')).toBeInTheDocument();
    });

    expect(mockFetchPosts).toHaveBeenCalledTimes(1);
  });

  it('creates a post and shows it in the list', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No posts yet. Create the first one to populate the feed.')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New post' } });
    fireEvent.change(screen.getByLabelText('Body'), { target: { value: 'Post body' } });
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Ada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Publish post' }));

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith({
        title: 'New post',
        body: 'Post body',
        author: 'Ada',
      });
    });

    expect(screen.getByText('New post')).toBeInTheDocument();
    expect(screen.getByText('By Ada')).toBeInTheDocument();
  });

  it('enters edit mode and saves changes', async () => {
    mockFetchPosts.mockResolvedValueOnce([
      {
        _id: 'post-1',
        title: 'Original title',
        body: 'Original body',
        author: 'Ada',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Original title')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated title' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(mockUpdatePost).toHaveBeenCalledWith('post-1', {
        title: 'Updated title',
        body: 'Original body',
        author: 'Ada',
      });
    });

    expect(screen.getByText('Updated title')).toBeInTheDocument();
  });

  it('deletes a post when asked', async () => {
    mockFetchPosts.mockResolvedValueOnce([
      {
        _id: 'post-1',
        title: 'Delete me',
        body: 'Body',
        author: 'Ada',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Delete me')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(mockDeletePost).toHaveBeenCalledWith('post-1');
    });

    expect(screen.queryByText('Delete me')).not.toBeInTheDocument();
  });
});
