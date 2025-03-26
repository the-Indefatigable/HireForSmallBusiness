'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  skills: string[];
  experience: string[];
  bio: string;
  location: string;
  yearsOfExperience: number;
  hourlyRate: number;
  availability: 'Full-time' | 'Part-time' | 'Contract';
  photo: string;
  preferredWorkType: 'Remote' | 'Hybrid' | 'On-site';
  preferredRoles: string[];
  socialMedia?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  portfolio?: {
    website?: string;
    projects?: Array<{
      title: string;
      description: string;
      link?: string;
      technologies: string[];
    }>;
  };
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: string;
  }>;
  resume?: {
    filename: string;
    url: string;
    uploadedAt: string;
  };
}

interface InterviewRequest {
  message: string;
  date: string;
  rate?: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

const DUMMY_CANDIDATES: Candidate[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    experience: [
      'Senior Frontend Developer at Tech Corp',
      'Full Stack Developer at StartupX'
    ],
    bio: 'Experienced full-stack developer with a passion for building scalable web applications...',
    location: 'San Francisco, CA',
    yearsOfExperience: 5,
    hourlyRate: 75,
    availability: 'Full-time',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    preferredWorkType: 'Remote',
    preferredRoles: ['Senior Frontend Developer', 'Full Stack Developer', 'Technical Lead']
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Smith',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
    experience: [
      'Senior UI/UX Designer at Design Studio',
      'Product Designer at Tech Startup'
    ],
    bio: 'Creative designer focused on creating beautiful and intuitive user experiences',
    location: 'New York, NY',
    yearsOfExperience: 3,
    hourlyRate: 65,
    availability: 'Part-time',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    preferredWorkType: 'Hybrid',
    preferredRoles: ['UI/UX Designer', 'Product Designer', 'Design Lead']
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    skills: ['Python', 'Data Analysis', 'Machine Learning', 'SQL'],
    experience: [
      'Data Scientist at AI Company',
      'Data Analyst at Analytics Firm'
    ],
    bio: 'Data scientist with expertise in machine learning and predictive analytics',
    location: 'Austin, TX',
    yearsOfExperience: 4,
    hourlyRate: 85,
    availability: 'Full-time',
    photo: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    preferredWorkType: 'Remote',
    preferredRoles: ['Data Scientist', 'Machine Learning Engineer', 'Data Science Lead']
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    skills: ['Content Writing', 'SEO', 'Social Media', 'Marketing'],
    experience: [
      'Content Marketing Manager at Digital Agency',
      'Content Writer at Tech Blog'
    ],
    bio: 'Experienced content writer and digital marketing specialist',
    location: 'Remote',
    yearsOfExperience: 3,
    hourlyRate: 55,
    availability: 'Part-time',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    preferredWorkType: 'Remote',
    preferredRoles: ['Content Writer', 'Content Marketing Manager', 'Digital Marketing Specialist']
  }
];

const CandidateCard = React.memo(({ 
  candidate, 
  onSelect 
}: { 
  candidate: Candidate; 
  onSelect: (candidate: Candidate) => void;
}) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={() => onSelect(candidate)}
    >
      <div className="relative h-48">
        <Image
          src={candidate.photo}
          alt={`${candidate.firstName} ${candidate.lastName}`}
          width={400}
          height={200}
          className="w-full h-full object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbA=="
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-800">
          ${candidate.hourlyRate}/hr
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {candidate.firstName} {candidate.lastName}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{candidate.location}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {candidate.preferredRoles?.slice(0, 2).map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {role}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {skill}
            </span>
          ))}
          {candidate.skills.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              +{candidate.skills.length - 3} more
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{candidate.bio}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {candidate.yearsOfExperience} years experience
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(candidate);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
});

CandidateCard.displayName = 'CandidateCard';

