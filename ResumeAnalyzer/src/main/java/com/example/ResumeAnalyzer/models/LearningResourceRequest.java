package com.example.ResumeAnalyzer.models;

import java.util.List;

public class LearningResourceRequest {
    private List<String> skills;
    private String learningStyle;
    private Double maxBudget;
    private String timeFrame;
    // getters, setters, constructors

    public LearningResourceRequest(List<String> skills, String learningStyle, Double maxBudget, String timeFrame) {
        this.skills = skills;
        this.learningStyle = learningStyle;
        this.maxBudget = maxBudget;
        this.timeFrame = timeFrame;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getLearningStyle() {
        return learningStyle;
    }

    public void setLearningStyle(String learningStyle) {
        this.learningStyle = learningStyle;
    }

    public Double getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(Double maxBudget) {
        this.maxBudget = maxBudget;
    }

    public String getTimeFrame() {
        return timeFrame;
    }

    public void setTimeFrame(String timeFrame) {
        this.timeFrame = timeFrame;
    }
}
