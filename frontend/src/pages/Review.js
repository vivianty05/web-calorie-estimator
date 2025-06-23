import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Review.css";

const BASE_URL = "http://127.0.0.1:8000";

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { foodEntryId, foodName: initFoodName, image } = location.state || {};

  const [foodName, setFoodName] = useState(initFoodName || "");
  const [imagePath] = useState(image); // base64 image preview
  const imageUrl = imagePath ? imagePath : null;

  const detectionTime = new Date().toLocaleString();

  const [detectedItems, setDetectedItems] = useState([
    { name: "Onion", confidence: 98, count: 70, unit: "unit", caloriesPerUnit: 40 },
    { name: "Salt", confidence: 95, count: 5, unit: "unit", caloriesPerUnit: 0 },
    { name: "Egg", confidence: 95, count: 100, unit: "unit", caloriesPerUnit: 70 },
    { name: "Baking Powder", confidence: 95, count: 90, unit: "unit", caloriesPerUnit: 2 },
    { name: "AP Flour", confidence: 86, count: 80, unit: "unit", caloriesPerUnit: 3.64 }
  ]);

  const [unitMap, setUnitMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`${BASE_URL}/get-units/`);
        const data = await res.json();

        const map = {};
        data.forEach(unit => {
          map[unit.name] = {
            id: unit.id,
            description: unit.description
          };
        });

        console.log("✅ Loaded unitMap:", map);
        setUnitMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch units:", err);
      }
    };

    fetchUnits();
  }, []);

  const handleChange = (index, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updated = [...detectedItems];
      updated[index].count = value;
      setDetectedItems(updated);
    }
  };

  const handleUnitChange = (index, newUnit) => {
    const updated = [...detectedItems];
    updated[index].unit = newUnit;
    updated[index].unit_id = unitMap[newUnit]?.id || null;
    setDetectedItems(updated);
  };

  const increment = (index) => {
    const updated = [...detectedItems];
    updated[index].count = (parseFloat(updated[index].count) || 0) + 1;
    setDetectedItems(updated);
  };

  const decrement = (index) => {
    const updated = [...detectedItems];
    const current = parseFloat(updated[index].count) || 0;
    updated[index].count = current > 0 ? current - 1 : 0;
    setDetectedItems(updated);
  };

  const handleConfirmClick = () => {
    const hasUnconfigured = detectedItems.some(item => item.unit === "unit");
    if (hasUnconfigured) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setShowModal(true);
  };

  const handleCalculateClick = async () => {
    setShowModal(false);

    const payload = {
      id: foodEntryId,
      food_name: foodName,
      ingredients: detectedItems.map(item => ({
        name: item.name,
        quantity: parseFloat(item.count),
        unit: item.unit,
        unit_id: unitMap[item.unit]?.id
      }))
    };

    try {
      const response = await fetch(`${BASE_URL}/submit-review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", errorText);

      // Try parsing JSON error
      try {
        const errorJson = JSON.parse(errorText);
        if (
          errorJson.detail &&
          errorJson.detail.includes("is not available for")
        ) {
          alert("⚠️ Please select an appropriate unit for the ingredients.\n\n" + errorJson.detail);
        } else {
          alert("Failed to save ingredients. Please try again.");
        }
      } catch (parseError) {
        alert("Failed to save ingredients. Please try again.");
      }
      return;
    }

      const result = await response.json();
      console.log("✅ Submission success:", result);

      navigate("/calculate", {
        state: {
          ingredients: detectedItems,
          foodName: result.food_name,
          foodEntryId: result.food_entry_id,
          // foodEntryId: result.food_entry_id,
          // foodEntryId: result.id,
          totalCalories: result.total_calories
        }
      });

    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Error connecting to backend.");
    }
  };

  return (
    <div className="review-page">
      <div className="centered-container">
        <h2 className="review-title">Part 2: Review Detection</h2>
        {foodName && <h3 className="food-title">{foodName}</h3>}
        <p className="detection-time">Detection Result • {detectionTime}</p>

        <div className="review-box">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Uploaded ingredients"
              className="detected-image"
            />
          )}
          <p className="review-message">
            Detected {detectedItems.length} ingredients. Please review and adjust the quantities below.
          </p>
        </div>

        <h3 className="ingredient-section-title">Detected Ingredients</h3>

        <div className="ingredient-list">
          {detectedItems.map((item, index) => (
            <div key={index} className="ingredient-card">
              <div className="ingredient-check">✅</div>
              <div className="ingredient-info">
                <strong>{item.name}</strong>
                <p>Confidence: {item.confidence}%</p>
              </div>
              <div className="ingredient-control">
                <label>Count:</label>
                <div className="quantity-box">
                  <button onClick={() => decrement(index)}>-</button>
                  <input
                    type="text"
                    value={item.count}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                  <button onClick={() => increment(index)}>+</button>

                  <select
                    className="unit-dropdown"
                    value={item.unit}
                    onChange={(e) => handleUnitChange(index, e.target.value)}
                  >
                    <option value="unit" disabled>unit</option>
                    {Object.entries(unitMap).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.description} ({key})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showWarning && (
          <p className="unit-warning">⚠️ Please select a unit for the ingredients before continuing.</p>
        )}

        <div className="confirm-buttons">
          <button className="confirm-button" onClick={handleConfirmClick}>
            Confirm Ingredients
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ingredient List and Quantities</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-divider" />

            <p className="modal-description">
              Please review the following ingredient list and their quantities before proceeding with the calorie calculation:
            </p>

            <ul className="modal-list">
              {detectedItems.map((item, index) => (
                <li key={index}>
                  <span>{item.name}</span>
                  <span className="modal-amount">
                    {item.count} {item.unit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="modal-buttons">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="confirm-button" onClick={handleCalculateClick}>Calculate Calories</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;