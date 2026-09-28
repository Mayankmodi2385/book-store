function bookCard({ book, onEdit, onDelete }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>

      <p>Author: {book.author}</p>
      <p>Price: ₹{book.price}</p>
      <p>Category: {book.category}</p>
      <p>{book.description}</p>

      <button onClick={() => onEdit(book)}>Edit</button>
      <button onClick={() => onDelete(book._id)}>Delete</button>
    </div>
  );
}

export default bookCard;