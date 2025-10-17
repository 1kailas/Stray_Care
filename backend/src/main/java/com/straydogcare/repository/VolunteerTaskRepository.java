package com.straydogcare.repository;

import com.straydogcare.model.VolunteerTask;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VolunteerTaskRepository extends MongoRepository<VolunteerTask, String> {
    List<VolunteerTask> findByVolunteerId(String volunteerId);
    List<VolunteerTask> findByStatus(VolunteerTask.Status status);
    List<VolunteerTask> findByVolunteerIdAndStatus(String volunteerId, VolunteerTask.Status status);
}
