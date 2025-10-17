package com.straydogcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "volunteers")
public class Volunteer {
    
    @Id
    private String id;
    
    private String userId; // Reference to User
    private String name;
    private String contact;
    private String email;
    private String area;
    private Role role;
    private Status status = Status.PENDING;
    
    private List<String> assignedCases = new ArrayList<>();
    private Integer completedCases = 0;
    private String availability; // e.g., "Weekends", "Weekdays", "Anytime"
    
    private String address;
    private String experience;
    private String certifications;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Role {
        FEEDER, RESCUER, VET, TRANSPORT, FOSTER
    }
    
    public enum Status {
        PENDING, APPROVED, ACTIVE, INACTIVE, REJECTED
    }
}
