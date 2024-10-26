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

  // Clear credentials on component mount
  useEffect(() => {
    setUsername("");
    setPassword("");
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin"); // Redirect if token exists
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear error and success messages on new login attempt
    setError(null);
    setSuccessMessage(null);

    // Validate fields
    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true); // Set loading to true on login attempt

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
      localStorage.setItem("token", data.token); // Store token in localStorage
      setSuccessMessage("Login successful!");
      setTimeout(() => navigate("/admin"), 1500); // Redirect to admin panel
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false when login completes
    }
  };

  return (
    <div className="login-container">
      <div>
        <img src="https://res.cloudinary.com/dsjcty43b/image/upload/v1729929976/login-image_piuwue.png" alt="Login Illustration" />
      </div>
      <div>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
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
            {loading ? <span className="loader"></span> : "Login"}
          </button>
          
          <div className="message-container">
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
