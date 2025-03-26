package com.talentmarketplace.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentmarketplace.model.CandidateProfile;
import com.talentmarketplace.model.User;
import com.talentmarketplace.repository.CandidateProfileRepository;
import com.talentmarketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CandidateProfileService {
    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public CandidateProfileService(CandidateProfileRepository candidateProfileRepository, UserRepository userRepository, ObjectMapper objectMapper) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public CandidateProfile createProfile(CandidateProfile profile, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        profile.setUser(user);
        return candidateProfileRepository.save(profile);
    }

    public CandidateProfile findByUserId(Long userId) {
        return candidateProfileRepository.findByUserId(userId)
            .orElse(null);
    }

    public List<CandidateProfile> findAvailableCandidates(String location, String workType, String industry) {
        return candidateProfileRepository.findAvailableCandidates(location, workType, industry);
    }

    public List<CandidateProfile> findBySkill(String skill) {
        return candidateProfileRepository.findBySkill(skill);
    }

    public CandidateProfile updateProfile(Long userId, String profileJson) {
        try {
            CandidateProfile existingProfile = findByUserId(userId);
            if (existingProfile == null) {
                throw new RuntimeException("Profile not found");
            }

            CandidateProfile updatedProfile = objectMapper.readValue(profileJson, CandidateProfile.class);
            
            // Update fields while preserving IDs and file URLs
            existingProfile.setBio(updatedProfile.getBio());
            existingProfile.setSkills(updatedProfile.getSkills());
            existingProfile.setExperience(updatedProfile.getExperience());
            existingProfile.setLocation(updatedProfile.getLocation());
            existingProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
            existingProfile.setLinkedInProfile(updatedProfile.getLinkedInProfile());
            existingProfile.setGithubProfile(updatedProfile.getGithubProfile());
            existingProfile.setExpectedSalary(updatedProfile.getExpectedSalary());
            existingProfile.setPreferredWorkType(updatedProfile.getPreferredWorkType());
            existingProfile.setPreferredIndustries(updatedProfile.getPreferredIndustries());

            return candidateProfileRepository.save(existingProfile);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }

    public void deleteProfile(Long id) {
        candidateProfileRepository.deleteById(id);
    }

    public CandidateProfile save(CandidateProfile profile) {
        return candidateProfileRepository.save(profile);
    }

    public List<CandidateProfile> searchCandidates(String skills, String location, String workType) {
        if (skills != null && !skills.isEmpty()) {
            return candidateProfileRepository.findBySkillsContainingAndLocationContainingAndPreferredWorkType(
                skills, location, workType);
        } else if (location != null && !location.isEmpty()) {
            return candidateProfileRepository.findByLocationContainingAndPreferredWorkType(
                location, workType);
        } else if (workType != null && !workType.isEmpty()) {
            return candidateProfileRepository.findByPreferredWorkType(workType);
        }
        return candidateProfileRepository.findAll();
    }
} 