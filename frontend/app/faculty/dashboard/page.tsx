"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FacultyDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome, {user?.full_name || "Faculty"}!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Here's what's happening with your classes today.
        </p>
      </div>
      <Card>
        <CardHeader><CardTitle>Faculty Dashboard</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">Analytics and course management tools will be displayed here.</p></CardContent>
      </Card>
    </div>
  );
}