"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Calendar, Mail, Users, CheckCircle, Star, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

interface ApplicationForm {
  student_id: string;
  student_name: string;
  student_email: string;
  committee_id: number;
  position_id: number;
  cover_message: string;
  resume_skills: string[];
  experience: string;
}

export default function CommitteeDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const committeeId = parseInt(params.id as string);
  const highlightPositionId = searchParams.get("position");

  const [committee, setCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock student data - in real app, this would come from auth context
  const studentData = {
    id: "student123",
    name: "John Doe",
    email: "john.doe@college.edu",
    skills: ["leadership", "communication", "programming", "event_planning", "teamwork"]
  };

  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    student_id: studentData.id,
    student_name: studentData.name,
    student_email: studentData.email,
    committee_id: committeeId,
    position_id: 0,
    cover_message: "",
    resume_skills: studentData.skills,
    experience: ""
  });

  useEffect(() => {
    fetchCommitteeDetails();
  }, [committeeId]);

  useEffect(() => {
    if (highlightPositionId && committee) {
      const position = committee.positions.find(p => p.id === parseInt(highlightPositionId));
      if (position) {
        setSelectedPosition(position);
        setShowApplicationDialog(true);
      }
    }
  }, [highlightPositionId, committee]);

  const fetchCommitteeDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/committees/${committeeId}`);
      if (response.ok) {
        const data = await response.json();
        setCommittee(data);
      } else {
        toast.error("Committee not found");
      }
    } catch (error) {
      console.error("Error fetching committee details:", error);
      toast.error("Failed to load committee details");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (position: Position) => {
    setSelectedPosition(position);
    setApplicationForm(prev => ({
      ...prev,
      position_id: position.id
    }));
    setShowApplicationDialog(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedPosition) return;

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/committees/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationForm),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Application submitted successfully!");
        setShowApplicationDialog(false);
        
        // Show recommendation score
        setTimeout(() => {
          toast.info(`Recommendation Score: ${result.recommendation_score.toFixed(0)}% - ${result.recommendation_reason}`);
        }, 1000);
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading committee details...</p>
        </div>
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Committee Not Found</h2>
        <Link href="/student/committees">
          <Button>Back to Committees</Button>
        </Link>
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
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{committee.name}</h1>
            <Badge variant="secondary" className="mb-4">
              {committee.category}
            </Badge>
            <p className="text-gray-600 max-w-3xl">{committee.description}</p>
          </div>
        </div>
      </div>

      {/* Committee Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            <strong>Email:</strong> {committee.contact_email}
          </p>
        </CardContent>
      </Card>

      {/* Positions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Available Positions ({committee.positions.length})
        </h2>

        <div className="grid gap-6">
          {committee.positions.map((position) => (
            <Card key={position.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{position.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getStatusColor(position.status)}>
                        {position.status}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Deadline: {new Date(position.application_deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {position.status === "open" && !isDeadlinePassed(position.application_deadline) && (
                    <Button onClick={() => handleApplyClick(position)}>
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-base">
                  {position.description}
                </CardDescription>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {position.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Skills Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.skills_required.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {(position.status !== "open" || isDeadlinePassed(position.application_deadline)) && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {isDeadlinePassed(position.application_deadline) 
                        ? "Application deadline has passed" 
                        : "This position is no longer accepting applications"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedPosition?.title}</DialogTitle>
            <DialogDescription>
              Submit your application for this position in {committee.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Position Summary */}
            {selectedPosition && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{selectedPosition.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{selectedPosition.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Application Deadline: {new Date(selectedPosition.application_deadline).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Application Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student_name">Full Name</Label>
                  <Input
                    id="student_name"
                    value={applicationForm.student_name}
                    onChange={(e) => setApplicationForm(prev => ({...prev, student_name: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="student_email">Email</Label>
                  <Input
                    id="student_email"
                    type="email"
                    value={applicationForm.student_email}
                    onChange={(e) => setApplicationForm(prev => ({...prev, student_email: e.target.value}))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your relevant experience, achievements, and qualifications..."
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm(prev => ({...prev, experience: e.target.value}))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="cover_message">Cover Message</Label>
                <Textarea
                  id="cover_message"
                  placeholder="Why are you interested in this position? What makes you a good fit?"
                  value={applicationForm.cover_message}
                  onChange={(e) => setApplicationForm(prev => ({...prev, cover_message: e.target.value}))}
                  rows={4}
                />
              </div>

              <div>
                <Label>Your Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {applicationForm.resume_skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Skills are automatically detected from your profile. Update your profile to modify skills.
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitApplication} 
                disabled={submitting || !applicationForm.cover_message.trim() || !applicationForm.experience.trim()}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
