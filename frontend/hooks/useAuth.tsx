"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/app/lib/apiService';
import dummyUsers from '@/data/users.json';

interface User {
  full_name: any;
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'committee';
  student_details?: {
    sap_id: number;
    roll_number: string;
    class_name: string;
    division: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First try to authenticate with the real backend API
      console.log('Attempting backend login...');
      const result = await apiService.login(email, password);
      
      if (result.success && result.user) {
        const user: User = {
          id: result.user.id.toString(),
          name: result.user.full_name,
          full_name: result.user.full_name,
          email: result.user.email,
          role: result.user.role,
          student_details: result.user.student_details || null
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Backend login successful');
        return true;
      }
    } catch (error) {
      console.error('Backend login failed, trying dummy users:', error);
    }

    // Fallback to dummy users if backend is unavailable
    console.log('Attempting dummy user login...');
    const dummyUser = dummyUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (dummyUser) {
      // For student users, try to create them in the backend
      if (dummyUser.role === 'student' && 'sapId' in dummyUser && dummyUser.sapId) {
        try {
          const signupData = {
            full_name: dummyUser.name,
            email: dummyUser.email,
            password: dummyUser.password,
            sap_id: parseInt(dummyUser.sapId.replace('SAP', '')) || 123456,
            roll_number: dummyUser.sapId,
            class_name: `${dummyUser.branch} Year ${dummyUser.year}`,
            division: 'A'
          };
          
          console.log('Attempting to create backend user for dummy student...');
          const signupResult = await apiService.signup(signupData);
          console.log('Signup result:', signupResult);
          if (signupResult.success) {
            console.log('Backend user created successfully');
            // Try to login with the newly created backend user
            const backendLoginResult = await apiService.login(email, password);
            if (backendLoginResult.success && backendLoginResult.user) {
              const user: User = {
                id: backendLoginResult.user.id.toString(),
                name: backendLoginResult.user.full_name,
                full_name: backendLoginResult.user.full_name,
                email: backendLoginResult.user.email,
                role: backendLoginResult.user.role,
                student_details: backendLoginResult.user.student_details || null
              };
              setUser(user);
              localStorage.setItem('user', JSON.stringify(user));
              console.log('Backend login after signup successful');
              return true;
            }
          }
        } catch (error) {
          console.log('Backend user creation failed, continuing with dummy user:', error);
        }
      }

      // Build student details for student users
      let studentDetails = null;
      if (dummyUser.role === 'student' && 'sapId' in dummyUser && dummyUser.sapId) {
        studentDetails = {
          sap_id: parseInt(dummyUser.sapId.replace('SAP', '')) || 0,
          roll_number: dummyUser.sapId,
          class_name: `${dummyUser.branch} Year ${dummyUser.year}`,
          division: 'A'
        };
      }

      const user: User = {
        id: dummyUser.id,
        name: dummyUser.name,
        full_name: dummyUser.name,
        email: dummyUser.email,
        role: dummyUser.role as 'student' | 'faculty' | 'admin' | 'committee',
        student_details: studentDetails
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Dummy user login successful');
      return true;
    }

    console.log('Login failed - no matching credentials');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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