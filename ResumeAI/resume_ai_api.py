import os
import re
import whisper
from werkzeug.utils import secure_filename
from typing import List, Dict, Union, Any
import tempfile


import spacy
import nltk
import textstat
import language_tool_python
from flask import Flask, request, jsonify
from fuzzywuzzy import fuzz
from flask_cors import CORS

# Import from local db module
from db import fetch_resume

# Download necessary NLTK resources
nltk.download('punkt', quiet=True)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load model only once
model = whisper.load_model("base")

# Setup upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Enhanced Job Roles with More Comprehensive Skills
JOB_ROLES = {
    "Software Engineer": {
        "primary_skills": {
            "python", "java", "c++", "javascript", "typescript",
            "spring boot", "django", "flask", "express", "fastapi",
            "sql", "nosql", "react", "angular", "vue",
            "object-oriented programming", "software development", "rest api"
        },
        "secondary_skills": {
            "git", "github", "gitlab", "rest apis", "graphql", "microservices", 
            "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins",
            "agile methodologies", "scrum", "kanban", "tdd", "unit testing",
            "algorithm design", "system design", "data structures"
        }
    },
    "Data Scientist": {
        "primary_skills": {
            "python", "r", "machine learning", "deep learning", "statistics", 
            "pandas", "numpy", "scipy", "tensorflow", "pytorch", "scikit-learn", 
            "data analysis", "predictive modeling", "nlp", "neural networks",
            "regression", "classification", "clustering", "time series analysis"
        },
        "secondary_skills": {
            "sql", "nosql", "big data", "hadoop", "spark", "tableau", "power bi",
            "data visualization", "matplotlib", "seaborn", "plotly", "feature engineering",
            "etl", "data pipelines", "ab testing", "hypothesis testing", "bayesian statistics",
            "model deployment", "mlops", "computer vision", "reinforcement learning"
        }
    },
    "DevOps Engineer": {
        "primary_skills": {
            "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins",
            "terraform", "ansible", "puppet", "chef", "cloud infrastructure",
            "linux", "bash", "shell scripting", "monitoring", "prometheus", "grafana"
        },
        "secondary_skills": {
            "networking", "security", "load balancing", "dns", "nginx", "apache",
            "infrastructure as code", "git", "github actions", "gitlab ci",
            "logging", "elk stack", "observability", "serverless", "lambda",
            "high availability", "disaster recovery", "configuration management",
            "automation", "troubleshooting", "performance optimization"
        }
    },
    "Frontend Developer": {
        "primary_skills": {
            "react", "angular", "vue", "javascript", "typescript", 
            "css", "sass", "less", "html5", "redux", "responsive design",
            "web development", "dom manipulation", "frontend frameworks"
        },
        "secondary_skills": {
            "webpack", "babel", "graphql", "rest api", "axios", "fetch api",
            "ui/ux design", "accessibility", "bootstrap", "tailwind css", "material ui",
            "styled components", "css modules", "state management", "web performance",
            "progressive web apps", "single page applications", "unit testing", "jest", "cypress"
        }
    },
    "Backend Developer": {
        "primary_skills": {
            "java", "python", "c#", "node.js", "go", "ruby", "php",
            "spring boot", "django", "express", "asp.net", "laravel", "flask",
            "rest api", "graphql", "microservices", "sql", "nosql", "orm"
        },
        "secondary_skills": {
            "database design", "postgresql", "mysql", "mongodb", "redis", "message queues",
            "rabbitmq", "kafka", "api design", "authentication", "authorization", "oauth",
            "jwt", "docker", "kubernetes", "aws", "azure", "error handling", "logging",
            "unit testing", "integration testing", "caching", "performance optimization"
        }
    },
    "Full Stack Developer": {
        "primary_skills": {
            "javascript", "typescript", "python", "java", "node.js",
            "react", "angular", "vue", "express", "django", "spring boot",
            "html5", "css", "sql", "nosql", "rest api", "graphql"
        },
        "secondary_skills": {
            "git", "docker", "aws", "azure", "ci/cd", "webpack", "babel",
            "responsive design", "microservices", "database design",
            "authentication", "authorization", "testing", "debugging",
            "agile methodologies", "scrum", "ui/ux principles"
        }
    },
    "Data Engineer": {
        "primary_skills": {
            "python", "sql", "spark", "hadoop", "airflow", "etl",
            "data pipelines", "data modeling", "database design",
            "data warehousing", "big data", "data integration"
        },
        "secondary_skills": {
            "aws", "azure", "gcp", "snowflake", "redshift", "bigquery",
            "kafka", "streaming data", "docker", "kubernetes", "dbt",
            "nosql", "mongodb", "cassandra", "hive", "terraform",
            "data quality", "data governance", "linux", "shell scripting"
        }
    },
    "UI/UX Designer": {
        "primary_skills": {
            "figma", "sketch", "adobe xd", "user research", "wireframing",
            "prototyping", "user testing", "interaction design",
            "visual design", "ui design", "ux design", "user-centered design"
        },
        "secondary_skills": {
            "html", "css", "responsive design", "accessibility",
            "design systems", "information architecture", "user flows",
            "usability testing", "a/b testing", "typography", "color theory",
            "adobe creative suite", "photoshop", "illustrator",
            "design thinking", "user personas", "journey mapping"
        }
    },
    "Product Manager": {
        "primary_skills": {
            "product strategy", "roadmapping", "agile", "scrum",
            "user stories", "requirements gathering", "prioritization",
            "stakeholder management", "product lifecycle", "market research"
        },
        "secondary_skills": {
            "data analysis", "kpis", "metrics", "a/b testing",
            "competitive analysis", "user research", "wireframing",
            "prototyping", "jira", "confluence", "presentation skills",
            "project management", "go-to-market strategy", "business analysis"
        }
    },
    "Cloud Solutions Architect": {
        "primary_skills": {
            "aws", "azure", "gcp", "cloud architecture", "cloud migration",
            "infrastructure as code", "terraform", "serverless",
            "microservices", "containers", "kubernetes", "docker"
        },
        "secondary_skills": {
            "networking", "security", "high availability", "disaster recovery",
            "cost optimization", "performance optimization", "scalability",
            "cloud native", "devops", "ci/cd", "monitoring", "logging",
            "compliance", "governance", "multi-cloud strategies"
        }
    }
}

