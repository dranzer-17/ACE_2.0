"use client";
import { Sidebar } from "@/components/shared/Sidebar";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";
import { Header } from "@/components/shared/Header"; 

// --- Define the navigation links specifically for committee members ---
const committeeNavItems = [
  {
    href: "/committee/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/committee/applications",
    label: "Applications",
    icon: FileText,
  },
  {
    href: "/committee/events",
    label: "Events",
    icon: Calendar,
  },
  {
    href: "/committee/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/committee/members",
    label: "Members",
    icon: Users,
  },
];

export default function CommitteeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={committeeNavItems} />

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
