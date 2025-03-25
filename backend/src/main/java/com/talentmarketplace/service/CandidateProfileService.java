package com.talentmarketplace.service;

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

    @Autowired
    public CandidateProfileService(CandidateProfileRepository candidateProfileRepository, UserRepository userRepository) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
    }

    public CandidateProfile createProfile(CandidateProfile profile, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        profile.setUser(user);
        return candidateProfileRepository.save(profile);
    }

    public Optional<CandidateProfile> findByUserId(Long userId) {
        return candidateProfileRepository.findByUserId(userId);
    }

    public List<CandidateProfile> findAvailableCandidates(String location, String workType, String industry) {
        return candidateProfileRepository.findAvailableCandidates(location, workType, industry);
    }

    public List<CandidateProfile> findBySkill(String skill) {
        return candidateProfileRepository.findBySkill(skill);
    }

    public CandidateProfile updateProfile(CandidateProfile profile) {
        if (!candidateProfileRepository.existsById(profile.getId())) {
            throw new RuntimeException("Profile not found");
        }
        return candidateProfileRepository.save(profile);
    }

    public void deleteProfile(Long id) {
        candidateProfileRepository.deleteById(id);
    }
} 