# Load NLP models
try:
    nlp = spacy.load("en_core_web_lg")
except OSError:
    nlp = spacy.load("en_core_web_sm")

# Career transition mapping
CAREER_PATHS = {
    "Software Engineer": {
        "next_roles": ["Senior Software Engineer", "Tech Lead", "Backend Developer", "Full Stack Developer"],
        "recommended_skills": ["system design", "cloud architecture", "microservices", "docker", "kubernetes"],
        "learning_resources": [
            {"name": "System Design Primer", "url": "https://github.com/donnemartin/system-design-primer"},
            {"name": "Designing Data-Intensive Applications", "url": "https://dataintensive.net"},
            {"name": "Cloud Skills by AWS", "url": "https://explore.skillbuilder.aws/learn"}
        ]
    },
    "Frontend Developer": {
        "next_roles": ["UI/UX Engineer", "Frontend Architect", "Full Stack Developer"],
        "recommended_skills": ["next.js", "typescript", "performance optimization", "accessibility"],
        "learning_resources": [
            {"name": "Frontend Masters", "url": "https://frontendmasters.com"},
            {"name": "Google Web Dev", "url": "https://web.dev"},
            {"name": "UI/UX Design by Coursera", "url": "https://www.coursera.org/specializations/ui-ux-design"}
        ]
    },
    "Data Scientist": {
        "next_roles": ["Senior Data Scientist", "ML Engineer", "AI Researcher"],
        "recommended_skills": ["mlops", "deep learning", "model deployment", "aws sageMaker"],
        "learning_resources": [
            {"name": "Deep Learning Specialization (Coursera)", "url": "https://www.coursera.org/specializations/deep-learning"},
            {"name": "ML Engineering Google", "url": "https://developers.google.com/machine-learning/guides"},
            {"name": "Made with ML", "url": "https://madewithml.com/"}
        ]
    },
    # Add more roles as needed...
}


# Initialize grammar checking tool
tool = language_tool_python.LanguageTool("en-US")


def preprocess_text(text: str) -> str:
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return ' '.join(text.lower().split())


def extract_keywords(text: str, top_n: int = 20) -> List[str]:
    processed_text = preprocess_text(text)
    doc = nlp(processed_text)
    keywords = [
        token.lemma_ for token in doc 
        if (token.pos_ in {'NOUN', 'PROPN', 'VERB'} 
            and not token.is_stop 
            and len(token.lemma_) > 2
            and token.lemma_.isalpha())
    ]
    unique_keywords = []
    for keyword in keywords:
        if keyword not in unique_keywords:
            unique_keywords.append(keyword)
    return unique_keywords[:top_n]


def analyze_grammar(text: str) -> Dict[str, Union[List[Dict], float]]:
    if not text:
        return {"error": "No text provided"}

    matches = tool.check(text)
    grammar_errors = [
        {
            "error": m.message,
            "suggestions": m.replacements,
            "context": m.context,
            "offset": m.offset,
            "length": m.errorLength
        } for m in matches
    ]

    readability_scores = {
        "flesch_reading_ease": round(textstat.flesch_reading_ease(text), 2),
        "flesch_kincaid_grade": round(textstat.flesch_kincaid_grade(text), 2),
        "automated_readability_index": round(textstat.automated_readability_index(text), 2),
        "coleman_liau_index": round(textstat.coleman_liau_index(text), 2),
        "smog_index": round(textstat.smog_index(text), 2)
    }

    return {
        "grammar_errors": grammar_errors,
        "readability_metrics": readability_scores,
        "total_errors": len(grammar_errors)
    }


