function PredictionResult({ predictionResult, originalImageURL }) {
  if (!predictionResult) {
    return null;
  }

  const classKey = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR",
  };

  let key;

  for (key in classKey) {
    key = Number(predictionResult.predicted_class);
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        backgroundColor: "#1e1e1e",
        minHeight: "95vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2em",
        }}
      >
        Prediction Result
      </h2>
      <p
        style={{
          fontSize: "1.1em",
          marginBottom: "20px",
          color: "#cccccc",
        }}
      >
        Below is the analysis of the uploaded image based on our
        {" Applications' "}
        predictions.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          maxWidth: "800px",
          gap: "20px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              marginBottom: "10px",
            }}
          >
            Original Image
          </h3>
          {originalImageURL && (
            <img
              src={originalImageURL}
              alt="Original"
              style={{
                maxWidth: "300px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <h3
            style={{
              marginBottom: "10px",
            }}
          >
            Grad-CAM Heatmap
          </h3>
          <img
            src={`data:image/jpeg;base64,${predictionResult.gradcam_image}`}
            alt="Grad-CAM"
            style={{
              maxWidth: "300px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
      </div>
      <p
        style={{
          fontSize: "1.2em",
          marginTop: "20px",
        }}
      >
        <strong>Predicted Class:</strong> {predictionResult.predicted_class}
        {"  ==>  "}
        {classKey[key]}
      </p>
      <p style={{ fontSize: "1.2em" }}>
        <strong>Explanation:</strong> {predictionResult.explanation}
      </p>
    </div>
  );
}

export default PredictionResult;
