import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUsername("");
    setPassword("");
    const token = localStorage.getItem("token");
    if (token) navigate("/admin"); // Redirect if token exists
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://backend-vtwx.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setSuccessMessage("Login successful!");

      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src="https://res.cloudinary.com/dsjcty43b/image/upload/v1729929976/login-image_piuwue.png" alt="Login" className="login-image"/>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Admin Login</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button-login" type="submit" disabled={loading}>
          {loading ? <span className="loader-login"></span> : "Login"}
        </button>
        <div className="message-container">
          {error && <div className="error fade-in">{error}</div>}
          {successMessage && <div className="success fade-in">{successMessage}</div>}
        </div>
      </form>
    </div>
  );
};

export default Login;
