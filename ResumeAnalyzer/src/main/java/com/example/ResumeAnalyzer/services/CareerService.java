package com.example.ResumeAnalyzer.services;


import com.example.ResumeAnalyzer.models.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CareerService {

    /**
     * Predicts potential career progression paths based on current role, skills, experience, and industry.
     */
    public CareerPathsDTO predictNextRoles(String currentRole, List<String> skills, Integer yearsExperience,
                                           String industry) {
        // Input validation
        if (currentRole == null || currentRole.isEmpty() || skills == null || skills.isEmpty()) {
            throw new IllegalArgumentException("Current role and at least one skill must be provided");
        }

        CareerPathsDTO careerPaths = new CareerPathsDTO();
        careerPaths.setVertical_progression(new ArrayList<>());
        careerPaths.setSpecialization_paths(new ArrayList<>());
        careerPaths.setLateral_movements(new ArrayList<>());
        careerPaths.setEmerging_opportunities(new ArrayList<>());

        // Tech career paths
        if (currentRole.toLowerCase().contains("software") ||
                skills.stream().anyMatch(skill -> skill.toLowerCase().contains("program"))) {

            if (yearsExperience != null && yearsExperience >= 3) {
                careerPaths.getVertical_progression().add(new RoleDTO("Senior " + currentRole, 0.85));
                careerPaths.getVertical_progression().add(new RoleDTO(currentRole + " Lead", 0.75));
            }

            careerPaths.getSpecialization_paths().add(new RoleDTO("Machine Learning Engineer", 0.65));
            careerPaths.getSpecialization_paths().add(new RoleDTO("DevOps Specialist", 0.60));
        }
        // Marketing career paths
        else if (currentRole.toLowerCase().contains("market")) {
            careerPaths.getVertical_progression().add(new RoleDTO("Senior " + currentRole, 0.80));
            careerPaths.getVertical_progression().add(new RoleDTO("Marketing Manager", 0.70));

            careerPaths.getSpecialization_paths().add(new RoleDTO("Digital Marketing Specialist", 0.75));
            careerPaths.getSpecialization_paths().add(new RoleDTO("Content Strategy Manager", 0.65));
        }

        // Default fallback for any role type
        if (careerPaths.getVertical_progression().isEmpty() &&
                careerPaths.getSpecialization_paths().isEmpty() &&
                careerPaths.getLateral_movements().isEmpty() &&
                careerPaths.getEmerging_opportunities().isEmpty()) {

            careerPaths.getVertical_progression().add(new RoleDTO("Senior " + currentRole, 0.70));
            careerPaths.getVertical_progression().add(new RoleDTO(currentRole + " Manager", 0.65));
        }

        return careerPaths;
    }

    /**
     * Suggests skills to develop based on target roles and current skill gaps.
     */
    public SkillsRecommendationDTO suggestSkills(List<String> targetRoles, List<String> currentSkills,
                                                 String industry) {
        // Input validation
        if (targetRoles == null || targetRoles.isEmpty()) {
            throw new IllegalArgumentException("Target roles must be provided as a list");
        }

        // Initialize with empty lists if null
        if (currentSkills == null) {
            currentSkills = new ArrayList<>();
        }

        SkillsRecommendationDTO skillRecommendations = new SkillsRecommendationDTO();
        skillRecommendations.setTechnical_skills(new ArrayList<>());
        skillRecommendations.setSoft_skills(new ArrayList<>());
        skillRecommendations.setCertifications(new ArrayList<>());
        skillRecommendations.setEmerging_skills(new ArrayList<>());

        for (String role : targetRoles) {
            String roleLower = role.toLowerCase();

            // Technical skills based on role
            if (roleLower.contains("software") || roleLower.contains("developer")) {
                if (!currentSkills.contains("Python")) {
                    skillRecommendations.getTechnical_skills().add(
                            new SkillDTO("Python", "high", 0.9)
                    );
                }

                skillRecommendations.getTechnical_skills().add(
                        new SkillDTO("Cloud Computing (AWS/Azure)", "medium", 0.75)
                );

                skillRecommendations.getCertifications().add(
                        new SkillDTO("AWS Certified Developer", "medium", 0.7)
                );
            }

            // Management skills for leadership roles
            if (roleLower.contains("lead") || roleLower.contains("manager") || roleLower.contains("senior")) {
                skillRecommendations.getSoft_skills().add(
                        new SkillDTO("Team Leadership", "high", 0.85)
                );

                skillRecommendations.getSoft_skills().add(
                        new SkillDTO("Project Management", "high", 0.8)
                );

                skillRecommendations.getCertifications().add(
                        new SkillDTO("PMP Certification", "medium", 0.65)
                );
            }
        }

        // Default skills for any role if no recommendations were added
        if (skillRecommendations.getTechnical_skills().isEmpty() &&
                skillRecommendations.getSoft_skills().isEmpty() &&
                skillRecommendations.getCertifications().isEmpty() &&
                skillRecommendations.getEmerging_skills().isEmpty()) {

            skillRecommendations.getSoft_skills().add(
                    new SkillDTO("Communication", "high", 0.9)
            );

            skillRecommendations.getTechnical_skills().add(
                    new SkillDTO("Advanced " + targetRoles.get(0) + " techniques", "high", 0.8)
            );
        }

        return skillRecommendations;
    }

    /**
     * Provides personalized learning resources based on skills, learning preferences, and constraints.
     */
    public Map<String, ResourceCategoryDTO> getLearningResources(List<String> skills, String learningStyle,
                                                                 Double maxBudget, String timeFrame) {
        // Input validation
        if (skills == null || skills.isEmpty()) {
            throw new IllegalArgumentException("At least one skill must be provided");
        }

        Map<String, ResourceCategoryDTO> resourcesBySkill = new HashMap<>();

        for (String skill : skills) {
            ResourceCategoryDTO resources = new ResourceCategoryDTO();
            resources.setCourses(new ArrayList<>());
            resources.setBooks(new ArrayList<>());
            resources.setCommunities(new ArrayList<>());
            resources.setArticles(new ArrayList<>());
            resources.setCertifications(new ArrayList<>());

            String skillLower = skill.toLowerCase();

            // Populate resources based on skill type
            if (skillLower.contains("python") || skillLower.contains("programming")) {
                // Courses
                CourseDTO course1 = new CourseDTO();
                course1.setName("Complete Python Bootcamp");
                course1.setProvider("Udemy");
                course1.setUrl("https://udemy.com/python-bootcamp");
                course1.setCost(59.99);
                course1.setDuration("40 hours");
                course1.setRating(4.7);
                course1.setFormat("video");
                course1.setLevel("beginner to intermediate");

                CourseDTO course2 = new CourseDTO();
                course2.setName("Python for Data Science");
                course2.setProvider("Coursera");
                course2.setUrl("https://coursera.org/python-data-science");
                course2.setCost(49.00);
                course2.setDuration("30 hours");
                course2.setRating(4.8);
                course2.setFormat("interactive");
                course2.setLevel("intermediate");

                resources.getCourses().add(course1);
                resources.getCourses().add(course2);

                // Books
                BookDTO book = new BookDTO();
                book.setName("Python Crash Course");
                book.setAuthor("Eric Matthes");
                book.setUrl("https://amazon.com/python-crash-course");
                book.setCost(29.99);
                book.setFormat("print/ebook");
                book.setLevel("beginner");
                resources.getBooks().add(book);

                // Communities
                CommunityDTO community = new CommunityDTO();
                community.setName("Python Discord Community");
                community.setUrl("https://discord.com/python");
                community.setCost("free");
                community.setType("online forum");
                resources.getCommunities().add(community);
            }
            else if (skillLower.contains("leadership") || skillLower.contains("management")) {
                // Courses
                CourseDTO course = new CourseDTO();
                course.setName("Leadership: Practical Skills");
                course.setProvider("LinkedIn Learning");
                course.setUrl("https://linkedin-learning.com/leadership-skills");
                course.setCost(29.99);
                course.setDuration("15 hours");
                course.setRating(4.6);
                course.setFormat("video");
                course.setLevel("intermediate");
                resources.getCourses().add(course);

                // Books
                BookDTO book = new BookDTO();
                book.setName("The Five Dysfunctions of a Team");
                book.setAuthor("Patrick Lencioni");
                book.setUrl("https://amazon.com/five-dysfunctions");
                book.setCost(19.99);
                book.setFormat("print/ebook");
                book.setLevel("all levels");
                resources.getBooks().add(book);

                // Add certifications and articles (placeholder)
                resources.setCertifications(Arrays.asList(
                        Map.of(
                                "name", "Project Management Professional (PMP)",
                                "provider", "PMI",
                                "url", "https://pmi.org/pmp",
                                "cost", 555.00,
                                "duration", "Self-paced + exam",
                                "value", "Industry standard certification"
                        )
                ));

                resources.setArticles(Arrays.asList(
                        Map.of(
                                "name", "Effective Leadership in Crisis",
                                "publisher", "Harvard Business Review",
                                "url", "https://hbr.org/leadership-crisis",
                                "cost", "free",
                                "format", "article"
                        )
                ));
            }
            else {
                // Default resources for any skill
                CourseDTO course = new CourseDTO();
                course.setName(skill + " Fundamentals");
                course.setProvider("Udemy");
                course.setUrl("https://udemy.com/" + skill.toLowerCase().replace(" ", "-") + "-fundamentals");
                course.setCost(49.99);
                course.setDuration("20 hours");
                course.setRating(4.5);
                course.setFormat("video");
                resources.getCourses().add(course);

                resources.setArticles(Arrays.asList(
                        Map.of(
                                "name", "Getting Started with " + skill,
                                "publisher", "Medium",
                                "url", "https://medium.com/getting-started-" + skill.toLowerCase().replace(" ", "-"),
                                "cost", "free",
                                "format", "article"
                        )
                ));

                CommunityDTO community = new CommunityDTO();
                community.setName(skill + " Professional Network");
                community.setUrl("https://linkedin.com/groups/" + skill.toLowerCase().replace(" ", "-"));
                community.setCost("free");
                community.setType("professional network");
                resources.getCommunities().add(community);
            }

            // Filter resources based on user preferences
            if (learningStyle != null && !learningStyle.isEmpty()) {
                String style = learningStyle.toLowerCase();

                if (resources.getCourses() != null) {
                    resources.setCourses(
                            resources.getCourses().stream()
                                    .filter(c -> c.getFormat() == null || c.getFormat().toLowerCase().contains(style))
                                    .collect(Collectors.toList())
                    );
                }
            }

            if (maxBudget != null) {
                if (resources.getCourses() != null) {
                    resources.setCourses(
                            resources.getCourses().stream()
                                    .filter(c -> {
                                        if (c.getCost() == null) return true;
                                        if (c.getCost() instanceof String && "free".equals(c.getCost())) return true;
                                        if (c.getCost() instanceof Number) {
                                            return ((Number) c.getCost()).doubleValue() <= maxBudget;
                                        }
                                        return true;
                                    })
                                    .collect(Collectors.toList())
                    );
                }

                if (resources.getBooks() != null) {
                    resources.setBooks(
                            resources.getBooks().stream()
                                    .filter(b -> {
                                        if (b.getCost() == null) return true;
                                        if (b.getCost() instanceof String && "free".equals(b.getCost())) return true;
                                        if (b.getCost() instanceof Number) {
                                            return ((Number) b.getCost()).doubleValue() <= maxBudget;
                                        }
                                        return true;
                                    })
                                    .collect(Collectors.toList())
                    );
                }
            }

            resourcesBySkill.put(skill, resources);
        }

        return resourcesBySkill;
    }

    /**
     * Creates a personalized career development plan with milestones and action items.
     */
    public DevelopmentPlanDTO createCareerDevelopmentPlan(String currentRole, String targetRole,
                                                          List<String> currentSkills, String timeline) {
        // Input validation
        if (currentRole == null || currentRole.isEmpty() ||
                targetRole == null || targetRole.isEmpty() ||
                currentSkills == null) {
            throw new IllegalArgumentException("Current role, target role, and current skills must be provided");
        }

        // Default timeline if not provided
        if (timeline == null || timeline.isEmpty()) {
            timeline = "6 months";
        }

        // Determine skills gap
        SkillsRecommendationDTO targetSkills = suggestSkills(Arrays.asList(targetRole), currentSkills, null);

        // Create timeline based on skill acquisition needs
        int monthsAvailable = 6; // Default
        try {
            String[] parts = timeline.split("\\s+");
            if (parts.length > 0 && parts[0].matches("\\d+")) {
                monthsAvailable = Integer.parseInt(parts[0]);
            }
        } catch (Exception e) {
            // Use default of 6 months
        }

        // Build development plan
        DevelopmentPlanDTO developmentPlan = new DevelopmentPlanDTO();

        // Create summary
        DevelopmentPlanSummaryDTO summary = new DevelopmentPlanSummaryDTO();
        summary.setCurrent_role(currentRole);
        summary.setTarget_role(targetRole);
        summary.setTimeline(timeline);
        summary.setSkills_gap(
                targetSkills.getTechnical_skills().size() +
                        targetSkills.getSoft_skills().size()
        );
        developmentPlan.setSummary(summary);

        // Create milestones
        List<MilestoneDTO> milestones = new ArrayList<>();
        int milestoneCount = Math.min(monthsAvailable, 4); // Cap at 4 milestones

        for (int i = 0; i < milestoneCount; i++) {
            int month = (i + 1) * (monthsAvailable / milestoneCount);

            List<String> skillsToMention = new ArrayList<>();
            if (i < targetSkills.getTechnical_skills().size()) {
                int endIndex = Math.min(i + 2, targetSkills.getTechnical_skills().size());
                List<SkillDTO> skillsSegment = targetSkills.getTechnical_skills().subList(i, endIndex);
                skillsToMention = skillsSegment.stream()
                        .map(SkillDTO::getSkill)
                        .collect(Collectors.toList());
            }

            String courseGoal = skillsToMention.isEmpty() ?
                    "Complete skill development courses" :
                    "Complete courses on " + String.join(", ", skillsToMention);

            MilestoneDTO milestone = new MilestoneDTO();
            milestone.setTimeline("Month " + month);
            milestone.setGoals(Arrays.asList(
                    courseGoal,
                    "Build network with " + targetRole + " professionals"
            ));
            milestone.setMetrics(Arrays.asList(
                    "Course completion certificates",
                    "5+ new professional connections"
            ));

            milestones.add(milestone);
        }

        // Final milestone - application phase
        MilestoneDTO finalMilestone = new MilestoneDTO();
        finalMilestone.setTimeline("Month " + monthsAvailable);
        finalMilestone.setGoals(Arrays.asList(
                "Apply for " + targetRole + " positions",
                "Showcase portfolio of new skills"
        ));
        finalMilestone.setMetrics(Arrays.asList(
                "5+ job applications submitted",
                "2+ interviews scheduled"
        ));
        milestones.add(finalMilestone);

        developmentPlan.setMilestones(milestones);

        // Skill acquisition plan
        SkillAcquisitionPlanDTO skillPlan = new SkillAcquisitionPlanDTO();

        // Get priority skills
        List<String> prioritySkills = new ArrayList<>();

        // Combine technical and soft skills, then take first 3
        List<SkillDTO> allSkills = new ArrayList<>();
        allSkills.addAll(targetSkills.getTechnical_skills());
        allSkills.addAll(targetSkills.getSoft_skills());

        // Take top 3 skills
        List<SkillDTO> topSkills = allSkills.size() > 3 ? allSkills.subList(0, 3) : allSkills;
        prioritySkills = topSkills.stream()
                .map(SkillDTO::getSkill)
                .collect(Collectors.toList());

        skillPlan.setPriority_skills(prioritySkills);

        // Get learning resources for priority skills
        skillPlan.setLearning_resources(getLearningResources(prioritySkills, null, null, null));

        developmentPlan.setSkill_acquisition_plan(skillPlan);

        // Networking strategy
        NetworkingStrategyDTO networkingStrategy = new NetworkingStrategyDTO();
        networkingStrategy.setTarget_connections(Arrays.asList(
                "Current " + targetRole + " professionals",
                "Hiring managers in target companies",
                "Industry thought leaders"
        ));
        networkingStrategy.setEngagement_approach(Arrays.asList(
                "Attend industry meetups and conferences",
                "Engage in online forums and communities",
                "Request informational interviews"
        ));
        developmentPlan.setNetworking_strategy(networkingStrategy);

        // Application strategy
        ApplicationStrategyDTO applicationStrategy = new ApplicationStrategyDTO();
        applicationStrategy.setResume_focus_points(Arrays.asList(
                "Highlight newly acquired skills",
                "Emphasize transferable experience from current role",
                "Quantify achievements with metrics"
        ));
        applicationStrategy.setInterview_preparation(Arrays.asList(
                "Research common interview questions for target role",
                "Prepare portfolio showcasing new skills",
                "Practice role-specific scenarios"
        ));
        developmentPlan.setApplication_strategy(applicationStrategy);

        return developmentPlan;
    }

    /**
     * Provides comprehensive career analysis by combining multiple API results.
     */
    public CareerAnalysisDTO getComprehensiveCareerAnalysis(String jobRole, List<String> skills,
                                                            String targetRole, String timeline) {
        // Input validation
        if (jobRole == null || jobRole.isEmpty() || skills == null || skills.isEmpty()) {
            throw new IllegalArgumentException("Job role and a non-empty skills list are required");
        }

        // Set default timeline if not provided
        if (timeline == null || timeline.isEmpty()) {
            timeline = "6 months";
        }

        CareerAnalysisDTO analysis = new CareerAnalysisDTO();

        // Step 1: Predict next roles
        CareerPathsDTO nextRoles = predictNextRoles(jobRole, skills, null, null);
        analysis.setNextRoles(nextRoles);

        // Step 2: Suggest skills based on vertical roles
        List<String> verticalRoles = nextRoles.getVertical_progression().stream()
                .map(RoleDTO::getRole)
                .collect(Collectors.toList());

        SkillsRecommendationDTO recommendedSkills = suggestSkills(verticalRoles, skills, null);
        analysis.setRecommendedSkills(recommendedSkills);

        // Step 3: Get learning resources for technical skills
        List<String> skillList = recommendedSkills.getTechnical_skills().stream()
                .map(SkillDTO::getSkill)
                .collect(Collectors.toList());

        Map<String, ResourceCategoryDTO> learningResources = getLearningResources(skillList, null, null, null);
        analysis.setLearningResources(learningResources);

        // Step 4: Create development plan if target role provided
        if (targetRole != null && !targetRole.isEmpty()) {
            DevelopmentPlanDTO developmentPlan = createCareerDevelopmentPlan(
                    jobRole, targetRole, skills, timeline
            );
            analysis.setCareerDevelopmentPlan(developmentPlan);
        }

        return analysis;
    }
}
