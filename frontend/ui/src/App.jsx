import { useState } from "react";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation
} from "./services/booksApi";

import BookForm from "./Components/bookForm";
import BookList from "./Components/bookList";

function App() {
  const { data: books, isLoading } = useGetBooksQuery();

  const [createBook, { isLoading: isCreating }] =
    useCreateBookMutation();

  const [updateBook, { isLoading: isUpdating }] =
    useUpdateBookMutation();

  const [deleteBook] = useDeleteBookMutation();

  const [deletingId, setDeletingId] = useState(null);

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
    setDeletingId(id);

    await deleteBook(id);

    setDeletingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);

    setForm({
      title: "",
      author: "",
      price: "",
      category: "",
      description: ""
    });
  };

  if (isLoading) {
    return <h2>Loading books...</h2>;
  }

  return (
    <div className="app">
      <h1>Book Store</h1>
      <Signup />
      <Login />
      <BookForm
        form={form}
        editingId={editingId}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />
      

      <BookList
        books={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}

export default App;