package com.straydogcare.service;

import com.straydogcare.model.Adoption;
import com.straydogcare.model.DogReport;
import com.straydogcare.model.Notification;
import com.straydogcare.repository.AdoptionRepository;
import com.straydogcare.repository.DogReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdoptionService {
    
    private final AdoptionRepository adoptionRepository;
    private final DogReportRepository dogReportRepository;
    private final NotificationService notificationService;
    
    public List<Adoption> getAllAdoptions() {
        return adoptionRepository.findAll();
    }
    
    public List<Adoption> getAdoptionsByStatus(Adoption.Status status) {
        return adoptionRepository.findByStatus(status);
    }
    
    public List<Adoption> getAdoptionsByAdopter(String adopterId) {
        return adoptionRepository.findByAdopterId(adopterId);
    }
    
    public Adoption getAdoptionById(String id) {
        return adoptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adoption not found"));
    }
    
    public Adoption createAdoption(Adoption adoption) {
        adoption.setStatus(Adoption.Status.PENDING);
        adoption.setApplicationDate(LocalDateTime.now());
        adoption.setCreatedAt(LocalDateTime.now());
        
        // Get dog information if dogReportId is provided
        if (adoption.getDogReportId() != null) {
            dogReportRepository.findById(adoption.getDogReportId()).ifPresent(dog -> {
                adoption.setDogName(dog.getDogName());
                adoption.setDogDescription(dog.getDescription());
                adoption.setDogPhotoUrl(dog.getPhotoUrl());
            });
        }
        
        Adoption saved = adoptionRepository.save(adoption);
        
        // Notify adopter
        if (adoption.getAdopterId() != null) {
            notificationService.createNotification(
                    adoption.getAdopterId(),
                    "Adoption Application Received",
                    "Your adoption application has been received and is under review",
                    Notification.Type.ADOPTION_UPDATE,
                    saved.getId(),
                    "ADOPTION"
            );
        }
        
        return saved;
    }
    
    public Adoption updateAdoption(String id, Adoption adoption) {
        Adoption existing = getAdoptionById(id);
        
        // Update fields
        if (adoption.getDogName() != null) existing.setDogName(adoption.getDogName());
        if (adoption.getDogDescription() != null) existing.setDogDescription(adoption.getDogDescription());
        if (adoption.getDogPhotoUrl() != null) existing.setDogPhotoUrl(adoption.getDogPhotoUrl());
        if (adoption.getAdopterName() != null) existing.setAdopterName(adoption.getAdopterName());
        if (adoption.getAdopterContact() != null) existing.setAdopterContact(adoption.getAdopterContact());
        if (adoption.getAdopterEmail() != null) existing.setAdopterEmail(adoption.getAdopterEmail());
        if (adoption.getAdopterAddress() != null) existing.setAdopterAddress(adoption.getAdopterAddress());
        if (adoption.getNotes() != null) existing.setNotes(adoption.getNotes());
        if (adoption.getAdopterId() != null) existing.setAdopterId(adoption.getAdopterId());
        
        // Update status if provided
        if (adoption.getStatus() != null) {
            existing.setStatus(adoption.getStatus());
            if (adoption.getStatus() == Adoption.Status.PENDING) {
                existing.setApplicationDate(LocalDateTime.now());
            }
        }
        
        Adoption updated = adoptionRepository.save(existing);
        
        // Notify if status changed to PENDING (user submitted adoption request)
        if (adoption.getStatus() == Adoption.Status.PENDING && adoption.getAdopterId() != null) {
            notificationService.createNotification(
                    adoption.getAdopterId(),
                    "Adoption Request Submitted",
                    "Your adoption request for " + existing.getDogName() + " has been submitted for review",
                    Notification.Type.ADOPTION_UPDATE,
                    id,
                    "ADOPTION"
            );
        }
        
        return updated;
    }
    
    public Adoption updateAdoptionStatus(String id, Adoption.Status status) {
        Adoption adoption = getAdoptionById(id);
        adoption.setStatus(status);
        
        if (status == Adoption.Status.APPROVED) {
            adoption.setApprovalDate(LocalDateTime.now());
        } else if (status == Adoption.Status.COMPLETED) {
            adoption.setCompletionDate(LocalDateTime.now());
            
            // Update dog report status if exists
            if (adoption.getDogReportId() != null) {
                dogReportRepository.findById(adoption.getDogReportId()).ifPresent(dog -> {
                    dog.setStatus(DogReport.Status.COMPLETED);
                    dogReportRepository.save(dog);
                });
            }
        }
        
        Adoption updated = adoptionRepository.save(adoption);
        
        // Notify adopter
        if (adoption.getAdopterId() != null) {
            String message = "Your adoption application status: " + status;
            notificationService.createNotification(
                    adoption.getAdopterId(),
                    "Adoption Status Update",
                    message,
                    Notification.Type.ADOPTION_UPDATE,
                    id,
                    "ADOPTION"
            );
        }
        
        return updated;
    }
    
    public void deleteAdoption(String id) {
        adoptionRepository.deleteById(id);
    }
}
