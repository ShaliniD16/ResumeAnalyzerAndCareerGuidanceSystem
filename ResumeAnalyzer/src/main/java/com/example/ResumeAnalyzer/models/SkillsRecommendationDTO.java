package com.example.ResumeAnalyzer.models;

import java.util.List;

public class SkillsRecommendationDTO {
    private List<SkillDTO> technical_skills;
    private List<SkillDTO> soft_skills;
    private List<SkillDTO> certifications;
    private List<SkillDTO> emerging_skills;

    // Getters and setters
    public List<SkillDTO> getTechnical_skills() { return technical_skills; }
    public void setTechnical_skills(List<SkillDTO> technical_skills) { this.technical_skills = technical_skills; }
    public List<SkillDTO> getSoft_skills() { return soft_skills; }
    public void setSoft_skills(List<SkillDTO> soft_skills) { this.soft_skills = soft_skills; }
    public List<SkillDTO> getCertifications() { return certifications; }
    public void setCertifications(List<SkillDTO> certifications) { this.certifications = certifications; }
    public List<SkillDTO> getEmerging_skills() { return emerging_skills; }
    public void setEmerging_skills(List<SkillDTO> emerging_skills) { this.emerging_skills = emerging_skills; }
}
