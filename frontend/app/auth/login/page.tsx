"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { apiService } from "@/app/lib/apiService"; 
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Get the powerful login function from our context

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!email || !password) {
      toast.error("Please fill in both email and password.");
      return;
    }
    setIsLoading(true);

    // --- 2. Call the REAL apiService ---
    const result = await apiService.login(email, password);
    
    if (result.success && result.user) {
      toast.success(result.message);
      // --- 3. THE MAGIC STEP ---
      // This function now handles everything: setting state, localStorage, and redirection!
      login(result.user); 
    } else {
      toast.error(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 left-4">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">StudentHub</CardTitle>
          <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
        </CardHeader>
        {/* Use a form element for better accessibility */}
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@college.edu" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={isLoading}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account? <Link href="/auth/register" className="font-semibold text-primary hover:underline">Sign Up</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}