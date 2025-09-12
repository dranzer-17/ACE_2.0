import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming you have shadcn-ui Button
import { BookOpenCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gray-900 rounded-full dark:bg-gray-100">
          <BookOpenCheck className="w-8 h-8 text-white dark:text-gray-900" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-6xl">
          Welcome to StudentHub
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-400">
          Your all-in-one solution for managing campus life, from timetables and events to canteen orders and resource booking.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/auth/login">
              Sign In
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/register">
              Create an Account
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}