import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/Navbar.css";

function Navbar() {
  // Initialize state based on token existence
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));
  const navigate = useNavigate();

  // Add an effect to listen for token changes
  useEffect(() => {
    // Check token on component mount
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
    };

    // Initially check when component mounts
    checkLoginStatus();

    // Listen for storage events (in case token is changed in another tab)
    window.addEventListener("storage", checkLoginStatus);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // For debugging
  console.log("Auth state in Navbar:", { isLoggedIn, token: localStorage.getItem("token") });

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">ResumeAI</Link>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/" className="nav-item">Home</NavLink></li>
        <li><NavLink to="/dashboard" className="nav-item">Dashboard</NavLink></li>
        <li><NavLink to="/resume-upload" className="nav-item">Resume Analysis</NavLink></li>
        <li><NavLink to="/career-guidance" className="nav-item">Career Guidance</NavLink></li>
        <li><NavLink to="/mock-interview" className="nav-item">Mock Interview</NavLink></li>
        <li><NavLink to="/resume-formatter" className="nav-item">Resume Builder</NavLink></li>

        {/* Show Profile link and Logout if logged in */}
        {isLoggedIn ? (
          <>
            <li><NavLink to="/profile" className="nav-item">Profile</NavLink></li>
            <li><button className="nav-item logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className="nav-item">Login</NavLink></li>
            <li><NavLink to="/register" className="nav-item">Register</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;