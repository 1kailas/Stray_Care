package com.straydogcare.service;

import com.straydogcare.model.Notification;
import com.straydogcare.model.Volunteer;
import com.straydogcare.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VolunteerService {
    
    private final VolunteerRepository volunteerRepository;
    private final NotificationService notificationService;
    
    public List<Volunteer> getAllVolunteers() {
        return volunteerRepository.findAll();
    }
    
    public List<Volunteer> getVolunteersByStatus(Volunteer.Status status) {
        return volunteerRepository.findByStatus(status);
    }
    
    public List<Volunteer> getVolunteersByArea(String area) {
        return volunteerRepository.findByArea(area);
    }
    
    public Volunteer getVolunteerById(String id) {
        return volunteerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
    }
    
    public Volunteer registerVolunteer(Volunteer volunteer) {
        if (volunteerRepository.existsByEmail(volunteer.getEmail())) {
            throw new RuntimeException("Email already registered as volunteer");
        }
        
        volunteer.setStatus(Volunteer.Status.PENDING);
        volunteer.setCreatedAt(LocalDateTime.now());
        volunteer.setCompletedCases(0);
        
        Volunteer saved = volunteerRepository.save(volunteer);
        
        // Notify admin about new volunteer registration
        // In production, you would notify all admin users
        
        return saved;
    }
    
    public Volunteer updateVolunteer(String id, Volunteer volunteer) {
        Volunteer existing = getVolunteerById(id);
        
        if (volunteer.getName() != null) existing.setName(volunteer.getName());
        if (volunteer.getContact() != null) existing.setContact(volunteer.getContact());
        if (volunteer.getEmail() != null) existing.setEmail(volunteer.getEmail());
        if (volunteer.getArea() != null) existing.setArea(volunteer.getArea());
        if (volunteer.getRole() != null) existing.setRole(volunteer.getRole());
        if (volunteer.getAvailability() != null) existing.setAvailability(volunteer.getAvailability());
        if (volunteer.getAddress() != null) existing.setAddress(volunteer.getAddress());
        if (volunteer.getExperience() != null) existing.setExperience(volunteer.getExperience());
        if (volunteer.getCertifications() != null) existing.setCertifications(volunteer.getCertifications());
        
        existing.setUpdatedAt(LocalDateTime.now());
        
        return volunteerRepository.save(existing);
    }
    
    public Volunteer updateVolunteerStatus(String id, Volunteer.Status status) {
        Volunteer volunteer = getVolunteerById(id);
        volunteer.setStatus(status);
        volunteer.setUpdatedAt(LocalDateTime.now());
        
        Volunteer updated = volunteerRepository.save(volunteer);
        
        // Notify volunteer about status change
        if (volunteer.getUserId() != null) {
            String message = status == Volunteer.Status.APPROVED 
                    ? "Your volunteer application has been approved!" 
                    : "Your volunteer status has been updated to: " + status;
            
            notificationService.createNotification(
                    volunteer.getUserId(),
                    "Volunteer Status Update",
                    message,
                    Notification.Type.VOLUNTEER_APPROVED,
                    id,
                    "VOLUNTEER"
            );
        }
        
        return updated;
    }
    
    public void deleteVolunteer(String id) {
        volunteerRepository.deleteById(id);
    }
    
    public void incrementCompletedCases(String volunteerId) {
        Volunteer volunteer = getVolunteerById(volunteerId);
        volunteer.setCompletedCases(volunteer.getCompletedCases() + 1);
        volunteerRepository.save(volunteer);
    }
}
