package com.example.ResumeAnalyzer.models;

public class SkillDTO {
    private String skill;
    private String priority;
    private double relevance_score;

    // Constructors
    public SkillDTO() {}
    public SkillDTO(String skill, String priority, double relevance_score) {
        this.skill = skill;
        this.priority = priority;
        this.relevance_score = relevance_score;
    }

    // Getters and setters
    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public double getRelevance_score() { return relevance_score; }
    public void setRelevance_score(double relevance_score) { this.relevance_score = relevance_score; }
}
