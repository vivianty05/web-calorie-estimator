import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Review from "./pages/Review";
import Calculate from "./pages/Calculate";
import EditFood from "./pages/EditFood";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Header directly in App.js */}
        <header className="app-header">
          <h1 className="app-logo">FoodCal AI</h1>
          <hr className="divider" />
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/review" element={<Review />} />
            <Route path="/calculate" element={<Calculate />} />
            <Route path="/edit" element={<EditFood />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;