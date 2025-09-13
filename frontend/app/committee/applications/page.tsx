"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Eye, Check, X, Clock, Star, Mail, User, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

interface Application {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  committee_id: number;
  position_id: number;
  cover_message: string;
  resume_skills: string[];
  experience: string;
  recommendation_score: number;
  recommendation_reason: string;
  applied_at: string;
  status: string;
}

interface Position {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  skills_required: string[];
  status: string;
  application_deadline: string;
}

interface Committee {
  id: number;
  name: string;
  description: string;
  positions: Position[];
  category: string;
  contact_email: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCommittee, setSelectedCommittee] = useState("all");

  // Mock committee ID - in real app, this would come from auth context
  const currentCommitteeId = 1; // Student Council

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchApplications(),
        fetchCommittees()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/committees/applications/committee/${currentCommitteeId}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchCommittees = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/committees/");
      if (response.ok) {
        const data = await response.json();
        setCommittees(data);
      }
    } catch (error) {
      console.error("Error fetching committees:", error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/committees/applications/${applicationId}/status?status=${newStatus}`, {
        method: "PUT",
      });

      if (response.ok) {
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        toast.success(`Application ${newStatus} successfully`);
        setShowApplicationDialog(false);
      } else {
        toast.error("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const getPositionTitle = (positionId: number) => {
    for (const committee of committees) {
      const position = committee.positions.find(p => p.id === positionId);
      if (position) return position.title;
    }
    return "Unknown Position";
  };

  const getCommitteeName = (committeeId: number) => {
    const committee = committees.find(c => c.id === committeeId);
    return committee ? committee.name : "Unknown Committee";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPositionTitle(app.position_id).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesCommittee = selectedCommittee === "all" || app.committee_id.toString() === selectedCommittee;
    return matchesSearch && matchesStatus && matchesCommittee;
  });

  const groupedApplications = {
    pending: filteredApplications.filter(app => app.status === "pending"),
    under_review: filteredApplications.filter(app => app.status === "under_review"),
    accepted: filteredApplications.filter(app => app.status === "accepted"),
    rejected: filteredApplications.filter(app => app.status === "rejected"),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Committee Applications</h1>
        <p className="text-gray-600">Review and manage applications for committee positions.</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by student name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCommittee} onValueChange={setSelectedCommittee}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by committee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Committees</SelectItem>
            {committees.map(committee => (
              <SelectItem key={committee.id} value={committee.id.toString()}>
                {committee.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Applications Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending ({groupedApplications.pending.length})</span>
          </TabsTrigger>
          <TabsTrigger value="under_review" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Under Review ({groupedApplications.under_review.length})</span>
          </TabsTrigger>
          <TabsTrigger value="accepted" className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Accepted ({groupedApplications.accepted.length})</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center space-x-2">
            <X className="h-4 w-4" />
            <span>Rejected ({groupedApplications.rejected.length})</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedApplications).map(([status, apps]) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="grid gap-4">
              {apps.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{application.student_name}</h3>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {application.student_email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied: {new Date(application.applied_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span><strong>Position:</strong> {getPositionTitle(application.position_id)}</span>
                          <span><strong>Committee:</strong> {getCommitteeName(application.committee_id)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(application.recommendation_score)}`}>
                          {application.recommendation_score.toFixed(0)}% Match
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApplicationDialog(true);
                          }}
                          className="mt-2"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <h4 className="font-medium text-sm mb-1">Cover Message Preview:</h4>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {application.cover_message.length > 150 
                          ? `${application.cover_message.substring(0, 150)}...` 
                          : application.cover_message}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {application.resume_skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.replace("_", " ")}
                          </Badge>
                        ))}
                        {application.resume_skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{application.resume_skills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {application.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateApplicationStatus(application.id, "under_review")}
                          >
                            Review
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => updateApplicationStatus(application.id, "accepted")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => updateApplicationStatus(application.id, "rejected")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {apps.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">No applications with {status.replace("_", " ")} status.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Application Detail Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Detailed view of the application from {selectedApplication?.student_name}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Student Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Name:</strong> {selectedApplication.student_name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedApplication.student_email}
                    </div>
                    <div>
                      <strong>Applied For:</strong> {getPositionTitle(selectedApplication.position_id)}
                    </div>
                    <div>
                      <strong>Committee:</strong> {getCommitteeName(selectedApplication.committee_id)}
                    </div>
                    <div>
                      <strong>Application Date:</strong> {new Date(selectedApplication.applied_at).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Recommendation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`text-3xl font-bold ${getScoreColor(selectedApplication.recommendation_score)}`}>
                      {selectedApplication.recommendation_score.toFixed(0)}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            selectedApplication.recommendation_score >= 80 ? 'bg-green-500' :
                            selectedApplication.recommendation_score >= 60 ? 'bg-blue-500' :
                            selectedApplication.recommendation_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedApplication.recommendation_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{selectedApplication.recommendation_reason}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.resume_skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{selectedApplication.experience}</p>
                </CardContent>
              </Card>

              {/* Cover Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-gray-700">{selectedApplication.cover_message}</p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {selectedApplication.status === "pending" && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => updateApplicationStatus(selectedApplication.id, "under_review")}
                  >
                    Mark Under Review
                  </Button>
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => updateApplicationStatus(selectedApplication.id, "accepted")}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept Application
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => updateApplicationStatus(selectedApplication.id, "rejected")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
