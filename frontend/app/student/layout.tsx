"use client";
import { Sidebar } from "@/components/shared/Sidebar";
import {
  LayoutDashboard,
  CalendarCheck,
  Utensils,
  MessageSquare,
  BookOpen,
  ClipboardList,
  MessageCircle,
  MapPlusIcon,
  Trophy,
  Users,
} from "lucide-react";
import { Header } from "@/components/shared/Header"; 
// --- Define the navigation links specifically for students ---
const studentNavItems = [
  {
    href: "/student/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/student/attendance",
    label: "Attendance",
    icon: CalendarCheck,
  },
  {
    href: "/student/canteen",
    label: "Canteen",
    icon: Utensils,
  },
  {
    href: "/student/chat",
    label: "Chat",
    icon: MessageSquare,
  },
  {
    href: "/student/library",
    label: "Library",
    icon: BookOpen,
  },
  {
    href: "/student/timetable",
    label: "Timetable",
    icon: ClipboardList,
  },
  {
    href: "/student/feedback",
    label: "Feedback",
    icon: MessageCircle,
  },
  {
    href: "/student/navigation",
    label: "Navigation",
    icon: MapPlusIcon,
  },
  {
    href: "/student/achievements",
    label: "Achievements",
    icon: Trophy,
  },
  {
    href: "/student/committees",
    label: "Committees",
    icon: Users,
  },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={studentNavItems} />

      {/* --- 2. Create a wrapper for the main content --- */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-white dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );

}