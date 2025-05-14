import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ResumeUpload from "./components/ResumeUpload";
import ResumeAnalysis from "./components/ResumeAnalysis";
import CareerGuidance from "./components/CareerGuidance";
import JobDescription from "./components/JobDescription";
import MockInterview from "./components/MockInterview";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AIResumeFormatter from "./components/AIResumeFormatter";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/career-guidance" element={<CareerGuidance />} />
        <Route path="/job-description" element={<JobDescription />} />
        <Route path="/mock-interview" element={<MockInterview />} />
        <Route path="/resume-formatter" element={<AIResumeFormatter />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
