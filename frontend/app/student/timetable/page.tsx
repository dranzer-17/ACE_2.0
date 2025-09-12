import { TimetableDisplay } from "@/components/timetable/TimetableDisplay";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TimetableEntry } from "@/app/lib/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Authentication Placeholder ---
// In a real app, you would get this from a session (e.g., using NextAuth.js or Clerk).
// For this example, we assume we have the logged-in user's ID.
const getCurrentUser = async () => {
  // This is a mock. We need a student to test.
  // The signup endpoint from your backend creates users starting with ID 1.
  // Let's assume the first student has ID 3 (after admin and faculty).
  return { id: 3, role: 'student' };
};
// --- End Authentication Placeholder ---

async function getStudentTimetable(userId: number): Promise<TimetableEntry[]> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${API_URL}/timetable/student/${userId}`, {
      cache: 'no-store', // Essential for data that changes frequently
    });

    if (!res.ok) {
      console.error("Failed to fetch timetable:", res.status, await res.text());
      return []; // Return empty array on a failed request
    }
    return await res.json();
  } catch (error) {
    console.error("Network error fetching timetable:", error);
    return []; // Return empty array on a network or parsing error
  }
}

export default async function StudentTimetablePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'student') {
    return <div>Access Denied. You must be logged in as a student to view this page.</div>;
  }

  const timetableEntries = await getStudentTimetable(user.id);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Weekly Timetable</h1>
        <p className="text-muted-foreground">Your personalized class schedule for the week.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
          <CardDescription>
            Any official changes to your schedule will be reflected here immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {timetableEntries.length > 0 ? (
            <TimetableDisplay entries={timetableEntries} />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Schedule Found!</AlertTitle>
              <AlertDescription>
                You have not been enrolled in any courses yet. Please contact the administration if you believe this is an error.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}