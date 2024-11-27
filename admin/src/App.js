// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SiteManager from "./components/SiteManager";
import AddSite from "./components/AddSite";

const App = () => {
    return (
        <Router>
            <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                <h1>Site Management App</h1>
                <Routes>
                    <Route path="/" element={<SiteManager />} />
                    <Route path="/add" element={<AddSite />} />
                 </Routes>
            </div>
        </Router>
    );
};

export default App;
