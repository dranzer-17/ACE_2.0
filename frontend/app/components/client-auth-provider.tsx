'use client';

import { AuthProvider } from '@/app/lib/hooks/use-auth';
import { AuthRedirector } from './auth-wrapper';
import { ReactNode } from 'react';

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthRedirector>{children}</AuthRedirector>
    </AuthProvider>
  );
}
