package com.straydogcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "dog_reports")
public class DogReport {
    
    @Id
    private String id;
    
    private String dogName;
    private String description;
    private Condition condition;
    private String location;
    private GeoJsonPoint coordinates; // For map integration
    private String photoUrl;
    private Status status = Status.PENDING;
    
    private String reportedBy; // User ID
    private String reporterName;
    private String reporterContact;
    
    private String assignedTo; // Volunteer ID
    private String assignedVolunteerName;
    
    private List<Note> notes = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    
    private Integer priority = 3; // 1-5, 1 being highest
    private LocalDateTime rescueDate;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Condition {
        HEALTHY, INJURED, SICK, MALNOURISHED, CRITICAL
    }
    
    public enum Status {
        PENDING, ASSIGNED, IN_PROGRESS, RESCUED, COMPLETED, CLOSED
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Note {
        private String content;
        private String addedBy;
        private LocalDateTime addedAt = LocalDateTime.now();
    }
}
