"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Clock, BookCheck } from "lucide-react";

export default function StudentDashboardPage() {
  // Get the current user's data from the authentication hook
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header with personalized welcome message */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {/* We use a fallback in case the user data hasn't loaded yet */}
          Welcome back, {user?.full_name || "Student"}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Here’s a quick overview of your academic status today.
        </p>
      </div>

      {/* Grid for summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder Card for Attendance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
            <BookCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-- %</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Data is being calculated...
            </p>
          </CardContent>
        </Card>

        {/* Placeholder Card for Today's Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Classes Today
            </CardTitle>
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Loading schedule...
            </p>
          </CardContent>
        </Card>

        {/* Placeholder Card for Recent Grades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fetching recent marks...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future components */}
      <div className="pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Your friend's attendance component will go here or in a dedicated attendance page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}