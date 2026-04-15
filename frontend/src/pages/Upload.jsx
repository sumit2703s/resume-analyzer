import { useState } from "react";

export default function Upload({ onUpload, loading, error }) {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleDrag = (event) => {
    event.preventDefault();
    setDragActive(event.type === "dragover");
  };

  return (
    <div className="upload-shell">
      <div
        className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragLeave={() => setDragActive(false)}
      >
        <div className="upload-icon">☁</div>
        <span className="upload-label">
          {file ? file.name : "Drag & Drop your PDF here"}
        </span>
        <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "1rem" }}>
          or click anywhere to browse files
        </p>
        <input
          type="file"
          accept="application/pdf"
          className="file-input"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </div>

      <div className="card" style={{ width: "100%", maxWidth: "650px", textAlign: "left", padding: "24px" }}>
        <h3 style={{ marginBottom: "12px", fontSize: "1.1rem" }}>Target Job Description (Optional)</h3>
        <textarea
          placeholder="Paste requirements here to tailor the analysis..."
          style={{
            width: "100%",
            minHeight: "120px",
            background: "rgba(0,0,0,0.2)",
            border: "1px solid var(--card-border)",
            borderRadius: "12px",
            padding: "16px",
            color: "var(--text-main)",
            fontFamily: "inherit",
            resize: "vertical",
            fontSize: "0.95rem"
          }}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {file && (
        <div className="file-info card" style={{ padding: "16px 24px" }}>
          <div>
            <p className="file-name" style={{ margin: 0 }}>{file.name}</p>
            <p className="file-meta" style={{ margin: "4px 0 0", fontSize: "0.9rem" }}>{(file.size / 1024).toFixed(1)} KB • PDF</p>
          </div>
          <div style={{ color: "#10b981", fontSize: "1.5rem" }}>✓</div>
        </div>
      )}

      {error && <p className="error-state">{error}</p>}

      <div className="actions-row">
        <button
          type="button"
          className="button-primary"
          disabled={!file || loading}
          onClick={() => file && onUpload(file, jobDescription)}
        >
          {loading ? "Analyzing Matrix..." : "Commence Analysis"}
        </button>
        {(file || jobDescription) && !loading && (
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              setFile(null);
              setJobDescription("");
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
