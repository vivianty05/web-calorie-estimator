import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../pages/Header";
import "./History.css";

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const food = location.state;

  if (!food) {
    navigate("/");
    return null;
  }

  const ingredientsWithCalories = food.ingredients.map((item) => ({
    ...item,
    calories: (item.count || 0) * item.caloriesPerUnit,
  }));

  const totalCalories = ingredientsWithCalories.reduce((sum, item) => sum + item.calories, 0);

  return (
    <Header>
      <div className="history-page">
        <h2 className="food-title">{food.title}</h2>
        <img src={food.image} alt={food.title} className="food-image" />

        <div className="ingredients-list">
          {ingredientsWithCalories.map((item, index) => (
            <div key={index} className="ingredient-row">
              <span className="ingredient-name">{item.name}</span>
              <span className="ingredient-quantity">
                {item.count} {item.unit}
              </span>
              <span className="ingredient-calories">{item.calories.toFixed(2)} kcal</span>
            </div>
          ))}
        </div>

        <div className="total-calories">
          <strong>Total Calories:</strong> {totalCalories.toFixed(2)} kcal
        </div>
      </div>

      {/* Floating Back Button Bottom Left */}
      <button
        className="floating-back-button"
        onClick={() => navigate("/")}
        aria-label="Back to Home"
        title="Back to Home"
      >
        ←
      </button>
    </Header>
  );
};

export default History;
