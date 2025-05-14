package com.example.ResumeAnalyzer.models;

import java.util.List;

public class DevelopmentPlanRequestDTO {
    private String current_role;
    private String target_role;
    private List<String> current_skills;
    private String timeline;

    // Getters and setters
    public String getCurrent_role() { return current_role; }
    public void setCurrent_role(String current_role) { this.current_role = current_role; }
    public String getTarget_role() { return target_role; }
    public void setTarget_role(String target_role) { this.target_role = target_role; }
    public List<String> getCurrent_skills() { return current_skills; }
    public void setCurrent_skills(List<String> current_skills) { this.current_skills = current_skills; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
}
