import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

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
    reader.onloadend = () => {
      setImage(reader.result);
      setStatus("loading");

      setTimeout(() => {
        document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          setStatus("done");

          // ✅ Save food name to localStorage and pass it through state
          localStorage.setItem("foodName", foodName);
          setTimeout(() => navigate("/review", { state: { foodName } }), 1500);
        }, 1500);
      }, 300);
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
    if (status === "loading") return "Analyzing the photo to detect ingredients...";
    if (status === "done") return "Redirecting to detected results...";
    return "Make sure the image is clear for accurate detection.";
  };

  return (
    <div className="upload-page">
      <h1 className="step-title">Part 1: Upload Ingredients Image</h1>

      <div className="centered-container">
        <div className="food-input-group">
          <label className="food-prompt">What are you making?</label>
          <div className="food-input-row">
            <input
              type="text"
              className="food-input"
              placeholder="Please enter the food you are making here."
              value={foodName}
              onChange={(e) => {
                if (!submitted) setFoodName(e.target.value);
              }}
              disabled={submitted}
            />
            <button
              className="food-submit-button"
              onClick={() => {
                if (foodName.trim()) setSubmitted(true);
              }}
              disabled={submitted}
            >
              Enter
            </button>
          </div>
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