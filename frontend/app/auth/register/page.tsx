"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { apiService } from "@/app/lib/apiService"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState("student");
  
  // State for the student form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sapId, setSapId] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [className, setClassName] = useState("");
  const [division, setDivision] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    // --- FIX 2: This function should ONLY handle the currently selected tab ---
    if (selectedRole !== 'student') {
        toast.info("Faculty and Committee registration is not yet available.");
        return;
    }

    // Validation for student form
    if (!fullName || !sapId || !rollNumber || !className || !division || !password || !confirmPassword) {
      return toast.error("Please fill all required fields for the student account.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setIsLoading(true);
    
    const studentApiData = {
      full_name: fullName,
      email: email,
      password: password,
      sap_id: parseInt(sapId, 10),
      roll_number: rollNumber,
      class_name: className,
      division: division,
    };
    
    const result = await apiService.signup(studentApiData);
    
    if (result.success) {
      toast.success(result.message || "Account created! Please log in.");
      router.push("/auth/login"); 
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {/* --- FIX 1: REMOVE the 'disabled' prop to enable switching --- */}
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
              <TabsTrigger value="committee">Committee</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="pt-4 text-center">
             {/* Dynamic title based on selected tab */}
            <CardTitle className="text-2xl font-bold">Create a {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account</CardTitle>
            <CardDescription>Join the platform to unlock your campus potential.</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {selectedRole === 'student' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="fullName">Full Name*</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="email">Email*</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="sapId">SAP ID*</Label><Input id="sapId" type="number" value={sapId} onChange={(e) => setSapId(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="rollNumber">Roll Number*</Label><Input id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="className">Class*</Label><Input id="className" placeholder="e.g., TE-1" value={className} onChange={(e) => setClassName(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="division">Division*</Label><Input id="division" placeholder="e.g., A" value={division} onChange={(e) => setDivision(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="password">Password*</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} /></div>
              <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm Password*</Label><Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} /></div>
            </div>
          )}
          {selectedRole === 'faculty' && <div className="text-center p-8 text-gray-500">Faculty registration form will be here.</div>}
          {selectedRole === 'committee' && <div className="text-center p-8 text-gray-500">Committee registration form will be here.</div>}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/auth/login" className="text-sm"><Button variant="ghost">Already have an account?</Button></Link>
          {/* --- FIX 3: This button now calls the main handleSubmit function --- */}
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}