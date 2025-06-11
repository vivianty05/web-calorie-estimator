import React from "react";
import "./Header.css";

const Header = ({ children }) => {
  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="app-logo">FoodCal AI</h1>
        <hr className="divider" />
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
};

export default Header;
