"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, Star, Clock, CheckCircle, XCircle, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

interface Committee {
  id: number;
  name: string;
  description: string;
  positions: any[];
  category: string;
  contact_email: string;
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock student ID - in real app, this would come from auth context
  const studentId = "student123";

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
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/committees/applications/student/${studentId}`);
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

  const getCommitteeName = (committeeId: number) => {
    const committee = committees.find(c => c.id === committeeId);
    return committee ? committee.name : "Unknown Committee";
  };

  const getPositionTitle = (positionId: number) => {
    for (const committee of committees) {
      const position = committee.positions.find(p => p.id === positionId);
      if (position) return position.title;
    }
    return "Unknown Position";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your application is waiting to be reviewed by the committee.";
      case "under_review":
        return "Your application is currently being reviewed by the committee.";
      case "accepted":
        return "Congratulations! Your application has been accepted.";
      case "rejected":
        return "Unfortunately, your application was not selected this time.";
      default:
        return "Application status unknown.";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/student/committees" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Committees
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your committee position applications.</p>
      </div>

      {/* Applications Summary */}
      {applications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {applications.filter(app => app.status === "under_review").length}
                  </p>
                  <p className="text-sm text-gray-600">Under Review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === "accepted").length}
                  </p>
                  <p className="text-sm text-gray-600">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Applications List */}
      <div className="space-y-6">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">You haven't submitted any committee applications yet.</p>
              <Link href="/student/committees">
                <Button>Browse Committees</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <span>{getPositionTitle(application.position_id)}</span>
                      <Badge className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status.replace("_", " ")}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {getCommitteeName(application.committee_id)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(application.recommendation_score)}`}>
                      {application.recommendation_score.toFixed(0)}% Match
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied: {new Date(application.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Status Message */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{getStatusMessage(application.status)}</p>
                  </div>

                  {/* Recommendation Analysis */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Recommendation Analysis</h4>
                    </div>
                    <p className="text-blue-800 text-sm">{application.recommendation_reason}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Your Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.resume_skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Application Details */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Experience:</h4>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {application.experience.length > 150 
                          ? `${application.experience.substring(0, 150)}...` 
                          : application.experience}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Cover Message:</h4>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {application.cover_message.length > 150 
                          ? `${application.cover_message.substring(0, 150)}...` 
                          : application.cover_message}
                      </p>
                    </div>
                  </div>

                  {/* Action based on status */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Application ID: {application.id.substring(0, 8)}...
                    </div>
                    
                    {application.status === "accepted" && (
                      <Badge className="bg-green-100 text-green-800">
                        🎉 Congratulations! Check your email for next steps.
                      </Badge>
                    )}
                    
                    {application.status === "rejected" && (
                      <div className="text-sm text-gray-600">
                        Don't give up! Consider applying for other positions.
                      </div>
                    )}
                    
                    {(application.status === "pending" || application.status === "under_review") && (
                      <div className="text-sm text-gray-600">
                        We'll notify you when there's an update.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Call to Action */}
      {applications.length > 0 && (
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium mb-2">Want to Apply for More Positions?</h3>
            <p className="text-gray-600 mb-4">
              Explore other committees and find positions that match your skills and interests.
            </p>
            <Link href="/student/committees">
              <Button>Browse More Committees</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
