import { useState } from "react";
import "../assets/styles.css";
import "./../styles/JobDescription.css";


const JobDescription = () => {
  const [jobDesc, setJobDesc] = useState("");

  const handleGenerate = async () => {
    const response = await fetch("http://localhost:8080/api/job-description");
    const data = await response.json();
    setJobDesc(data.description);
  };

  return (
    <div className="container">
      <h2>AI-Generated Job Descriptions</h2>
      <button onClick={handleGenerate}>Generate</button>
      <p>{jobDesc}</p>
    </div>
  );
};

export default JobDescription;
