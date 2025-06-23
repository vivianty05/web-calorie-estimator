import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FoodEditor from "./FoodEditor";

const BASE_URL = "http://127.0.0.1:8000";

const Calculate = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const foodEntryId = location.state?.foodEntryId;

  const [foodName, setFoodName] = useState("Unnamed Dish");
  const [ingredients, setIngredients] = useState([]);
  const [foodImage, setFoodImage] = useState("");
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodEntry = async () => {
      try {
        const res = await fetch(`${BASE_URL}/food-entries/${foodEntryId}`);
        const data = await res.json();

        setFoodName(data.food_name);
        setTotalCalories(data.total_calories);
        setFoodImage(data.detected_image_path);
        setIngredients(
          data.ingredients.map((i) => ({
            name: i.name,
            count: i.quantity,
            unit: i.unit.name,
            unit_id: i.unit.id,
            caloriesPerUnit: i.quantity > 0 ? (i.calories / i.quantity) : 0,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch food entry:", err);
      } finally {
        setLoading(false);
      }
    };

    if (foodEntryId) {
      console.log("Fetching food entry with ID:", foodEntryId);
      fetchFoodEntry();
    }
    else {
      console.error("Missing foodEntryId from route state");
    }
  }, [foodEntryId]);

  return loading ? (
    <div className="calculate-page">
      <div className="centered-container">
        <h2>Part 3: Calorie Calculation</h2>
        <p>Loading...</p>
      </div>
    </div>
  ) : (
    <FoodEditor
      editable={false}
      initialFoodName={foodName}
      initialIngredients={ingredients}
      imagePath={foodImage}
      totalCalories={totalCalories}
      onCancel={() => navigate("/")}
      buttonLabel="Done"
    />
  );
};

export default Calculate;