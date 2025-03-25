package com.talentmarketplace.controller;

import com.talentmarketplace.model.InterviewRequest;
import com.talentmarketplace.model.InterviewRequestStatus;
import com.talentmarketplace.service.InterviewRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/interview-requests")
@CrossOrigin(origins = "http://localhost:3000")
public class InterviewRequestController {
    private final InterviewRequestService interviewRequestService;

    @Autowired
    public InterviewRequestController(InterviewRequestService interviewRequestService) {
        this.interviewRequestService = interviewRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestParam Long employerId,
            @RequestParam Long candidateId,
            @RequestParam String message) {
        try {
            InterviewRequest request = interviewRequestService.createRequest(employerId, candidateId, message);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/employer/{employerId}")
    public ResponseEntity<List<InterviewRequest>> getEmployerRequests(@PathVariable Long employerId) {
        return ResponseEntity.ok(interviewRequestService.getEmployerRequests(employerId));
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<InterviewRequest>> getCandidateRequests(@PathVariable Long candidateId) {
        return ResponseEntity.ok(interviewRequestService.getCandidateRequests(candidateId));
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<?> updateRequestStatus(
            @PathVariable Long requestId,
            @RequestParam InterviewRequestStatus status) {
        try {
            InterviewRequest request = interviewRequestService.updateRequestStatus(requestId, status);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long requestId) {
        try {
            interviewRequestService.deleteRequest(requestId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 