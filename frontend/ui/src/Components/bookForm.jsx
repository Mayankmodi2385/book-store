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
    <div className="book-form">
      <h2>{editingId ? "Edit Book" : "Add Book"}</h2>

      <form onSubmit={onSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
        />

        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={onChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={onChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={onChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loader"></span>
              {editingId ? "Updating..." : "Adding..."}
            </>
          ) : (
            editingId ? "Update Book" : "Add Book"
          )}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isUpdating}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default BookForm;