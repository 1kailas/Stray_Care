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
@Document(collection = "forum_posts")
public class ForumPost {
    
    @Id
    private String id;
    
    private String title;
    private String content;
    private Category category;
    
    private String authorId; // User ID
    private String authorName;
    
    private List<Comment> comments = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    
    private Integer likes = 0;
    private Integer views = 0;
    
    private boolean pinned = false;
    private boolean locked = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Category {
        GENERAL, ADOPTION, RESCUE, HEALTH, BEHAVIOR, LOST_FOUND, SUCCESS_STORIES, ANNOUNCEMENTS
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String id;
        private String content;
        private String authorId;
        private String authorName;
        private LocalDateTime createdAt = LocalDateTime.now();
        private Integer likes = 0;
    }
}