def analyze_ats(resume_text: str, job_description: str) -> Dict[str, Union[float, List[str]]]:
    if not resume_text or not job_description:
        return {"error": "Resume text or job description is missing"}

    resume_keywords = set(extract_keywords(resume_text))
    job_keywords = set(extract_keywords(job_description))

    matched_keywords = set()
    fuzzy_matched_keywords = set()

    for job_keyword in job_keywords:
        if job_keyword in resume_keywords:
            matched_keywords.add(job_keyword)
        else:
            for resume_keyword in resume_keywords:
                if fuzz.ratio(job_keyword, resume_keyword) > 70:
                    fuzzy_matched_keywords.add(job_keyword)
                    break

    total_keywords = len(job_keywords)
    exact_match_weight = 1.0
    fuzzy_match_weight = 0.5

    if total_keywords == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_keywords) * exact_match_weight +
            len(fuzzy_matched_keywords) * fuzzy_match_weight) /
            total_keywords * 100,
            2
        )

    return {
        "ats_score": match_percentage,
        "exact_matched_keywords": list(matched_keywords),
        "fuzzy_matched_keywords": list(fuzzy_matched_keywords),
        "missing_keywords": list(job_keywords - matched_keywords - fuzzy_matched_keywords)
    }


def analyze_skills(resume_text: str, job_role: str) -> Dict[str, Any]:
    if not resume_text:
        return {"error": "Resume text is missing"}
    
    # Default to Software Engineer if job role is not recognized
    if job_role not in JOB_ROLES:
        closest_match = None
        highest_score = 0
        for role in JOB_ROLES.keys():
            score = fuzz.ratio(job_role.lower(), role.lower())
            if score > highest_score and score > 60:  # 60% similarity threshold
                highest_score = score
                closest_match = role
        
        job_role = closest_match if closest_match else "Software Engineer"

    processed_resume_text = preprocess_text(resume_text)
    resume_keywords = set(extract_keywords(resume_text))

    role_skills = JOB_ROLES[job_role]
    primary_skills = role_skills["primary_skills"]
    secondary_skills = role_skills["secondary_skills"]

    def fuzzy_skill_match(skills_set):
        matched = set()
        for skill in skills_set:
            if skill in processed_resume_text:
                matched.add(skill)
            else:
                for resume_keyword in resume_keywords:
                    if fuzz.ratio(skill, resume_keyword) > 70:
                        matched.add(skill)
                        break
        return matched

    primary_matched = fuzzy_skill_match(primary_skills)
    secondary_matched = fuzzy_skill_match(secondary_skills)

    # Handle division by zero
    primary_match_percentage = round(len(primary_matched) / max(len(primary_skills), 1) * 100, 2)
    secondary_match_percentage = round(len(secondary_matched) / max(len(secondary_skills), 1) * 100, 2)

    return {
        "primary_matched_skills": list(primary_matched),
        "secondary_matched_skills": list(secondary_matched),
        "missing_primary_skills": list(primary_skills - primary_matched),
        "missing_secondary_skills": list(secondary_skills - secondary_matched),
        "primary_match_percentage": primary_match_percentage,
        "secondary_match_percentage": secondary_match_percentage,
        "matched_job_role": job_role  # Include the matched job role in the response
    }
    
def predict_career_path(job_role: str) -> Dict[str, Any]:
    if not job_role:
        return {"error": "Job role is missing"}

    # Match closest job role from the known career paths
    matched_role = None
    highest_score = 0
    for role in CAREER_PATHS.keys():
        score = fuzz.ratio(job_role.lower(), role.lower())
        if score > highest_score and score > 60:
            matched_role = role
            highest_score = score

    if not matched_role:
        return {"error": "Career path data not available for this role"}

    path_info = CAREER_PATHS[matched_role]
    return {
        "current_role": matched_role,
        "suggested_next_roles": path_info["next_roles"],
        "recommended_skills": path_info["recommended_skills"],
        "learning_resources": path_info["learning_resources"]
    }
def predict_next_roles(current_role, skills, years_experience=None, industry=None):
    """
    Predicts potential career progression paths based on current role, skills, experience, and industry.
    
    Args:
        current_role (str): The user's current job title
        skills (list): List of user's current skills
        years_experience (int, optional): Years of experience in current role
        industry (str, optional): User's industry sector
        
    Returns:
        dict: Dictionary containing role categories and recommended next roles with confidence scores
    """
    # Input validation
    if not current_role or not isinstance(skills, list) or len(skills) == 0:
        raise ValueError("Current role and at least one skill must be provided")
    
    # Career path recommendations based on role, skills, experience and industry
    career_paths = {
        "vertical_progression": [],      # Same career track, higher positions
        "specialization_paths": [],      # Specialized versions of current role
        "lateral_movements": [],         # Related roles at similar level
        "emerging_opportunities": []     # New roles based on skill alignment
    }
    
    # Implement actual prediction logic here (simplified example)
    if "software" in current_role.lower() or any("program" in skill.lower() for skill in skills):
        # Tech career paths
        if years_experience and years_experience >= 3:
            career_paths["vertical_progression"] = [
                {"role": f"Senior {current_role}", "confidence": 0.85},
                {"role": f"{current_role} Lead", "confidence": 0.75}
            ]
        
        career_paths["specialization_paths"] = [
            {"role": "Machine Learning Engineer", "confidence": 0.65},
            {"role": "DevOps Specialist", "confidence": 0.60}
        ]
    
    elif "market" in current_role.lower():
        # Marketing career paths
        career_paths["vertical_progression"] = [
            {"role": f"Senior {current_role}", "confidence": 0.80},
            {"role": "Marketing Manager", "confidence": 0.70}
        ]
        
        career_paths["specialization_paths"] = [
            {"role": "Digital Marketing Specialist", "confidence": 0.75},
            {"role": "Content Strategy Manager", "confidence": 0.65}
        ]
    
    # Default fallback for any role type
    if not any(career_paths.values()):
        career_paths["vertical_progression"] = [
            {"role": f"Senior {current_role}", "confidence": 0.70},
            {"role": f"{current_role} Manager", "confidence": 0.65}
        ]
    
    return career_paths


