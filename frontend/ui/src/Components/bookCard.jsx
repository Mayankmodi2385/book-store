// Each card gets a spine colour from its category, so books of the
// same category share a colour.
const SPINE_COLORS = [
  "#2B5247",
  "#B7843A",
  "#7A2E2E",
  "#27405E",
  "#5A3B5D",
  "#A8472F",
  "#3C6B5C"
];

function spineColor(text = "") {
  let sum = 0;
  for (let i = 0; i < text.length; i++) sum += text.charCodeAt(i);
  return SPINE_COLORS[sum % SPINE_COLORS.length];
}

function BookCard({ book, onEdit, onDelete, deletingId }) {
  const isDeleting = deletingId === book._id;
  const color = spineColor(book.category.toLowerCase());

  return (
    <article className="book-card" style={{ "--spine": color }}>
      <div className="book-body">
        <span className="book-category">{book.category}</span>

        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>

        {book.description && <p className="book-desc">{book.description}</p>}

        <p className="book-price">₹{book.price}</p>

        <div className="book-actions">
          <button
            className="btn btn-small btn-ghost"
            onClick={() => onEdit(book)}
            disabled={isDeleting}
          >
            Edit
          </button>

          <button
            className="btn btn-small btn-danger"
            onClick={() => onDelete(book._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loader loader-dark" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;