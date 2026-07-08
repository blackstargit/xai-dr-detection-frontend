import { useState, useRef } from "react";

function ImageUpload({ onImageSubmit, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    setFileName(file.name);
    onImageSubmit(file);
  };

  const triggerFileInput = () => {
    if (isLoading) return;
    fileInputRef.current.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "var(--bg-glass)",
        border: isDragOver ? "2px dashed var(--color-primary)" : "1px solid var(--border-light)",
        borderRadius: "16px",
        padding: "40px",
        textAlign: "center",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        transition: "var(--transition-smooth)",
        animation: "pulseGlow 2s infinite ease-in-out",
        cursor: isLoading ? "not-allowed" : "default",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          {/* Laser Scanning Animation */}
          <div
            style={{
              width: "120px",
              height: "120px",
              border: "3px solid rgba(0, 242, 254, 0.15)",
              borderTopColor: "var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          />
          <h3 style={{ fontSize: "1.4em", fontWeight: "600", margin: "0 0 10px 0", color: "var(--color-primary)" }}>
            Scanning Retina...
          </h3>
          <p style={{ margin: 0, fontSize: "0.95em", color: "var(--text-muted)" }}>
            Our model is detecting lesion hotspots and generating clinical insights.
          </p>
        </div>
      ) : (
        <>
          {/* Upload Icon */}
          <div
            style={{
              fontSize: "3em",
              color: isDragOver ? "var(--color-primary)" : "var(--text-muted)",
              marginBottom: "15px",
              transition: "var(--transition-smooth)",
            }}
          >
            👁️
          </div>
          <h2 style={{ fontSize: "1.6em", fontWeight: "600", margin: "0 0 10px 0" }}>
            Upload Retinal Scan
          </h2>
          <p style={{ margin: "0 0 25px 0", color: "var(--text-muted)", fontSize: "0.95em", lineHeight: "1.5" }}>
            Drag and drop your fundus image here, or browse files.<br />
            Supports JPEG, PNG, or TIFF files.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <button
            onClick={triggerFileInput}
            style={{
              padding: "12px 28px",
              fontSize: "1em",
              fontWeight: "600",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "var(--color-primary)",
              color: "var(--bg-darker)",
              boxShadow: "0 4px 15px rgba(0, 242, 254, 0.3)",
              transition: "var(--transition-smooth)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(0, 242, 254, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(0, 242, 254, 0.3)";
            }}
          >
            Browse Fundus Scan
          </button>
          
          {fileName && (
            <p style={{ marginTop: "15px", fontSize: "0.85em", color: "var(--color-primary)" }}>
              Selected: {fileName}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default ImageUpload;
