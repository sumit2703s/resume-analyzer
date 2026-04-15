export default function StrengthWeakness({ strengths = [], weaknesses = [] }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px" }}>Diagnostics</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h3>Core Strengths</h3>
          <ul className="styled-list bullet-success">
            {strengths.length > 0 ? (
              strengths.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li>No particular strengths detected.</li>
            )}
          </ul>
        </div>
        
        <div style={{ paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <h3>Critical Weaknesses</h3>
          <ul className="styled-list bullet-danger">
            {weaknesses.length > 0 ? (
              weaknesses.map((item, idx) => <li key={idx}>{item}</li>)
            ) : (
              <li>No critical flaws detected. Extremely solid configuration.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
