import { useState } from "react";

import {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation
} from "./services/booksApi";

import BookForm from "./Components/bookForm";
import BookList from "./Components/bookList";
import Signup from "./Components/Signup";
import Login from "./Components/Login";

function App() {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Controls Login and Signup forms
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const { data: books, isLoading } = useGetBooksQuery(undefined, {
    skip: !token
  });

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          📚 Book Store
        </div>

        {!token ? (
          <div className="nav-buttons">

            <button
              className="login-btn"
              onClick={() => {
                setShowLogin(true);
                setShowSignup(false);
              }}
            >
              Login
            </button>

            <button
              className="signup-btn"
              onClick={() => {
                setShowSignup(true);
                setShowLogin(false);
              }}
            >
              Sign Up
            </button>

          </div>
        ) : (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </nav>

      <h1>Book Store</h1>

      {/* NOT LOGGED IN */}
      {!token ? (

        <>

          {showSignup && (
            <Signup />
          )}

          {showLogin && (
            <Login />
          )}

        </>

      ) : (

        /* LOGGED IN */
        <>

          <div>
            <h3>
              Welcome, {user?.name}
            </h3>
          </div>

          <BookForm
            form={form}
            editingId={editingId}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          {isLoading ? (
            <h2>Loading books...</h2>
          ) : (
            <BookList
              books={books}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

        </>

      )}

    </div>
  );
}

export default App;