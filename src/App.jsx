import React, { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import PredictionResult from "./components/PredictionResult";

const API_URL = import.meta.env.VITE_API_URL; // Your Flask API URL

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [isProceed, setIsProceed] = useState(false);
  const [originalImageURL, setOriginalImageURL] = useState(null); // Store the URL of the original image

  const handleImageSubmit = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    // Create a URL for the original image to display it immediately
    setOriginalImageURL(URL.createObjectURL(imageFile));

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const data = await response.json();
      console.log(data);
      setPredictionResult(data);
    } catch (error) {
      console.error("Error during prediction:", error);
      // Handle error (e.g., display an error message)
    }
  };

  const proceed = () => {
    setIsProceed(true);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!isProceed && (
        <ImageUpload onImageSubmit={handleImageSubmit} proceed={proceed} />
      )}

      <PredictionResult
        predictionResult={predictionResult}
        originalImageURL={originalImageURL} // Pass the URL to the component
      />
    </div>
  );
}

export default App;
