package com.example.ResumeAnalyzer.services;

import com.example.ResumeAnalyzer.models.Resume;
import com.example.ResumeAnalyzer.repositories.ResumeRepository;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    private final Tika tika = new Tika(); // Apache Tika for text extraction

    public Resume processResume(MultipartFile file, String name, String email, String phone, String skills, String experience, String jobTitle) throws IOException {
        String extractedText;

        try {
            extractedText = tika.parseToString(file.getInputStream());
        } catch (TikaException e) {
            throw new RuntimeException("Error extracting text from resume file", e);
        }

        Resume resume = new Resume();
        resume.setName(name);
        resume.setEmail(email);
        resume.setPhone(phone);
        resume.setSkills(skills);
        resume.setExperience(experience);
        resume.setJobTitle(jobTitle);
        resume.setFileName(file.getOriginalFilename());
        // Clean extracted text - remove excessive whitespace and normalize
        resume.setResumeText(extractedText.trim().replaceAll("\\s+", " "));

        return resumeRepository.save(resume);
    }

    public Resume getResumeById(Long id) {
        Optional<Resume> resume = resumeRepository.findById(id);
        return resume.orElse(null);
    }

    public Resume updateResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }
}