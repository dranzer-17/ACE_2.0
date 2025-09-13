"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, Clock, CheckCircle, XCircle, TrendingUp, Calendar, Star } from "lucide-react";
import Link from "next/link";

interface ApplicationStats {
  total: number;
  pending: number;
  under_review: number;
  accepted: number;
  rejected: number;
}

interface RecentApplication {
  id: string;
  student_name: string;
  position_title: string;
  applied_at: string;
  recommendation_score: number;
  status: string;
}

export default function CommitteeDashboard() {
  const [stats, setStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    under_review: 0,
    accepted: 0,
    rejected: 0
  });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock committee data - in real app, this would come from auth context
  const currentCommittee = {
    id: 1,
    name: "Student Council",
    category: "governance"
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications for the committee
      const response = await fetch(`http://localhost:8000/api/committees/applications/committee/${currentCommittee.id}`);
      if (response.ok) {
        const applications = await response.json();
        
        // Calculate stats
        const newStats = {
          total: applications.length,
          pending: applications.filter((app: any) => app.status === "pending").length,
          under_review: applications.filter((app: any) => app.status === "under_review").length,
          accepted: applications.filter((app: any) => app.status === "accepted").length,
          rejected: applications.filter((app: any) => app.status === "rejected").length,
        };
        setStats(newStats);

        // Get recent applications (last 5)
        const recent = applications
          .sort((a: any, b: any) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
          .slice(0, 5)
          .map((app: any) => ({
            id: app.id,
            student_name: app.student_name,
            position_title: getPositionTitle(app.position_id),
            applied_at: app.applied_at,
            recommendation_score: app.recommendation_score,
            status: app.status
          }));
        setRecentApplications(recent);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionTitle = (positionId: number) => {
    // Mock position titles - in real app, this would be fetched from API
    const positions: { [key: number]: string } = {
      1: "President",
      2: "Vice President", 
      3: "Secretary",
      4: "Technical Head",
      5: "Workshop Coordinator"
    };
    return positions[positionId] || "Unknown Position";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentCommittee.name} Dashboard</h1>
        <p className="text-gray-600">Overview of applications and committee activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Not selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Applications
              </span>
              <Link href="/committee/applications">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
            <CardDescription>Latest applications submitted to your committee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{application.student_name}</span>
                      <Badge className={getStatusColor(application.status)} variant="secondary">
                        {application.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Applied for: {application.position_title}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(application.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getScoreColor(application.recommendation_score)}`}>
                      {application.recommendation_score.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">match</div>
                  </div>
                </div>
              ))}
              
              {recentApplications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No applications yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/committee/applications" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Applications ({stats.pending} pending)
                </Button>
              </Link>
              
              <Link href="/committee/events" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Events
                </Button>
              </Link>
              
              <Link href="/committee/analytics" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              
              <Link href="/committee/members" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Application Insights */}
      {stats.total > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Application Insights
            </CardTitle>
            <CardDescription>Key metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {((stats.accepted / stats.total) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Acceptance Rate</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending + stats.under_review}
                </div>
                <p className="text-sm text-gray-600">Applications in Pipeline</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {recentApplications.length > 0 
                    ? (recentApplications.reduce((sum, app) => sum + app.recommendation_score, 0) / recentApplications.length).toFixed(0)
                    : 0}%
                </div>
                <p className="text-sm text-gray-600">Avg. Match Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
