import { useEffect, useState } from "react";
import { useSignupMutation } from "../services/authApi";

function EyeIcon({ off }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function Signup({ onSuccess, onSwitch }) {
  const [signup, { isLoading }] = useSignupMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // Shows a "server is waking up" hint (the free Render plan sleeps when idle).
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => setSlow(true), 4000);

    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [isLoading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password
      }).unwrap();

      onSuccess();
    } catch (err) {
      if (err?.status === "FETCH_ERROR") {
        setError("Cannot reach the server. Check your internet and try again.");
      } else {
        setError(err?.data?.message || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <div>
          <p className="brand-name">Book Store</p>
          <p className="brand-line">
            Keep every book you own or sell in one tidy shelf.
          </p>
        </div>

        <div className="shelf" aria-hidden="true">
          <div className="spines">
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
            <span className="spine" />
          </div>
          <div className="shelf-board" />
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Sign up to start building your book shelf.
          </p>

          {error && <p className="notice notice-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span className="field-label">Name</span>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                inputMode="email"
                required
              />
            </label>

            <label className="field">
              <span className="field-label">Password</span>

              <span className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </span>
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loader" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

            {isLoading && slow && (
              <p className="hint">
                The server is waking up. The first request can take up to a
                minute.
              </p>
            )}
          </form>

          <p className="switch-text">
            Already have an account?{" "}
            <button type="button" className="link-btn" onClick={onSwitch}>
              Log in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;