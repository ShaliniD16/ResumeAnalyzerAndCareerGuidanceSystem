package com.example.ResumeAnalyzer.models;

import java.util.Map;

public class CareerAnalysisDTO {
    private CareerPathsDTO nextRoles;
    private SkillsRecommendationDTO recommendedSkills;
    private Map<String, ResourceCategoryDTO> learningResources;
    private DevelopmentPlanDTO careerDevelopmentPlan;

    // Getters and setters
    public CareerPathsDTO getNextRoles() { return nextRoles; }
    public void setNextRoles(CareerPathsDTO nextRoles) { this.nextRoles = nextRoles; }
    public SkillsRecommendationDTO getRecommendedSkills() { return recommendedSkills; }
    public void setRecommendedSkills(SkillsRecommendationDTO recommendedSkills) { this.recommendedSkills = recommendedSkills; }
    public Map<String, ResourceCategoryDTO> getLearningResources() { return learningResources; }
    public void setLearningResources(Map<String, ResourceCategoryDTO> learningResources) { this.learningResources = learningResources; }
    public DevelopmentPlanDTO getCareerDevelopmentPlan() { return careerDevelopmentPlan; }
    public void setCareerDevelopmentPlan(DevelopmentPlanDTO careerDevelopmentPlan) { this.careerDevelopmentPlan = careerDevelopmentPlan; }
}
