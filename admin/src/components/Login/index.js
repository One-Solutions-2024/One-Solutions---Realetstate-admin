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
      const response = await fetch("https://backend-vtwx.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Check if the response is not ok (status is 4xx or 5xx)
      if (!response.ok) {
        // If the response is not OK, attempt to extract a message from the server's response
        const responseData = await response.json();

        if (responseData.error) {
          // Assuming the backend returns an 'error' field when login fails
          if (responseData.error === "Invalid username") {
            setError("Username is not correct");
          } else if (responseData.error === "Invalid password") {
            setError("Password is not correct");
          } else {
            setError(responseData.error);
          }
        } else {
          setError("Login failed");
        }
        throw new Error("Login failed"); // Throw to skip the next steps
      }

      // If login is successful, retrieve token
      const { token } = await response.json();
      localStorage.setItem("token", token);
      setSuccessMessage("Login successful!");
      navigate("/admin");
    } catch (err) {
      // Handle errors that are not response-related (e.g., network issues)
      if (!error) setError("You're offline or something went wrong.");
    } finally {
      setLoading(false);
    }
  };



  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div  className="login-container">
      <header className="header">
        <h1 className="header-title">ONE SOLUTIONS</h1>
      </header>
      <div className="login-container-image-form">
        <div className="image-container">
          <img src="https://www.foundit.in/rio/public/images/login-illustration.png" alt="Login" className="login-image" />
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <h2>One Login</h2>
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

    </div>
  );
};

export default Login;
