import { useState, useEffect } from "react";
import Upload from "./pages/Upload.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { uploadResume, analyzeResume, getResults } from "./api/client.js";

function App() {
  const [resumeId, setResumeId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark"; // Defaulting to the beautiful dark mode
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleUpload = async (file, jobDescription) => {
    setLoading(true);
    setError("");

    try {
      const uploadResponse = await uploadResume(file, jobDescription);
      setResumeId(uploadResponse.resume_id);

      await analyzeResume(uploadResponse.resume_id);
      const resultsResponse = await getResults(uploadResponse.resume_id);
      setAnalysis(resultsResponse.analysis);
    } catch (err) {
      setError(err.message || "Unable to process resume.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResumeId(null);
    setAnalysis(null);
    setError("");
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
        {theme === 'light' ? '☾' : '☼'}
      </button>
      
      <div className="main-header animate-1">
        <h1 className="page-title">ATS Intelligence.</h1>
        <p className="subtitle">
          Engineered to dismantle applicant tracking systems. Deploy your resume below for absolute 
          precision screening and structural optimization.
        </p>
      </div>
      
      <div className="animate-2">
        {analysis ? (
          <Dashboard analysis={analysis} onReset={reset} />
        ) : (
          <Upload onUpload={handleUpload} loading={loading} error={error} />
        )}
      </div>
    </div>
  );
}

export default App;
