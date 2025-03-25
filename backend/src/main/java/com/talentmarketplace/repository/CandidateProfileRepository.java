package com.talentmarketplace.repository;

import com.talentmarketplace.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);
    
    @Query("SELECT cp FROM CandidateProfile cp WHERE cp.isAvailable = true AND " +
           "(:location IS NULL OR cp.location = :location) AND " +
           "(:workType IS NULL OR cp.preferredWorkType = :workType) AND " +
           "(:industry IS NULL OR :industry MEMBER OF cp.preferredIndustries)")
    List<CandidateProfile> findAvailableCandidates(String location, String workType, String industry);
    
    @Query("SELECT cp FROM CandidateProfile cp WHERE cp.isAvailable = true AND " +
           "(:skill IS NULL OR :skill MEMBER OF cp.skills)")
    List<CandidateProfile> findBySkill(String skill);
} 