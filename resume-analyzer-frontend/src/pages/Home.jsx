import { useState } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; 
import "../assets/styles.css";
import "./../styles/Home.css";
import ResumeAnalysisIllustration from "../components/ResumeAnalysisIllustration";

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);
 
  // const { isLoggedIn } = useAuth();
  // Otherwise, use localStorage directly
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const features = [
    {
      title: "AI Resume Analysis",
      description: "Get detailed feedback on your resume content, format, and relevance to specific job postings.",
      icon: "📝" 
    },
    {
      title: "Career Guidance",
      description: "Receive personalized career path recommendations based on your skills, experience, and interests.",
      icon: "🧭"
    },
    {
      title: "Interview Preparation",
      description: "Practice with AI-powered mock interviews tailored to your target role and industry.",
      icon: "🎯"
    },
    {
      title: "Resume Builder",
      description: "Create professional, ATS-optimized resumes with our easy-to-use resume builder.",
      icon: "⚙️"
    }
  ];

  const testimonials = [
    {
      quote: "ResumeAI helped me identify key gaps in my resume that were preventing me from getting interviews. After implementing the suggestions, I received three interview calls in just one week!",
      author: "Sarah J., Software Engineer",
      image: "/api/placeholder/70/70" 
    },
    {
      quote: "The mock interview feature was a game-changer. It helped me prepare for tough questions and build my confidence. I'm now working at my dream company!",
      author: "Michael T., Marketing Specialist",
      image: "/api/placeholder/70/70" 
    },
    {
      quote: "As a career switcher, I wasn't sure how to position my experience. The career guidance tool gave me actionable insights that helped me transition to UX design successfully.",
      author: "Rebecca L., UX Designer",
      image: "/api/placeholder/70/70" 
    }
  ];

  const stats = [
    { value: "85%", label: "Success Rate" },
    { value: "10,000+", label: "Resumes Analyzed" },
    { value: "97%", label: "Satisfaction Rate" },
    { value: "3x", label: "Interview Chances" }
  ];

  return (
    <div className="home-container">
     
      <section className="hero-section tight-hero">
        <div className="hero-content">
          <h1>Supercharge Your Job Search with AI</h1>
          <p className="hero-subtitle">
            Our AI tools analyze your resume, provide tailored career guidance, and prepare you for interviews to help you land your dream job.
          </p>
          <div className="cta-buttons">
            {isLoggedIn ? (
              <Link to="/dashboard" className="primary-button">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="primary-button">Get Started Free</Link>
                <Link to="/login" className="secondary-button">Login</Link>
              </>
            )}
          </div>
        </div>
        
        <div className="hero-image">
          <ResumeAnalysisIllustration />
        </div>
      </section>
{/* 
      Stats Section
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Features Section */}
      <section className="features-section">
        <h2>How ResumeAI Can Help You</h2>
        <div className="features-container">
          <div className="features-tabs">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-tab ${activeFeature === index ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
              </div>
            ))}
          </div>
          <div className="feature-content">
            <h3>{features[activeFeature].title}</h3>
            <p>{features[activeFeature].description}</p>
            <Link to={isLoggedIn ? "/dashboard" : "/register"} className="feature-link">
              Try {features[activeFeature].title} →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Your Resume</h3>
            <p>Upload your existing resume or create a new one using our templates.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes your resume against industry standards and job requirements.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Personalized Feedback</h3>
            <p>Receive detailed recommendations to improve your resume and job search strategy.</p>
          </div>
          {/* <div className="step">
            <div className="step-number">4</div>
            <h3>Apply with Confidence</h3>
            <p>Submit your optimized resume and prepare for interviews with our tools.</p>
          </div> */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Success Stories</h2>
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.author} className="author-image" />
                <p className="author-name">{testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Job Search?</h2>
          <p>Join thousands of job seekers who have already improved their career prospects with ResumeAI.</p>
          <div className="cta-buttons">
            {isLoggedIn ? (
              <Link to="/resume-upload" className="primary-button">Analyze Your Resume</Link>
            ) : (
              <Link to="/register" className="primary-button">Get Started Free</Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;