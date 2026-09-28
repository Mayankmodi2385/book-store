function BookCard({
  book,
  onEdit,
  onDelete,
  deletingId
}) {
  const isDeleting = deletingId === book._id;

  return (
    <div className="book-card">
      <h3>{book.title}</h3>

      <p>Author: {book.author}</p>

      <p>Price: ₹{book.price}</p>

      <p>Category: {book.category}</p>

      <p>{book.description}</p>

      <button
        onClick={() => onEdit(book)}
        disabled={isDeleting}
      >
        Edit
      </button>

      <button
        onClick={() => onDelete(book._id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <span className="loader"></span>
            Deleting...
          </>
        ) : (
          "Delete"
        )}
      </button>
    </div>
  );
}

export default BookCard;