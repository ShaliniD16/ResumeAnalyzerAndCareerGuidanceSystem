package com.example.ResumeAnalyzer.controllers;

import com.example.ResumeAnalyzer.models.ChangePasswordDTO;
import com.example.ResumeAnalyzer.models.UserProfileDTO;
import com.example.ResumeAnalyzer.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getName()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, Principal principal) {
        userService.changePassword(principal.getName(), dto);
        return ResponseEntity.ok("Password updated successfully");
    }
}
