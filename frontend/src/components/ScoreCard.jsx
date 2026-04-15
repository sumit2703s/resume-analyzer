export default function ScoreCard({ score }) {
  const safeScore = score ?? 0;
  // Calculate percentage for CSS conic gradient 
  // Custom CSS property isn't standard inline, so we hack it perfectly
  const scoreStyle = { "--score-pct": `${safeScore}%` };

  return (
    <div className="card" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h2 style={{ marginBottom: "8px" }}>ATS Alignment Score</h2>
      
      <div className="score-circle" style={scoreStyle}>
        <span>{safeScore}</span>
      </div>
      
      <p className="score-desc">
        Scores above 80 indicate excellent keyword density and structure. 
        Aim for 90+ for elite tier roles.
      </p>
    </div>
  );
}
