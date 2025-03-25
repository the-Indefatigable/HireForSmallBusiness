package com.talentmarketplace.service;

import com.talentmarketplace.model.InterviewRequest;
import com.talentmarketplace.model.InterviewRequestStatus;
import com.talentmarketplace.model.User;
import com.talentmarketplace.repository.InterviewRequestRepository;
import com.talentmarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class InterviewRequestService {
    private final InterviewRequestRepository interviewRequestRepository;
    private final UserRepository userRepository;

    @Autowired
    public InterviewRequestService(InterviewRequestRepository interviewRequestRepository, UserRepository userRepository) {
        this.interviewRequestRepository = interviewRequestRepository;
        this.userRepository = userRepository;
    }

    public InterviewRequest createRequest(Long employerId, Long candidateId, String message) {
        User employer = userRepository.findById(employerId)
            .orElseThrow(() -> new RuntimeException("Employer not found"));
        User candidate = userRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        InterviewRequest request = new InterviewRequest();
        request.setEmployer(employer);
        request.setCandidate(candidate);
        request.setMessage(message);
        request.setStatus(InterviewRequestStatus.PENDING);
        
        return interviewRequestRepository.save(request);
    }

    public List<InterviewRequest> getEmployerRequests(Long employerId) {
        User employer = userRepository.findById(employerId)
            .orElseThrow(() -> new RuntimeException("Employer not found"));
        return interviewRequestRepository.findByEmployer(employer);
    }

    public List<InterviewRequest> getCandidateRequests(Long candidateId) {
        User candidate = userRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return interviewRequestRepository.findByCandidate(candidate);
    }

    public InterviewRequest updateRequestStatus(Long requestId, InterviewRequestStatus status) {
        InterviewRequest request = interviewRequestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Interview request not found"));
        request.setStatus(status);
        return interviewRequestRepository.save(request);
    }

    public void deleteRequest(Long requestId) {
        interviewRequestRepository.deleteById(requestId);
    }
} 