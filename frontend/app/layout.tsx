// frontend/app/layout.tsx
import './globals.css'; // Your global styles
import { Inter } from 'next/font/google';
import { ClientAuthProvider } from './components/client-auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ACE 2.0 Campus Platform',
  description: 'Unified Campus Solution Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientAuthProvider>
          {children}
        </ClientAuthProvider>
      </body>
    </html>
  );
}