"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        // Get user data from localStorage to determine redirect
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          // Redirect based on user role
          switch (user.role) {
            case 'student':
              router.push('/student/chat');
              break;
            case 'faculty':
              router.push('/faculty/dashboard');
              break;
            case 'admin':
              router.push('/admin/dashboard');
              break;
            case 'committee':
              router.push('/committee/dashboard');
              break;
            default:
              router.push('/student/chat');
          }
        } else {
          router.push('/student/chat');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to ACE 2.0</CardTitle>
          <CardDescription>
            Enter your credentials to access the campus solution platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Demo Credentials:</h3>
            <div className="space-y-2 text-xs">
              <div><strong>Student:</strong> vidhi@college.edu / password123</div>
              <div><strong>Faculty:</strong> teacher@college.edu / teacherpass</div>
              <div><strong>Admin:</strong> admin@college.edu / adminpass</div>
              <div><strong>Committee:</strong> committee@college.edu / committeepass</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}