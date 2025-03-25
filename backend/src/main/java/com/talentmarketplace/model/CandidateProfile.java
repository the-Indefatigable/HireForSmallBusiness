package com.talentmarketplace.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "candidate_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 1000)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "candidate_skills")
    @Column(name = "skill")
    private Set<String> skills = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "candidate_experience")
    @Column(name = "experience")
    private Set<String> experience = new HashSet<>();

    private String location;
    
    private String phoneNumber;
    
    private String linkedInProfile;
    
    private String githubProfile;
    
    @Column(nullable = false)
    private boolean isAvailable = true;
    
    private String expectedSalary;
    
    private String preferredWorkType; // REMOTE, HYBRID, ON_SITE
    
    @ElementCollection
    @CollectionTable(name = "candidate_preferred_industries")
    @Column(name = "industry")
    private Set<String> preferredIndustries = new HashSet<>();
} 