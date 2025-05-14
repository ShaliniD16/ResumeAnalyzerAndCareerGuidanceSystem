import React, { useState } from 'react';
import './../styles/CareerGuidance.css';

const CareerGuidance = () => {
  // Form state
  const [currentRole, setCurrentRole] = useState('');
  const [skills, setSkills] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [timeline, setTimeline] = useState('6 months');
  
  // Results state
  const [careerAnalysis, setCareerAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('nextRoles');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle user inputs as array
  const getSkillsArray = () => skills.split(',').map(skill => skill.trim()).filter(skill => skill);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Call the career path prediction API
      const roleResponse = await fetch('http://localhost:8080/api/career/predict-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_role: currentRole,
          skills: getSkillsArray(),
          years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          industry: industry || null
        }),
      });

      if (!roleResponse.ok) {
        throw new Error('Failed to fetch career path predictions');
      }
      
      const roleData = await roleResponse.json();
      
      // Get all potential next roles to query for skills
      const allRoles = [
        ...roleData.vertical_progression.map(item => item.role),
        ...roleData.specialization_paths.map(item => item.role),
        ...roleData.lateral_movements.map(item => item.role),
        ...roleData.emerging_opportunities.map(item => item.role)
      ];
      
      // Only proceed if we have roles
      if (allRoles.length === 0) {
        throw new Error('No career paths found for the provided information');
      }
      
      // Call the skills suggestion API
      const skillsResponse = await fetch('http://localhost:8080/api/career/suggest-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_roles: allRoles,
          current_skills: getSkillsArray(),
          industry: industry || null
        }),
      });
      
      if (!skillsResponse.ok) {
        throw new Error('Failed to fetch skill recommendations');
      }
      
      const skillsData = await skillsResponse.json();
      
      // Get all suggested skills to query for resources
      const allSkills = [
        ...skillsData.technical_skills.map(item => item.skill),
        ...skillsData.soft_skills.map(item => item.skill),
      ];
      
      // Call the learning resources API
      const resourcesResponse = await fetch('http://localhost:8080/api/career/learning-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skills: allSkills
        }),
      });
      
      if (!resourcesResponse.ok) {
        throw new Error('Failed to fetch learning resources');
      }
      
      const resourcesData = await resourcesResponse.json();

      // If target role is provided, get a development plan
      let developmentPlan = null;
      if (targetRole) {
        const planResponse = await fetch('http://localhost:8080/api/career/development-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_role: currentRole,
            target_role: targetRole,
            current_skills: getSkillsArray(),
            timeline: timeline
          }),
        });
        
        if (planResponse.ok) {
          developmentPlan = await planResponse.json();
        }
      }
      
      // Combine all data
      setCareerAnalysis({
        careerPaths: roleData,
        recommendedSkills: skillsData,
        learningResources: resourcesData,
        developmentPlan: developmentPlan
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="career-guidance-container">
      <h2>Professional Career Guidance</h2>
      
      <form onSubmit={handleSubmit} className="career-form">
        <div className="form-group">
          <label htmlFor="currentRole">Current Job Role:</label>
          <input
            type="text"
            id="currentRole"
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value)}
            placeholder="e.g. Software Developer"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="skills">Your Skills (comma separated):</label>
          <input
            type="text"
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. JavaScript, Project Management, Communication"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="yearsExperience">Years of Experience:</label>
            <input
              type="number"
              id="yearsExperience"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="e.g. 3"
              min="0"
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="industry">Industry:</label>
            <input
              type="text"
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. Technology"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="targetRole">Target Role (optional):</label>
            <input
              type="text"
              id="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Engineering Manager"
            />
          </div>
          
          <div className="form-group half">
            <label htmlFor="timeline">Timeline:</label>
            <select
              id="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
            >
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="12 months">12 months</option>
              <option value="18 months">18 months</option>
            </select>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Analyzing...' : 'Analyze Career Path'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {careerAnalysis && (
        <div className="results-container">
          <div className="tabs">
            <button 
              className={activeTab === 'nextRoles' ? 'active' : ''} 
              onClick={() => setActiveTab('nextRoles')}
            >
              Career Paths
            </button>
            <button 
              className={activeTab === 'skills' ? 'active' : ''} 
              onClick={() => setActiveTab('skills')}
            >
              Recommended Skills
            </button>
            <button 
              className={activeTab === 'resources' ? 'active' : ''} 
              onClick={() => setActiveTab('resources')}
            >
              Learning Resources
            </button>
            {careerAnalysis.developmentPlan && (
              <button 
                className={activeTab === 'plan' ? 'active' : ''} 
                onClick={() => setActiveTab('plan')}
              >
                Development Plan
              </button>
            )}
          </div>

          {activeTab === 'nextRoles' && (
            <div className="tab-content">
              <h3>Potential Career Paths</h3>
              
              {careerAnalysis.careerPaths.vertical_progression.length > 0 && (
                <div className="career-section">
                  <h4>Vertical Progression</h4>
                  <div className="card-container">
                    {careerAnalysis.careerPaths.vertical_progression.map((role, idx) => (
                      <div key={idx} className="role-card">
                        <h5>{role.role}</h5>
                        <div className="confidence">
                          <span>Match: {Math.round(role.confidence * 100)}%</span>
                          <div className="progress-bar">
                            <div className="progress" style={{width: `${role.confidence * 100}%`}}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {careerAnalysis.careerPaths.specialization_paths.length > 0 && (
                <div className="career-section">
                  <h4>Specialization Paths</h4>
                  <div className="card-container">
                    {careerAnalysis.careerPaths.specialization_paths.map((role, idx) => (
                      <div key={idx} className="role-card">
                        <h5>{role.role}</h5>
                        <div className="confidence">
                          <span>Match: {Math.round(role.confidence * 100)}%</span>
                          <div className="progress-bar">
                            <div className="progress" style={{width: `${role.confidence * 100}%`}}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {careerAnalysis.careerPaths.lateral_movements && careerAnalysis.careerPaths.lateral_movements.length > 0 && (
                <div className="career-section">
                  <h4>Lateral Movements</h4>
                  <div className="card-container">
                    {careerAnalysis.careerPaths.lateral_movements.map((role, idx) => (
                      <div key={idx} className="role-card">
                        <h5>{role.role}</h5>
                        <div className="confidence">
                          <span>Match: {Math.round(role.confidence * 100)}%</span>
                          <div className="progress-bar">
                            <div className="progress" style={{width: `${role.confidence * 100}%`}}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {careerAnalysis.careerPaths.emerging_opportunities && careerAnalysis.careerPaths.emerging_opportunities.length > 0 && (
                <div className="career-section">
                  <h4>Emerging Opportunities</h4>
                  <div className="card-container">
                    {careerAnalysis.careerPaths.emerging_opportunities.map((role, idx) => (
                      <div key={idx} className="role-card">
                        <h5>{role.role}</h5>
                        <div className="confidence">
                          <span>Match: {Math.round(role.confidence * 100)}%</span>
                          <div className="progress-bar">
                            <div className="progress" style={{width: `${role.confidence * 100}%`}}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="tab-content">
              <h3>Recommended Skills to Develop</h3>
              
              {careerAnalysis.recommendedSkills.technical_skills.length > 0 && (
                <div className="skills-section">
                  <h4>Technical Skills</h4>
                  <div className="skills-list">
                    {careerAnalysis.recommendedSkills.technical_skills.map((skill, idx) => (
                      <div key={idx} className={`skill-tag ${skill.priority}`}>
                        {skill.skill}
                        <span className="priority-indicator">{skill.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {careerAnalysis.recommendedSkills.soft_skills.length > 0 && (
                <div className="skills-section">
                  <h4>Soft Skills</h4>
                  <div className="skills-list">
                    {careerAnalysis.recommendedSkills.soft_skills.map((skill, idx) => (
                      <div key={idx} className={`skill-tag ${skill.priority}`}>
                        {skill.skill}
                        <span className="priority-indicator">{skill.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {careerAnalysis.recommendedSkills.certifications.length > 0 && (
                <div className="skills-section">
                  <h4>Recommended Certifications</h4>
                  <div className="skills-list">
                    {careerAnalysis.recommendedSkills.certifications.map((cert, idx) => (
                      <div key={idx} className={`skill-tag ${cert.priority}`}>
                        {cert.skill}
                        <span className="priority-indicator">{cert.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="tab-content">
              <h3>Learning Resources</h3>
              
              {Object.keys(careerAnalysis.learningResources).map(skill => (
                <div key={skill} className="resource-section">
                  <h4>{skill}</h4>
                  
                  {careerAnalysis.learningResources[skill].courses.length > 0 && (
                    <div className="resource-category">
                      <h5>Courses</h5>
                      <div className="resource-cards">
                        {careerAnalysis.learningResources[skill].courses.map((course, idx) => (
                          <div key={idx} className="resource-card">
                            <h6>{course.name}</h6>
                            <p className="provider">by {course.provider}</p>
                            <div className="resource-details">
                              <span className="resource-cost">{typeof course.cost === 'number' ? `$${course.cost}` : course.cost}</span>
                              {course.duration && <span className="resource-duration">{course.duration}</span>}
                              {course.rating && <span className="resource-rating">Rating: {course.rating}/5</span>}
                            </div>
                            <a href={course.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                              View Course
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {careerAnalysis.learningResources[skill].books && careerAnalysis.learningResources[skill].books.length > 0 && (
                    <div className="resource-category">
                      <h5>Books</h5>
                      <div className="resource-cards">
                        {careerAnalysis.learningResources[skill].books.map((book, idx) => (
                          <div key={idx} className="resource-card">
                            <h6>{book.name}</h6>
                            <p className="provider">by {book.author}</p>
                            <div className="resource-details">
                              <span className="resource-cost">{typeof book.cost === 'number' ? `$${book.cost}` : book.cost}</span>
                              {book.format && <span className="resource-format">{book.format}</span>}
                            </div>
                            <a href={book.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                              View Book
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {careerAnalysis.learningResources[skill].communities && careerAnalysis.learningResources[skill].communities.length > 0 && (
                    <div className="resource-category">
                      <h5>Communities</h5>
                      <div className="resource-cards">
                        {careerAnalysis.learningResources[skill].communities.map((community, idx) => (
                          <div key={idx} className="resource-card">
                            <h6>{community.name}</h6>
                            <div className="resource-details">
                              <span className="resource-cost">{community.cost}</span>
                              {community.type && <span className="resource-type">{community.type}</span>}
                            </div>
                            <a href={community.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                              Join Community
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'plan' && careerAnalysis.developmentPlan && (
            <div className="tab-content">
              <h3>Career Development Plan</h3>
              <div className="plan-summary">
                <div className="plan-summary-item">
                  <span className="label">From:</span> 
                  <span className="value">{careerAnalysis.developmentPlan.summary.current_role}</span>
                </div>
                <div className="plan-summary-item">
                  <span className="label">To:</span> 
                  <span className="value">{careerAnalysis.developmentPlan.summary.target_role}</span>
                </div>
                <div className="plan-summary-item">
                  <span className="label">Timeline:</span> 
                  <span className="value">{careerAnalysis.developmentPlan.summary.timeline}</span>
                </div>
                <div className="plan-summary-item">
                  <span className="label">Skills to Acquire:</span> 
                  <span className="value">{careerAnalysis.developmentPlan.summary.skills_gap}</span>
                </div>
              </div>
              
              <div className="timeline">
                <h4>Development Timeline</h4>
                <div className="timeline-container">
                  {careerAnalysis.developmentPlan.milestones.map((milestone, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <h5>{milestone.timeline}</h5>
                        <div className="timeline-goals">
                          <h6>Goals:</h6>
                          <ul>
                            {milestone.goals.map((goal, gIdx) => (
                              <li key={gIdx}>{goal}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="timeline-metrics">
                          <h6>Success Metrics:</h6>
                          <ul>
                            {milestone.metrics.map((metric, mIdx) => (
                              <li key={mIdx}>{metric}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="plan-strategies">
                <div className="strategy-section">
                  <h4>Networking Strategy</h4>
                  <div className="strategy-content">
                    <div className="strategy-subsection">
                      <h5>Who to Connect With</h5>
                      <ul>
                        {careerAnalysis.developmentPlan.networking_strategy.target_connections.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="strategy-subsection">
                      <h5>How to Connect</h5>
                      <ul>
                        {careerAnalysis.developmentPlan.networking_strategy.engagement_approach.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="strategy-section">
                  <h4>Application Strategy</h4>
                  <div className="strategy-content">
                    <div className="strategy-subsection">
                      <h5>Resume Focus</h5>
                      <ul>
                        {careerAnalysis.developmentPlan.application_strategy.resume_focus_points.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="strategy-subsection">
                      <h5>Interview Preparation</h5>
                      <ul>
                        {careerAnalysis.developmentPlan.application_strategy.interview_preparation.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerGuidance;