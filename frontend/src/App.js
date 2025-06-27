import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Review from "./pages/Review";
import Calculate from "./pages/Calculate";
import EditFood from "./pages/EditFood";
import ScrollToTop from "./components/ScrollToTop"; // <-- Add this line
import "./App.css";

const App = () => {
  return (
    <Router>
      <ScrollToTop /> {/* <-- Scroll restoration component */}
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-logo">EatSmart</h1>
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