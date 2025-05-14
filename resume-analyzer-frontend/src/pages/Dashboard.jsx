import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-links">
        <Link to="/resume-upload" className="dashboard-card">Resume Analysis</Link>
        <Link to="/career-guidance" className="dashboard-card">Career Guidance</Link>
        <Link to="/mock-interview" className="dashboard-card">Mock Interview</Link>
        {/* <Link to="/job-description" className="dashboard-card">AI Job Description</Link> */}
        <Link to="/resume-formatter" className="dashboard-card">Resume Builder</Link>
        {/* <Link to="/profile" className="dashboard-card">Profile</Link> */}
      </div>
    </div>
  );
};

export default Dashboard;
