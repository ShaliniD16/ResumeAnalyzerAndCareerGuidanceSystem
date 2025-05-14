package com.example.ResumeAnalyzer.models;

import java.util.List;

public class MilestoneDTO {
    private String timeline;
    private List<String> goals;
    private List<String> metrics;

    // Getters and setters
    public String getTimeline() { return timeline; }
    public void setTimeline(String timeline) { this.timeline = timeline; }
    public List<String> getGoals() { return goals; }
    public void setGoals(List<String> goals) { this.goals = goals; }
    public List<String> getMetrics() { return metrics; }
    public void setMetrics(List<String> metrics) { this.metrics = metrics; }
}
