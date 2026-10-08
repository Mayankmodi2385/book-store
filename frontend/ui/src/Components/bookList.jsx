import BookCard from "./bookCard";

function BookList({ books, onEdit, onDelete, deletingId }) {
  const count = books?.length || 0;

  return (
    <section className="book-list">
      <h2 className="section-title">
        Your books <span className="count">{count}</span>
      </h2>

      {count === 0 ? (
        <div className="empty">
          <p className="empty-title">Your shelf is empty</p>
          <p className="empty-text">
            Add your first book using the form above and it will show up here.
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default BookList;