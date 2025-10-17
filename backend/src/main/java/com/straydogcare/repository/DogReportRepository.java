package com.straydogcare.repository;

import com.straydogcare.model.DogReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DogReportRepository extends MongoRepository<DogReport, String> {
    List<DogReport> findByStatus(DogReport.Status status);
    List<DogReport> findByCondition(DogReport.Condition condition);
    List<DogReport> findByLocation(String location);
    List<DogReport> findByAssignedTo(String assignedTo);
    List<DogReport> findByReportedBy(String reportedBy);
    List<DogReport> findByStatusOrderByPriorityAscCreatedAtDesc(DogReport.Status status);
}
