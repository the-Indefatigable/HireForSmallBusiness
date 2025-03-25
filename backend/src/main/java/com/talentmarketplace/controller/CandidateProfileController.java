package com.talentmarketplace.controller;

import com.talentmarketplace.model.CandidateProfile;
import com.talentmarketplace.service.CandidateProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "http://localhost:3000")
public class CandidateProfileController {
    private final CandidateProfileService candidateProfileService;

    @Autowired
    public CandidateProfileController(CandidateProfileService candidateProfileService) {
        this.candidateProfileService = candidateProfileService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> createProfile(@PathVariable Long userId, @RequestBody CandidateProfile profile) {
        try {
            CandidateProfile createdProfile = candidateProfileService.createProfile(profile, userId);
            return ResponseEntity.ok(createdProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        return candidateProfileService.findByUserId(userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CandidateProfile>> searchCandidates(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workType,
            @RequestParam(required = false) String industry) {
        return ResponseEntity.ok(candidateProfileService.findAvailableCandidates(location, workType, industry));
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<CandidateProfile>> findBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(candidateProfileService.findBySkill(skill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody CandidateProfile profile) {
        try {
            profile.setId(id);
            CandidateProfile updatedProfile = candidateProfileService.updateProfile(profile);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProfile(@PathVariable Long id) {
        try {
            candidateProfileService.deleteProfile(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 