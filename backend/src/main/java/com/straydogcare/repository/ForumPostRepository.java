package com.straydogcare.repository;

import com.straydogcare.model.ForumPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumPostRepository extends MongoRepository<ForumPost, String> {
    List<ForumPost> findByCategory(ForumPost.Category category);
    List<ForumPost> findByAuthorId(String authorId);
    List<ForumPost> findByPinnedTrue();
    List<ForumPost> findAllByOrderByCreatedAtDesc();
}
