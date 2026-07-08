import { useState } from "react";

function PredictionResult({ predictionResult, originalImageURL, onReset }) {
  const [opacity, setOpacity] = useState(0.5);
  const [selectedFeature, setSelectedFeature] = useState(null);

  if (!predictionResult) {
    return null;
  }

  const classKey = {
    0: { name: "No DR", color: "var(--color-normal)", description: "Healthy retina with no visible vascular abnormalities.", pct: 15 },
    1: { name: "Mild", color: "var(--color-mild)", description: "Presence of early microaneurysms (microscopic capillary leaks).", pct: 35 },
    2: { name: "Moderate", color: "var(--color-moderate)", description: "Evident microaneurysms, hemorrhages, and hard lipid exudates.", pct: 55 },
    3: { name: "Severe", color: "var(--color-severe)", description: "Significant hemorrhages in 4 quadrants, microvascular changes (IRMA).", pct: 75 },
    4: { name: "Proliferative DR", color: "var(--color-proliferative)", description: "Advanced neovascularization (abnormal vessel growth) with risk of vitreous hemorrhage.", pct: 100 },
  };

  const predClass = Number(predictionResult.predicted_class);
  const classInfo = classKey[predClass] || classKey[0];

  const clinicalFeatures = [
    {
      id: "microaneurysms",
      title: "Microaneurysms",
      desc: "Tiny red dots representing small bulges in the capillary walls of the retina. They are the earliest clinical sign of diabetic retinopathy.",
      symbol: "🔴"
    },
    {
      id: "exudates",
      title: "Hard Exudates",
      desc: "Yellow lipid and protein leaks deposited into the outer plexiform layer of the retina, resulting from damaged hyperpermeable vessels.",
      symbol: "🟡"
    },
    {
      id: "hemorrhages",
      title: "Retinal Hemorrhages",
      desc: "Bleeding within the intermediate layers of the retina. Blot hemorrhages signify deeper capillary leakage, indicating progressive damage.",
      symbol: "🩸"
    },
    {
      id: "neovascularization",
      title: "Neovascularization",
      desc: "The growth of new, fragile blood vessels across the retina or optic disk. These leak easily, causing severe vision loss or retinal detachment.",
      symbol: "🕸️"
    }
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "40px",
        width: "100%",
        maxWidth: "960px",
        backgroundColor: "var(--bg-glass)",
        border: "1px solid var(--border-light)",
        borderRadius: "16px",
        padding: "30px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
        animation: "fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      }}
    >
      {/* Left Workspace: Interactive Visualizer */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3
          style={{
            fontSize: "1.2em",
            fontWeight: "600",
            margin: "0 0 20px 0",
            color: "var(--text-main)",
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>👁️</span> Diagnostic Visualization Workspace
        </h3>

        {/* Layered Image Frame */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "360px",
            aspectRatio: "1/1",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            border: "1px solid var(--border-light)",
            backgroundColor: "#05070e",
          }}
        >
          {originalImageURL && (
            <img
              src={originalImageURL}
              alt="Original Retina"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
          <img
            src={`data:image/jpeg;base64,${predictionResult.gradcam_image}`}
            alt="Grad-CAM Heatmap"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: opacity,
              mixBlendMode: "screen",
              transition: "opacity 0.05s linear",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Opacity Blend Control */}
        <div style={{ width: "100%", maxWidth: "360px", marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.85em",
              color: "var(--text-muted)",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            <span>Retinal Structure (0%)</span>
            <span>Grad-CAM Highlights (100%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            style={{
              width: "100%",
              cursor: "pointer",
              accentColor: "var(--color-primary)",
              height: "6px",
              borderRadius: "3px",
              background: "rgba(255, 255, 255, 0.1)",
              outline: "none",
              border: "none",
            }}
          />
          <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.85em", color: "var(--color-primary)" }}>
            Current Overlay Opacity: <strong>{Math.round(opacity * 100)}%</strong>
          </div>
        </div>
      </div>

      {/* Right Workspace: Clinical Report */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h3
            style={{
              fontSize: "1.2em",
              fontWeight: "600",
              margin: "0 0 20px 0",
              color: "var(--text-main)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>📋</span> Diagnostic Report Card
          </h3>

          {/* Severity Class Widget */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.9em", color: "var(--text-muted)" }}>Pathological Classification</span>
              <span
                style={{
                  color: classInfo.color,
                  fontSize: "1.1em",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {classInfo.name}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div style={{ width: "100%", height: "8px", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", overflow: "hidden", marginBottom: "10px" }}>
              <div
                style={{
                  width: `${classInfo.pct}%`,
                  height: "100%",
                  backgroundColor: classInfo.color,
                  boxShadow: `0 0 10px ${classInfo.color}`,
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
            
            <p style={{ margin: 0, fontSize: "0.9em", color: "var(--text-muted)", lineHeight: "1.4" }}>
              {classInfo.description}
            </p>
          </div>

          {/* AI Clinical Explanations */}
          <div style={{ marginBottom: "24px" }}>
            <h4 style={{ fontSize: "0.95em", fontWeight: "600", margin: "0 0 8px 0", color: "var(--text-main)" }}>
              Model Interpretation Summary
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "0.92em",
                color: "var(--text-muted)",
                lineHeight: "1.5",
                backgroundColor: "rgba(0, 242, 254, 0.03)",
                borderLeft: "3px solid var(--color-primary)",
                padding: "12px",
                borderRadius: "0 8px 8px 0",
              }}
            >
              {predictionResult.explanation}
            </p>
          </div>

          {/* Clinical Features Explorer */}
          <div>
            <h4 style={{ fontSize: "0.95em", fontWeight: "600", margin: "0 0 10px 0", color: "var(--text-main)" }}>
              Lesion Feature Inspector (Click to Learn)
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {clinicalFeatures.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeature(selectedFeature === f.id ? null : f.id)}
                  style={{
                    backgroundColor: selectedFeature === f.id ? "rgba(0, 242, 254, 0.15)" : "rgba(255, 255, 255, 0.02)",
                    border: selectedFeature === f.id ? "1px solid var(--color-primary)" : "1px solid var(--border-light)",
                    color: selectedFeature === f.id ? "var(--color-primary)" : "var(--text-muted)",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85em",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                  }}
                  onMouseOver={(e) => {
                    if (selectedFeature !== f.id) {
                      e.target.style.borderColor = "var(--color-primary)";
                      e.target.style.color = "var(--text-main)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedFeature !== f.id) {
                      e.target.style.borderColor = "var(--border-light)";
                      e.target.style.color = "var(--text-muted)";
                    }
                  }}
                >
                  {f.symbol} {f.title}
                </button>
              ))}
            </div>

            {selectedFeature && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "8px",
                  fontSize: "0.88em",
                  color: "var(--text-muted)",
                  lineHeight: "1.4",
                  animation: "fadeInUp 0.3s ease-out forwards",
                }}
              >
                <strong>
                  {clinicalFeatures.find((f) => f.id === selectedFeature)?.title}:
                </strong>{" "}
                {clinicalFeatures.find((f) => f.id === selectedFeature)?.desc}
              </div>
            )}
          </div>
        </div>

        {/* Reset Actions */}
        <button
          onClick={onReset}
          style={{
            marginTop: "30px",
            padding: "12px",
            width: "100%",
            fontSize: "1em",
            fontWeight: "600",
            borderRadius: "8px",
            border: "1px solid var(--border-light)",
            backgroundColor: "transparent",
            color: "var(--text-main)",
            cursor: "pointer",
            transition: "var(--transition-smooth)",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.target.style.borderColor = "var(--text-main)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.borderColor = "var(--border-light)";
          }}
        >
          Clear Workspace & Scan New Retina
        </button>
      </div>
    </div>
  );
}

export default PredictionResult;
