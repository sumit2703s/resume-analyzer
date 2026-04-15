export default function KeywordMatch({ keywordAnalysis = {} }) {
  const { matched_keywords = [], missing_keywords = [], match_percentage = 0 } = keywordAnalysis;

  return (
    <div className="card" display="flex" flexDirection="column">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h2 style={{ margin: 0 }}>Keyword Density</h2>
        <span className="chip accent">{match_percentage}% Hit Rate</span>
      </div>

      <div style={{ display: "grid", gap: "28px" }}>
        <div>
          <h3>Acquired Keywords</h3>
          <div className="chips-wrap">
            {matched_keywords.length > 0 ? (
              matched_keywords.map((keyword, idx) => (
                <span key={idx} className="chip success">{keyword}</span>
              ))
            ) : (
              <em style={{ color: "#64748b" }}>No keywords matched.</em>
            )}
          </div>
        </div>
        
        <div style={{ padding: "20px 0 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <h3>Missing Keywords</h3>
          <div className="chips-wrap">
            {missing_keywords.length > 0 ? (
              missing_keywords.map((keyword, idx) => (
                <span key={idx} className="chip danger">{keyword}</span>
              ))
            ) : (
              <em style={{ color: "#64748b" }}>System detected no gaps. Perfect!</em>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
