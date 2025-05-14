import { useState } from "react";
import "../assets/styles.css";

const ResumeAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    const response = await fetch("http://localhost:8080/api/analyze");
    const data = await response.json();
    setAnalysis(data);
  };

  return (
    <div className="container">
      <h2>Resume Analysis</h2>
      <button onClick={handleAnalyze}>Analyze</button>
      {analysis && (
        <pre>{JSON.stringify(analysis, null, 2)}</pre>
      )}
    </div>
  );
};

export default ResumeAnalysis;
