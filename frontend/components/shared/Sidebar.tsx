"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, LogOut } from "lucide-react";

// Define the type for a navigation item
type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType; // The component type for the icon
};

// Define the props for our Sidebar component
type SidebarProps = {
  navItems: NavItem[];
};

export function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen p-4 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg dark:bg-white">
          <BookOpenCheck className="w-5 h-5 text-white dark:text-gray-900" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">StudentHub</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} passHref>
              <Button
                // --- THIS IS THE KEY CHANGE ---
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive
                    ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    : ""
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div>
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
}