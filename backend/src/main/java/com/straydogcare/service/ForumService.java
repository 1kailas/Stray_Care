package com.straydogcare.service;

import com.straydogcare.model.ForumPost;
import com.straydogcare.repository.ForumPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForumService {
    
    private final ForumPostRepository forumPostRepository;
    
    public List<ForumPost> getAllPosts() {
        return forumPostRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<ForumPost> getPostsByCategory(ForumPost.Category category) {
        return forumPostRepository.findByCategory(category);
    }
    
    public List<ForumPost> getPinnedPosts() {
        return forumPostRepository.findByPinnedTrue();
    }
    
    public ForumPost getPostById(String id) {
        return forumPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }
    
    public ForumPost createPost(ForumPost post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setLikes(0);
        post.setViews(0);
        post.setPinned(false);
        post.setLocked(false);
        
        return forumPostRepository.save(post);
    }
    
    public ForumPost updatePost(String id, ForumPost post) {
        ForumPost existing = getPostById(id);
        
        if (post.getTitle() != null) existing.setTitle(post.getTitle());
        if (post.getContent() != null) existing.setContent(post.getContent());
        if (post.getCategory() != null) existing.setCategory(post.getCategory());
        if (post.getTags() != null) existing.setTags(post.getTags());
        
        existing.setUpdatedAt(LocalDateTime.now());
        
        return forumPostRepository.save(existing);
    }
    
    public ForumPost addComment(String postId, ForumPost.Comment comment) {
        ForumPost post = getPostById(postId);
        
        if (post.isLocked()) {
            throw new RuntimeException("Post is locked and cannot be commented on");
        }
        
        comment.setId(UUID.randomUUID().toString());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setLikes(0);
        
        post.getComments().add(comment);
        post.setUpdatedAt(LocalDateTime.now());
        
        return forumPostRepository.save(post);
    }
    
    public ForumPost likePost(String postId) {
        ForumPost post = getPostById(postId);
        post.setLikes(post.getLikes() + 1);
        return forumPostRepository.save(post);
    }
    
    public ForumPost incrementViews(String postId) {
        ForumPost post = getPostById(postId);
        post.setViews(post.getViews() + 1);
        return forumPostRepository.save(post);
    }
    
    public ForumPost togglePin(String postId) {
        ForumPost post = getPostById(postId);
        post.setPinned(!post.isPinned());
        return forumPostRepository.save(post);
    }
    
    public ForumPost toggleLock(String postId) {
        ForumPost post = getPostById(postId);
        post.setLocked(!post.isLocked());
        return forumPostRepository.save(post);
    }
    
    public void deletePost(String id) {
        forumPostRepository.deleteById(id);
    }
}
