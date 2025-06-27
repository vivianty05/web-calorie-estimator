import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FoodEditor from "./FoodEditor";

// const BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = "http://192.168.0.224:8000";
// const BASE_URL = "http://172.24.2.255:8000";

const EditFood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const foodId = location.state?.food?.id;

  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableUnits, setAvailableUnits] = useState([]);

  // Fetch units once on mount
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(`${BASE_URL}/get-units/`);
        const data = await res.json();
        setAvailableUnits(data); // each unit: { id, name }
      } catch (err) {
        console.error("Failed to fetch units:", err);
      }
    };

    fetchUnits();
  }, []);

  // Fetch full food entry from backend
  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/food-entries/${foodId}`);
        if (!response.ok) throw new Error("Failed to fetch food details");
        const data = await response.json();

        // Transform ingredients to match FoodEditor expectations
        const transformedIngredients = (data.ingredients || []).map((ing) => ({
          name: ing.name,
          count: ing.quantity,
          unit: ing.unit?.name || "",      // Extract unit name
          unit_id: ing.unit_id,
          caloriesPerUnit:
            ing.quantity > 0 ? ing.calories / ing.quantity : 0, // Prevent NaN
        }));

        setFoodData({
          id: data.id,
          foodName: data.food_name,
          ingredients: transformedIngredients,
          totalCalories: data.total_calories,
          imagePath: data.detected_image_path,
        });
      } catch (error) {
        console.error("❌ Error loading food data:", error);
        alert("Unable to load food entry.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (foodId) {
      fetchFoodDetails();
    } else {
      alert("No food selected.");
      navigate("/");
    }
  }, [foodId, navigate]);

  const handleSubmit = async (updatedData) => {
    try {
      const payload = {
        id: foodData.id,
        food_name: updatedData.title,
        ingredients: updatedData.ingredients.map((item) => ({
          name: item.name,
          quantity: item.count,
          unit: item.unit,
          unit_id: item.unit_id,
        })),
      };

      const response = await fetch(`${BASE_URL}/submit-review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Backend error:", errText);
        alert("Failed to update food. Please check your input.");
        return;
      }

      const result = await response.json();
      console.log("✅ Food updated:", result);
      navigate("/");
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Error connecting to backend.");
    }
  };

  if (loading) return <p>Loading food details...</p>;
  if (!foodData) return <p>No food data found.</p>;

  return (
    <div className="edit-food-page centered-container">
      <FoodEditor
        editable={true}
        initialFoodName={foodData.foodName}
        initialIngredients={foodData.ingredients}
        imagePath={foodData.imagePath}           // ✅ Image now handled inside FoodEditor
        availableUnits={availableUnits}          // ✅ new prop
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        buttonLabel="Back"
        showBackButton={true}
      />
    </div>
  );
};

export default EditFood;