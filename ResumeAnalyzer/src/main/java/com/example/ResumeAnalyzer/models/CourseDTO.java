package com.example.ResumeAnalyzer.models;

public class CourseDTO {
    private String name;
    private String provider;
    private String url;
    private Object cost;  // Can be number or String like "free"
    private String duration;
    private Double rating;
    private String format;
    private String level;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public Object getCost() { return cost; }
    public void setCost(Object cost) { this.cost = cost; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
