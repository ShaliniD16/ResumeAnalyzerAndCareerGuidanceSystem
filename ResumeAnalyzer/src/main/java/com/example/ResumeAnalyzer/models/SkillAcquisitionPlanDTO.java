package com.example.ResumeAnalyzer.models;

import java.util.List;
import java.util.Map;

public class SkillAcquisitionPlanDTO {
    private List<String> priority_skills;
    private Map<String, ResourceCategoryDTO> learning_resources;

    // Getters and setters
    public List<String> getPriority_skills() { return priority_skills; }
    public void setPriority_skills(List<String> priority_skills) { this.priority_skills = priority_skills; }
    public Map<String, ResourceCategoryDTO> getLearning_resources() { return learning_resources; }
    public void setLearning_resources(Map<String, ResourceCategoryDTO> learning_resources) { this.learning_resources = learning_resources; }
}
