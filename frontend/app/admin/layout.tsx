"use client";

import { Sidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { LayoutDashboard, Users, ClipboardList, Package, Utensils, Library } from "lucide-react";

// --- Define the navigation links for ADMIN ---
const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/timetable", label: "Timetable", icon: ClipboardList },
  { href: "/admin/resources", label: "Resources", icon: Package },
  { href: "/admin/canteen", label: "Canteen", icon: Utensils },
  { href: "/admin/library", label: "Library", icon: Library },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar navItems={adminNavItems} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-white dark:bg-gray-950">{children}</main>
      </div>
    </div>
  );
}