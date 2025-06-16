import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Calculate.css";

const Calculate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Prefer route state, fallback to localStorage
  const foodName =
    location.state?.foodName || localStorage.getItem("foodName") || "Unnamed Dish";

  // ✅ Prefer ingredients from route state
  const ingredients = location.state?.ingredients || [
    { name: "Onion", count: 7, unit: "pieces", caloriesPerUnit: 40 },
    { name: "Salt", count: 1000, unit: "grams", caloriesPerUnit: 0 },
    { name: "Egg", count: 3, unit: "pieces", caloriesPerUnit: 70 },
    { name: "Baking Powder", count: 90, unit: "grams", caloriesPerUnit: 2 },
    { name: "AP Flour", count: 1000, unit: "grams", caloriesPerUnit: 3.64 },
  ];

  const ingredientsWithCalories = ingredients.map(item => ({
    ...item,
    calories: (item.count || 0) * item.caloriesPerUnit,
  }));

  const totalCalories = ingredientsWithCalories.reduce(
    (sum, item) => sum + item.calories,
    0
  );

  return (
    <div className="calculate-page">
      <div className="centered-container">
        <h2>Part 3: Calorie Calculation</h2>
        <h3 className="food-name-display">{foodName}</h3>

        <div className="ingredients-list">
          {ingredientsWithCalories.map((item, index) => (
            <div key={index} className="ingredient-row">
              <span className="ingredient-name">{item.name}</span>
              <span className="ingredient-quantity">
                {item.count} {item.unit}
              </span>
              <span className="ingredient-calories">
                {item.calories.toFixed(2)} kcal
              </span>
            </div>
          ))}
        </div>

        <div className="total-calories">
          <strong>Total Calories:</strong> {totalCalories.toFixed(2)} kcal
        </div>

        <button className="done-button" onClick={() => navigate("/")}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Calculate;