import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Review.css";

const Review = () => {
  const detectionTime = new Date().toLocaleString();
  const navigate = useNavigate();

  const [detectedItems, setDetectedItems] = useState([
    { name: "Onion", confidence: 98, count: 7, unit: "pieces", caloriesPerUnit: 40 },
    { name: "Salt", confidence: 95, count: 1000, unit: "grams", caloriesPerUnit: 0 },
    { name: "Egg", confidence: 95, count: 3, unit: "pieces", caloriesPerUnit: 70 },
    { name: "Baking Powder", confidence: 95, count: 90, unit: "grams", caloriesPerUnit: 2 },
    { name: "AP Flour", confidence: 86, count: 1000, unit: "grams", caloriesPerUnit: 3.64 }
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleChange = (index, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updated = [...detectedItems];
      updated[index].count = value;
      setDetectedItems(updated);
    }
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

  const handleCalculateClick = () => {
    setShowModal(false);
    navigate("/calculate", { state: { ingredients: detectedItems } });
  };

  return (
    <div className="review-page">
      <h2 className="review-title">Part 2: Review Detection</h2>

      <p className="detection-time">Detection Result • {detectionTime}</p>

      <div className="review-box">
        <img
          src="/path-to-your-preview.jpg"
          alt="Detected ingredients"
          className="detected-image"
        />
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
                <span>{item.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="confirm-buttons">
        <button className="confirm-button" onClick={() => setShowModal(true)}>
          Confirm Ingredients
        </button>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ingredients List and Quantities</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <p className="modal-description">
              Please review the following ingredients and their quantities before proceeding with the calorie calculation:
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
