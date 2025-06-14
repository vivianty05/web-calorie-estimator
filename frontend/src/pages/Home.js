import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const mockHistory = [
  { id: 1, title: "Chicken Salad", calories: 320, image: "/images/chicken_salad.jpg" },
  { id: 2, title: "Veggie Pasta", calories: 450, image: "/images/veggie_pasta.jpg" },
  { id: 3, title: "Fruit Smoothie", calories: 210, image: "/images/fruit_smoothie.jpg" },
  { id: 4, title: "Beef Stir-fry", calories: 550, image: "/images/beef_stirfry.jpg" },
  { id: 5, title: "Oatmeal Bowl", calories: 300, image: "/images/oatmeal_bowl.jpg" },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = mockHistory.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <div className="centered-container">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search past foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="history-grid">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div key={item.id} className="history-card">
                <img src={item.image} alt={item.title} className="history-image" />
                <div className="history-info">
                  <h3>{item.title}</h3>
                  <p>{item.calories} kcal</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No matching food found.</p>
          )}
        </div>
      </div>

      <button
        className="floating-add-button"
        onClick={() => navigate("/upload")}
        aria-label="Add new food"
        title="Add New Food"
      >
        +
      </button>
    </div>
  );
};

export default Home;