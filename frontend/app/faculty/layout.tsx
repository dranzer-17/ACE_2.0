"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { LayoutDashboard, CheckSquare, GraduationCap, Book, Flame } from "lucide-react";

// --- Define the navigation links for FACULTY ---
const facultyNavItems = [
  { href: "/faculty/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/faculty/attendance", label: "Attendance", icon: CheckSquare },
  { href: "/faculty/grading", label: "Grading", icon: GraduationCap },
  { href: "/faculty/resources", label: "Resources", icon: Book },
  { href: "/faculty/initiatives", label: "Initiatives", icon: Flame },
];

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={facultyNavItems} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-white dark:bg-gray-950">{children}</main>
      </div>
    </div>
  );
}