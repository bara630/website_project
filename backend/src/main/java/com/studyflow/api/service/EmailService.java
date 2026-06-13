package com.studyflow.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTaskReminder(String toEmail, String taskTitle, String dueDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("StudyFlow Task Reminder");
        message.setText("Don't forget to complete your task: " + taskTitle + 
                        "\nDue date: " + dueDate + 
                        "\n\nStay focused and keep up the great work!");
        mailSender.send(message);
    }

    public void sendExamReminder(String toEmail, String courseName, String examDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("StudyFlow Exam Reminder");
        message.setText("Upcoming exam alert: " + courseName + 
                        "\nExam date: " + examDate + 
                        "\n\nMake sure to review your materials and prepare well!");
        mailSender.send(message);
    }

    public void sendWorkloadAlert(String toEmail, String messageContent) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("StudyFlow Workload Alert");
        message.setText(messageContent);
        mailSender.send(message);
    }
}