def suggest_skills(target_roles, current_skills=None, industry=None):
    """
    Suggests skills to develop based on target roles and current skill gaps.
    
    Args:
        target_roles (list): List of target job roles
        current_skills (list, optional): List of user's current skills for gap analysis
        industry (str, optional): User's industry sector for context
        
    Returns:
        dict: Dictionary of skill categories and recommended skills with priority levels
    """
    # Input validation
    if not target_roles or not isinstance(target_roles, list):
        raise ValueError("Target roles must be provided as a list")
    
    current_skills = current_skills or []
    
    # Define skill recommendations by category
    skill_recommendations = {
        "technical_skills": [],
        "soft_skills": [],
        "certifications": [],
        "emerging_skills": []
    }
    
    # Example implementation (would use more sophisticated logic in production)
    for role in target_roles:
        role_lower = role.lower()
        
        # Technical skills based on role
        if "software" in role_lower or "developer" in role_lower:
            if "Python" not in current_skills:
                skill_recommendations["technical_skills"].append({
                    "skill": "Python",
                    "priority": "high",
                    "relevance_score": 0.9
                })
            
            skill_recommendations["technical_skills"].append({
                "skill": "Cloud Computing (AWS/Azure)",
                "priority": "medium",
                "relevance_score": 0.75
            })
            
            skill_recommendations["certifications"].append({
                "skill": "AWS Certified Developer",
                "priority": "medium",
                "relevance_score": 0.7
            })
        
        # Management skills for leadership roles
        if "lead" in role_lower or "manager" in role_lower or "senior" in role_lower:
            skill_recommendations["soft_skills"].append({
                "skill": "Team Leadership",
                "priority": "high",
                "relevance_score": 0.85
            })
            
            skill_recommendations["soft_skills"].append({
                "skill": "Project Management",
                "priority": "high",
                "relevance_score": 0.8
            })
            
            skill_recommendations["certifications"].append({
                "skill": "PMP Certification",
                "priority": "medium",
                "relevance_score": 0.65
            })
        
        # Default skills for any role
        if not any(skill_recommendations.values()):
            skill_recommendations["soft_skills"].append({
                "skill": "Communication",
                "priority": "high",
                "relevance_score": 0.9
            })
            
            skill_recommendations["technical_skills"].append({
                "skill": f"Advanced {target_roles[0]} techniques",
                "priority": "high",
                "relevance_score": 0.8
            })
    
    return skill_recommendations


