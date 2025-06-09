import { useState } from "react";
import "../assets/styles.css";
import "./../styles/ResumeUpload.css";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    jobTitle: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    if (!file) {
      setError("Please upload a resume file");
      return false;
    }
    if (!formData.name || !formData.email || !formData.jobTitle) {
      setError("Name, email, and target job title are required");
      return false;
    }
    return true;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);
    const data = new FormData();
    
    // Add all form fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("file", file);

    try {
      // Step 1: Upload resume to Spring Boot backend
      const uploadResponse = await fetch("http://localhost:8080/api/resumes/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Resume upload failed: ${uploadResponse.statusText}`);
      }

      const result = await uploadResponse.json();
      console.log("Upload successful:", result);
      
      // Set analysis result from the same response
      if (result.analysisResult) {
        setAnalysisResult(result.analysisResult);
      }
      
    } catch (error) {
      console.error("Error during upload or analysis:", error);
      setError(error.message || "Upload or analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render matched keywords with highlighting
  const renderKeywords = (keywords) => {
    if (!keywords || keywords.length === 0) return "None";
    return keywords.join(", ");
  };

  return (
    <div className="container">
      <h2>Upload & Analyze Your Resume</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input 
            type="text" 
            id="phone" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="skills">Key Skills (comma-separated)</label>
          <input 
            type="text" 
            id="skills" 
            name="skills" 
            value={formData.skills}
            onChange={handleChange} 
            placeholder="e.g., Java, Python, AWS, Project Management" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="experience">Years of Experience</label>
          <input 
            type="text" 
            id="experience" 
            name="experience" 
            value={formData.experience}
            onChange={handleChange} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="jobTitle">Target Job Title/Role *</label>
          <input 
            type="text" 
            id="jobTitle" 
            name="jobTitle" 
            value={formData.jobTitle}
            onChange={handleChange} 
            required 
            placeholder="e.g., Software Engineer, Data Scientist" 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="resume">Resume File (PDF, DOC, DOCX) *</label>
          <input 
            type="file" 
            id="resume" 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx" 
            required 
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Upload & Analyze"}
        </button>
      </form>

      {analysisResult && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          
          {/* ATS Analysis Section */}
          {analysisResult.ats_analysis && (
            <div className="result-section">
              <h4>ATS Compatibility</h4>
              <div className="score-indicator">
                <div className="score-label">ATS Score:</div>
                <div className="score-value">
                  <span className={`score ${analysisResult.ats_analysis.ats_score >= 70 ? 'good' : analysisResult.ats_analysis.ats_score >= 50 ? 'average' : 'poor'}`}>
                    {analysisResult.ats_analysis.ats_score}%
                  </span>
                </div>
              </div>
              
              <div className="keywords-section">
                <h5>Keyword Analysis</h5>
                <div className="keyword-group">
                  <div className="keyword-label">Matched Keywords:</div>
                  <div className="keyword-value matched">
                    {renderKeywords(analysisResult.ats_analysis.exact_matched_keywords)}
                  </div>
                </div>
                
                <div className="keyword-group">
                  <div className="keyword-label">Similar Matches:</div>
                  <div className="keyword-value fuzzy">
                    {renderKeywords(analysisResult.ats_analysis.fuzzy_matched_keywords)}
                  </div>
                </div>
                
                <div className="keyword-group">
                  <div className="keyword-label">Missing Keywords:</div>
                  <div className="keyword-value missing">
                    {renderKeywords(analysisResult.ats_analysis.missing_keywords)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Skills Analysis Section */}
          {analysisResult.skill_analysis && (
            <div className="result-section">
              <h4>Skills Analysis</h4>
              
              <div className="skills-metrics">
                <div className="skill-metric">
                  <div className="metric-label">Primary Skills Match:</div>
                  <div className="metric-value">
                    <span className={`score ${analysisResult.skill_analysis.primary_match_percentage >= 70 ? 'good' : analysisResult.skill_analysis.primary_match_percentage >= 50 ? 'average' : 'poor'}`}>
                      {analysisResult.skill_analysis.primary_match_percentage}%
                    </span>
                  </div>
                </div>
                
                <div className="skill-metric">
                  <div className="metric-label">Secondary Skills Match:</div>
                  <div className="metric-value">
                    <span className={`score ${analysisResult.skill_analysis.secondary_match_percentage >= 70 ? 'good' : analysisResult.skill_analysis.secondary_match_percentage >= 50 ? 'average' : 'poor'}`}>
                      {analysisResult.skill_analysis.secondary_match_percentage}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="skills-breakdown">
                <h5>Skills Breakdown</h5>
                
                <div className="skill-group">
                  <div className="skill-label">Matched Primary Skills:</div>
                  <div className="skill-value matched">
                    {renderKeywords(analysisResult.skill_analysis.primary_matched_skills)}
                  </div>
                </div>
                
                <div className="skill-group">
                  <div className="skill-label">Matched Secondary Skills:</div>
                  <div className="skill-value matched">
                    {renderKeywords(analysisResult.skill_analysis.secondary_matched_skills)}
                  </div>
                </div>
                
                <div className="skill-group">
                  <div className="skill-label">Missing Primary Skills:</div>
                  <div className="skill-value missing">
                    {renderKeywords(analysisResult.skill_analysis.missing_primary_skills)}
                  </div>
                </div>
                
                <div className="skill-group">
                  <div className="skill-label">Missing Secondary Skills:</div>
                  <div className="skill-value missing">
                    {renderKeywords(analysisResult.skill_analysis.missing_secondary_skills)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Grammar Analysis Section */}
          {analysisResult.grammar_analysis && (
            <div className="result-section">
              <h4>Grammar & Readability</h4>
              
              <div className="grammar-metrics">
                <div className="grammar-metric">
                  <div className="metric-label">Total Grammar Issues:</div>
                  <div className="metric-value">
                    <span className={`score ${analysisResult.grammar_analysis.total_errors <= 3 ? 'good' : analysisResult.grammar_analysis.total_errors <= 8 ? 'average' : 'poor'}`}>
                      {analysisResult.grammar_analysis.total_errors}
                    </span>
                  </div>
                </div>
                
                {analysisResult.grammar_analysis.readability_metrics && (
                  <div className="readability-metrics">
                    <h5>Readability Scores</h5>
                    <div className="readability-metric">
                      <div className="metric-label">Flesch Reading Ease:</div>
                      <div className="metric-value">
                        {analysisResult.grammar_analysis.readability_metrics.flesch_reading_ease}
                        <span className="metric-note">(Higher is easier to read)</span>
                      </div>
                    </div>
                    
                    <div className="readability-metric">
                      <div className="metric-label">Grade Level:</div>
                      <div className="metric-value">
                        {analysisResult.grammar_analysis.readability_metrics.flesch_kincaid_grade}
                      </div>
                    </div>
                  </div>
                )}
                
                {analysisResult.grammar_analysis.grammar_errors && 
                 analysisResult.grammar_analysis.grammar_errors.length > 0 && (
                  <div className="grammar-errors">
                    <h5>Grammar Issues</h5>
                    <ul className="errors-list">
                      {analysisResult.grammar_analysis.grammar_errors.slice(0, 5).map((error, index) => (
                        <li key={index} className="error-item">
                          <div className="error-message">{error.error}</div>
                          {error.suggestions && error.suggestions.length > 0 && (
                            <div className="error-suggestion">
                              Suggestion: {error.suggestions[0]}
                            </div>
                          )}
                        </li>
                      ))}
                      
                      {analysisResult.grammar_analysis.grammar_errors.length > 5 && (
                        <li className="more-errors">
                          + {analysisResult.grammar_analysis.grammar_errors.length - 5} more issues
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="improvement-tips">
            <h4>Improvement Tips</h4>
            <ul>
              {analysisResult.ats_analysis && analysisResult.ats_analysis.missing_keywords && 
               analysisResult.ats_analysis.missing_keywords.length > 0 && (
                <li>
                  <strong>Add missing keywords:</strong> Include relevant terms like 
                  {" " + analysisResult.ats_analysis.missing_keywords.slice(0, 3).join(", ")}
                  {analysisResult.ats_analysis.missing_keywords.length > 3 ? ", and others" : ""}.
                </li>
              )}
              
              {analysisResult.grammar_analysis && 
               analysisResult.grammar_analysis.total_errors > 0 && (
                <li>
                  <strong>Fix grammar issues:</strong> Correct the {analysisResult.grammar_analysis.total_errors} 
                  grammar {analysisResult.grammar_analysis.total_errors === 1 ? "error" : "errors"} to improve professionalism.
                </li>
              )}
              
              {analysisResult.skill_analysis && 
               analysisResult.skill_analysis.primary_match_percentage < 70 && (
                <li>
                  <strong>Highlight key skills:</strong> Emphasize important skills like
                  {analysisResult.skill_analysis.missing_primary_skills && 
                   " " + analysisResult.skill_analysis.missing_primary_skills.slice(0, 3).join(", ")}
                  {analysisResult.skill_analysis.missing_primary_skills && 
                   analysisResult.skill_analysis.missing_primary_skills.length > 3 ? ", and others" : ""}.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
