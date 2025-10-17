package com.straydogcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "volunteer_tasks")
public class VolunteerTask {
    
    @Id
    private String id;
    
    private String volunteerId; // Reference to Volunteer
    private String volunteerName; // Cached for display
    private String title;
    private String description;
    private Priority priority = Priority.MEDIUM;
    private Status status = Status.PENDING;
    private String dueDate; // ISO date string
    private String assignedDate; // ISO date string
    private String completedDate; // ISO date string
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
