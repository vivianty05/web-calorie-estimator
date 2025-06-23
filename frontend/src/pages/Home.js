import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const BASE_URL = "http://127.0.0.1:8000";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch food entries from backend
  useEffect(() => {
    const fetchFoodEntries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/food-entries/`);
        if (!response.ok) throw new Error("Failed to fetch food history");
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        console.error("❌ Error loading food entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodEntries();
  }, []);

  const filteredHistory = historyData.filter((item) =>
    item.food_name.toLowerCase().includes(searchTerm.toLowerCase())
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

        {loading ? (
          <p>Loading food history...</p>
        ) : (
          <div className="history-grid">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-card"
                  onClick={() =>
                    navigate("/edit", {
                      state: {
                        food: {
                          id: item.id,
                          title: item.food_name,
                          ingredients: item.ingredients || [],
                          totalCalories: item.total_calories,
                        },
                      },
                    })
                  }
                >
                  <img
                    src={`${BASE_URL}/${item.image_path}`}
                    alt={item.food_name}
                    className="history-image"
                  />
                  <div className="history-info">
                    <h3>{item.food_name}</h3>
                    <p>{item.total_calories ?? "Not calculated"} kcal</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No matching food found.</p>
            )}
          </div>
        )}
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