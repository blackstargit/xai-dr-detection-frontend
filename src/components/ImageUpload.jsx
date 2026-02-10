import { useState } from "react";

function ImageUpload({ onImageSubmit, proceed }) {
  console.log("Inside ImageUpload");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      onImageSubmit(selectedFile);
      proceed();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "90vh",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        paddingTop: "50px",
      }}
    >
      <h1
        style={{
          fontSize: "2.5em",
          marginBottom: "20px",
        }}
      >
        Diabetic Retinopathy Prediction
      </h1>

      <p
        style={{
          fontSize: "1.2em",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Upload a retinal image, and our AI model will analyze it for signs of
        diabetic retinopathy. Using advanced explainable AI techniques (Grad-CAM
        and NLP), you will receive a detailed explanation of the predictions.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            padding: "10px",
            fontSize: "1em",
            borderRadius: "5px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "1.2em",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "#ffffff",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Predict
        </button>
      </form>
    </div>
  );
}

export default ImageUpload;
