package com.studyflow.api.controller;

import com.studyflow.api.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/task-reminder")
    public String sendTaskReminder(@RequestBody EmailRequest request) {
        try {
            emailService.sendTaskReminder(request.toEmail, request.taskTitle, request.dueDate);
            return "Task reminder sent successfully to " + request.toEmail;
        } catch (Exception e) {
            return "Failed to send task reminder: " + e.getMessage();
        }
    }

    @PostMapping("/exam-reminder")
    public String sendExamReminder(@RequestBody EmailRequest request) {
        try {
            emailService.sendExamReminder(request.toEmail, request.courseName, request.examDate);
            return "Exam reminder sent successfully to " + request.toEmail;
        } catch (Exception e) {
            return "Failed to send exam reminder: " + e.getMessage();
        }
    }

    @PostMapping("/workload-alert")
    public String sendWorkloadAlert(@RequestBody EmailRequest request) {
        try {
            emailService.sendWorkloadAlert(request.toEmail, request.message);
            return "Workload alert sent successfully to " + request.toEmail;
        } catch (Exception e) {
            return "Failed to send workload alert: " + e.getMessage();
        }
    }

    static class EmailRequest {
        public String toEmail;
        public String taskTitle;
        public String dueDate;
        public String courseName;
        public String examDate;
        public String message;
    }
}
