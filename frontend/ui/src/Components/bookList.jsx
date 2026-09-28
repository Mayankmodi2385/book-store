import BookCard from "./bookCard";

function bookList({ books, onEdit, onDelete, isDeleting }) {
  return (
    <div className="book-list">
      <h2>Books</h2>

    <div className="books-grid">
      {books?.map((book) => (
        <bookCard
    key={book._id}
    book={book}
    onEdit={onEdit}
    onDelete={onDelete}
    isDeleting={isDeleting}
/>
      ))}
    </div>
    </div>
  );
}

export default bookList;