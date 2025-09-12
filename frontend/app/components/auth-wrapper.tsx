'use client';

import { useAuth } from '@/app/lib/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

// Component to handle redirection based on auth status and role
export function AuthRedirector({ children }: { children: ReactNode }) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/']; // Adjust as needed

  useEffect(() => {
    if (loading) return; // Wait until auth state is loaded

    // If not authenticated and trying to access a protected route
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push('/auth/login');
      return;
    }

    // If authenticated and trying to access a public route (like login/register), redirect to dashboard
    if (isAuthenticated && publicPaths.includes(pathname) && pathname !== '/') { // Allow '/' as landing page
      let redirectPath = '/'; // Default fallback

      if (userRole === 'student') redirectPath = '/dashboard/student/timetable';
      else if (userRole === 'faculty') redirectPath = '/dashboard/faculty/attendance';
      else if (userRole === 'committee') redirectPath = '/dashboard/committee/events';
      else if (userRole === 'admin') redirectPath = '/dashboard/admin/timetable';

      if (pathname !== redirectPath) { // Only redirect if not already on the target dashboard
        router.push(redirectPath);
      }
      return;
    }
  }, [isAuthenticated, userRole, loading, pathname, router]);

  // If loading, show a simple loading message
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading authentication...
      </div>
    );
  }

  return <>{children}</>;
}
