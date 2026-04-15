import ScoreCard from "../components/ScoreCard.jsx";
import Suggestions from "../components/Suggestions.jsx";
import KeywordMatch from "../components/KeywordMatch.jsx";
import StrengthWeakness from "../components/StrengthWeakness.jsx";

export default function Dashboard({ analysis, onReset }) {
  const { ats_score, strengths, weaknesses, suggestions, keyword_analysis, improved_bullets } = analysis;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header animate-1">
        <div style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "8px", fontWeight: "700" }}>Diagnostic Report</h2>
          <p className="subtitle" style={{ margin: 0, fontSize: "1rem", maxWidth: "500px", textAlign: "left" }}>
            The following telemetry details your alignment with industry-standard hiring matrices.
          </p>
        </div>
        <button type="button" className="button-secondary" onClick={onReset}>
          Analyze New Document
        </button>
      </div>

      <div className="grid-2 animate-2">
        <ScoreCard score={ats_score} />
        <KeywordMatch keywordAnalysis={keyword_analysis} />
      </div>

      <div className="grid-2 animate-3">
        <StrengthWeakness strengths={strengths} weaknesses={weaknesses} />
        <Suggestions suggestions={suggestions} />
      </div>

      {improved_bullets?.length > 0 && (
        <div className="card">
          <h2>Bullet Point Optimization</h2>
          <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Consider replacing some of your existing bullet points with these high-impact alternatives:</p>
          <ul className="styled-list">
            {improved_bullets.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
