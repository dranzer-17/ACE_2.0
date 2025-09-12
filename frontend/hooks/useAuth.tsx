"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// --- 1. Define the Types ---
// This defines the shape of our user object, matching the backend's UserResponse
interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | string; // Use string as fallback
  student_details?: {
    sap_id: number;
    roll_number: string;
    class_name: string;
    division: string;
  };
}

// This defines the values that our AuthContext will provide
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// --- 2. Create the Context ---
// We create a context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Create the Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // On initial load, check if user data exists in localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    }
  }, []);

  const login = (userData: User) => {
    // Save user data to state and localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // --- Role-Based Redirection ---
    // This is the key logic that sends users to the correct dashboard
    switch (userData.role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'faculty':
        router.push('/faculty/dashboard');
        break;
      case 'student':
        router.push('/student/dashboard');
        break;
      default:
        // Fallback to a generic home page if role is unrecognized
        router.push('/');
        break;
    }
  };

  const logout = () => {
    // Clear user data from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to the login page
    router.push('/auth/login');
  };

  const value = {
    user,
    isAuthenticated: !!user, // isAuthenticated is true if user is not null
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 4. Create the Custom Hook ---
// This hook provides a simple way for components to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};