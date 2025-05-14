package com.example.ResumeAnalyzer.models;

import java.util.List;

public class RoleRequestDTO {
    private String current_role;
    private List<String> skills;
    private Integer years_experience;
    private String industry;

    // Getters and setters
    public String getCurrent_role() { return current_role; }
    public void setCurrent_role(String current_role) { this.current_role = current_role; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public Integer getYears_experience() { return years_experience; }
    public void setYears_experience(Integer years_experience) { this.years_experience = years_experience; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
}