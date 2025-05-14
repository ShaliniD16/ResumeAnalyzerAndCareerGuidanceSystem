package com.example.ResumeAnalyzer.models;

import java.util.List;

public class SkillsRequestDTO {
    private List<String> target_roles;
    private List<String> current_skills;
    private String industry;

    // Getters and setters
    public List<String> getTarget_roles() { return target_roles; }
    public void setTarget_roles(List<String> target_roles) { this.target_roles = target_roles; }
    public List<String> getCurrent_skills() { return current_skills; }
    public void setCurrent_skills(List<String> current_skills) { this.current_skills = current_skills; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
}
