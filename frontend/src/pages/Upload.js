import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const BASE_URL = "http://127.0.0.1:8000";

const Upload = () => {
  const [foodName, setFoodName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputCameraRef = useRef(null);
  const fileInputGalleryRef = useRef(null);
  const navigate = useNavigate();

  const handleTakePhoto = () => {
    setShowDropdown(false);
    fileInputCameraRef.current.click();
  };

  const handleUploadPhoto = () => {
    setShowDropdown(false);
    fileInputGalleryRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result;
      setImage(base64);
      setStatus("loading");

      const formData = new FormData();
      formData.append("food_name", foodName);
      formData.append("file", file);

      try {
        const response = await fetch(`${BASE_URL}/upload-image/`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("❌ Server error:", response.status, text);
          throw new Error("Upload failed");
        }

        const data = await response.json();

        const detectionForm = new FormData();
        detectionForm.append("file", file);
        detectionForm.append("food_entry_id", data.food_entry_id);

        const detectionResponse = await fetch(`${BASE_URL}/detect-ingredients/`, {
          method: "POST",
          body: detectionForm,
        });

        if (!detectionResponse.ok) {
          throw new Error("Detection failed");
        }

        const detectionData = await detectionResponse.json();
        const detectedIngredients = detectionData.detected_ingredients;
        const detectedImagePath = detectionData.detected_imaged_path;

        setStatus("done");

        setTimeout(() => {
          navigate("/review", {
            state: {
              foodName: data.food_name,
              image: base64,
              foodEntryId: data.food_entry_id,
              detectedIngredients,
              detectedImagePath,
            },
          });
        }, 1500);
      } catch (error) {
        console.error("❌ Upload or detection error:", error);
        setStatus("idle");
        alert("Upload or detection failed. Please try again.");
      }
    };

    reader.readAsDataURL(file);
  };

  const getStatusText = () => {
    if (status === "loading") return "Processing Image...";
    if (status === "done")
      return <span className="success">Image Processed Successfully ✅</span>;
    return "Add Photo of Ingredients";
  };

  const getStatusDescription = () => {
    if (status === "loading") return "Analyzing and uploading the photo...";
    if (status === "done") return "Redirecting to detected results...";
    return "Make sure the image is clear for accurate detection.";
  };

  return (
    <div className="upload-page">
      <h1 className="step-title">Part 1: Upload Ingredients Image</h1>

      <div className="centered-container">
        <div className="food-input-group">
          <label className="food-prompt">What are you making?</label>

          {!submitted ? (
            <div className="food-input-row">
              <input
                type="text"
                className="food-input"
                placeholder="Please enter the food you are making here."
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
              <button
                className="food-submit-button"
                onClick={() => {
                  if (foodName.trim()) setSubmitted(true);
                }}
              >
                Enter
              </button>
            </div>
          ) : (
            <h2 style={{ color: "#2563eb", fontWeight: "700", marginTop: "1rem" }}>
              {foodName}
            </h2>
          )}
        </div>
      </div>

      {submitted && (
        <div id="upload-section" className="centered-container">
          {image && <img src={image} alt="Preview" className="image-preview" />}

          <div className="upload-box" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              <strong>{getStatusText()}</strong>
              <p>{getStatusDescription()}</p>
              {status === "loading" && <div className="loader"></div>}
            </div>
          </div>

          {showDropdown && (
            <div className="upload-dropdown">
              <div className="dropdown-option" onClick={handleTakePhoto}>
                📷 Take a Picture
              </div>
              <div className="dropdown-option" onClick={handleUploadPhoto}>
                🖼️ Upload a Photo
              </div>
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputCameraRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputGalleryRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Upload;