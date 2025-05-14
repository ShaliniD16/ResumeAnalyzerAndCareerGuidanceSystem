package com.example.ResumeAnalyzer.models;

public class RoleDTO {
    private String role;
    private double confidence;

    // Constructors
    public RoleDTO() {}
    public RoleDTO(String role, double confidence) {
        this.role = role;
        this.confidence = confidence;
    }

    // Getters and setters
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
}
