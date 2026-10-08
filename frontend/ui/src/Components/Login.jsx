import { useEffect, useState } from "react";
import { useLoginMutation } from "../services/authApi";

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

function Login({ onSuccess, onSwitch, notice }) {
  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
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
      const response = await login({
        // iPhone keyboards add capital letters and spaces, so clean the email.
        email: form.email.trim().toLowerCase(),
        password: form.password
      }).unwrap();

      onSuccess(response.token, response.user);
    } catch (err) {
      if (err?.status === "FETCH_ERROR") {
        setError("Cannot reach the server. Check your internet and try again.");
      } else {
        setError(err?.data?.message || "Login failed. Please try again.");
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
          <h1 className="auth-title">Log in</h1>
          <p className="auth-subtitle">
            Welcome back. Log in to open your shelf.
          </p>

          {notice && <p className="notice notice-ok">{notice}</p>}
          {error && <p className="notice notice-error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
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
                  autoComplete="current-password"
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
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>

            {isLoading && slow && (
              <p className="hint">
                The server is waking up. The first login can take up to a
                minute.
              </p>
            )}
          </form>

          <p className="switch-text">
            New here?{" "}
            <button type="button" className="link-btn" onClick={onSwitch}>
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;