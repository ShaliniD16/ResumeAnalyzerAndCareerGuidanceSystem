package com.example.ResumeAnalyzer.models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resumes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String skills;
    private String experience;
    @Column(name = "job_title")  // Ensure correct mapping
    private String jobTitle;

    @Column(name = "file_name")
    private String fileName;  // Original file name

    @Column(name = "resume_text", length = 10000)
    private String resumeText; // Extracted text from resume file

    @Override
    public String toString() {
        return "Resume{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", skills='" + skills + '\'' +
                ", experience='" + experience + '\'' +
                ", fileName='" + fileName + '\'' +
                ", jobTitle='" + jobTitle + '\'' +
                ", resumeText='" + (resumeText != null ? resumeText.substring(0, Math.min(100, resumeText.length())) + "..." : "null") + '\'' +
                '}';
    }

}

