import { useEffect, useState } from 'react';
import { createPost, deletePost, fetchPosts, updatePost } from './services/postsApi';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import './styles/app.css';

const EMPTY_FORM = { title: '', body: '', author: '' };

function App() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (requestError) {
        setError(requestError.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingPostId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingPostId) {
        const updatedPost = await updatePost(editingPostId, formData);
        setPosts((currentPosts) =>
          currentPosts.map((post) => (post._id === editingPostId ? updatedPost : post))
        );
      } else {
        const createdPost = await createPost(formData);
        setPosts((currentPosts) => [createdPost, ...currentPosts]);
      }

      resetForm();
    } catch (requestError) {
      setError(requestError.message || 'Unable to save post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setFormData({
      title: post.title,
      body: post.body,
      author: post.author,
    });
  };

  const handleDelete = async (postId) => {
    setError('');

    try {
      await deletePost(postId);
      setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete post');
    }
  };

  return (
    <main className="app-shell">
      <section className="hero card">
        <div>
          <p className="eyebrow">Full-stack blog platform</p>
          <h1>Write, edit, and ship posts from one clean interface.</h1>
          <p className="hero-copy">
            This frontend talks to the Express + MongoDB backend and gives you a simple CRUD
            workspace for managing blog content.
          </p>
        </div>
        <div className="hero-stats" aria-label="Dashboard summary">
          <div>
            <span className="stat-value">{posts.length}</span>
            <span className="stat-label">Posts loaded</span>
          </div>
          <div>
            <span className="stat-value">{editingPostId ? 'Edit' : 'Create'}</span>
            <span className="stat-label">Current mode</span>
          </div>
        </div>
      </section>

      <section className="layout-grid">
        <PostForm
          formData={formData}
          editingPostId={editingPostId}
          loading={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}

export default App;
