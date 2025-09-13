// File: frontend/app/student/dashboard/page.tsx (or a central /dashboard/page.tsx)

"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
    Activity,
    ArrowRight,
    BookOpen,
    ClipboardList,
    DollarSign,
    GraduationCap,
    Home,
    Library,
    ListChecks,
    Users
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

// --- DUMMY JSON DATA (Replace with API calls) ---

const studentDashboardData = {
    upcomingClasses: [
        { time: "10:00 AM", course: "Data Structures", room: "CR-G5" },
        { time: "11:00 AM", course: "Advanced Algorithms", room: "CR-301" },
        { time: "01:00 PM", course: "Database Systems Lab", room: "Lab-404" },
    ],
    assignmentsDue: 3,
    libraryBooksDue: 1,
    canteenBalance: 45.50,
};

const facultyDashboardData = {
    schedule: [
        { time: "09:00 AM", course: "Intro to AI", room: "CR-G1" },
        { time: "11:00 AM", course: "Advanced Algorithms", room: "CR-301" },
    ],
    ungradedSubmissions: 12,
    totalStudents: 85,
    coursesTaught: 4,
};

const adminDashboardData = {
    totalStudents: 1250,
    totalFaculty: 75,
    booksInLibrary: 8932,
    canteenRevenue: 1234.56,
    enrollmentByDept: [
        { name: 'Comp Sci', students: 450 },
        { name: 'Mech Eng', students: 280 },
        { name: 'Electronics', students: 220 },
        { name: 'IT', students: 300 },
    ],
    recentActivity: [
        { action: "New student registered", user: "Riya Sharma" },
        { action: "Course added", user: "Admin" },
        { action: "Library book overdue", user: "Karan Singh" },
    ]
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

// --- Student Dashboard ---
const StudentDashboard = ({ user }: { user: any }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}!</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Upcoming Classes" value={studentDashboardData.upcomingClasses.length} icon={<Home size={20}/>} color="#3B82F6" description="Classes scheduled for today"/>
                <StatCard title="Assignments Due" value={studentDashboardData.assignmentsDue} icon={<ClipboardList size={20}/>} color="#F59E0B" description="Check your submissions"/>
                <StatCard title="Library Books" value={studentDashboardData.libraryBooksDue} icon={<Library size={20}/>} color="#10B981" description="Due for return soon"/>
                <StatCard title="Canteen Balance" value={`$${studentDashboardData.canteenBalance.toFixed(2)}`} icon={<DollarSign size={20}/>} color="#EF4444" description="Add funds for your next meal"/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Today's Timetable</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {studentDashboardData.upcomingClasses.map((c, i) => (
                                <li key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                    <div className="font-medium">{c.time} - {c.course}</div>
                                    <div className="text-sm text-muted-foreground">Room: {c.room}</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-3">
                        <Button asChild variant="outline">
                            <Link href="/student/library"><BookOpen className="mr-2 h-4 w-4"/> Browse Library</Link>
                        </Button>
                        <Button asChild variant="outline">
                             <Link href="/student/timetable"><ClipboardList className="mr-2 h-4 w-4"/> View Full Timetable</Link>
                        </Button>
                        <Button asChild>
                             <Link href="/student/canteen">Order from Canteen <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- Faculty Dashboard ---
const FacultyDashboard = ({ user }: { user: any }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Welcome, {user?.full_name || 'Professor'}!</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Classes Today" value={facultyDashboardData.schedule.length} icon={<Home size={20}/>} color="#8B5CF6" />
                <StatCard title="Ungraded Submissions" value={facultyDashboardData.ungradedSubmissions} icon={<ListChecks size={20}/>} color="#F59E0B" />
                <StatCard title="Total Students" value={facultyDashboardData.totalStudents} icon={<Users size={20}/>} color="#3B82F6" />
                <StatCard title="Courses Taught" value={facultyDashboardData.coursesTaught} icon={<BookOpen size={20}/>} color="#10B981" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-4">
                            {facultyDashboardData.schedule.map((c, i) => (
                                <li key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                    <div className="font-medium">{c.time} - {c.course}</div>
                                    <div className="text-sm text-muted-foreground">Room: {c.room}</div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                     <CardContent className="flex flex-col space-y-3">
                        <Button asChild variant="outline">
                            <Link href="/faculty/courses">Manage Courses</Link>
                        </Button>
                        <Button asChild>
                             <Link href="/faculty/grading">Enter Grades <ArrowRight className="ml-2 h-4 w-4"/></Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- Admin Dashboard ---
const AdminDashboard = () => {
    return (
         <div className="space-y-6">
            <h2 className="text-3xl font-bold">Administrator Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Students" value={adminDashboardData.totalStudents} icon={<GraduationCap size={20}/>} color="#3B82F6" description="+20 this month" />
                <StatCard title="Total Faculty" value={adminDashboardData.totalFaculty} icon={<Users size={20}/>} color="#8B5CF6" description="+5 this month" />
                <StatCard title="Books in Library" value={adminDashboardData.booksInLibrary} icon={<Library size={20}/>} color="#10B981" />
                <StatCard title="Canteen Revenue (Today)" value={`$${adminDashboardData.canteenRevenue.toFixed(2)}`} icon={<DollarSign size={20}/>} color="#EF4444" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Student Enrollment by Department</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={adminDashboardData.enrollmentByDept} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {adminDashboardData.recentActivity.map((act, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>{act.user.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{act.action}</p>
                                        <p className="text-xs text-muted-foreground">by {act.user}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) {
        return <div className="p-8">Loading dashboard...</div>; // Or a loading spinner
    }

    const renderDashboardByRole = () => {
        switch (user.role) {
            case 'student':
                return <StudentDashboard user={user} />;
            case 'faculty':
                return <FacultyDashboard user={user} />;
            case 'admin':
                return <AdminDashboard />;
            default:
                return <div>No dashboard available for your role.</div>;
        }
    };

    return (
        <div className="p-4 sm:p-8">
            {renderDashboardByRole()}
        </div>
    );
}