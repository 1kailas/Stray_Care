package com.straydogcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "adoptions")
public class Adoption {
    
    @Id
    private String id;
    
    private String dogReportId; // Reference to DogReport
    private String dogName;
    private String dogDescription;
    private String dogPhotoUrl;
    
    private String adopterId; // User ID
    private String adopterName;
    private String adopterContact;
    private String adopterEmail;
    private String adopterAddress;
    
    private Status status = Status.PENDING;
    private String notes;
    
    private LocalDateTime applicationDate;
    private LocalDateTime approvalDate;
    private LocalDateTime completionDate;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    public enum Status {
        PENDING, UNDER_REVIEW, APPROVED, REJECTED, COMPLETED
    }
}