export default function Marketplace() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<'experience' | 'rate' | 'availability'>('experience');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [interviewRequest, setInterviewRequest] = useState<InterviewRequest>({
    message: '',
    date: '',
    rate: undefined
  });
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    minExperience: '',
    maxRate: '',
    workType: '' as 'Remote' | 'Hybrid' | 'On-site' | '',
    availability: ''
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Extract unique locations from DUMMY_CANDIDATES
  const locations = useMemo(() => {
    const uniqueLocations = new Set(DUMMY_CANDIDATES.map(candidate => candidate.location));
    return Array.from(uniqueLocations);
  }, []);

  // Filter candidates based on search term, location, and skills
  const filteredCandidates = useMemo(() => {
    return DUMMY_CANDIDATES.filter(candidate => {
      const matchesSearch = searchTerm === '' ||
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation = selectedLocation === '' || candidate.location === selectedLocation;
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.every(skill => candidate.skills.includes(skill));

      return matchesSearch && matchesLocation && matchesSkills;
    });
  }, [searchTerm, selectedLocation, selectedSkills]);

  // Sort candidates
  const sortedCandidates = useMemo(() => {
    return [...filteredCandidates].sort((a, b) => {
      switch (sortBy) {
        case 'experience':
          return b.yearsOfExperience - a.yearsOfExperience;
        case 'rate':
          return b.hourlyRate - a.hourlyRate;
        case 'availability':
          // Sort by availability type
          const availabilityOrder = { 'Full-time': 0, 'Part-time': 1, 'Contract': 2 };
          return availabilityOrder[a.availability] - availabilityOrder[b.availability];
        default:
          return 0;
      }
    });
  }, [filteredCandidates, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedCandidates.length / ITEMS_PER_PAGE);
  const paginatedCandidates = sortedCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation, selectedSkills, sortBy]);

  const handleInterviewRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStatus('sending');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setRequestStatus('success');
    setTimeout(() => {
      setSelectedCandidate(null);
      setRequestStatus('idle');
      setInterviewRequest({ message: '', date: '', rate: undefined });
    }, 2000);
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
    setTypingTimeout(timeout);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCandidate || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      content: newMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setChatMessages([...chatMessages, message]);
    setNewMessage('');
    setIsTyping(false);

    // Simulate message delivery and read status
    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }, 2000);
  };

  const handleResumeUpload = (file: File) => {
    // Reset error state
    setResumeError('');
    
    // Check file type
    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are allowed');
      return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setResumeError('File size must be less than 5MB');
      return;
    }
    
    // Check for potential security issues
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      setResumeError('Invalid file name');
      return;
    }
    
    setResumeFile(file);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Talent Marketplace</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.firstName}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="space-y-4">
            {/* Main Search with Dropdown */}
            <div className="relative" ref={searchRef}>
              <div className="flex items-center">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search candidates..."
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSkills([]);
                    setSelectedLocation('');
                    setSearchFilters({
                      minExperience: '',
                      maxRate: '',
                      workType: '',
                      availability: ''
                    });
                  }}
                  className="ml-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              </div>

              {/* Search Options Dropdown */}
              {isSearchOpen && (
                <div className="absolute z-50 mt-1 w-full bg-black/70 backdrop-blur-md rounded-md shadow-lg border border-gray-700/50">
                  <div className="p-4 space-y-4">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Location</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full rounded-md bg-black/50 border-gray-700/50 text-white/90 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">All Locations</option>
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Skills Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Skills</label>
                      <select
                        multiple
                        value={selectedSkills}
                        onChange={(e) => {
                          const values = Array.from(e.target.selectedOptions, option => option.value);
                          setSelectedSkills(values);
                        }}
                        className="w-full rounded-md bg-black/50 border-gray-700/50 text-white/90 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {Array.from(new Set(DUMMY_CANDIDATES.flatMap(c => c.skills))).map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>

                    {/* Experience Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Experience (years)</label>
                      <input
                        type="number"
                        value={searchFilters.minExperience}
                        onChange={(e) => setSearchFilters({ ...searchFilters, minExperience: e.target.value })}
                        className="w-full rounded-md bg-black/50 border-gray-700/50 text-white/90 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Minimum years"
                      />
                    </div>

                    {/* Rate Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Hourly Rate ($)</label>
                      <input
                        type="number"
                        value={searchFilters.maxRate}
                        onChange={(e) => setSearchFilters({ ...searchFilters, maxRate: e.target.value })}
                        className="w-full rounded-md bg-black/50 border-gray-700/50 text-white/90 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Maximum rate"
                      />
                    </div>

                    {/* Work Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Work Type</label>
                      <select
                        value={searchFilters.workType}
                        onChange={(e) => setSearchFilters({ ...searchFilters, workType: e.target.value as any })}
                        className="w-full rounded-md bg-black/50 border-gray-700/50 text-white/90 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">All Types</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">Availability</label>
                      <select
                        value={searchFilters.availability}
                        onChange={(e) => setSearchFilters({ ...searchFilters, availability: e.target.value })}
                        className="w-full rounded-md bg-black/50 border-gray-700/50 text-white/90 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">All</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected Filters Display */}
            <div className="flex flex-wrap gap-4">
              {selectedLocation && (
                <div className="flex items-center bg-blue-100 rounded-full px-3 py-1">
                  <span className="text-sm text-blue-800">{selectedLocation}</span>
                  <button
                    onClick={() => setSelectedLocation('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              )}
              {selectedSkills.map(skill => (
                <div key={skill} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm text-gray-800">{skill}</span>
                  <button
                    onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Found {filteredCandidates.length} candidates matching your criteria
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSelect={setSelectedCandidate}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCandidate.firstName} {selectedCandidate.lastName}
                </h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'details'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'chat'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chat
                </button>
              </div>

              {activeTab === 'details' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                      <img
                        className="w-full h-48 object-cover rounded-lg"
                        src={selectedCandidate.photo}
                        alt={`${selectedCandidate.firstName} ${selectedCandidate.lastName}`}
                      />
                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900">About</h3>
                        <p className="mt-2 text-gray-600">{selectedCandidate.bio}</p>
                      </div>

                      {/* Social Media Links */}
                      {selectedCandidate.socialMedia && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium text-gray-900">Connect</h3>
                          <div className="mt-2 flex space-x-4">
                            {selectedCandidate.socialMedia.linkedin && (
                              <a
                                href={selectedCandidate.socialMedia.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                LinkedIn
                              </a>
                            )}
                            {selectedCandidate.socialMedia.github && (
                              <a
                                href={selectedCandidate.socialMedia.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                GitHub
                              </a>
                            )}
                            {selectedCandidate.socialMedia.twitter && (
                              <a
                                href={selectedCandidate.socialMedia.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-600"
                              >
                                Twitter
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div>
                      <div className="space-y-4">
                        {/* Details Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Details</h3>
                          <dl className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Location</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedCandidate.location}</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Experience</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedCandidate.yearsOfExperience} years</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Rate</dt>
                              <dd className="mt-1 text-sm text-gray-900">${selectedCandidate.hourlyRate}/hr</dd>
                            </div>
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Availability</dt>
                              <dd className="mt-1 text-sm text-gray-900">{selectedCandidate.availability}</dd>
                            </div>
                            {selectedCandidate.preferredWorkType && (
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Work Type</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedCandidate.preferredWorkType}</dd>
                              </div>
                            )}
                          </dl>
                        </div>

                        {/* Skills Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedCandidate.skills.map(skill => (
                              <span
                                key={skill}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Portfolio Section */}
                        {selectedCandidate.portfolio && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Portfolio</h3>
                            {selectedCandidate.portfolio.website && (
                              <a
                                href={selectedCandidate.portfolio.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 text-blue-600 hover:text-blue-800"
                              >
                                Visit Website →
                              </a>
                            )}
                            {selectedCandidate.portfolio.projects && (
                              <div className="mt-4 space-y-4">
                                {selectedCandidate.portfolio.projects.map((project, index) => (
                                  <div key={index} className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                                    <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                                    {project.link && (
                                      <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                      >
                                        View Project →
                                      </a>
                                    )}
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {project.technologies.map(tech => (
                                        <span
                                          key={tech}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Education Section */}
                        {selectedCandidate.education && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Education</h3>
                            <ul className="mt-2 space-y-1">
                              {selectedCandidate.education.map((edu, index) => (
                                <li key={index} className="text-sm text-gray-600">{edu.degree} at {edu.institution} ({edu.year})</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Certifications Section */}
                        {selectedCandidate.certifications && (
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                            <ul className="mt-2 space-y-1">
                              {selectedCandidate.certifications.map((cert, index) => (
                                <li key={index} className="text-sm text-gray-600">{cert.name} ({cert.issuer}, {cert.year})</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Add Resume Upload Section */}
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
                          {selectedCandidate.resume ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.resume.filename}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded on {new Date(selectedCandidate.resume.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <a
                                href={selectedCandidate.resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                              >
                                View Resume
                              </a>
                            </div>
                          ) : (
                            // Only show upload option if the user is a candidate viewing their own profile
                            user?.role === 'CANDIDATE' && user.id === selectedCandidate.id ? (
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                  Upload Resume (PDF only, max 5MB)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                  <div className="space-y-1 text-center">
                                    <svg
                                      className="mx-auto h-12 w-12 text-gray-400"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 48 48"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                      <label
                                        htmlFor="resume-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id="resume-upload"
                                          name="resume-upload"
                                          type="file"
                                          className="sr-only"
                                          accept=".pdf"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleResumeUpload(file);
                                          }}
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PDF up to 5MB</p>
                                  </div>
                                </div>
                                {resumeError && (
                                  <p className="mt-2 text-sm text-red-600">{resumeError}</p>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No resume uploaded yet.</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Section */
                <div className="flex flex-col h-[60vh]">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.senderId === user.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-75">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                            {message.senderId === user.id && (
                              <div className="flex items-center space-x-1 ml-2">
                                {message.status === 'sent' && (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                  </svg>
                                )}
                                {message.status === 'delivered' && (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                                {message.status === 'read' && (
                                  <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

              {/* Interview Request Form */}
              {activeTab === 'details' && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Send Interview Request</h3>
                  {requestStatus === 'success' ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-md">
                      Interview request sent successfully!
                    </div>
                  ) : (
                    <form onSubmit={handleInterviewRequest} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          value={interviewRequest.message}
                          onChange={(e) => setInterviewRequest({ ...interviewRequest, message: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                          placeholder="Tell us about your project and requirements..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Proposed Interview Date</label>
                        <input
                          type="datetime-local"
                          value={interviewRequest.date}
                          onChange={(e) => setInterviewRequest({ ...interviewRequest, date: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Proposed Rate (optional)</label>
                        <input
                          type="number"
                          value={interviewRequest.rate || ''}
                          onChange={(e) => setInterviewRequest({ ...interviewRequest, rate: e.target.value ? Number(e.target.value) : undefined })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter hourly rate"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={requestStatus === 'sending'}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {requestStatus === 'sending' ? 'Sending...' : 'Send Request'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 