def get_learning_resources(skills, learning_style=None, max_budget=None, time_frame=None):
    """
    Provides personalized learning resources based on skills, learning preferences, and constraints.
    
    Args:
        skills (list): Skills the user wants to learn
        learning_style (str, optional): User's preferred learning method (video, reading, interactive)
        max_budget (float, optional): Maximum budget for learning resources
        time_frame (str, optional): User's time frame for learning (quick, comprehensive)
        
    Returns:
        dict: Dictionary of skill-specific resources categorized by type
    """
    # Input validation
    if not skills or not isinstance(skills, list):
        raise ValueError("At least one skill must be provided")
    
    resources_by_skill = {}
    
    # Generate resources for each skill
    for skill in skills:
        resources = {
            "courses": [],
            "certifications": [],
            "books": [],
            "articles": [],
            "communities": []
        }
        
        skill_lower = skill.lower()
        
        # Populate resources based on skill type
        if "python" in skill_lower or "programming" in skill_lower:
            resources["courses"] = [
                {
                    "name": "Complete Python Bootcamp",
                    "provider": "Udemy",
                    "url": "https://udemy.com/python-bootcamp",
                    "cost": 59.99,
                    "duration": "40 hours",
                    "rating": 4.7,
                    "format": "video",
                    "level": "beginner to intermediate"
                },
                {
                    "name": "Python for Data Science",
                    "provider": "Coursera",
                    "url": "https://coursera.org/python-data-science",
                    "cost": 49.00,
                    "duration": "30 hours", 
                    "rating": 4.8,
                    "format": "interactive",
                    "level": "intermediate"
                }
            ]
            
            resources["books"] = [
                {
                    "name": "Python Crash Course",
                    "author": "Eric Matthes",
                    "url": "https://amazon.com/python-crash-course",
                    "cost": 29.99,
                    "format": "print/ebook",
                    "level": "beginner"
                }
            ]
            
            resources["communities"] = [
                {
                    "name": "Python Discord Community",
                    "url": "https://discord.com/python",
                    "cost": "free",
                    "type": "online forum"
                }
            ]
        
        elif "leadership" in skill_lower or "management" in skill_lower:
            resources["courses"] = [
                {
                    "name": "Leadership: Practical Skills",
                    "provider": "LinkedIn Learning",
                    "url": "https://linkedin-learning.com/leadership-skills",
                    "cost": 29.99,
                    "duration": "15 hours",
                    "rating": 4.6,
                    "format": "video",
                    "level": "intermediate"
                }
            ]
            
            resources["certifications"] = [
                {
                    "name": "Project Management Professional (PMP)",
                    "provider": "PMI",
                    "url": "https://pmi.org/pmp",
                    "cost": 555.00,
                    "duration": "Self-paced + exam",
                    "value": "Industry standard certification"
                }
            ]
            
            resources["books"] = [
                {
                    "name": "The Five Dysfunctions of a Team",
                    "author": "Patrick Lencioni",
                    "url": "https://amazon.com/five-dysfunctions",
                    "cost": 19.99,
                    "format": "print/ebook",
                    "level": "all levels"
                }
            ]
            
            resources["articles"] = [
                {
                    "name": "Effective Leadership in Crisis",
                    "publisher": "Harvard Business Review",
                    "url": "https://hbr.org/leadership-crisis",
                    "cost": "free",
                    "format": "article"
                }
            ]
        
        # Default resources for any skill
        else:
            resources["courses"] = [
                {
                    "name": f"{skill} Fundamentals",
                    "provider": "Udemy",
                    "url": f"https://udemy.com/{skill.lower().replace(' ', '-')}-fundamentals",
                    "cost": 49.99,
                    "duration": "20 hours",
                    "rating": 4.5,
                    "format": "video"
                }
            ]
            
            resources["articles"] = [
                {
                    "name": f"Getting Started with {skill}",
                    "publisher": "Medium",
                    "url": f"https://medium.com/getting-started-{skill.lower().replace(' ', '-')}",
                    "cost": "free",
                    "format": "article"
                }
            ]
            
            resources["communities"] = [
                {
                    "name": f"{skill} Professional Network",
                    "url": f"https://linkedin.com/groups/{skill.lower().replace(' ', '-')}",
                    "cost": "free",
                    "type": "professional network"
                }
            ]
        
        # Filter resources based on user preferences
        if learning_style:
            for category in resources:
                resources[category] = [r for r in resources[category] 
                                      if "format" not in r or learning_style.lower() in r.get("format", "").lower()]
        
        if max_budget:
            for category in resources:
                resources[category] = [r for r in resources[category] 
                                      if "cost" not in r or (r["cost"] != "free" and float(str(r["cost"]).replace("free", "0")) <= max_budget)]
        
        resources_by_skill[skill] = resources
    
    return resources_by_skill

