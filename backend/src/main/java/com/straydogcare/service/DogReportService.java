package com.straydogcare.service;

import com.straydogcare.model.DogReport;
import com.straydogcare.model.Notification;
import com.straydogcare.model.Volunteer;
import com.straydogcare.repository.DogReportRepository;
import com.straydogcare.repository.VolunteerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DogReportService {
    
    private final DogReportRepository dogReportRepository;
    private final VolunteerRepository volunteerRepository;
    private final NotificationService notificationService;
    
    public List<DogReport> getAllReports() {
        return dogReportRepository.findAll();
    }
    
    public List<DogReport> getReportsByStatus(DogReport.Status status) {
        return dogReportRepository.findByStatus(status);
    }
    
    public List<DogReport> getReportsByLocation(String location) {
        return dogReportRepository.findByLocation(location);
    }
    
    public List<DogReport> getReportsByCondition(DogReport.Condition condition) {
        return dogReportRepository.findByCondition(condition);
    }
    
    public DogReport getReportById(String id) {
        return dogReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }
    
    public DogReport createReport(DogReport report) {
        // Only set PENDING status if no status is provided
        if (report.getStatus() == null) {
            report.setStatus(DogReport.Status.PENDING);
        }
        report.setCreatedAt(LocalDateTime.now());
        
        // Set priority based on condition
        switch (report.getCondition()) {
            case CRITICAL -> report.setPriority(1);
            case INJURED -> report.setPriority(2);
            case SICK -> report.setPriority(2);
            case MALNOURISHED -> report.setPriority(3);
            default -> report.setPriority(4);
        }
        
        DogReport saved = dogReportRepository.save(report);
        
        // Notify volunteers in the area
        List<Volunteer> volunteers = volunteerRepository.findByArea(report.getLocation());
        for (Volunteer volunteer : volunteers) {
            if (volunteer.getUserId() != null && volunteer.getStatus() == Volunteer.Status.ACTIVE) {
                notificationService.createNotification(
                        volunteer.getUserId(),
                        "New Dog Report",
                        "A new dog has been reported in your area: " + report.getLocation(),
                        Notification.Type.INFO,
                        saved.getId(),
                        "DOG_REPORT"
                );
            }
        }
        
        return saved;
    }
    
    public DogReport updateReport(String id, DogReport report) {
        DogReport existing = getReportById(id);
        
        if (report.getDogName() != null) existing.setDogName(report.getDogName());
        if (report.getDescription() != null) existing.setDescription(report.getDescription());
        if (report.getCondition() != null) existing.setCondition(report.getCondition());
        if (report.getLocation() != null) existing.setLocation(report.getLocation());
        if (report.getPhotoUrl() != null) existing.setPhotoUrl(report.getPhotoUrl());
        if (report.getStatus() != null) existing.setStatus(report.getStatus());
        if (report.getCoordinates() != null) existing.setCoordinates(report.getCoordinates());
        
        existing.setUpdatedAt(LocalDateTime.now());
        
        return dogReportRepository.save(existing);
    }
    
    public DogReport assignToVolunteer(String reportId, String volunteerId) {
        DogReport report = getReportById(reportId);
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        
        report.setAssignedTo(volunteerId);
        report.setAssignedVolunteerName(volunteer.getName());
        report.setStatus(DogReport.Status.ASSIGNED);
        
        DogReport updated = dogReportRepository.save(report);
        
        // Notify volunteer
        if (volunteer.getUserId() != null) {
            notificationService.createNotification(
                    volunteer.getUserId(),
                    "Case Assigned",
                    "You have been assigned to a new dog rescue case",
                    Notification.Type.CASE_ASSIGNED,
                    reportId,
                    "DOG_REPORT"
            );
        }
        
        // Update volunteer's assigned cases
        volunteer.getAssignedCases().add(reportId);
        volunteerRepository.save(volunteer);
        
        return updated;
    }
    
    public DogReport addNote(String reportId, String note, String userId) {
        DogReport report = getReportById(reportId);
        
        DogReport.Note newNote = new DogReport.Note();
        newNote.setContent(note);
        newNote.setAddedBy(userId);
        newNote.setAddedAt(LocalDateTime.now());
        
        report.getNotes().add(newNote);
        report.setUpdatedAt(LocalDateTime.now());
        
        return dogReportRepository.save(report);
    }
    
    public void deleteReport(String id) {
        dogReportRepository.deleteById(id);
    }
    
    public List<DogReport> getNearbyReports(double lat, double lng, double radiusInKm) {
        // For simplicity, returning all reports
        // In production, use MongoDB's geospatial queries
        return dogReportRepository.findAll();
    }
}
