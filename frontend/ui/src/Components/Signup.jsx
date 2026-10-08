import { useState } from "react";
import { useSignupMutation } from "../services/authApi";

function Signup() {
  const [signup, { isLoading }] = useSignupMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(form).unwrap();

      console.log("Signup successful:", response);

      alert("Signup successful!");

      setForm({
        name: "",
        email: "",
        password: ""
      });

    } catch (error) {
      console.log("Signup failed:", error);

      alert(
        error?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="auth-form">

      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password field */}
        <div className="password-wrapper">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>

        </div>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Signup"}
        </button>

      </form>

    </div>
  );
}

export default Signup;