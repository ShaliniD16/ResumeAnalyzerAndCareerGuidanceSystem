package com.example.ResumeAnalyzer.controllers;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*") 
public class MockInterviewController {

    @Value("${flask.api.url:http://localhost:5000/api/interview/analyze}")
    private String flaskApiUrl;

    @PostMapping("/submit")
    public ResponseEntity<?> handleInterviewSubmission(
            @RequestParam("role") String role,
            @RequestParam("audios") List<MultipartFile> audios
    ) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Build multipart form data
            LinkedMultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("role", role);

            for (int i = 0; i < audios.size(); i++) {
                MultipartFile file = audios.get(i);
                ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                };
                body.add("audios", new HttpEntity<>(resource, createFileHeaders(file)));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // Send to Flask API
            ResponseEntity<String> response = restTemplate.exchange(
                    flaskApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to process mock interview: " + e.getMessage()));
        }
    }

    private HttpHeaders createFileHeaders(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.builder("form-data")
                .name("audios")
                .filename(file.getOriginalFilename())
                .build());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return headers;
    }
}

