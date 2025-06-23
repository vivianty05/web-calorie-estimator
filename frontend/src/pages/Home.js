import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const BASE_URL = "http://127.0.0.1:8000";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

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

  const handleCardClick = (item) => {
    if (deleteMode) {
      toggleSelection(null, item.id);
    } else {
      navigate("/edit", {
        state: {
          food: {
            id: item.id,
            title: item.food_name,
            ingredients: item.ingredients || [],
            totalCalories: item.total_calories,
          },
        },
      });
    }
  };

  const toggleSelection = (e, id) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const confirmAndDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected food entries?")
    ) {
      for (const id of selectedIds) {
        try {
          await fetch(`${BASE_URL}/delete-entry/${id}`, { method: "DELETE" });
        } catch (err) {
          console.error(`Failed to delete entry ${id}`, err);
        }
      }
      setSelectedIds([]);
      setDeleteMode(false);
      window.location.reload();
    }
  };

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
                  className={`history-card ${
                    deleteMode && selectedIds.includes(item.id)
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleCardClick(item)}
                >
                  {deleteMode && (
                    <button
                      className={`check-button ${
                        selectedIds.includes(item.id) ? "checked" : ""
                      }`}
                      onClick={(e) => toggleSelection(e, item.id)}
                    >
                      {selectedIds.includes(item.id) && "✔"}
                    </button>
                  )}
                  <img
                    // src={`${BASE_URL}/${item.image_path}`}
                    src={item.image_path}
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

      {/* Delete Mode Actions */}
      {deleteMode && (
        <div className="delete-action-buttons">
          <button
            className="cancel-delete-button"
            onClick={() => {
              setDeleteMode(false);
              setSelectedIds([]);
            }}
          >
            Cancel
          </button>
          {selectedIds.length > 0 && (
            <button className="delete-confirm-button" onClick={confirmAndDelete}>
              Delete ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* Floating Edit Button – only visible if not deleting */}
      {!deleteMode && (
        <div className="floating-edit-container">
          <button
            className="floating-edit-button"
            onClick={() => setShowOptions((prev) => !prev)}
            aria-label="Edit food entries"
            title="Edit Options"
          >
            🖉
          </button>

          {showOptions && (
            <div className="edit-options">
              <button onClick={() => navigate("/upload")}>
                <span className="option-icon">➕</span>
                <span className="option-text">Add Food</span>
              </button>
              <button
                onClick={() => {
                  setDeleteMode(true);
                  setShowOptions(false);
                }}
              >
                {/* <span className="option-icon">🗑️</span> */}
                <span className="option-icon">❌</span>
                <span className="option-text">Delete Food</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;