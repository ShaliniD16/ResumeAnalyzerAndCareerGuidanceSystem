package com.example.ResumeAnalyzer.models;

import java.util.List;

public class ResourcesRequestDTO {
    private List<String> skills;
    private String learning_style;
    private Double max_budget;
    private String time_frame;

    // Getters and setters
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getLearning_style() { return learning_style; }
    public void setLearning_style(String learning_style) { this.learning_style = learning_style; }
    public Double getMax_budget() { return max_budget; }
    public void setMax_budget(Double max_budget) { this.max_budget = max_budget; }
    public String getTime_frame() { return time_frame; }
    public void setTime_frame(String time_frame) { this.time_frame = time_frame; }
}
