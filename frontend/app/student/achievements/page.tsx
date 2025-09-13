// /app/dashboard/achievements/page.tsx

"use client";

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Trophy, Briefcase, FlaskConical, Code } from 'lucide-react';

// A helper to pick an icon based on achievement type
const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'hackathon': return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 'internship': return <Briefcase className="h-5 w-5 text-blue-500" />;
    case 'research': return <FlaskConical className="h-5 w-5 text-green-500" />;
    case 'competition': return <Code className="h-5 w-5 text-purple-500" />;
    default: return <Trophy className="h-5 w-5 text-gray-500" />;
  }
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await api.getCollegeAchievements();
      setAchievements(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredAchievements = useMemo(() => {
    return achievements.filter(ach => {
      const matchesType = typeFilter === 'all' || ach.type === typeFilter;
      const matchesBranch = branchFilter === 'all' || ach.studentBranch === branchFilter;
      return matchesType && matchesBranch;
    });
  }, [achievements, typeFilter, branchFilter]);

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">College Hall of Fame</h1>
        <p className="text-muted-foreground">Celebrating the outstanding achievements of our students.</p>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center gap-4 p-4">
          <p className="font-semibold">Filter by:</p>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Achievement Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Hackathon">Hackathon</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Competition">Competition</SelectItem>
              <SelectItem value="Research">Research</SelectItem>
            </SelectContent>
          </Select>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Student Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Achievements List */}
      <div className="space-y-6">
        {isLoading ? (
          <p>Loading achievements...</p>
        ) : filteredAchievements.length > 0 ? (
          filteredAchievements.map(ach => (
            <div key={ach.id} className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {getIconForType(ach.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{ach.studentName} <span className="font-normal text-muted-foreground">- {ach.studentBranch}</span></p>
                  <p className="text-sm text-muted-foreground">{format(new Date(ach.date), 'PPP')}</p>
                </div>
                <h3 className="text-lg font-bold">{ach.title}</h3>
                <p className="text-sm text-muted-foreground">{ach.description}</p>
                <Badge variant="secondary" className="mt-2">{ach.type}</Badge>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-16">No achievements found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}