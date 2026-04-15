export default function Suggestions({ suggestions = [] }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: "24px" }}>Actionable Insights</h2>
      <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Implement these structural changes to increase your parsing success rate:</p>
      
      <ul className="styled-list">
        {suggestions.length > 0 ? (
          suggestions.map((item, idx) => <li key={idx}>{item}</li>)
        ) : (
          <li>No additional optimization suggestions required.</li>
        )}
      </ul>
    </div>
  );
}
