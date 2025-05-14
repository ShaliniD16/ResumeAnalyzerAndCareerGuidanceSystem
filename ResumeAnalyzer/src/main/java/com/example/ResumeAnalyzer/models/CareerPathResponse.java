package com.example.ResumeAnalyzer.models;

import java.util.List;



import java.util.Map;

public class CareerPathResponse {
    private Map<String, Object> nextRoles;
    private Map<String, Object> recommendedSkills;
    private Map<String, Object> learningResources;
    private Map<String, Object> careerDevelopmentPlan;

    // Constructors, Getters and Setters

    public CareerPathResponse() {
    }

    public CareerPathResponse(Map<String, Object> nextRoles, Map<String, Object> recommendedSkills, Map<String, Object> learningResources, Map<String, Object> careerDevelopmentPlan) {

        this.nextRoles = nextRoles;
        this.recommendedSkills = recommendedSkills;
        this.learningResources = learningResources;
        this.careerDevelopmentPlan = careerDevelopmentPlan;
    }

    public Map<String, Object> getNextRoles() {
        return nextRoles;
    }

    public void setNextRoles(Map<String, Object> nextRoles) {
        this.nextRoles = nextRoles;
    }

    public Map<String, Object> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(Map<String, Object> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
    }

    public Map<String, Object> getLearningResources() {
        return learningResources;
    }

    public void setLearningResources(Map<String, Object> learningResources) {
        this.learningResources = learningResources;
    }

    public Map<String, Object> getCareerDevelopmentPlan() {
        return careerDevelopmentPlan;
    }

    public void setCareerDevelopmentPlan(Map<String, Object> careerDevelopmentPlan) {
        this.careerDevelopmentPlan = careerDevelopmentPlan;
    }
}

