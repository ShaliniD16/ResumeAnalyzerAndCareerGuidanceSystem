package com.example.ResumeAnalyzer.models;

import java.util.List;

public class NetworkingStrategyDTO {
    private List<String> target_connections;
    private List<String> engagement_approach;

    // Getters and setters
    public List<String> getTarget_connections() { return target_connections; }
    public void setTarget_connections(List<String> target_connections) { this.target_connections = target_connections; }
    public List<String> getEngagement_approach() { return engagement_approach; }
    public void setEngagement_approach(List<String> engagement_approach) { this.engagement_approach = engagement_approach; }
}