def create_career_development_plan(current_role, target_role, current_skills, timeline="6 months"):
    """
    Creates a personalized career development plan with milestones and action items.
    
    Args:
        current_role (str): User's current job title
        target_role (str): User's target job title
        current_skills (list): List of user's current skills
        timeline (str, optional): Desired timeline for transition
        
    Returns:
        dict: Complete career development plan with milestones and action items
    """
    # Input validation
    if not current_role or not target_role or not current_skills:
        raise ValueError("Current role, target role, and current skills must be provided")
    
    # Determine skills gap
    target_skills = suggest_skills([target_role], current_skills)
    
    # Create timeline based on skill acquisition needs
    months_available = int(timeline.split()[0]) if timeline.split()[0].isdigit() else 6
    
    # Build development plan
    development_plan = {
        "summary": {
            "current_role": current_role,
            "target_role": target_role,
            "timeline": timeline,
            "skills_gap": len(target_skills.get("technical_skills", [])) + len(target_skills.get("soft_skills", []))
        },
        "milestones": [],
        "skill_acquisition_plan": {},
        "networking_strategy": {},
        "application_strategy": {}
    }
    
    # Create milestones
    milestone_count = min(months_available, 4)  # Cap at 4 milestones
    for i in range(milestone_count):
        month = (i + 1) * (months_available // milestone_count)
        
        # Fix: Properly handle the conditional in the list comprehension
        skills_to_mention = []
        if i < len(target_skills.get("technical_skills", [])):
            skills_segment = target_skills.get("technical_skills", [])[i:i+2]
            skills_to_mention = [s["skill"] for s in skills_segment]
        
        course_goal = f"Complete courses on {', '.join(skills_to_mention)}" if skills_to_mention else "Complete skill development courses"
        
        development_plan["milestones"].append({
            "timeline": f"Month {month}",
            "goals": [
                course_goal,
                f"Build network with {target_role} professionals"
            ],
            "metrics": [
                "Course completion certificates",
                "5+ new professional connections"
            ]
        })
    
    # Final milestone - application phase
    development_plan["milestones"].append({
        "timeline": f"Month {months_available}",
        "goals": [
            f"Apply for {target_role} positions",
            "Showcase portfolio of new skills"
        ],
        "metrics": [
            "5+ job applications submitted",
            "2+ interviews scheduled"
        ]
    })
    
    # Skill acquisition plan
    development_plan["skill_acquisition_plan"] = {
        "priority_skills": [s["skill"] for s in (target_skills.get("technical_skills", []) + target_skills.get("soft_skills", []))[:3]],
        "learning_resources": get_learning_resources([s["skill"] for s in (target_skills.get("technical_skills", []) + target_skills.get("soft_skills", []))[:3]])
    }
    
    # Networking strategy
    development_plan["networking_strategy"] = {
        "target_connections": [
            f"Current {target_role} professionals",
            f"Hiring managers in target companies",
            "Industry thought leaders"
        ],
        "engagement_approach": [
            "Attend industry meetups and conferences",
            "Engage in online forums and communities",
            "Request informational interviews"
        ]
    }
    
    # Application strategy
    development_plan["application_strategy"] = {
        "resume_focus_points": [
            "Highlight newly acquired skills",
            "Emphasize transferable experience from current role",
            "Quantify achievements with metrics"
        ],
        "interview_preparation": [
            "Research common interview questions for target role",
            "Prepare portfolio showcasing new skills",
            "Practice role-specific scenarios"
        ]
    }
    
    return development_plan

# Full analysis endpoint compatible with ResumeAnalysisController's /full endpoint
@app.route("/api/analysis/full", methods=["POST"])
def full_analysis():
    data = request.json
    resume_text = data.get("resumeText", "").strip()
    job_description = data.get("jobDescription", "").strip()
    job_role = data.get("jobRole", "").strip()
    
    # Creating unified response format to match Spring Controller expectations
    result = {}
    
    # Always analyze grammar
    result["grammar"] = analyze_grammar(resume_text)
    
    # ATS analysis if job description is provided
    if job_description:
        result["ats"] = analyze_ats(resume_text, job_description)
    
    # Skills analysis if job role is provided
    if job_role:
        result["skills"] = analyze_skills(resume_text, job_role)
    
    return jsonify(result)

# Individual analysis endpoints to match ResumeAnalysisController
@app.route("/api/analysis/grammar", methods=["POST"])
def grammar_analysis():
    data = request.json
    resume_text = data.get("resumeText", "").strip()
    result = analyze_grammar(resume_text)
    return jsonify(result)

@app.route("/api/analysis/ats", methods=["POST"])
def ats_analysis():
    data = request.json
    resume_text = data.get("resumeText", "").strip()
    job_description = data.get("jobDescription", "").strip()
    result = analyze_ats(resume_text, job_description)
    return jsonify(result)

@app.route("/api/analysis/skills", methods=["POST"])
def skills_analysis():
    data = request.json
    resume_text = data.get("resumeText", "").strip()
    job_role = data.get("jobRole", "").strip()
    result = analyze_skills(resume_text, job_role)
    return jsonify(result)

# Original unified route - kept for backward compatibility
@app.route("/analyze-resume", methods=["POST"])
def analyze_resume():
    data = request.json
    resume_id = data.get("resume_id")
    resume_text = data.get("resume_text", "").strip()
    job_description = data.get("job_description", "").strip()
    job_role = data.get("job_role", "").strip()

    # If resume_id is provided, fetch from database
    if resume_id:
        resume = fetch_resume(resume_id)
        if resume:
            resume_text = resume.resume_text

    # Skip any analysis with missing required data
    grammar_analysis_result = analyze_grammar(resume_text) if resume_text else {"error": "No resume text provided"}
    ats_analysis_result = analyze_ats(resume_text, job_description) if resume_text and job_description else {"error": "Missing data for ATS analysis"}
    skill_analysis_result = analyze_skills(resume_text, job_role) if resume_text and job_role else {"error": "Missing data for skills analysis"}

    return jsonify({
        "grammar_analysis": grammar_analysis_result,
        "ats_analysis": ats_analysis_result,
        "skill_analysis": skill_analysis_result
    })

# @app.route("/api/analysis/career-path", methods=["POST"])
# def career_path_analysis():
#     data = request.json
#     job_role = data.get("jobRole", "").strip()
#     result = predict_career_path(job_role)
#     return jsonify(result)

@app.route('/api/analysis/career-path', methods=['POST'])
def career_path():
    data = request.get_json()
    job_role = data.get('jobRole')
    skills = data.get('skills', [])
    target_role = data.get('targetRole')  # Optional
    timeline = data.get('timeline', "6 months")

    if not job_role or not isinstance(skills, list) or not skills:
        return jsonify({'error': 'Job role and a non-empty skills list are required'}), 400

    try:
        # Step 1: Predict next roles
        next_roles = predict_next_roles(job_role, skills)

        # Step 2: Suggest skills
        vertical_roles = [r["role"] for r in next_roles.get("vertical_progression", [])]
        recommended_skills = suggest_skills(vertical_roles, skills)

        # Step 3: Learning resources
        skill_list = [s["skill"] for s in recommended_skills.get("technical_skills", [])]
        learning_resources = get_learning_resources(skill_list)

        # Step 4: Career dev plan if target provided
        development_plan = {}
        if target_role:
            development_plan = create_career_development_plan(
                current_role=job_role,
                target_role=target_role,
                current_skills=skills,
                timeline=timeline
            )

        return jsonify({
            "nextRoles": next_roles,
            "recommendedSkills": recommended_skills,
            "learningResources": learning_resources,
            "careerDevelopmentPlan": development_plan
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# @app.route('/api/interview/transcribe', methods=['POST'])
# def transcribe_audio():
#     if 'audio' not in request.files:
#         return jsonify({'error': 'No audio file provided'}), 400

#     audio_file = request.files['audio']
#     filename = secure_filename(audio_file.filename)
#     audio_path = os.path.join(UPLOAD_FOLDER, filename)
#     audio_file.save(audio_path)

#     try:
#         result = whisper_model.transcribe(audio_path)
#         os.remove(audio_path)  # Clean up the saved file after processing

#         return jsonify({
#             'transcription': result['text'],
#             'segments': result['segments'],
#             'language': result['language']
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# --- Role-specific questions ---
INTERVIEW_QUESTIONS = {
    "software engineer": [
        "Can you explain the SOLID principles?",
        "Describe a challenging bug you fixed recently.",
        "How do you ensure code quality in a team?",
        "What is the difference between REST and GraphQL?",
        "Tell me about a time you optimized performance."
    ],
    "project manager": [
        "How do you handle conflicting priorities?",
        "Describe your approach to stakeholder communication.",
        "What project management tools do you use?",
        "How do you define project success?",
        "How do you manage scope creep?"
    ],
    # Add more roles here
}

@app.route('/api/interview/questions', methods=['POST'])
def get_mock_questions():
    data = request.get_json()
    role = data.get('role', '').lower()

    questions = INTERVIEW_QUESTIONS.get(role)
    if not questions:
        return jsonify({'error': f'No questions found for the role "{role}".'}), 404

    return jsonify({'questions': questions})

# Load Whisper model once during startup
model = whisper.load_model("base")

# Backend code updates for improved feedback

@app.route('/api/interview/evaluate', methods=['POST'])
def evaluate_audio_response():
    print("FORM KEYS:", request.form.keys())
    print("FILE KEYS:", request.files.keys())
    
    if 'audio' not in request.files or 'question' not in request.form:
        return jsonify({'error': 'Audio and question are required'}), 400
    
    audio_file = request.files['audio']
    question = request.form['question']
    role = request.form.get('role', 'general')  # Get the role or default to 'general'
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        audio_path = temp_file.name
        audio_file.save(audio_path)
    
    try:
        result = model.transcribe(audio_path)
        transcript = result["text"]
        
        feedback = generate_enhanced_feedback(transcript, question, role)
        
        return jsonify({
            "transcript": transcript,
            "feedback": feedback
        })
    except Exception as e:
        return jsonify({'error': f'Error processing audio: {str(e)}'}), 500
    finally:
        os.remove(audio_path)

def generate_enhanced_feedback(transcript, question, role):
    """
    Generate structured feedback for the interview response
    """
    if not transcript.strip():
        return {
            "score": 1,
            "strengths": [],
            "areas_to_improve": ["You didn't provide any audible response. Try speaking more clearly and directly into the microphone."],
            "example_answer": get_example_answer(question, role)
        }
    
    # Analyze the response length
    word_count = len(transcript.split())
    if word_count < 15:
        return {
            "score": 1,
            "strengths": [],
            "areas_to_improve": ["Your answer was too brief. Try to elaborate more on your points and provide specific examples.",
                               "Aim for at least 1-2 minutes of speaking time for most interview questions."],
            "example_answer": get_example_answer(question, role)
        }
    
    # Initialize feedback structure
    feedback = {
        "score": 0,
        "strengths": [],
        "areas_to_improve": [],
        "example_answer": get_example_answer(question, role)
    }
    
    # Analyze content (this would be more sophisticated with a real LLM implementation)
    
    # Check for STAR method in behavioral questions
    if any(term in question.lower() for term in ["describe a time", "tell me about", "example of", "experience with"]):
        has_situation = any(term in transcript.lower() for term in ["situation", "context", "background", "when i was"])
        has_task = any(term in transcript.lower() for term in ["task", "challenge", "problem", "goal", "needed to"])
        has_action = any(term in transcript.lower() for term in ["action", "approach", "steps", "handled", "did", "implemented", "created"])
        has_result = any(term in transcript.lower() for term in ["result", "outcome", "impact", "learned", "accomplished", "achieved"])
        
        if has_situation and has_task and has_action and has_result:
            feedback["strengths"].append("Excellent use of the STAR method (Situation, Task, Action, Result) in your response.")
            feedback["score"] += 1
        else:
            missing_components = []
            if not has_situation: missing_components.append("Situation")
            if not has_task: missing_components.append("Task")
            if not has_action: missing_components.append("Action")
            if not has_result: missing_components.append("Result")
            
            if missing_components:
                feedback["areas_to_improve"].append(f"Consider using the complete STAR method in your answer. Missing components: {', '.join(missing_components)}.")
    
    # Check for specific examples
    has_examples = any(term in transcript.lower() for term in ["for example", "instance", "specifically", "particular", "case", "project"])
    if has_examples:
        feedback["strengths"].append("Good use of specific examples to illustrate your points.")
        feedback["score"] += 1
    else:
        feedback["areas_to_improve"].append("Include specific examples from your experience to make your answer more credible and memorable.")
    
    # Check for quantifiable achievements
    has_metrics = any(term in transcript.lower() for term in ["percent", "increased", "reduced", "saved", "improved", "measured", "metric", "kpi", "roi"])
    if has_metrics:
        feedback["strengths"].append("Excellent inclusion of quantifiable results or metrics.")
        feedback["score"] += 1
    else:
        feedback["areas_to_improve"].append("When possible, include metrics or quantifiable achievements to demonstrate your impact.")
    
    # Role-specific feedback
    if "software engineer" in role.lower():
        # Check for technical depth
        technical_terms = ["algorithm", "complexity", "architecture", "pattern", "framework", "database", "optimization", "testing"]
        has_technical_depth = any(term in transcript.lower() for term in technical_terms)
        
        if has_technical_depth:
            feedback["strengths"].append("Good demonstration of technical knowledge relevant to the question.")
            feedback["score"] += 1
        else:
            feedback["areas_to_improve"].append("Include more technical details relevant to software engineering to showcase your expertise.")
    
    elif "project manager" in role.lower():
        # Check for project management concepts
        pm_terms = ["stakeholder", "timeline", "budget", "scope", "deliverable", "milestone", "risk", "communication", "team", "priority"]
        has_pm_concepts = any(term in transcript.lower() for term in pm_terms)
        
        if has_pm_concepts:
            feedback["strengths"].append("Good use of project management terminology and concepts.")
            feedback["score"] += 1
        else:
            feedback["areas_to_improve"].append("Incorporate more project management terminology and methodologies in your answer.")
    
    # Adjust base score based on word count
    if word_count > 50:
        feedback["score"] += 1
    
    # Ensure we have at least one strength and area to improve
    if not feedback["strengths"]:
        feedback["strengths"].append("You provided a complete answer to the question.")
    
    if not feedback["areas_to_improve"]:
        feedback["areas_to_improve"].append("Consider structuring your answer more clearly with an introduction, main points, and conclusion.")
    
    # Cap the score between 1 and 5
    feedback["score"] = max(1, min(feedback["score"], 5))
    
    return feedback

def get_example_answer(question, role):
    """
    Return an example strong answer based on the question and role
    """
    # This would be expanded with a more comprehensive database of example answers
    # or generated by a model in a real implementation
    
    examples = {
        "Can you explain the SOLID principles?": 
            "SOLID is an acronym representing five design principles for writing maintainable and scalable software. S stands for Single Responsibility Principle, meaning a class should have only one reason to change. O is the Open/Closed Principle, which states that software entities should be open for extension but closed for modification. L, the Liskov Substitution Principle, means that objects should be replaceable with instances of their subtypes without altering the correctness of the program. I stands for Interface Segregation Principle, which says clients shouldn't be forced to depend on interfaces they don't use. Finally, D is the Dependency Inversion Principle, suggesting that high-level modules shouldn't depend on low-level modules, but both should depend on abstractions. In my recent project, I applied these principles when redesigning our payment processing system, which significantly improved maintainability and reduced bugs during feature additions.",
        
        "Describe a challenging bug you fixed recently.":
            "I encountered a particularly challenging memory leak in our React Native application that only manifested in production after about 2 hours of usage. To tackle this, I first reproduced the issue by setting up performance monitoring. I identified that our image caching mechanism wasn't properly releasing resources when navigating between screens. I methodically isolated the problem by creating a minimal test case, then discovered that we were storing references to large image objects without implementing proper cleanup. The solution involved restructuring our image handling to use weak references and explicitly releasing resources when components unmounted. After implementing my fix, our memory usage decreased by 40% and the app crash rate dropped from 15% to under 1%. This experience reinforced my approach to debugging complex issues: reproduce reliably, isolate methodically, and verify thoroughly after implementing the fix.",
            
        "How do you handle conflicting priorities?":
            "When facing conflicting priorities, I first assess each task's impact on business objectives and stakeholder needs. For example, while managing our company's product launch, I had simultaneous requests from marketing, sales, and engineering. I created a prioritization matrix scoring each request on urgency, strategic impact, and resource requirements. Then I facilitated a meeting with key stakeholders, presenting this analysis and reaching consensus on a revised timeline. For items that couldn't be delayed, I identified process efficiencies and secured temporary additional resources. This approach resulted in a successful product launch while maintaining team morale and stakeholder satisfaction. I've found that transparent communication, data-driven prioritization, and creative resource allocation are essential for effectively managing competing demands."
    }
    
    return examples.get(question, "No specific example available for this question. Focus on providing structured, specific answers with relevant examples from your experience.")




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)