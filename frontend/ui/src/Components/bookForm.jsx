function BookForm({
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel,
  isCreating,
  isUpdating
}) {
  const isSubmitting = isCreating || isUpdating;

  return (
    <section className="panel book-form">
      <h2 className="panel-title">{editingId ? "Edit book" : "Add a book"}</h2>

      <form onSubmit={onSubmit} className="book-form-grid">
        <label className="field">
          <span className="field-label">Title</span>
          <input
            name="title"
            placeholder="Book title"
            value={form.title}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Author</span>
          <input
            name="author"
            placeholder="Author name"
            value={form.author}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Price (₹)</span>
          <input
            name="price"
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="499"
            value={form.price}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Category</span>
          <input
            name="category"
            placeholder="Fiction, Science, Comics..."
            value={form.category}
            onChange={onChange}
            required
          />
        </label>

        <label className="field field-wide">
          <span className="field-label">Description</span>
          <textarea
            name="description"
            placeholder="A short note about the book (optional)"
            value={form.description}
            onChange={onChange}
          />
        </label>

        <div className="form-actions field-wide">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="loader" />
                {editingId ? "Saving..." : "Adding..."}
              </>
            ) : editingId ? (
              "Save changes"
            ) : (
              "Add book"
            )}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={isUpdating}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default BookForm;