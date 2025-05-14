package com.example.ResumeAnalyzer.models;

public class BookDTO {
    private String name;
    private String author;
    private String url;
    private Object cost;
    private String format;
    private String level;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public Object getCost() { return cost; }
    public void setCost(Object cost) { this.cost = cost; }
    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
