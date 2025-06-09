package com.example.ResumeAnalyzer.controllers;



import com.example.ResumeAnalyzer.services.CareerService;
import com.example.ResumeAnalyzer.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/career")
//@CrossOrigin(origins = "*") 
public class CareerController {

    @Autowired
    private CareerService careerService;

    @PostMapping("/predict-roles")
    public ResponseEntity<?> predictNextRoles(@RequestBody RoleRequestDTO request) {
        try {
            CareerPathsDTO careerPaths = careerService.predictNextRoles(
                    request.getCurrent_role(),
                    request.getSkills(),
                    request.getYears_experience(),
                    request.getIndustry()
            );
            return ResponseEntity.ok(careerPaths);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to predict career paths: " + e.getMessage()));
        }
    }

    @PostMapping("/suggest-skills")
    public ResponseEntity<?> suggestSkills(@RequestBody SkillsRequestDTO request) {
        try {
            SkillsRecommendationDTO skillsRecommendation = careerService.suggestSkills(
                    request.getTarget_roles(),
                    request.getCurrent_skills(),
                    request.getIndustry()
            );
            return ResponseEntity.ok(skillsRecommendation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to suggest skills: " + e.getMessage()));
        }
    }

    @PostMapping("/learning-resources")
    public ResponseEntity<?> getLearningResources(@RequestBody ResourcesRequestDTO request) {
        try {
            Map<String, ResourceCategoryDTO> resources = careerService.getLearningResources(
                    request.getSkills(),
                    request.getLearning_style(),
                    request.getMax_budget(),
                    request.getTime_frame()
            );
            return ResponseEntity.ok(resources);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get learning resources: " + e.getMessage()));
        }
    }

    @PostMapping("/development-plan")
    public ResponseEntity<?> createDevelopmentPlan(@RequestBody DevelopmentPlanRequestDTO request) {
        try {
            DevelopmentPlanDTO developmentPlan = careerService.createCareerDevelopmentPlan(
                    request.getCurrent_role(),
                    request.getTarget_role(),
                    request.getCurrent_skills(),
                    request.getTimeline()
            );
            return ResponseEntity.ok(developmentPlan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to create development plan: " + e.getMessage()));
        }
    }

    @PostMapping("/analysis/career-path")
    public ResponseEntity<?> getCareerPathAnalysis(@RequestBody CareerAnalysisRequestDTO request) {
        try {
            CareerAnalysisDTO analysis = careerService.getComprehensiveCareerAnalysis(
                    request.getJobRole(),
                    request.getSkills(),
                    request.getTargetRole(),
                    request.getTimeline()
            );
            return ResponseEntity.ok(analysis);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to analyze career path: " + e.getMessage()));
        }
    }
}
