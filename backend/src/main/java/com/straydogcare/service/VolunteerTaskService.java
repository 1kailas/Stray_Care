package com.straydogcare.service;

import com.straydogcare.model.Volunteer;
import com.straydogcare.model.VolunteerTask;
import com.straydogcare.repository.VolunteerRepository;
import com.straydogcare.repository.VolunteerTaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VolunteerTaskService {
    
    private final VolunteerTaskRepository taskRepository;
    private final VolunteerRepository volunteerRepository;
    
    public List<VolunteerTask> getAllTasks() {
        return taskRepository.findAll();
    }
    
    public Optional<VolunteerTask> getTaskById(String id) {
        return taskRepository.findById(id);
    }
    
    public List<VolunteerTask> getTasksByVolunteerId(String volunteerId) {
        return taskRepository.findByVolunteerId(volunteerId);
    }
    
    public List<VolunteerTask> getTasksByStatus(VolunteerTask.Status status) {
        return taskRepository.findByStatus(status);
    }
    
    public VolunteerTask createTask(VolunteerTask task) {
        // Get volunteer name for caching
        if (task.getVolunteerId() != null) {
            Optional<Volunteer> volunteer = volunteerRepository.findById(task.getVolunteerId());
            volunteer.ifPresent(v -> task.setVolunteerName(v.getName()));
        }
        
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }
    
    public VolunteerTask updateTask(String id, VolunteerTask taskDetails) {
        return taskRepository.findById(id)
            .map(task -> {
                if (taskDetails.getTitle() != null) {
                    task.setTitle(taskDetails.getTitle());
                }
                if (taskDetails.getDescription() != null) {
                    task.setDescription(taskDetails.getDescription());
                }
                if (taskDetails.getPriority() != null) {
                    task.setPriority(taskDetails.getPriority());
                }
                if (taskDetails.getStatus() != null) {
                    task.setStatus(taskDetails.getStatus());
                    // Set completed date when status changes to COMPLETED
                    if (taskDetails.getStatus() == VolunteerTask.Status.COMPLETED && task.getCompletedDate() == null) {
                        task.setCompletedDate(LocalDateTime.now().toString());
                    }
                }
                if (taskDetails.getDueDate() != null) {
                    task.setDueDate(taskDetails.getDueDate());
                }
                if (taskDetails.getNotes() != null) {
                    task.setNotes(taskDetails.getNotes());
                }
                task.setUpdatedAt(LocalDateTime.now());
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }
    
    public VolunteerTask updateTaskStatus(String id, VolunteerTask.Status status, String notes) {
        return taskRepository.findById(id)
            .map(task -> {
                task.setStatus(status);
                if (notes != null) {
                    task.setNotes(notes);
                }
                // Set completed date when status changes to COMPLETED
                if (status == VolunteerTask.Status.COMPLETED && task.getCompletedDate() == null) {
                    task.setCompletedDate(LocalDateTime.now().toString());
                }
                task.setUpdatedAt(LocalDateTime.now());
                return taskRepository.save(task);
            })
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }
    
    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }
}
