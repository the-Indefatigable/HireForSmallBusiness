package com.talentmarketplace.controller;

import com.talentmarketplace.model.CandidateProfile;
import com.talentmarketplace.model.User;
import com.talentmarketplace.model.UserRole;
import com.talentmarketplace.service.CandidateProfileService;
import com.talentmarketplace.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateProfileController {

    @Autowired
    private CandidateProfileService candidateProfileService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> createProfile(@PathVariable Long userId, @RequestBody CandidateProfile profile) {
        try {
            CandidateProfile createdProfile = candidateProfileService.createProfile(profile, userId);
            return ResponseEntity.ok(createdProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        
        // If the current user is a candidate, they can only view their own profile
        if (currentUser.getRole() == UserRole.CANDIDATE && !currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only view your own profile");
        }

        CandidateProfile profile = candidateProfileService.findByUserId(id);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchCandidates(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String workType,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        
        // Only employers can search for candidates
        if (currentUser.getRole() != UserRole.EMPLOYER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Only employers can search for candidates");
        }

        List<CandidateProfile> profiles = candidateProfileService.searchCandidates(skills, location, workType);
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<CandidateProfile>> findBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(candidateProfileService.findBySkill(skill));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestPart("profile") String profileJson,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "resume", required = false) MultipartFile resume,
            Authentication authentication) {
        
        User currentUser = (User) authentication.getPrincipal();
        
        // Only allow users to update their own profile
        if (!currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You can only update your own profile");
        }

        try {
            CandidateProfile profile = candidateProfileService.updateProfile(id, profileJson);
            
            // Handle photo upload
            if (photo != null && !photo.isEmpty()) {
                String photoUrl = fileStorageService.storeFile(photo, "photos");
                profile.setPhotoUrl(photoUrl);
            }
            
            // Handle resume upload
            if (resume != null && !resume.isEmpty()) {
                String resumeUrl = fileStorageService.storeFile(resume, "resumes");
                profile.setResumeUrl(resumeUrl);
            }
            
            profile = candidateProfileService.save(profile);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to update profile: " + e.getMessage());
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