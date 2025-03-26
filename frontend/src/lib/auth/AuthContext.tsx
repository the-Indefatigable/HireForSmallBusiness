'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER';
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy test accounts
const TEST_ACCOUNTS = {
  'candidate@test.com': {
    password: 'test123',
    user: {
      id: '1',
      email: 'candidate@test.com',
      role: 'CANDIDATE' as const,
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  'employer@test.com': {
    password: 'test123',
    user: {
      id: '2',
      email: 'employer@test.com',
      role: 'EMPLOYER' as const,
      firstName: 'Jane',
      lastName: 'Smith'
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored auth token and validate it
    const token = localStorage.getItem('auth_token');
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check for test credentials
      if (email === 'employer@example.com' && password === 'password123') {
        const user: User = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'EMPLOYER'
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/marketplace');
        return;
      }

      if (email === 'candidate@example.com' && password === 'password123') {
        const user: User = {
          id: '2',
          email,
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'CANDIDATE'
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        router.push('/candidate/profile');
        return;
      }

      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // For demo purposes, just create a new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName
      };

      setUser(newUser);
      localStorage.setItem('auth_token', 'dummy-token');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Navigate to marketplace after successful registration
      router.push('/marketplace');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}