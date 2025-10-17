package com.straydogcare.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vaccinations")
public class Vaccination {
    
    @Id
    private String id;
    
    private String dogReportId; // Reference to DogReport
    private String dogName;
    private String dogDescription;
    
    private List<VaccinationRecord> records = new ArrayList<>();
    
    private String vetId; // Volunteer/User ID
    private String vetName;
    
    private String location;
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VaccinationRecord {
        private String vaccineName;
        private VaccineType type;
        private LocalDate dateAdministered;
        private LocalDate nextDueDate;
        private String batchNumber;
        private String administeredBy;
        private String notes;
        private boolean completed = true;
    }
    
    public enum VaccineType {
        RABIES, DHPP, BORDETELLA, LEPTOSPIROSIS, LYME, DEWORMING, OTHER
    }
}
