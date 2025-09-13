// /app/dashboard/attendance/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { FileUp, Send, History } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the new leave form
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        const attendanceData = await api.getStudentAttendance(user.id);
        setRecords(attendanceData);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      return toast.error("Please fill all fields for the sick leave request.");
    }
    if (!user) return;

    setIsSubmitting(true);
    const result = await api.submitSickLeave({
      studentId: user.id,
      startDate,
      endDate,
      reason
    });
    
    if (result.success) {
      toast.success(result.message);
      // Refetch the records to show the new pending request
      const updatedRecords = await api.getStudentAttendance(user.id);
      setRecords(updatedRecords);
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Portal</h1>
        <p className="text-muted-foreground">Manage your sick leaves and view attendance history.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileUp className="h-5 w-5" /> Submit Sick Leave</CardTitle>
              <CardDescription>Request leave for medical reasons. Requires faculty approval.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date*</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date*</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason*</Label>
                <Textarea id="reason" placeholder="e.g., Fever and cold" value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proof">Upload Proof (e.g., Medical Certificate)</Label>
                <Input id="proof" type="file" />
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : <><Send className="mr-2 h-4 w-4" /> Submit for Approval</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Submission History</CardTitle>
              <CardDescription>Your past and pending attendance requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <p>Loading history...</p> : records.length > 0 ? (
                <div className="space-y-4">
                  {records.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold">{record.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(record.startDate), 'PPP')} to {format(new Date(record.endDate), 'PPP')}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No submission history found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}