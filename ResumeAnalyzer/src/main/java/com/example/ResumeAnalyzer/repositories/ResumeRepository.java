package com.example.ResumeAnalyzer.repositories;



import com.example.ResumeAnalyzer.models.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
}


