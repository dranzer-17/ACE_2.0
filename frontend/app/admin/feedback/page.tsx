"use client";
import { useEffect, useState } from "react";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
interface Feedback {
id: number; category: string; subject: string; rating?: number;
comment: string; is_anonymous: boolean; created_at: string;
student: { full_name: string; email: string; } | null;
}
export default function AdminFeedbackPage() {
const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
async function fetchFeedback() {
const result = await apiService.getAdminFeedback();
if (result.success) {
setFeedbackList(result.data);
} else {
toast.error(result.message);
}
setLoading(false);
}
fetchFeedback();
}, []);
if (loading) {
return <p>Loading feedback...</p>;
}
return (
<div className="space-y-6">
<h2 className="text-3xl font-bold">View Feedback</h2>
<Card>
<CardHeader>
<CardTitle>Feedback Submissions</CardTitle>
<CardDescription>Review feedback submitted by students.</CardDescription>
</CardHeader>
<CardContent>
<Table>
<TableHeader>
<TableRow>
<TableHead>Category</TableHead><TableHead>Subject</TableHead>
<TableHead>Rating</TableHead><TableHead>Comment</TableHead>
<TableHead>Submitted By</TableHead><TableHead>Date</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{feedbackList.length === 0 ? (
<TableRow><TableCell colSpan={6} className="text-center">No feedback found.</TableCell></TableRow>
) : (
feedbackList.map((item) => (
<TableRow key={item.id}>
<TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
<TableCell className="font-medium">{item.subject}</TableCell>
<TableCell>{item.rating ? `${item.rating}/5 ★` : "-"}</TableCell>
<TableCell className="max-w-xs truncate">{item.comment}</TableCell>
<TableCell>
{item.is_anonymous || !item.student ? ("Anonymous") : (
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