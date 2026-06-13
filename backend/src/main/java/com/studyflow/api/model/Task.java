package com.studyflow.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "due_date")
    private String dueDate;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "estimated_pomodoros")
    private Integer estimatedPomodoros;

    // Explicit getter for completed field
    public Boolean getCompleted() {
        return this.completed;
    }

    // Explicit setter for completed field
    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    // Explicit getter for userId field
    public Long getUserId() {
        return this.userId;
    }

    // Explicit setter for userId field
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // Explicit getter for title field
    public String getTitle() {
        return this.title;
    }

    // Explicit setter for title field
    public void setTitle(String title) {
        this.title = title;
    }
}