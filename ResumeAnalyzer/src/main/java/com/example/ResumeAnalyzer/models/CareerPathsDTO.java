package com.example.ResumeAnalyzer.models;

import java.util.List;

public class CareerPathsDTO {
    private List<RoleDTO> vertical_progression;
    private List<RoleDTO> specialization_paths;
    private List<RoleDTO> lateral_movements;
    private List<RoleDTO> emerging_opportunities;

    // Getters and setters
    public List<RoleDTO> getVertical_progression() { return vertical_progression; }
    public void setVertical_progression(List<RoleDTO> vertical_progression) { this.vertical_progression = vertical_progression; }
    public List<RoleDTO> getSpecialization_paths() { return specialization_paths; }
    public void setSpecialization_paths(List<RoleDTO> specialization_paths) { this.specialization_paths = specialization_paths; }
    public List<RoleDTO> getLateral_movements() { return lateral_movements; }
    public void setLateral_movements(List<RoleDTO> lateral_movements) { this.lateral_movements = lateral_movements; }
    public List<RoleDTO> getEmerging_opportunities() { return emerging_opportunities; }
    public void setEmerging_opportunities(List<RoleDTO> emerging_opportunities) { this.emerging_opportunities = emerging_opportunities; }
}
