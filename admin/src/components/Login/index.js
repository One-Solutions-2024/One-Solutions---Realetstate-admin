import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing eye icons from react-icons
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message on new attempt
    setSuccessMessage(null); // Reset success message on new attempt
    try {
      const response = await fetch(`https://backend-vtwx.onrender.com/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const { token } = await response.json();
      localStorage.setItem("token", token);
      setSuccessMessage("Login successful!");
      navigate("/admin");
    } catch (err) {
      setError(err = "You're Offline" || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="login-container">
<div className="image-container">
<img src="https://www.foundit.in/rio/public/images/login-illustration.png" alt="Login" className="login-image"/>

</div>
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
        <div className="passward-filed-input passward-filed">
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" onClick={togglePasswordVisibility} className="toggle-password">
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Use icons for visibility toggle */}
          </button>
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
