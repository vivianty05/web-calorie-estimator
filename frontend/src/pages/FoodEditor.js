import React, { useState, useEffect } from "react";
import "./FoodEditor.css";

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "http://192.168.0.224:8000";
// const BASE_URL = "http://172.24.2.255:8000";

const FoodEditor = ({
  editable = false,
  initialFoodName = "",
  initialIngredients = [],
  imagePath,
  availableUnits = [],
  onSubmit,
  onCancel,
  buttonLabel = "Done",
}) => {
  const [editActivated, setEditActivated] = useState(false);
  const [foodName, setFoodName] = useState(initialFoodName);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [totalCalories, setTotalCalories] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const total = ingredients.reduce(
      (sum, item) => sum + (item.count || 0) * item.caloriesPerUnit,
      0
    );
    setTotalCalories(total);
  }, [ingredients]);

  const handleQuantityChange = (index, delta) => {
    const updated = [...ingredients];
    const newValue = parseFloat((updated[index].count + delta).toFixed(2));
    updated[index].count = newValue >= 0 ? newValue : 0;
    setIngredients(updated);
  };

  const handleManualInput = (index, value) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0) {
      const updated = [...ingredients];
      updated[index].count = parsed;
      setIngredients(updated);
    }
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSaveChanges = () => {
    const updatedTotal = ingredients.reduce(
      (sum, item) => sum + item.count * item.caloriesPerUnit,
      0
    );
    setTotalCalories(updatedTotal);
    onSubmit?.({ title: foodName, ingredients, totalCalories: updatedTotal });
    setShowConfirm(false);
  };

  return (
    <div className="calculate-page">
      <div className="centered-container">
        <h2>{editable ? "Edit Food Entry" : "Part 3: Calorie Calculation"}</h2>

        {editable && editActivated ? (
          <input
            type="text"
            className="food-input"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        ) : (
          <h3 className="food-name-display">{foodName}</h3>
        )}

        {/* ✅ Image with centered layout and white border */}
        {imagePath && (
          <div className="image-wrapper">
            <img
              src={`${BASE_URL}/${imagePath}`}
              alt={foodName}
              className="edit-food-image"
            />
          </div>
        )}

        <div className="ingredients-list">
          {ingredients.map((item, index) => (
            <div key={index} className="ingredient-row">
              <span className="ingredient-name">{item.name}</span>

              <span className="ingredient-quantity">
                {editable && editActivated ? (
                  <div className="quantity-adjuster">
                    <button
                      className="adjust-button"
                      onClick={() => handleQuantityChange(index, -1)}
                    >
                      −
                    </button>
                    <input
                      className="quantity-input"
                      type="number"
                      step="1"
                      min="0"
                      value={item.count}
                      onChange={(e) =>
                        handleManualInput(index, e.target.value)
                      }
                    />
                    <button
                      className="adjust-button"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      +
                    </button>
                    {availableUnits.length === 0 ? (
                      <span className="unit-label">{item.unit}</span>
                    ) : (
                      <select
                        className="unit-select"
                        value={item.unit}
                        onChange={(e) => {
                          const updated = [...ingredients];
                          updated[index].unit = e.target.value;
                          const selectedUnit = availableUnits.find(
                            (u) => u.name === e.target.value
                          );
                          updated[index].unit_id = selectedUnit?.id || null;
                          setIngredients(updated);
                        }}
                      >
                        {availableUnits.map((unit) => (
                          <option key={unit.id} value={unit.name}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  `${item.count} ${item.unit}`
                )}
              </span>

              <span className="ingredient-calories">
                {(
                  (item.count || 0) * (item.caloriesPerUnit || 0)
                ).toFixed(2)}{" "}
                kcal
              </span>
            </div>
          ))}
        </div>

        <div className="total-calories">
          <strong>Total Calories:</strong> {totalCalories.toFixed(2)} kcal
        </div>

        <div className="editor-buttons">
          {editable && editActivated ? (
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="done-button" onClick={onCancel}>
              {buttonLabel}
            </button>
          )}
        </div>

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Confirm Save</h3>
                <button
                  className="close-button"
                  onClick={() => setShowConfirm(false)}
                >
                  ×
                </button>
              </div>
              <p>
                Please confirm that you're ready to save all the edits you've
                made to the food entry.
              </p>
              <div className="modal-buttons">
                <button
                  className="cancel-button"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={confirmSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Floating Edit Button using SVG */}
      {editable && !editActivated && (
        <button
          className="floating-settings-button"
          onClick={() => setEditActivated(true)}
          title="Edit"
          aria-label="Edit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FoodEditor;