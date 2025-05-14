package com.example.ResumeAnalyzer.models;

import java.util.List;

public class DevelopmentPlanDTO {
    private DevelopmentPlanSummaryDTO summary;
    private List<MilestoneDTO> milestones;
    private SkillAcquisitionPlanDTO skill_acquisition_plan;
    private NetworkingStrategyDTO networking_strategy;
    private ApplicationStrategyDTO application_strategy;

    // Getters and setters
    public DevelopmentPlanSummaryDTO getSummary() { return summary; }
    public void setSummary(DevelopmentPlanSummaryDTO summary) { this.summary = summary; }
    public List<MilestoneDTO> getMilestones() { return milestones; }
    public void setMilestones(List<MilestoneDTO> milestones) { this.milestones = milestones; }
    public SkillAcquisitionPlanDTO getSkill_acquisition_plan() { return skill_acquisition_plan; }
    public void setSkill_acquisition_plan(SkillAcquisitionPlanDTO skill_acquisition_plan) { this.skill_acquisition_plan = skill_acquisition_plan; }
    public NetworkingStrategyDTO getNetworking_strategy() { return networking_strategy; }
    public void setNetworking_strategy(NetworkingStrategyDTO networking_strategy) { this.networking_strategy = networking_strategy; }
    public ApplicationStrategyDTO getApplication_strategy() { return application_strategy; }
    public void setApplication_strategy(ApplicationStrategyDTO application_strategy) { this.application_strategy = application_strategy; }
}

