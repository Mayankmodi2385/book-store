import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import {
  booksApi,
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation
} from "./services/booksApi";

import BookForm from "./Components/bookForm";
import BookList from "./Components/bookList";
import Signup from "./Components/Signup";
import Login from "./Components/Login";

// "mayank" -> "Mayank"
function capitalize(text = "") {
  const t = text.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

// "Mayank's Book Store" (names ending with "s" become "Chris' Book Store")
function storeName(user) {
  const name = (user?.name || "").trim();
  if (!name) return "Book Store";

  const first = capitalize(name);
  const possessive = /s$/i.test(first) ? `${first}'` : `${first}'s`;

  return `${possessive} Book Store`;
}

const EMPTY_FORM = {
  title: "",
  author: "",
  price: "",
  category: "",
  description: ""
};

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function App() {
  const dispatch = useDispatch();

  // Logged-in state lives in React state, so the page switches instantly
  // without window.location.reload().
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(readUser);

  // Which auth page to show when logged out. Login is the first page.
  const [view, setView] = useState("login");
  const [notice, setNotice] = useState("");

  const {
    data: books,
    isLoading,
    error: booksError
  } = useGetBooksQuery(undefined, { skip: !token });

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Browser tab title
  useEffect(() => {
    document.title = token ? storeName(user) : "Book Store";
  }, [token, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear cached books so the next user never sees them.
    dispatch(booksApi.util.resetApiState());

    setToken(null);
    setUser(null);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setNotice("");
    setView("login");
  };

  // If the token expired, the server answers 401. Send the user back to login.
  useEffect(() => {
    if (booksError?.status === 401) {
      /* eslint-disable react-hooks/set-state-in-effect */
      handleLogout();
      setNotice("Your session expired. Please log in again.");
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booksError]);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    setNotice("");
  };

  const handleSignupSuccess = () => {
    setNotice("Account created. Log in to continue.");
    setView("login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = { ...form, price: Number(form.price) };

    try {
      if (editingId) {
        await updateBook({ id: editingId, ...bookData }).unwrap();
        setEditingId(null);
      } else {
        await createBook(bookData).unwrap();
      }

      setForm(EMPTY_FORM);
    } catch (err) {
      alert(err?.data?.message || "Could not save the book. Please try again.");
    }
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteBook(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Could not delete the book.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  /* ---------- NOT LOGGED IN: Login first, Signup from the link below it ---------- */
  if (!token) {
    return view === "signup" ? (
      <Signup
        onSuccess={handleSignupSuccess}
        onSwitch={() => {
          setNotice("");
          setView("login");
        }}
      />
    ) : (
      <Login
        notice={notice}
        onSuccess={handleLoginSuccess}
        onSwitch={() => {
          setNotice("");
          setView("signup");
        }}
      />
    );
  }

  /* ---------- LOGGED IN ---------- */
  const firstName = capitalize((user?.name || "").trim().split(" ")[0]);

  return (
    <div className="app">
      <header className="navbar">
        <span className="logo">{storeName(user)}</span>

        <button className="btn btn-small btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="welcome">
        <h1 className="welcome-title">Welcome back, {firstName}</h1>
        <p className="welcome-text">
          Add new books, update their details or remove the ones you no longer
          need.
        </p>
      </section>

      <BookForm
        form={form}
        editingId={editingId}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />

      {isLoading ? (
        <p className="loading-text">Loading your books...</p>
      ) : booksError && booksError.status !== 401 ? (
        <p className="notice notice-error">
          Could not load your books. The server may be waking up, so please
          refresh in a few seconds.
        </p>
      ) : (
        <BookList
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}

export default App;