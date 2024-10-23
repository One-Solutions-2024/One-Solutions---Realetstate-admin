// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddJob from './components/AddJob';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddJob />} />
      </Routes>
    </Router>
  );
}

export default App;
