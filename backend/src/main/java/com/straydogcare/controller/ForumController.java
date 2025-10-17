package com.straydogcare.controller;

import com.straydogcare.dto.ApiResponse;
import com.straydogcare.model.ForumPost;
import com.straydogcare.service.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {
    
    private final ForumService forumService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ForumPost>>> getAllPosts(
            @RequestParam(required = false) String category
    ) {
        List<ForumPost> posts;
        
        if (category != null) {
            posts = forumService.getPostsByCategory(ForumPost.Category.valueOf(category.toUpperCase()));
        } else {
            posts = forumService.getAllPosts();
        }
        
        return ResponseEntity.ok(ApiResponse.success(posts));
    }
    
    @GetMapping("/pinned")
    public ResponseEntity<ApiResponse<List<ForumPost>>> getPinnedPosts() {
        List<ForumPost> posts = forumService.getPinnedPosts();
        return ResponseEntity.ok(ApiResponse.success(posts));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ForumPost>> getPostById(@PathVariable String id) {
        ForumPost post = forumService.getPostById(id);
        forumService.incrementViews(id);
        return ResponseEntity.ok(ApiResponse.success(post));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ForumPost>> createPost(
            @RequestBody ForumPost post,
            Authentication authentication
    ) {
        // Set author information from authenticated user
        if (authentication != null) {
            post.setAuthorId(authentication.getName());
        }
        
        ForumPost created = forumService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created successfully", created));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ForumPost>> updatePost(
            @PathVariable String id,
            @RequestBody ForumPost post
    ) {
        ForumPost updated = forumService.updatePost(id, post);
        return ResponseEntity.ok(ApiResponse.success("Post updated successfully", updated));
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<ForumPost>> addComment(
            @PathVariable String id,
            @RequestBody ForumPost.Comment comment,
            Authentication authentication
    ) {
        // Set comment author from authenticated user
        if (authentication != null) {
            comment.setAuthorId(authentication.getName());
        }
        
        ForumPost updated = forumService.addComment(id, comment);
        return ResponseEntity.ok(ApiResponse.success("Comment added successfully", updated));
    }
    
    @PatchMapping("/{id}/like")
    public ResponseEntity<ApiResponse<ForumPost>> likePost(@PathVariable String id) {
        ForumPost updated = forumService.likePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post liked", updated));
    }
    
    @PatchMapping("/{id}/pin")
    public ResponseEntity<ApiResponse<ForumPost>> togglePin(@PathVariable String id) {
        ForumPost updated = forumService.togglePin(id);
        return ResponseEntity.ok(ApiResponse.success("Post pin toggled", updated));
    }
    
    @PatchMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<ForumPost>> toggleLock(@PathVariable String id) {
        ForumPost updated = forumService.toggleLock(id);
        return ResponseEntity.ok(ApiResponse.success("Post lock toggled", updated));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        forumService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted successfully", null));
    }
}
