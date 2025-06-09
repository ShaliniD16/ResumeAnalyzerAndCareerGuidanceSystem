package com.example.ResumeAnalyzer.controllers;

import com.example.ResumeAnalyzer.models.Resume;
import com.example.ResumeAnalyzer.services.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") 
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("skills") String skills,
            @RequestParam("experience") String experience,
            @RequestParam("jobTitle") String jobTitle) {

        try {
            // 1. Save resume and extract text
            Resume savedResume = resumeService.processResume(file, name, email, phone, skills, experience, jobTitle);

            // 2. Prepare and send request to Flask API
            String flaskURL = "http://localhost:5000/analyze-resume";

            // Create the JSON body expected by Flask
            Map<String, Object> requestMap = new HashMap<>();
            requestMap.put("resume_text", savedResume.getResumeText());
            requestMap.put("job_description", jobTitle);  // Or use a specific job description if available
            requestMap.put("job_role", jobTitle);  // Using job title as the role

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestMap, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> flaskResponse = restTemplate.postForEntity(flaskURL, requestEntity, Map.class);

            // 3. Return Flask response (e.g. ATS results) to frontend
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Resume uploaded and analyzed successfully");
            response.put("analysisResult", flaskResponse.getBody());
            response.put("resumeId", savedResume.getId());
            response.put("resumeText", savedResume.getResumeText());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing resume file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable Long id) {
        try {
            Resume resume = resumeService.getResumeById(id);
            if (resume == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving resume: " + e.getMessage());
        }
    }
}
