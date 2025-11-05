package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    // Allowed image extensions for security
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"
    );
    
    // Allowed MIME types
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
    );
    
    // Max file size: 5MB
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;
    
    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            log.info("Received file upload request: {}", file.getOriginalFilename());
            
            // Validate file is not empty
            if (file.isEmpty()) {
                log.warn("Empty file upload attempt");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Please select a file to upload"));
            }
            
            // Validate file size
            if (file.getSize() > MAX_FILE_SIZE) {
                log.warn("File too large: {} bytes", file.getSize());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File size must be less than 5MB"));
            }
            
            // Validate MIME type
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
                log.warn("Invalid content type: {}", contentType);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only image files (JPG, PNG, GIF, WebP, SVG) are allowed"));
            }
            
            // Validate file extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isBlank()) {
                log.warn("Missing original filename");
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid filename"));
            }
            
            String extension = getFileExtension(originalFilename).toLowerCase();
            if (!ALLOWED_EXTENSIONS.contains(extension)) {
                log.warn("Invalid file extension: {}", extension);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("File type not allowed. Allowed types: JPG, PNG, GIF, WebP, SVG"));
            }
            
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            }
            
            // Generate secure unique filename with timestamp for better organization
            String sanitizedOriginalName = sanitizeFilename(originalFilename);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String uniqueId = UUID.randomUUID().toString().substring(0, 8);
            String filename = String.format("%s_%s_%s%s", timestamp, uniqueId, sanitizedOriginalName, extension);
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            log.info("File uploaded successfully: {}", filename);
            
            // Return file information
            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("url", "/uploads/" + filename);
            response.put("originalName", originalFilename);
            response.put("size", String.valueOf(file.getSize()));
            response.put("contentType", contentType);
            response.put("uploadedAt", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(ApiResponse.success("File uploaded successfully", response));
            
        } catch (IOException e) {
            log.error("File upload failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload file: " + e.getMessage()));
        }
    }
    
    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }
    
    /**
     * Sanitize filename to prevent path traversal attacks
     */
    private String sanitizeFilename(String filename) {
        // Remove extension
        int lastDotIndex = filename.lastIndexOf('.');
        String nameWithoutExt = lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
        
        // Remove special characters and limit length
        String sanitized = nameWithoutExt
                .replaceAll("[^a-zA-Z0-9-_]", "_")
                .replaceAll("_{2,}", "_")
                .trim();
        
        // Limit length
        if (sanitized.length() > 50) {
            sanitized = sanitized.substring(0, 50);
        }
        
        return sanitized.isEmpty() ? "file" : sanitized;
    }
    
    @DeleteMapping("/image/{filename}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(@PathVariable String filename) {
        try {
            // Sanitize filename to prevent path traversal
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                log.warn("Path traversal attempt detected: {}", filename);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid filename"));
            }
            
            Path filePath = Paths.get(uploadDir).resolve(filename);
            
            // Ensure file is within upload directory
            if (!filePath.normalize().startsWith(Paths.get(uploadDir).normalize())) {
                log.warn("Attempt to delete file outside upload directory: {}", filename);
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid file path"));
            }
            
            boolean deleted = Files.deleteIfExists(filePath);
            
            if (deleted) {
                log.info("File deleted successfully: {}", filename);
                return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
            } else {
                log.warn("File not found: {}", filename);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("File not found"));
            }
            
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete file: " + e.getMessage()));
        }
    }
}
