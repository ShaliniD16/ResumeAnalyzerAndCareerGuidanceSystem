package com.example.ResumeAnalyzer.services;

import com.example.ResumeAnalyzer.models.User;
import com.example.ResumeAnalyzer.repositories.UserRepository;
import com.example.ResumeAnalyzer.models.UserProfileDTO;
import com.example.ResumeAnalyzer.models.ChangePasswordDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfileDTO dto = new UserProfileDTO();
        dto.setName(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public void changePassword(String email, ChangePasswordDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IllegalArgumentException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}
