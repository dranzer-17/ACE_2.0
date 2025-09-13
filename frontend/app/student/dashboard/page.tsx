// File: frontend/app/student/dashboard/page.tsx

"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    BookOpen,
    ClipboardList,
    DollarSign,
    Library,
    Clock,
    Home
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

// --- DUMMY JSON DATA for a Student (Replace with API calls later) ---
const studentDashboardData = {
    upcomingClasses: [
        { time: "10:00 AM", course: "Data Structures", room: "CR-G5", type: "Lecture" },
        { time: "11:00 AM", course: "Advanced Algorithms", room: "CR-301", type: "Lecture" },
        { time: "01:00 PM", course: "Database Systems Lab", room: "Lab-404", type: "Practical" },
        { time: "02:00 PM", course: "Operating Systems", room: "CR-G5", type: "Lecture" },
    ],
    assignmentsDue: 3,
    libraryBooksDue: 1,
    canteenBalance: 45.50,
};

// --- Reusable Stat Card Component ---
interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    description?: string;
}

const StatCard = ({ title, value, icon, color, description }: StatCardProps) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className={`h-8 w-8 text-white flex items-center justify-center rounded-full`} style={{ backgroundColor: color }}>
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);


// --- Main Student Dashboard Page Component ---
export default function StudentDashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="p-4 sm:p-8 space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}!
                </h1>
                <p className="text-muted-foreground">
                    Here’s a summary of your day and tasks.
                </p>
            </div>
            
            {/* --- Key Metric Cards --- */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Upcoming Classes" 
                    value={studentDashboardData.upcomingClasses.length} 
                    icon={<Home size={20}/>} 
                    color="#3B82F6" // Blue
                    description="Classes scheduled for today"
                />
                <StatCard 
                    title="Assignments Due" 
                    value={studentDashboardData.assignmentsDue} 
                    icon={<ClipboardList size={20}/>} 
                    color="#F59E0B" // Amber
                    description="Check your pending submissions"
                />
                <StatCard 
                    title="Library Books" 
                    value={studentDashboardData.libraryBooksDue} 
                    icon={<Library size={20}/>} 
                    color="#10B981" // Emerald
                    description="Due for return soon"
                />
                <StatCard 
                    title="Canteen Balance" 
                    value={`$${studentDashboardData.canteenBalance.toFixed(2)}`} 
                    icon={<DollarSign size={20}/>} 
                    color="#EF4444" // Red
                    description="Add funds for your next meal"
                />
            </div>

            {/* --- Main Content Area --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Today's Timetable</CardTitle>
                        <CardDescription>Your schedule for today. Plan your day accordingly.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {studentDashboardData.upcomingClasses.map((item, index) => (
                                <li key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center h-10 w-10 bg-primary/10 text-primary rounded-full font-semibold">
                                            {item.time.split(' ')[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.course}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.room} ({item.type})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-muted-foreground">{item.time}</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Navigate to key sections of the portal.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-3">
                        <Button asChild variant="outline">
                            <Link href="/student/library">
                                <BookOpen className="mr-2 h-4 w-4"/> Browse Library
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                             <Link href="/student/timetable">
                                <Clock className="mr-2 h-4 w-4"/> View Full Timetable
                             </Link>
                        </Button>
                        <Button asChild>
                             <Link href="/student/canteen">
                                Order from Canteen <ArrowRight className="ml-auto h-4 w-4"/>
                             </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}