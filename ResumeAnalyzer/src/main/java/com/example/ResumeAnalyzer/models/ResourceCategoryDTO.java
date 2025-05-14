package com.example.ResumeAnalyzer.models;

import java.util.List;

public class ResourceCategoryDTO {
    private List<CourseDTO> courses;
    private List<BookDTO> books;
    private List<CommunityDTO> communities;
    private List<Object> articles;
    private List<Object> certifications;

    // Getters and setters
    public List<CourseDTO> getCourses() { return courses; }
    public void setCourses(List<CourseDTO> courses) { this.courses = courses; }
    public List<BookDTO> getBooks() { return books; }
    public void setBooks(List<BookDTO> books) { this.books = books; }
    public List<CommunityDTO> getCommunities() { return communities; }
    public void setCommunities(List<CommunityDTO> communities) { this.communities = communities; }
    public List<Object> getArticles() { return articles; }
    public void setArticles(List<Object> articles) { this.articles = articles; }
    public List<Object> getCertifications() { return certifications; }
    public void setCertifications(List<Object> certifications) { this.certifications = certifications; }
}
