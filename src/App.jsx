import { useState, useEffect } from "react";
import ImageUpload from "./components/ImageUpload";
import PredictionResult from "./components/PredictionResult";
import SampleSelector from "./components/SampleSelector";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/predict";
const STATUS_URL = API_URL.replace("/predict", "/status");

function App() {
  const [predictionResult, setPredictionResult] = useState(null);
  const [originalImageURL, setOriginalImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Health check to verify Flask backend status
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(STATUS_URL);
        if (res.ok) {
          const data = await res.json();
          setServerOnline(data.status === "healthy");
        } else {
          setServerOnline(false);
        }
      } catch {
        setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleImageSubmit = async (imageFile) => {
    setIsLoading(true);
    setErrorMsg(null);
    setPredictionResult(null);

    // Create a local URL for the original image for preview
    const objectUrl = URL.createObjectURL(imageFile);
    setOriginalImageURL(objectUrl);

    const formData = new FormData();
    formData.append("image", imageFile);

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
      setPredictionResult(data);
    } catch (error) {
      console.error("Error during prediction:", error);
      setErrorMsg("Failed to connect to the analysis model. Ensure the backend server is running.");
      setOriginalImageURL(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionResult(null);
    setOriginalImageURL(null);
    setErrorMsg(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        paddingBottom: "60px",
      }}
    >
      {/* Top Header / Status Bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "960px",
          padding: "20px 0",
          borderBottom: "1px solid var(--border-light)",
          marginBottom: "40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "2em" }}>👁️‍🗨️</span>
          <div>
            <h1
              style={{
                fontSize: "1.4em",
                fontWeight: "700",
                margin: 0,
                letterSpacing: "0.5px",
                background: "linear-gradient(90deg, #ffffff 0%, var(--color-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              RetinaScan AI
            </h1>
            <p style={{ margin: 0, fontSize: "0.75em", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Explainable Diabetic Retinopathy Detection
            </p>
          </div>
        </div>

        {/* Server Connection Status Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--border-light)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.8em",
            fontWeight: "600",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: serverOnline ? "var(--color-normal)" : "var(--color-proliferative)",
              boxShadow: serverOnline ? "0 0 8px var(--color-normal)" : "0 0 8px var(--color-proliferative)",
              transition: "var(--transition-smooth)",
            }}
          />
          <span style={{ color: serverOnline ? "var(--text-main)" : "var(--text-muted)" }}>
            {serverOnline ? "Server: Connected" : "Server: Offline"}
          </span>
        </div>
      </header>

      {/* Main Analysis Container */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "960px",
          flexGrow: 1,
        }}
      >
        {errorMsg && (
          <div
            style={{
              width: "100%",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid var(--color-proliferative)",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "var(--color-proliferative)",
              fontSize: "0.9em",
              textAlign: "center",
              animation: "fadeInUp 0.3s ease-out",
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {!predictionResult ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              animation: "fadeInUp 0.4s ease-out",
            }}
          >
            {/* Upload Zone */}
            <ImageUpload onImageSubmit={handleImageSubmit} isLoading={isLoading} />
            
            {/* Presets Cards */}
            {!isLoading && (
              <SampleSelector onImageSubmit={handleImageSubmit} isLoading={isLoading} />
            )}
          </div>
        ) : (
          <PredictionResult
            predictionResult={predictionResult}
            originalImageURL={originalImageURL}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer
        style={{
          marginTop: "60px",
          fontSize: "0.75em",
          color: "var(--text-dim)",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: "1.4",
        }}
      >
        Disclaimer: This AI system is designed for clinical research and educational demonstration only. 
        It does not replace professional diagnostic screening. Always consult a certified ophthalmologist 
        for medical advice.
      </footer>
    </div>
  );
}

export default App;
