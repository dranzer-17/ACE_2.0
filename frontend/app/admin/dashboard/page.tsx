"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Admin Control Panel
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Welcome, {user?.full_name || "Admin"}.
        </p>
      </div>
      <Card>
        <CardHeader><CardTitle>Platform Overview</CardTitle></CardHeader>
        <CardContent><p className="text-gray-500">High-level statistics and management controls will be displayed here.</p></CardContent>
      </Card>
    </div>
  );
}