import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History"
import Upload from "./pages/Upload";
import Review from "./pages/Review";
import Calculate from "./pages/Calculate";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/review" element={<Review />} />
      <Route path="/calculate" element={<Calculate />} />
    </Routes>
  </Router>
);

export default App;
