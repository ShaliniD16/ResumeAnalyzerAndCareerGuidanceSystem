package com.example.ResumeAnalyzer.controllers;

import com.example.ResumeAnalyzer.services.ResumeAnalysisService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
//@CrossOrigin(origins = "*") // For development only - restrict in production
public class ResumeAnalysisController {

    @Autowired
    private ResumeAnalysisService resumeAnalysisService;

    @PostMapping("/grammar")
    public ResponseEntity<?> analyzeGrammar(@RequestBody Map<String, String> request) {
        try {
            String resumeText = request.get("resumeText");
            if (resumeText == null || resumeText.isEmpty()) {
                return ResponseEntity.badRequest().body("Resume text is required");
            }

            JSONObject result = resumeAnalysisService.analyzeGrammar(resumeText);
            return ResponseEntity.ok(result.toMap());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error analyzing grammar: " + e.getMessage());
        }
    }

    @PostMapping("/ats")
    public ResponseEntity<?> analyzeATS(@RequestBody Map<String, String> request) {
        try {
            String resumeText = request.get("resumeText");
            String jobDescription = request.get("jobDescription");

            if (resumeText == null || resumeText.isEmpty()) {
                return ResponseEntity.badRequest().body("Resume text is required");
            }
            if (jobDescription == null || jobDescription.isEmpty()) {
                return ResponseEntity.badRequest().body("Job description is required");
            }

            JSONObject result = resumeAnalysisService.analyzeATS(resumeText, jobDescription);
            return ResponseEntity.ok(result.toMap());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error analyzing ATS: " + e.getMessage());
        }
    }

    @PostMapping("/skills")
    public ResponseEntity<?> analyzeSkills(@RequestBody Map<String, String> request) {
        try {
            String resumeText = request.get("resumeText");
            String jobRole = request.get("jobRole");

            if (resumeText == null || resumeText.isEmpty()) {
                return ResponseEntity.badRequest().body("Resume text is required");
            }
            if (jobRole == null || jobRole.isEmpty()) {
                return ResponseEntity.badRequest().body("Job role is required");
            }

            JSONObject result = resumeAnalysisService.analyzeSkills(resumeText, jobRole);
            return ResponseEntity.ok(result.toMap());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error analyzing skills: " + e.getMessage());
        }
    }

    @PostMapping("/full")
    public ResponseEntity<?> analyzeResumeFull(@RequestBody Map<String, String> request) {
        try {
            String resumeText = request.get("resumeText");
            String jobDescription = request.get("jobDescription");
            String jobRole = request.get("jobRole");

            if (resumeText == null || resumeText.isEmpty()) {
                return ResponseEntity.badRequest().body("Resume text is required");
            }

            Map<String, Object> fullAnalysis = new HashMap<>();

            // Always analyze grammar
            fullAnalysis.put("grammar", resumeAnalysisService.analyzeGrammar(resumeText).toMap());

            // ATS analysis if job description is provided
            if (jobDescription != null && !jobDescription.isEmpty()) {
                fullAnalysis.put("ats", resumeAnalysisService.analyzeATS(resumeText, jobDescription).toMap());
            }

            // Skills analysis if job role is provided
            if (jobRole != null && !jobRole.isEmpty()) {
                fullAnalysis.put("skills", resumeAnalysisService.analyzeSkills(resumeText, jobRole).toMap());
            }

            return ResponseEntity.ok(fullAnalysis);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error performing full analysis: " + e.getMessage());
        }
    }
//    @PostMapping("/career-path")
//    public ResponseEntity<?> analyzeCareerPath(@RequestBody Map<String, String> request) {
//        try {
//            String jobRole = request.get("jobRole");
//            if (jobRole == null || jobRole.isEmpty()) {
//                return ResponseEntity.badRequest().body("Job role is required");
//            }
//
//            JSONObject result = resumeAnalysisService.analyzeCareerPath(jobRole);
//            return ResponseEntity.ok(result.toMap());
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.internalServerError().body("Error analyzing career path: " + e.getMessage());
//        }
//    }



}