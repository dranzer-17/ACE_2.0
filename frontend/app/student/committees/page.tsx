"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Calendar, Star, Filter } from "lucide-react";
import Link from "next/link";

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

interface Recommendation {
  committee: Committee;
  position: Position;
  recommendation_score: number;
  recommendation_reason: string;
}

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Mock student skills for demonstration
  const studentSkills = ["leadership", "communication", "programming", "event_planning", "teamwork"];

  useEffect(() => {
    fetchCommittees();
    fetchRecommendations();
  }, []);

  const fetchCommittees = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/committees/");
      const data = await response.json();
      setCommittees(data);
    } catch (error) {
      console.error("Error fetching committees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const skillsParam = studentSkills.join(",");
      const response = await fetch(`http://localhost:8000/api/committees/recommendations/student123?skills=${skillsParam}`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const filteredCommittees = committees.filter(committee => {
    const matchesSearch = committee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         committee.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || committee.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(committees.map(c => c.category)));

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-blue-600 bg-blue-50";
    if (score >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading committees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Committees</h1>
        <p className="text-gray-600">Explore committees and apply for positions that match your skills and interests.</p>
      </div>

      {/* Toggle between committees and recommendations */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <Button
            variant={!showRecommendations ? "default" : "outline"}
            onClick={() => setShowRecommendations(false)}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>All Committees</span>
          </Button>
          <Button
            variant={showRecommendations ? "default" : "outline"}
            onClick={() => setShowRecommendations(true)}
            className="flex items-center space-x-2"
          >
            <Star className="h-4 w-4" />
            <span>Recommended for You</span>
          </Button>
        </div>
      </div>

      {!showRecommendations ? (
        <>
          {/* Search and Filter Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search committees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Committees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommittees.map((committee) => (
              <Card key={committee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{committee.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {committee.category}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {committee.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {committee.positions.length} open position{committee.positions.length !== 1 ? 's' : ''}
                    </div>
                    
                    <div className="space-y-2">
                      {committee.positions.slice(0, 2).map((position) => (
                        <div key={position.id} className="p-2 bg-gray-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{position.title}</span>
                            <Badge variant={position.status === 'open' ? 'default' : 'secondary'}>
                              {position.status}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Deadline: {new Date(position.application_deadline).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                      {committee.positions.length > 2 && (
                        <p className="text-sm text-gray-500">
                          +{committee.positions.length - 2} more position{committee.positions.length - 2 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    <Link href={`/student/committees/${committee.id}`}>
                      <Button className="w-full mt-4">
                        View Details & Apply
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Recommendations View */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Recommended Positions for You</h2>
            <p className="text-gray-600">Based on your skills: {studentSkills.join(", ")}</p>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={`${rec.committee.id}-${rec.position.id}`} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{rec.position.title}</h3>
                      <p className="text-gray-600">{rec.committee.name}</p>
                      <Badge variant="secondary" className="mt-1">
                        {rec.committee.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(rec.recommendation_score)}`}>
                        {rec.recommendation_score.toFixed(0)}% Match
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{rec.position.description}</p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Why this is recommended for you:</h4>
                    <p className="text-blue-800 text-sm">{rec.recommendation_reason}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Deadline: {new Date(rec.position.application_deadline).toLocaleDateString()}
                    </div>
                    <Link href={`/student/committees/${rec.committee.id}?position=${rec.position.id}`}>
                      <Button>Apply Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {filteredCommittees.length === 0 && !showRecommendations && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No committees found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
