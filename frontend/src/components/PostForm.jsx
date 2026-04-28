function PostForm({ formData, editingPostId, loading, onChange, onSubmit, onCancel }) {
  return (
    <section className="card form-card" aria-labelledby="post-form-title">
      <div className="section-header">
        <div>
          <p className="eyebrow">{editingPostId ? 'Edit mode' : 'Create mode'}</p>
          <h2 id="post-form-title">{editingPostId ? 'Update post' : 'Create a new post'}</h2>
        </div>
        {editingPostId ? (
          <button type="button" className="button button-secondary" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <form className="post-form" onSubmit={onSubmit}>
        <label>
          <span>Title</span>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={onChange}
            placeholder="A sharper headline"
            required
            maxLength={200}
          />
        </label>

        <label>
          <span>Body</span>
          <textarea
            name="body"
            value={formData.body}
            onChange={onChange}
            placeholder="Tell the story"
            rows={8}
            required
          />
        </label>

        <label>
          <span>Author</span>
          <input
            name="author"
            type="text"
            value={formData.author}
            onChange={onChange}
            placeholder="Your name"
            required
          />
        </label>

        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Saving...' : editingPostId ? 'Save changes' : 'Publish post'}
        </button>
      </form>
    </section>
  );
}

export default PostForm;
