import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done
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

      // Simulate processing
      setTimeout(() => {
        setStatus("done");

        // Then after 1.5s, go to review
        setTimeout(() => navigate("/review"), 1500);
      }, 1500);
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
    if (status === "loading")
      return "Analyzing the photo to detect ingredients...";
    if (status === "done") return "Redirecting to detected results...";
    return "Make sure the image is clear for accurate detection.";
  };

  return (
    <div className="upload-page">
      <h1 className="step-title">Part 1: Upload Ingredients Image</h1>

      {image && (
        <img src={image} alt="Preview" className="image-preview" />
      )}

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

      {/* Hidden file inputs */}
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
