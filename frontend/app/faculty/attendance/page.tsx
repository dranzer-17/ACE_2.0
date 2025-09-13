"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { attendanceApi } from '@/lib/attendanceApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';

interface PendingRequest {
  id: number;
  student_name: string;
  student_email: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  submitted_at: string;
}

export default function FacultyAttendancePage() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const requests = await attendanceApi.getPendingSickLeaveRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (requestId: number, status: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(requestId));
    
    try {
      const result = await attendanceApi.approveSickLeaveRequest(requestId, status);
      
      if (result.success) {
        toast.success(result.message);
        // Remove the processed request from the list
        setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process request');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Approval Portal</h1>
        <p className="text-muted-foreground">Review and approve student sick leave requests.</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pending Sick Leave Requests
              {pendingRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingRequests.length} pending
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Review student sick leave requests and approve or reject them.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading requests...</span>
              </div>
            ) : pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{request.student_name}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            <Clock className="h-3 w-3 mr-1" />
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.student_email}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        Submitted: {format(new Date(request.submitted_at), 'PPp')}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Leave Period</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>From:</strong> {format(new Date(request.start_date), 'PPP')}</p>
                          <p><strong>To:</strong> {format(new Date(request.end_date), 'PPP')}</p>
                          <p><strong>Duration:</strong> {calculateDays(request.start_date, request.end_date)} day(s)</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Reason</h4>
                        <p className="text-sm bg-muted p-3 rounded-md">{request.reason}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleApproval(request.id, 'approved')}
                        disabled={processingIds.has(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingIds.has(request.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleApproval(request.id, 'rejected')}
                        disabled={processingIds.has(request.id)}
                        variant="destructive"
                      >
                        {processingIds.has(request.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  All sick leave requests have been processed. Check back later for new submissions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}