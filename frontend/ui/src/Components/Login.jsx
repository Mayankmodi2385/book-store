import { useState } from "react";
import { useLoginMutation } from "../services/authApi";

function Login() {
  const [login, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({
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
      const response = await login(form).unwrap();

      console.log("Login successful:", response);

      // Store JWT
      localStorage.setItem("token", response.token);

      // Store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      alert("Login successful!");
      window.location.reload();


    } catch (error) {
      console.log("Login failed:", error);

      alert(
        error?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

      </form>
    </div>
  );
}

export default Login;