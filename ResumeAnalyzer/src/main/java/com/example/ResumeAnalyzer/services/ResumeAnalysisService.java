package com.example.ResumeAnalyzer.services;

import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class ResumeAnalysisService {
    private static final String FLASK_API_URL = "http://localhost:5000";

    public JSONObject analyzeGrammar(String resumeText) throws IOException {
        JSONObject jsonInput = new JSONObject().put("resume_text", resumeText);
        return sendPostRequest("/analyze-resume", jsonInput);
    }

    public JSONObject analyzeATS(String resumeText, String jobDescription) throws IOException {
        JSONObject jsonInput = new JSONObject()
                .put("resume_text", resumeText)
                .put("job_description", jobDescription);
        return sendPostRequest("/analyze-resume", jsonInput);
    }

    public JSONObject analyzeSkills(String resumeText, String jobRole) throws IOException {
        JSONObject jsonInput = new JSONObject()
                .put("resume_text", resumeText)
                .put("job_role", jobRole);
        return sendPostRequest("/analyze-resume", jsonInput);
    }

    private JSONObject sendPostRequest(String endpoint, JSONObject jsonInput) throws IOException {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(FLASK_API_URL + endpoint);

            // Set content type header
            StringEntity entity = new StringEntity(
                    jsonInput.toString(),
                    ContentType.APPLICATION_JSON.withCharset(StandardCharsets.UTF_8)
            );
            httpPost.setEntity(entity);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("Accept", "application/json");

            return httpClient.execute(httpPost, response -> {
                if (response.getCode() >= 400) {
                    throw new IOException("API request failed with status code: " + response.getCode());
                }

                String responseBody = new String(
                        response.getEntity().getContent().readAllBytes(),
                        StandardCharsets.UTF_8
                );
                return new JSONObject(responseBody);
            });
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Error communicating with Flask API: " + e.getMessage(), e);
        }
    }
//    public JSONObject analyzeCareerPath(String jobRole) throws IOException {
//        JSONObject jsonInput = new JSONObject().put("jobRole", jobRole);
//        return sendPostRequest("/api/analysis/career-path", jsonInput); // Updated endpoint from Flask
//    }



}