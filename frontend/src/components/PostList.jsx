function PostList({ posts, loading, error, onEdit, onDelete }) {
  return (
    <section className="card list-card" aria-labelledby="post-list-title">
      <div className="section-header">
        <div>
          <p className="eyebrow">Content library</p>
          <h2 id="post-list-title">Published posts</h2>
        </div>
      </div>

      {error ? <p className="alert alert-error">{error}</p> : null}
      {loading ? <p className="empty-state">Loading posts from the backend...</p> : null}
      {!loading && posts.length === 0 ? (
        <p className="empty-state">No posts yet. Create the first one to populate the feed.</p>
      ) : null}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post._id} className="post-item">
            <article>
              <header className="post-item-header">
                <div>
                  <h3>{post.title}</h3>
                  <p className="post-meta">By {post.author}</p>
                </div>
                <p className="post-meta">{new Date(post.createdAt).toLocaleDateString()}</p>
              </header>
              <p className="post-body">{post.body}</p>
            </article>
            <div className="post-actions">
              <button type="button" className="button button-secondary" onClick={() => onEdit(post)}>
                Edit
              </button>
              <button type="button" className="button button-danger" onClick={() => onDelete(post._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PostList;
