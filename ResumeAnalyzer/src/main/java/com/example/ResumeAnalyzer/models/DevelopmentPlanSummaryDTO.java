package com.example.ResumeAnalyzer.models;

public class DevelopmentPlanSummaryDTO {
    private String current_role;
    private String target_role;
    private String timeline;
    private int skills_gap;

    // Getters and setters
    public String getCurrent_role() { return current_role; }
    public void setCurrent_role(String current_role) { this.current_role = current_role; }
    public String getTarget_role() { return target_role; }
    public void setTarget_role(String target_role) { this.target_role = target_role; }
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
    public int getSkills_gap() { return skills_gap; }
    public void setSkills_gap(int skills_gap) { this.skills_gap = skills_gap; }
}
