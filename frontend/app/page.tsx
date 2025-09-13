// /app/page.tsx -- Modern Landing Page with Glass Effects

import { ThemeToggle } from "@/components/shared/theme-toggle";
import SplashCursor from "@/components/SplashCursor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpenCheck, Users, Calendar, MessageSquare, Trophy, Target, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-black dark:via-black dark:to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Floating Circle */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-slate-200/20 to-slate-300/10 dark:from-white/10 dark:to-white/5 rounded-full blur-xl animate-pulse" />
        
        {/* Top Right Geometric Shape */}
        <div className="absolute top-32 -right-16 w-32 h-32 bg-gradient-to-br from-slate-300/15 to-slate-200/10 dark:from-white/8 dark:to-white/4 rounded-2xl rotate-45 blur-lg animate-bounce" style={{ animationDuration: '6s' }} />
        
        {/* Middle Left Diamond */}
        <div className="absolute top-1/3 -left-8 w-24 h-24 bg-gradient-to-br from-slate-200/20 to-slate-100/10 dark:from-white/10 dark:to-white/5 transform rotate-45 blur-md animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Middle Right Circle */}
        <div className="absolute top-1/2 -right-12 w-36 h-36 bg-gradient-to-br from-slate-300/15 to-slate-200/8 dark:from-white/8 dark:to-white/4 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        {/* Bottom Left Square */}
        <div className="absolute bottom-32 -left-10 w-28 h-28 bg-gradient-to-br from-slate-200/18 to-slate-300/12 dark:from-white/9 dark:to-white/6 rounded-xl rotate-12 blur-lg animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        
        {/* Bottom Right Triangle Shape */}
        <div className="absolute -bottom-16 -right-20 w-44 h-44 bg-gradient-to-br from-slate-300/20 to-slate-200/10 dark:from-white/10 dark:to-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
        
        {/* Additional Large Background Elements */}
        <div className="absolute top-10 left-1/2 w-52 h-52 bg-gradient-to-br from-slate-100/8 to-slate-200/5 dark:from-white/4 dark:to-white/2 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-20 right-1/2 w-48 h-48 bg-gradient-to-br from-slate-200/10 to-slate-100/5 dark:from-white/5 dark:to-white/2 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s', animationDelay: '5s' }} />
        
        {/* NEW MASSIVE LAYER - ULTRA LARGE ELEMENTS */}
        <div className="absolute -top-32 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-100/8 to-slate-100/4 dark:from-blue-500/3 dark:to-white/2 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '20s' }} />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/6 to-slate-200/3 dark:from-purple-500/2 dark:to-white/1 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '25s', animationDelay: '8s' }} />
        <div className="absolute top-1/4 -left-40 w-72 h-72 bg-gradient-to-br from-green-100/7 to-slate-100/3 dark:from-green-500/3 dark:to-white/2 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '18s', animationDelay: '6s' }} />
        <div className="absolute bottom-1/3 -right-32 w-88 h-88 bg-gradient-to-br from-orange-100/5 to-slate-200/2 dark:from-orange-500/2 dark:to-white/1 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '22s', animationDelay: '4s' }} />
        
        {/* Floating Medium Elements */}
        <div className="absolute top-1/4 right-1/6 w-20 h-20 bg-gradient-to-br from-slate-300/12 to-slate-200/8 dark:from-white/6 dark:to-white/3 rounded-2xl rotate-12 blur-lg animate-spin" style={{ animationDuration: '30s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-18 h-18 bg-gradient-to-br from-slate-200/15 to-slate-300/10 dark:from-white/8 dark:to-white/4 rounded-xl rotate-45 blur-md animate-bounce" style={{ animationDuration: '10s', animationDelay: '3s' }} />
        
        {/* NEW MEDIUM ELEMENTS - COLORFUL */}
        <div className="absolute top-1/5 left-1/3 w-22 h-22 bg-gradient-to-br from-blue-200/12 to-blue-100/8 dark:from-blue-400/6 dark:to-blue-500/3 rounded-3xl rotate-30 blur-md animate-spin" style={{ animationDuration: '35s', animationDelay: '2s' }} />
        <div className="absolute bottom-1/5 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-200/10 to-purple-100/6 dark:from-purple-400/5 dark:to-purple-500/2 rounded-2xl rotate-60 blur-lg animate-bounce" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute top-2/5 left-1/8 w-20 h-20 bg-gradient-to-br from-green-200/11 to-green-100/7 dark:from-green-400/5 dark:to-green-500/3 rounded-xl rotate-15 blur-md animate-pulse" style={{ animationDuration: '14s', animationDelay: '1s' }} />
        <div className="absolute bottom-2/5 right-1/8 w-26 h-26 bg-gradient-to-br from-orange-200/9 to-orange-100/5 dark:from-orange-400/4 dark:to-orange-500/2 rounded-2xl rotate-45 blur-lg animate-spin" style={{ animationDuration: '28s', animationDelay: '6s' }} />
        <div className="absolute top-3/5 left-2/3 w-18 h-18 bg-gradient-to-br from-indigo-200/13 to-indigo-100/9 dark:from-indigo-400/6 dark:to-indigo-500/3 rounded-xl rotate-90 blur-md animate-bounce" style={{ animationDuration: '9s', animationDelay: '3.5s' }} />
        <div className="absolute bottom-3/5 right-2/3 w-22 h-22 bg-gradient-to-br from-pink-200/8 to-pink-100/4 dark:from-pink-400/4 dark:to-pink-500/2 rounded-3xl rotate-30 blur-lg animate-pulse" style={{ animationDuration: '16s', animationDelay: '7s' }} />
        
        {/* Floating Small Dots - MASSIVE EXPANSION */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-slate-400/30 dark:bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-slate-300/40 dark:bg-white/15 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/6 w-4 h-4 bg-slate-400/25 dark:bg-white/18 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2.5s' }} />
        <div className="absolute top-1/6 right-1/5 w-3 h-3 bg-slate-300/35 dark:bg-white/22 rounded-full animate-ping" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-slate-400/28 dark:bg-white/16 rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '3.2s' }} />
        <div className="absolute top-2/3 right-1/6 w-5 h-5 bg-slate-300/32 dark:bg-white/19 rounded-full animate-ping" style={{ animationDuration: '5.5s', animationDelay: '2.8s' }} />
        
        {/* NEW COLORFUL DOTS */}
        <div className="absolute top-1/8 left-1/2 w-3 h-3 bg-blue-400/40 dark:bg-blue-300/25 rounded-full animate-ping" style={{ animationDuration: '4.2s', animationDelay: '0.8s' }} />
        <div className="absolute top-5/8 right-1/2 w-4 h-4 bg-purple-400/35 dark:bg-purple-300/20 rounded-full animate-ping" style={{ animationDuration: '3.8s', animationDelay: '2.1s' }} />
        <div className="absolute bottom-1/8 left-3/4 w-2 h-2 bg-green-400/45 dark:bg-green-300/28 rounded-full animate-ping" style={{ animationDuration: '5.2s', animationDelay: '1.7s' }} />
        <div className="absolute top-7/8 right-3/4 w-5 h-5 bg-orange-400/30 dark:bg-orange-300/18 rounded-full animate-ping" style={{ animationDuration: '4.8s', animationDelay: '3.5s' }} />
        <div className="absolute top-3/8 left-1/8 w-3 h-3 bg-indigo-400/38 dark:bg-indigo-300/22 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '2.9s' }} />
        <div className="absolute bottom-3/8 right-1/8 w-4 h-4 bg-pink-400/33 dark:bg-pink-300/19 rounded-full animate-ping" style={{ animationDuration: '6.1s', animationDelay: '1.3s' }} />
        <div className="absolute top-1/3 left-5/6 w-2 h-2 bg-yellow-400/42 dark:bg-yellow-300/24 rounded-full animate-ping" style={{ animationDuration: '4.7s', animationDelay: '2.6s' }} />
        <div className="absolute bottom-1/3 right-5/6 w-5 h-5 bg-cyan-400/36 dark:bg-cyan-300/21 rounded-full animate-ping" style={{ animationDuration: '5.9s', animationDelay: '0.4s' }} />
        <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-red-400/39 dark:bg-red-300/23 rounded-full animate-ping" style={{ animationDuration: '3.9s', animationDelay: '3.8s' }} />
        <div className="absolute bottom-2/3 right-2/3 w-4 h-4 bg-teal-400/34 dark:bg-teal-300/20 rounded-full animate-ping" style={{ animationDuration: '5.4s', animationDelay: '1.9s' }} />
        
        {/* Subtle Gradient Orbs */}
        <div className="absolute top-20 left-1/3 w-16 h-16 bg-gradient-to-br from-slate-200/30 to-transparent dark:from-white/15 dark:to-transparent rounded-full blur-md animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-gradient-to-br from-slate-300/25 to-transparent dark:from-white/12 dark:to-transparent rounded-full blur-lg animate-pulse" style={{ animationDuration: '9s', animationDelay: '3s' }} />
        <div className="absolute top-1/3 left-1/8 w-14 h-14 bg-gradient-to-br from-slate-200/28 to-transparent dark:from-white/14 dark:to-transparent rounded-full blur-md animate-pulse" style={{ animationDuration: '8s', animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 right-1/8 w-18 h-18 bg-gradient-to-br from-slate-300/22 to-transparent dark:from-white/11 dark:to-transparent rounded-full blur-lg animate-pulse" style={{ animationDuration: '11s', animationDelay: '4.5s' }} />
        
        {/* NEW COLORFUL GRADIENT ORBS */}
        <div className="absolute top-12 left-2/3 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-transparent dark:from-blue-400/10 dark:to-transparent rounded-full blur-xl animate-pulse" style={{ animationDuration: '13s', animationDelay: '2.2s' }} />
        <div className="absolute bottom-12 right-2/3 w-28 h-28 bg-gradient-to-br from-purple-200/18 to-transparent dark:from-purple-400/9 dark:to-transparent rounded-full blur-xl animate-pulse" style={{ animationDuration: '17s', animationDelay: '5.8s' }} />
        <div className="absolute top-1/5 left-4/5 w-22 h-22 bg-gradient-to-br from-green-200/22 to-transparent dark:from-green-400/11 dark:to-transparent rounded-full blur-lg animate-pulse" style={{ animationDuration: '10s', animationDelay: '3.7s' }} />
        <div className="absolute bottom-1/5 right-4/5 w-26 h-26 bg-gradient-to-br from-orange-200/16 to-transparent dark:from-orange-400/8 dark:to-transparent rounded-full blur-xl animate-pulse" style={{ animationDuration: '14s', animationDelay: '6.3s' }} />
        <div className="absolute top-3/5 left-1/5 w-20 h-20 bg-gradient-to-br from-indigo-200/24 to-transparent dark:from-indigo-400/12 dark:to-transparent rounded-full blur-lg animate-pulse" style={{ animationDuration: '12s', animationDelay: '1.8s' }} />
        <div className="absolute bottom-3/5 right-1/5 w-32 h-32 bg-gradient-to-br from-pink-200/14 to-transparent dark:from-pink-400/7 dark:to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: '19s', animationDelay: '4.9s' }} />
        
        {/* Geometric Line Elements - EXPANDED */}
        <div className="absolute top-1/5 left-1/12 w-32 h-1 bg-gradient-to-r from-transparent via-slate-300/20 to-transparent dark:from-transparent dark:via-white/10 dark:to-transparent blur-sm rotate-45 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/5 right-1/12 w-28 h-1 bg-gradient-to-r from-transparent via-slate-200/25 to-transparent dark:from-transparent dark:via-white/12 dark:to-transparent blur-sm rotate-[-45deg] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-2/5 right-1/10 w-24 h-1 bg-gradient-to-r from-transparent via-slate-300/18 to-transparent dark:from-transparent dark:via-white/9 dark:to-transparent blur-sm rotate-12 animate-pulse" style={{ animationDuration: '7s', animationDelay: '3.5s' }} />
        
        {/* NEW COLORFUL LINES */}
        <div className="absolute top-1/8 left-3/4 w-36 h-1 bg-gradient-to-r from-transparent via-blue-300/25 to-transparent dark:from-transparent dark:via-blue-400/12 dark:to-transparent blur-sm rotate-30 animate-pulse" style={{ animationDuration: '9s', animationDelay: '1.4s' }} />
        <div className="absolute bottom-1/8 right-3/4 w-40 h-1 bg-gradient-to-r from-transparent via-purple-300/22 to-transparent dark:from-transparent dark:via-purple-400/11 dark:to-transparent blur-sm rotate-[-30deg] animate-pulse" style={{ animationDuration: '11s', animationDelay: '4.2s' }} />
        <div className="absolute top-3/8 left-1/10 w-30 h-1 bg-gradient-to-r from-transparent via-green-300/28 to-transparent dark:from-transparent dark:via-green-400/14 dark:to-transparent blur-sm rotate-60 animate-pulse" style={{ animationDuration: '8.5s', animationDelay: '2.7s' }} />
        <div className="absolute bottom-3/8 right-1/10 w-34 h-1 bg-gradient-to-r from-transparent via-orange-300/20 to-transparent dark:from-transparent dark:via-orange-400/10 dark:to-transparent blur-sm rotate-[-60deg] animate-pulse" style={{ animationDuration: '10.5s', animationDelay: '5.1s' }} />
        <div className="absolute top-5/8 left-5/6 w-26 h-1 bg-gradient-to-r from-transparent via-indigo-300/26 to-transparent dark:from-transparent dark:via-indigo-400/13 dark:to-transparent blur-sm rotate-15 animate-pulse" style={{ animationDuration: '7.8s', animationDelay: '3.9s' }} />
        <div className="absolute bottom-5/8 right-5/6 w-38 h-1 bg-gradient-to-r from-transparent via-pink-300/19 to-transparent dark:from-transparent dark:via-pink-400/9 dark:to-transparent blur-sm rotate-[-15deg] animate-pulse" style={{ animationDuration: '12.5s', animationDelay: '1.6s' }} />
        
        {/* Floating Border Elements - MASSIVE EXPANSION */}
        <div className="absolute top-1/8 left-2/3 w-12 h-12 border border-slate-300/25 dark:border-white/15 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '35s' }} />
        <div className="absolute bottom-1/6 left-1/4 w-8 h-8 border-2 border-slate-200/30 dark:border-white/18 rounded-full animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-3/5 right-1/12 w-10 h-10 border border-slate-300/20 dark:border-white/12 rounded-xl rotate-12 animate-spin" style={{ animationDuration: '28s', animationDelay: '4s' }} />
        <div className="absolute bottom-2/5 left-1/12 w-14 h-14 border-2 border-slate-200/22 dark:border-white/14 rounded-2xl rotate-45 animate-pulse" style={{ animationDuration: '9s', animationDelay: '1.8s' }} />
        
        {/* NEW COLORFUL BORDER ELEMENTS */}
        <div className="absolute top-1/10 left-1/2 w-16 h-16 border-2 border-blue-300/20 dark:border-blue-400/12 rounded-xl rotate-30 animate-spin" style={{ animationDuration: '40s', animationDelay: '3.3s' }} />
        <div className="absolute bottom-1/10 right-1/2 w-12 h-12 border border-purple-300/25 dark:border-purple-400/15 rounded-2xl rotate-60 animate-bounce" style={{ animationDuration: '7.5s', animationDelay: '5.7s' }} />
        <div className="absolute top-4/5 left-1/6 w-18 h-18 border-3 border-green-300/18 dark:border-green-400/10 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '11.2s', animationDelay: '2.4s' }} />
        <div className="absolute bottom-4/5 right-1/6 w-14 h-14 border-2 border-orange-300/22 dark:border-orange-400/13 rounded-3xl rotate-15 animate-spin" style={{ animationDuration: '33s', animationDelay: '6.8s' }} />
        <div className="absolute top-1/3 left-4/5 w-10 h-10 border border-indigo-300/28 dark:border-indigo-400/16 rounded-xl rotate-90 animate-bounce" style={{ animationDuration: '8.7s', animationDelay: '4.1s' }} />
        <div className="absolute bottom-1/3 right-4/5 w-20 h-20 border-2 border-pink-300/16 dark:border-pink-400/9 rounded-2xl rotate-30 animate-pulse" style={{ animationDuration: '13.5s', animationDelay: '1.2s' }} />
        <div className="absolute top-2/5 left-1/12 w-16 h-16 border-3 border-yellow-300/24 dark:border-yellow-400/14 rounded-lg rotate-[-30deg] animate-spin" style={{ animationDuration: '38s', animationDelay: '7.4s' }} />
        <div className="absolute bottom-2/5 right-1/12 w-12 h-12 border border-cyan-300/21 dark:border-cyan-400/12 rounded-xl rotate-45 animate-bounce" style={{ animationDuration: '6.8s', animationDelay: '3.6s' }} />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-black/80 dark:supports-[backdrop-filter]:bg-black/60 dark:border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-white">
                <BookOpenCheck className="h-5 w-5 text-white dark:text-slate-900" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">StudentHub</span>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Features</a>
                <a href="#about" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">About</a>
                <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Contact</a>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:px-8 lg:py-32">
        {/* Hero Section Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-1/4 w-8 h-8 border border-slate-300/30 dark:border-white/20 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute top-32 right-1/3 w-6 h-6 border border-slate-200/40 dark:border-white/15 rounded-full animate-pulse" />
          <div className="absolute bottom-20 left-1/6 w-10 h-10 border-2 border-slate-300/25 dark:border-white/18 rounded-full animate-bounce" style={{ animationDuration: '4s' }} />
          
          {/* Additional Hero Decorations */}
          <div className="absolute top-8 right-1/6 w-12 h-12 bg-gradient-to-br from-slate-200/15 to-slate-100/8 dark:from-white/8 dark:to-white/4 rounded-xl rotate-12 blur-md animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-8 right-1/4 w-16 h-16 border border-slate-300/20 dark:border-white/12 rounded-2xl rotate-45 animate-spin" style={{ animationDuration: '25s' }} />
          <div className="absolute top-1/3 left-1/8 w-6 h-6 bg-slate-300/35 dark:bg-white/20 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 right-1/8 w-8 h-8 bg-gradient-to-br from-slate-200/25 to-transparent dark:from-white/12 dark:to-transparent rounded-full blur-sm animate-pulse" style={{ animationDuration: '6s', animationDelay: '2.5s' }} />
          
          {/* Floating Lines */}
          <div className="absolute top-1/6 left-1/5 w-20 h-0.5 bg-gradient-to-r from-transparent via-slate-300/25 to-transparent dark:from-transparent dark:via-white/15 dark:to-transparent blur-sm rotate-45 animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-1/6 right-1/5 w-24 h-0.5 bg-gradient-to-r from-transparent via-slate-200/30 to-transparent dark:from-transparent dark:via-white/18 dark:to-transparent blur-sm rotate-[-30deg] animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full bg-black px-4 py-2 text-sm text-white ring-2 ring-white/20 dark:bg-black dark:text-white dark:ring-white/40 shadow-lg backdrop-blur-sm border border-slate-800 dark:border-white/30">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10 dark:from-white/20 dark:via-white/10 dark:to-white/20"></div>
                  <span className="relative z-10">✨ Transform Your Campus Experience</span>
                </div>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-7xl">
                Unlock Your
                <span className="bg-gradient-to-r from-slate-600 to-slate-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400"> Campus Potential</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                A centralized hub designed for students, faculty, and committees. 
                Discover opportunities, manage tasks, and connect with your college community like never before.
              </p>
              <div className="mt-12 flex items-center justify-center gap-6">
                <Link href="/auth/login">
                  <Button size="lg" className="bg-slate-900 px-8 py-3 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-6 py-24 lg:px-8">
        {/* Features Section Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-8 w-12 h-12 bg-gradient-to-br from-slate-200/20 to-slate-100/10 dark:from-white/10 dark:to-white/5 rounded-2xl rotate-12 blur-sm animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/3 right-6 w-16 h-16 border border-slate-300/20 dark:border-white/10 rounded-xl rotate-45 animate-spin" style={{ animationDuration: '25s' }} />
          <div className="absolute bottom-16 left-12 w-8 h-8 bg-slate-300/30 dark:bg-white/15 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '2s' }} />
          
          {/* Additional Features Decorations */}
          <div className="absolute top-4 right-1/3 w-10 h-10 border-2 border-slate-200/25 dark:border-white/15 rounded-lg rotate-12 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-slate-300/18 to-slate-200/10 dark:from-white/9 dark:to-white/5 rounded-xl rotate-45 blur-md animate-pulse" style={{ animationDuration: '9s', animationDelay: '3s' }} />
          <div className="absolute top-2/3 left-4 w-6 h-6 bg-slate-200/40 dark:bg-white/22 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1.8s' }} />
          <div className="absolute bottom-1/3 right-1/4 w-18 h-18 border border-slate-300/15 dark:border-white/8 rounded-2xl rotate-30 animate-spin" style={{ animationDuration: '32s', animationDelay: '5s' }} />
          
          {/* More Floating Elements */}
          <div className="absolute top-1/4 left-1/12 w-8 h-20 bg-gradient-to-b from-slate-200/20 to-transparent dark:from-white/10 dark:to-transparent rounded-full blur-lg animate-pulse" style={{ animationDuration: '7s', animationDelay: '2.2s' }} />
          <div className="absolute bottom-1/4 right-1/12 w-22 h-8 bg-gradient-to-r from-slate-300/15 to-transparent dark:from-white/8 dark:to-transparent rounded-full blur-md animate-pulse" style={{ animationDuration: '8s', animationDelay: '4.1s' }} />
        </div>
        
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
              Everything You Need to Excel
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Powerful features designed to streamline your campus experience and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Feature Cards */}
            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-white/20 dark:to-white/10 mb-6 backdrop-blur-sm">
                  <Users className="h-7 w-7 text-white dark:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors">Committee Management</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Efficiently organize and coordinate committee activities with streamlined communication and task management.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500/20 dark:to-blue-600/10 mb-6 backdrop-blur-sm">
                  <Calendar className="h-7 w-7 text-white dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">Event Planning</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Plan, organize, and manage campus events with integrated scheduling and attendance tracking.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500/20 dark:to-green-600/10 mb-6 backdrop-blur-sm">
                  <MessageSquare className="h-7 w-7 text-white dark:text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors">Real-time Chat</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Connect instantly with peers, faculty, and committee members through integrated messaging.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-500/20 dark:to-purple-600/10 mb-6 backdrop-blur-sm">
                  <Trophy className="h-7 w-7 text-white dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">Achievement Tracking</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Monitor your progress and celebrate achievements with comprehensive tracking and analytics.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500/20 dark:to-orange-600/10 mb-6 backdrop-blur-sm">
                  <Target className="h-7 w-7 text-white dark:text-orange-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-orange-800 dark:group-hover:text-orange-200 transition-colors">Task Management</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Stay organized with intelligent task management and deadline tracking across all your activities.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl dark:bg-white/5 dark:border-white/10 p-6 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500/20 dark:to-indigo-600/10 mb-6 backdrop-blur-sm">
                  <CheckCircle className="h-7 w-7 text-white dark:text-indigo-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-800 dark:group-hover:text-indigo-200 transition-colors">Attendance System</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                  Automated attendance tracking with detailed analytics and reporting for all campus activities.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-24 lg:px-8">
        {/* Stats Section Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 right-16 w-6 h-20 bg-gradient-to-b from-slate-200/25 to-transparent dark:from-white/12 dark:to-transparent rounded-full blur-md animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-12 left-20 w-14 h-14 border-2 border-slate-300/20 dark:border-white/12 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '7s' }} />
          
          {/* Additional Stats Decorations */}
          <div className="absolute top-1/4 left-8 w-10 h-10 bg-gradient-to-br from-slate-300/22 to-slate-200/12 dark:from-white/11 dark:to-white/6 rounded-xl rotate-12 blur-sm animate-pulse" style={{ animationDuration: '6.5s', animationDelay: '1.5s' }} />
          <div className="absolute bottom-1/4 right-12 w-12 h-12 border border-slate-200/28 dark:border-white/16 rounded-2xl rotate-45 animate-spin" style={{ animationDuration: '22s', animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-4 w-16 h-4 bg-gradient-to-r from-slate-200/20 to-transparent dark:from-white/10 dark:to-transparent rounded-full blur-md animate-pulse" style={{ animationDuration: '8s', animationDelay: '2.8s' }} />
          <div className="absolute bottom-8 right-1/3 w-8 h-8 bg-slate-300/35 dark:bg-white/20 rounded-full animate-ping" style={{ animationDuration: '4.2s', animationDelay: '1.2s' }} />
        </div>
        
        <div className="container mx-auto">
          <div className="rounded-2xl bg-slate-900 dark:bg-black/90 backdrop-blur-xl px-8 py-16 lg:px-16 border dark:border-white/10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
              <div>
                <div className="text-4xl font-bold text-white dark:text-white lg:text-5xl">10,000+</div>
                <div className="mt-2 text-slate-300 dark:text-slate-400">Active Students</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white dark:text-white lg:text-5xl">500+</div>
                <div className="mt-2 text-slate-300 dark:text-slate-400">Committees Managed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white dark:text-white lg:text-5xl">98%</div>
                <div className="mt-2 text-slate-300 dark:text-slate-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 lg:px-8">
        {/* CTA Section Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 left-12 w-10 h-10 border border-slate-300/25 dark:border-white/15 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '18s' }} />
          <div className="absolute bottom-16 right-16 w-12 h-12 bg-gradient-to-br from-slate-200/20 to-slate-100/12 dark:from-white/10 dark:to-white/6 rounded-xl rotate-12 blur-sm animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-8 w-6 h-6 bg-slate-300/40 dark:bg-white/25 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
          <div className="absolute bottom-1/3 left-8 w-14 h-14 border-2 border-slate-200/22 dark:border-white/13 rounded-2xl rotate-30 animate-bounce" style={{ animationDuration: '6s', animationDelay: '3s' }} />
        </div>
        
        <div className="container mx-auto">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
              Join thousands of students and faculty already using StudentHub to streamline their academic journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link href="/auth/register">
                <Button size="lg" className="bg-slate-900 px-8 py-3 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 px-6 py-12 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-white">
                <BookOpenCheck className="h-4 w-4 text-white dark:text-slate-900" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">StudentHub</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 StudentHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      <SplashCursor />
    </main>
  );
}