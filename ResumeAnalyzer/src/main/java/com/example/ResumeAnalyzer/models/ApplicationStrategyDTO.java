package com.example.ResumeAnalyzer.models;

import java.util.List;

public class ApplicationStrategyDTO {
    private List<String> resume_focus_points;
    private List<String> interview_preparation;

    // Getters and setters
    public List<String> getResume_focus_points() { return resume_focus_points; }
    public void setResume_focus_points(List<String> resume_focus_points) { this.resume_focus_points = resume_focus_points; }
    public List<String> getInterview_preparation() { return interview_preparation; }
    public void setInterview_preparation(List<String> interview_preparation) { this.interview_preparation = interview_preparation; }
}
