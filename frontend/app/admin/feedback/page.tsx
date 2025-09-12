"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Define the type for our feedback data
interface Feedback {
  id: number;
  category: string;
  subject: string;
  rating?: number;
  comment: string;
  is_anonymous: boolean;
  created_at: string;
  student: {
    full_name: string;
    email: string;
  } | null;
}

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch('http://localhost:8000/api/admin/feedback/', {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header when auth is implemented
            // "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback data');
        }

        const data = await response.json();
        setFeedbackList(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load feedback data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-center">
          <p>Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">View Feedback</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
          <CardDescription>Review feedback submitted by students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No feedback submissions found.
                  </TableCell>
                </TableRow>
              ) : (
                feedbackList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>
                      {item.rating ? (
                        <div className="flex items-center">
                          <span>{item.rating}/5</span>
                          <span className="ml-1 text-yellow-500">★</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-md truncate">{item.comment}</TableCell>
                    <TableCell>
                      {item.is_anonymous || !item.student ? (
                        <span className="text-muted-foreground">Anonymous</span>
                      ) : (
                        <div>
                          <p>{item.student.full_name}</p>
                          <p className="text-xs text-muted-foreground">{item.student.email}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
