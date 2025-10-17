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
@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    
    private String userId;
    private String title;
    private String message;
    private Type type;
    
    private boolean read = false;
    private String relatedEntityId; // ID of related dog report, adoption, etc.
    private String relatedEntityType; // DOG_REPORT, ADOPTION, VOLUNTEER, etc.
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime readAt;
    
    public enum Type {
        INFO, SUCCESS, WARNING, ERROR, CASE_ASSIGNED, CASE_UPDATE, ADOPTION_UPDATE, DONATION_RECEIVED, VOLUNTEER_APPROVED
    }
}
