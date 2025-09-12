// frontend/app/dashboard/student/feedback/page.tsx

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedbackPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Submit Feedback</h2>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>We Value Your Opinion</CardTitle>
          <CardDescription>
            Your feedback helps us improve the campus experience for everyone. 
            You can choose to submit your feedback anonymously.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  );
}