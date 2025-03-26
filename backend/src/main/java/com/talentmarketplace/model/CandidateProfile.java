package com.talentmarketplace.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;
import java.util.List;

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

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection
    @CollectionTable(name = "candidate_skills")
    @Column(name = "skill")
    private List<String> skills;

    @ElementCollection
    @CollectionTable(name = "candidate_experience")
    @Column(name = "experience", columnDefinition = "TEXT")
    private List<String> experience;

    private String location;
    
    private String phoneNumber;
    
    private String linkedInProfile;
    
    private String githubProfile;
    
    @Column(nullable = false)
    private boolean isAvailable = true;
    
    private String expectedSalary;
    
    @Enumerated(EnumType.STRING)
    private WorkType preferredWorkType;
    
    @ElementCollection
    @CollectionTable(name = "candidate_preferred_industries")
    @Column(name = "industry")
    private List<String> preferredIndustries;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "resume_url")
    private String resumeUrl;

    public enum WorkType {
        REMOTE,
        HYBRID,
        ON_SITE
    }
} 