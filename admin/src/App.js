import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from './components/AdminPanel';
import Login from "./components/Login";
import PopUp from "./components/PopUp";


function App() {
  const isAuthenticated = () => !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
      <Route path="/popup" element={<PopUp />} />

        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={isAuthenticated() ? <AdminPanel /> : <Navigate to="/login" />} // Updated
        />
        <Route path="/" element={<Navigate to="/login" replace />} /> {/* Updated */}
      </Routes>
    </Router>
  );
}

export default App;
