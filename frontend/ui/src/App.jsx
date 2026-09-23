import { useState } from "react";
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation
} from "./services/booksApi";

function App() {
  const { data: books, isLoading } = useGetBooksQuery();

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      ...form,
      price: Number(form.price)
    };

    if (editingId) {
      await updateBook({
        id: editingId,
        ...bookData
      });

      setEditingId(null);
    } else {
      await createBook(bookData);
    }

    setForm({
      title: "",
      author: "",
      price: "",
      category: "",
      description: ""
    });
  };

  const handleEdit = (book) => {
    setEditingId(book._id);

    setForm({
      title: book.title,
      author: book.author,
      price: book.price,
      category: book.category,
      description: book.description || ""
    });
  };

  const handleDelete = async (id) => {
    await deleteBook(id);
  };

  if (isLoading) {
    return <h2>Loading books...</h2>;
  }

  return (
    <div>
      <h1>Book Store</h1>

      <h2>{editingId ? "Edit Book" : "Add Book"}</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />

        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />

        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />

        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <button type="submit">
          {editingId ? "Update Book" : "Add Book"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                title: "",
                author: "",
                price: "",
                category: "",
                description: ""
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Books</h2>

      {books?.map((book) => (
        <div key={book._id}>
          <h3>{book.title}</h3>

          <p>Author: {book.author}</p>
          <p>Price: ₹{book.price}</p>
          <p>Category: {book.category}</p>
          <p>{book.description}</p>

          <button onClick={() => handleEdit(book)}>Edit</button>

          <button onClick={() => handleDelete(book._id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;