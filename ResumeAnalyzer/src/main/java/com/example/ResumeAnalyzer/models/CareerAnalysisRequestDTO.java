package com.example.ResumeAnalyzer.models;

import java.util.List;

public class CareerAnalysisRequestDTO {
    private String jobRole;
    private List<String> skills;
    private String targetRole;
    private String timeline;

    // Getters and setters
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
}

