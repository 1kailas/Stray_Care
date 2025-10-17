package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.VolunteerTask;
import com.straydogcare.service.VolunteerTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteer-tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VolunteerTaskController {
    
    private final VolunteerTaskService taskService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<VolunteerTask>>> getAllTasks() {
        try {
            List<VolunteerTask> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(ApiResponse.success(tasks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch tasks: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VolunteerTask>> getTaskById(@PathVariable String id) {
        try {
            return taskService.getTaskById(id)
                .map(task -> ResponseEntity.ok(ApiResponse.success(task)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Task not found")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch task: " + e.getMessage()));
        }
    }
    
    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<ApiResponse<List<VolunteerTask>>> getTasksByVolunteerId(@PathVariable String volunteerId) {
        try {
            List<VolunteerTask> tasks = taskService.getTasksByVolunteerId(volunteerId);
            return ResponseEntity.ok(ApiResponse.success(tasks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch tasks: " + e.getMessage()));
        }
    }
    
    @GetMapping("/my-tasks")
    public ResponseEntity<ApiResponse<List<VolunteerTask>>> getMyTasks() {
        try {
            // This endpoint should be secured and get the current user's volunteer ID from the security context
            // For now, it returns all tasks (you can implement authentication to filter by current user)
            List<VolunteerTask> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(ApiResponse.success(tasks));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch your tasks: " + e.getMessage()));
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<VolunteerTask>>> getTasksByStatus(@PathVariable String status) {
        try {
            VolunteerTask.Status taskStatus = VolunteerTask.Status.valueOf(status.toUpperCase());
            List<VolunteerTask> tasks = taskService.getTasksByStatus(taskStatus);
            return ResponseEntity.ok(ApiResponse.success(tasks));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Invalid status: " + status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to fetch tasks: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<VolunteerTask>> createTask(@RequestBody VolunteerTask task) {
        try {
            if (task.getVolunteerId() == null || task.getVolunteerId().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Volunteer ID is required"));
            }
            if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Task title is required"));
            }
            
            VolunteerTask createdTask = taskService.createTask(task);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdTask));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create task: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VolunteerTask>> updateTask(
            @PathVariable String id,
            @RequestBody VolunteerTask task) {
        try {
            VolunteerTask updatedTask = taskService.updateTask(id, task);
            return ResponseEntity.ok(ApiResponse.success(updatedTask));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to update task: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<VolunteerTask>> updateTaskStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            if (statusStr == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Status is required"));
            }
            
            VolunteerTask.Status status = VolunteerTask.Status.valueOf(statusStr.toUpperCase());
            String notes = request.get("notes");
            
            VolunteerTask updatedTask = taskService.updateTaskStatus(id, status, notes);
            return ResponseEntity.ok(ApiResponse.success(updatedTask));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Invalid status value"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to update task status: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to delete task: " + e.getMessage()));
        }
    }
}
