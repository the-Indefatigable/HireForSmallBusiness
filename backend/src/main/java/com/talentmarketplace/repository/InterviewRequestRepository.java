package com.talentmarketplace.repository;

import com.talentmarketplace.model.InterviewRequest;
import com.talentmarketplace.model.InterviewRequestStatus;
import com.talentmarketplace.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewRequestRepository extends JpaRepository<InterviewRequest, Long> {
    List<InterviewRequest> findByEmployer(User employer);
    List<InterviewRequest> findByCandidate(User candidate);
    List<InterviewRequest> findByEmployerAndStatus(User employer, InterviewRequestStatus status);
    List<InterviewRequest> findByCandidateAndStatus(User candidate, InterviewRequestStatus status);
} 