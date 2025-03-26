'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  photoSize?: number; // Size in bytes
  photoDimensions?: { width: number; height: number };
  skills: string[];
  experience: string;
  bio: string;
  portfolio?: string;
  location: string;
  yearsOfExperience: number;
  availability: 'Immediate' | '2 Weeks' | '1 Month' | '3 Months';
  hourlyRate: number;
  education: string;
  certifications?: string[];
  languages?: string[];
  preferredWorkType: 'Remote' | 'Hybrid' | 'On-site';
}

type SortOption = 'name' | 'experience' | 'rate' | 'availability';

interface InterviewRequest {
  candidateId: string;
  message: string;
  proposedDate?: string;
  proposedRate?: number;
}

// Add these constants at the top of the file
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PHOTO_DIMENSIONS = { width: 1200, height: 1200 };
const PHOTO_QUALITY = 0.8; // 80% quality for compression

// Add this function before the component
const validateAndOptimizePhoto = async (file: File): Promise<{ url: string; size: number; dimensions: { width: number; height: number } }> => {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > MAX_PHOTO_SIZE) {
      reject(new Error(`Photo size must be less than ${MAX_PHOTO_SIZE / (1024 * 1024)}MB`));
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Check dimensions
      if (img.width > MAX_PHOTO_DIMENSIONS.width || img.height > MAX_PHOTO_DIMENSIONS.height) {
        reject(new Error(`Photo dimensions must be less than ${MAX_PHOTO_DIMENSIONS.width}x${MAX_PHOTO_DIMENSIONS.height}px`));
        return;
      }

      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      if (width > height) {
        if (width > MAX_PHOTO_DIMENSIONS.width) {
          height = Math.round((height * MAX_PHOTO_DIMENSIONS.width) / width);
          width = MAX_PHOTO_DIMENSIONS.width;
        }
      } else {
        if (height > MAX_PHOTO_DIMENSIONS.height) {
          width = Math.round((width * MAX_PHOTO_DIMENSIONS.height) / height);
          height = MAX_PHOTO_DIMENSIONS.height;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create image blob'));
            return;
          }
          const url = URL.createObjectURL(blob);
          resolve({
            url,
            size: blob.size,
            dimensions: { width, height }
          });
        },
        file.type,
        PHOTO_QUALITY
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export default function CandidatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [experienceFilter, setExperienceFilter] = useState<number | null>(null);
  const [rateFilter, setRateFilter] = useState<number | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewRequest, setInterviewRequest] = useState<InterviewRequest>({
    candidateId: '',
    message: '',
    proposedDate: '',
    proposedRate: undefined
  });
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Redirect candidates to their profile page
  useEffect(() => {
    if (user?.role === 'CANDIDATE') {
      router.push('/profile');
    }
  }, [user, router]);

  // If user is a candidate, show a message
  if (user?.role === 'CANDIDATE') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              As a candidate, you can only view and edit your own profile. Please visit your profile page to manage your information.
            </p>
            <button
              onClick={() => router.push('/profile')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Mock candidates with diverse skills and experiences
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        experience: '5 years of experience in full-stack development, specializing in scalable web applications and cloud infrastructure.',
        bio: 'Passionate developer with a focus on creating scalable web applications. Led multiple teams in developing enterprise-level solutions.',
        portfolio: 'https://johndoe.dev',
        location: 'San Francisco, CA',
        yearsOfExperience: 5,
        availability: 'Immediate',
        hourlyRate: 120,
        education: 'BS in Computer Science, Stanford University',
        preferredWorkType: 'Remote'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Smith',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis'],
        experience: '3 years of experience in AI and machine learning, working on predictive models and data analysis.',
        bio: 'Data scientist with expertise in machine learning and AI. Developed several successful ML models for business applications.',
        location: 'New York, NY',
        yearsOfExperience: 3,
        availability: '2 Weeks',
        hourlyRate: 90,
        education: 'MS in Data Science, Columbia University',
        preferredWorkType: 'Hybrid'
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Johnson',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
        experience: '7 years of experience in backend development, specializing in microservices architecture.',
        bio: 'Senior backend developer with extensive experience in building scalable microservices. Expert in Java and Spring ecosystem.',
        portfolio: 'https://michaelj.dev',
        location: 'Seattle, WA',
        yearsOfExperience: 7,
        availability: '1 Month',
        hourlyRate: 150,
        education: 'BS in Software Engineering, University of Washington',
        preferredWorkType: 'On-site'
      },
      {
        id: '4',
        firstName: 'Emily',
        lastName: 'Brown',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research'],
        experience: '4 years of experience in UI/UX design, creating intuitive and beautiful user interfaces.',
        bio: 'UI/UX designer passionate about creating user-centered designs. Led design teams for multiple successful products.',
        portfolio: 'https://emilyb.design',
        location: 'Austin, TX',
        yearsOfExperience: 4,
        availability: 'Immediate',
        hourlyRate: 100,
        education: 'BA in Design, Rhode Island School of Design',
        preferredWorkType: 'Remote'
      },
      {
        id: '5',
        firstName: 'David',
        lastName: 'Wilson',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['DevOps', 'Kubernetes', 'CI/CD', 'GitLab'],
        experience: '6 years of experience in DevOps and cloud infrastructure, optimizing deployment pipelines.',
        bio: 'DevOps engineer specializing in cloud infrastructure and automation. Implemented CI/CD pipelines for multiple organizations.',
        location: 'Chicago, IL',
        yearsOfExperience: 6,
        availability: '3 Months',
        hourlyRate: 130,
        education: 'BS in Computer Engineering, Illinois Institute of Technology',
        preferredWorkType: 'Hybrid'
      },
      {
        id: '6',
        firstName: 'Lisa',
        lastName: 'Anderson',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Mobile Development', 'React Native', 'iOS', 'Android'],
        experience: '4 years of experience in mobile app development, creating cross-platform solutions.',
        bio: 'Mobile developer with expertise in React Native. Built and launched multiple successful mobile applications.',
        portfolio: 'https://lisa.dev',
        location: 'Boston, MA',
        yearsOfExperience: 4,
        availability: '2 Weeks',
        hourlyRate: 110,
        education: 'BS in Computer Science, MIT',
        preferredWorkType: 'Remote'
      },
      {
        id: '7',
        firstName: 'Alex',
        lastName: 'Chen',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Vue.js', 'GraphQL', 'MongoDB', 'Redis'],
        experience: '3 years of experience in modern web development, specializing in Vue.js and GraphQL.',
        bio: 'Full-stack developer with expertise in modern JavaScript frameworks. Built scalable applications using Vue.js and GraphQL.',
        location: 'Vancouver, BC',
        yearsOfExperience: 3,
        availability: 'Immediate',
        hourlyRate: 85,
        education: 'BS in Computer Science, University of British Columbia',
        preferredWorkType: 'Hybrid'
      },
      {
        id: '8',
        firstName: 'Rachel',
        lastName: 'Martinez',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Ruby on Rails', 'PostgreSQL', 'REST APIs', 'TDD'],
        experience: '5 years of experience in Ruby on Rails development, building robust web applications.',
        bio: 'Senior Ruby developer with a strong focus on test-driven development. Expert in building scalable Rails applications.',
        portfolio: 'https://rachelm.dev',
        location: 'Denver, CO',
        yearsOfExperience: 5,
        availability: '1 Month',
        hourlyRate: 95,
        education: 'BS in Computer Science, University of Colorado',
        preferredWorkType: 'On-site'
      },
      {
        id: '9',
        firstName: 'James',
        lastName: 'Wilson',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts'],
        experience: '4 years of experience in blockchain development, specializing in DeFi applications and smart contracts.',
        bio: 'Blockchain developer with expertise in building decentralized applications. Led multiple successful DeFi projects.',
        portfolio: 'https://jamesw.dev',
        location: 'San Francisco, CA',
        yearsOfExperience: 4,
        availability: 'Immediate',
        hourlyRate: 140,
        education: 'MS in Computer Science, UC Berkeley',
        certifications: ['Certified Blockchain Developer', 'AWS Certified Solutions Architect'],
        languages: ['English', 'Spanish'],
        preferredWorkType: 'Remote'
      },
      {
        id: '10',
        firstName: 'Sophie',
        lastName: 'Chen',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Game Development', 'Unity', 'C#', '3D Modeling'],
        experience: '5 years of experience in game development, creating engaging mobile and PC games.',
        bio: 'Game developer with a passion for creating immersive experiences. Led development of multiple successful games.',
        portfolio: 'https://sophiec.dev',
        location: 'Los Angeles, CA',
        yearsOfExperience: 5,
        availability: '2 Weeks',
        hourlyRate: 125,
        education: 'BS in Game Development, DigiPen Institute of Technology',
        certifications: ['Unity Certified Developer'],
        languages: ['English', 'Mandarin'],
        preferredWorkType: 'Hybrid'
      },
      {
        id: '11',
        firstName: 'Marcus',
        lastName: 'Thompson',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['Cybersecurity', 'Penetration Testing', 'Network Security', 'Ethical Hacking'],
        experience: '6 years of experience in cybersecurity, protecting enterprise systems and conducting security audits.',
        bio: 'Cybersecurity expert specializing in penetration testing and security consulting. Certified ethical hacker.',
        location: 'Washington, DC',
        yearsOfExperience: 6,
        availability: '1 Month',
        hourlyRate: 160,
        education: 'MS in Cybersecurity, George Washington University',
        certifications: ['CEH', 'CISSP', 'CompTIA Security+'],
        languages: ['English'],
        preferredWorkType: 'On-site'
      },
      {
        id: '12',
        firstName: 'Isabella',
        lastName: 'Rodriguez',
        photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        photoSize: 1024 * 1024, // 1MB
        photoDimensions: { width: 256, height: 256 },
        skills: ['AR/VR Development', 'Unity', 'Unreal Engine', '3D Animation'],
        experience: '3 years of experience in AR/VR development, creating immersive experiences for various platforms.',
        bio: 'AR/VR developer passionate about creating immersive experiences. Expert in Unity and Unreal Engine.',
        portfolio: 'https://isabellar.dev',
        location: 'Miami, FL',
        yearsOfExperience: 3,
        availability: 'Immediate',
        hourlyRate: 95,
        education: 'BS in Computer Science, University of Miami',
        certifications: ['Unity AR/VR Developer'],
        languages: ['English', 'Spanish', 'Portuguese'],
        preferredWorkType: 'Remote'
      }
    ];

    setCandidates(mockCandidates);
    setFilteredCandidates(mockCandidates);

    // Extract unique skills from all candidates
    const skills = Array.from(new Set(mockCandidates.flatMap(c => c.skills)));
    setAllSkills(skills);
  }, []);

  useEffect(() => {
    let filtered = candidates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(candidate => 
        candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(candidate =>
        selectedSkills.every(skill => candidate.skills.includes(skill))
      );
    }

    // Filter by experience
    if (experienceFilter !== null) {
      filtered = filtered.filter(candidate =>
        candidate.yearsOfExperience >= experienceFilter
      );
    }

    // Filter by rate
    if (rateFilter !== null) {
      filtered = filtered.filter(candidate =>
        candidate.hourlyRate <= rateFilter
      );
    }

    // Filter by availability
    if (availabilityFilter) {
      filtered = filtered.filter(candidate =>
        candidate.availability === availabilityFilter
      );
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'experience':
          return b.yearsOfExperience - a.yearsOfExperience;
        case 'rate':
          return a.hourlyRate - b.hourlyRate;
        case 'availability':
          const availabilityOrder = { 'Immediate': 0, '2 Weeks': 1, '1 Month': 2, '3 Months': 3 };
          return availabilityOrder[a.availability] - availabilityOrder[b.availability];
        default:
          return 0;
      }
    });

    setFilteredCandidates(filtered);
  }, [searchTerm, selectedSkills, candidates, sortBy, experienceFilter, rateFilter, availabilityFilter]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleInterviewRequest = async () => {
    if (!selectedCandidate || !user) return;

    setRequestStatus('sending');
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setRequestStatus('success');
      setShowInterviewForm(false);
      setSelectedCandidate(null);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setRequestStatus('idle');
        setInterviewRequest({
          candidateId: '',
          message: '',
          proposedDate: '',
          proposedRate: undefined
        });
      }, 2000);
    } catch (error) {
      setRequestStatus('error');
      setTimeout(() => setRequestStatus('idle'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates by name, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="experience">Experience</option>
                  <option value="rate">Hourly Rate</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Min. Experience:</label>
                <select
                  value={experienceFilter || ''}
                  onChange={(e) => setExperienceFilter(e.target.value ? Number(e.target.value) : null)}
                  className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1">1+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                  <option value="7">7+ years</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Max Rate:</label>
                <select
                  value={rateFilter || ''}
                  onChange={(e) => setRateFilter(e.target.value ? Number(e.target.value) : null)}
                  className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  <option value="50">$50/hr</option>
                  <option value="100">$100/hr</option>
                  <option value="150">$150/hr</option>
                  <option value="200">$200/hr</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Availability:</label>
                <select
                  value={availabilityFilter || ''}
                  onChange={(e) => setAvailabilityFilter(e.target.value || null)}
                  className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Any</option>
                  <option value="Immediate">Immediate</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <motion.button
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredCandidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                variants={item}
                layout
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedCandidate(candidate)}
              >
                <div className="relative h-48 bg-gray-200">
                  {candidate.photo ? (
                    <>
                      <img
                        src={candidate.photo}
                        alt={`${candidate.firstName} ${candidate.lastName}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width={candidate.photoDimensions?.width || 256}
                        height={candidate.photoDimensions?.height || 256}
                      />
                      {candidate.photoSize && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {(candidate.photoSize / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-4xl font-bold text-gray-400">
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <span className="text-sm text-gray-500">{candidate.location}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600 line-clamp-2">
                    {candidate.bio}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <span>{candidate.yearsOfExperience} years of experience</span>
                    <span>${candidate.hourlyRate}/hr</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Available: {candidate.availability}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interview Request Modal */}
      <AnimatePresence>
        {showInterviewForm && selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInterviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Send Interview Request
                </h2>
                <button
                  onClick={() => setShowInterviewForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    value={interviewRequest.message}
                    onChange={(e) => setInterviewRequest(prev => ({ ...prev, message: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                    placeholder="Tell the candidate about your project and why you're interested in interviewing them..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Proposed Interview Date</label>
                  <input
                    type="datetime-local"
                    value={interviewRequest.proposedDate}
                    onChange={(e) => setInterviewRequest(prev => ({ ...prev, proposedDate: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Proposed Rate (Optional)</label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={interviewRequest.proposedRate || ''}
                      onChange={(e) => setInterviewRequest(prev => ({ ...prev, proposedRate: e.target.value ? Number(e.target.value) : undefined }))}
                      className="block w-full pl-7 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInterviewForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInterviewRequest}
                    disabled={requestStatus === 'sending' || !interviewRequest.message}
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      (requestStatus === 'sending' || !interviewRequest.message) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {requestStatus === 'sending' ? 'Sending...' : 'Send Request'}
                  </motion.button>
                </div>

                {requestStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg"
                  >
                    Interview request sent successfully!
                  </motion.div>
                )}

                {requestStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg"
                  >
                    Failed to send interview request. Please try again.
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidate Modal */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </h2>
                    <p className="text-gray-500">{selectedCandidate.location}</p>
                    {selectedCandidate.photoSize && (
                      <p className="text-sm text-gray-500 mt-1">
                        Photo: {(selectedCandidate.photoSize / (1024 * 1024)).toFixed(1)}MB
                        {selectedCandidate.photoDimensions && 
                          ` • ${selectedCandidate.photoDimensions.width}x${selectedCandidate.photoDimensions.height}px`
                        }
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Experience:</span> {selectedCandidate.yearsOfExperience} years
                  </div>
                  <div>
                    <span className="font-medium">Rate:</span> ${selectedCandidate.hourlyRate}/hr
                  </div>
                  <div>
                    <span className="font-medium">Availability:</span> {selectedCandidate.availability}
                  </div>
                  <div>
                    <span className="font-medium">Education:</span> {selectedCandidate.education}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                  <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                    {selectedCandidate.experience}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Bio</h3>
                  <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                    {selectedCandidate.bio}
                  </p>
                </div>

                {selectedCandidate.portfolio && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">Portfolio</h3>
                    <a
                      href={selectedCandidate.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-blue-500 hover:text-blue-600"
                    >
                      {selectedCandidate.portfolio}
                    </a>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Send Interview Request
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 