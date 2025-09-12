"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Header() {
  return (
    <header className="flex justify-end items-center w-full h-16 px-6">
      <ThemeToggle />
    </header>
  );
}