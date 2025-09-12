"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";

// --- Import UI Components ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

// --- Define Type ---
type Course = {
  id: number;
  name: string;
  code: string;
};

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the "Add Course" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");

  const fetchCourses = async () => {
    setIsLoading(true);
    const result = await apiService.getCourses();
    if (result.success) {
      setCourses(result.data);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourseName || !newCourseCode) {
      toast.error("Please fill in both name and code.");
      return;
    }
    
    const result = await apiService.createCourse({ name: newCourseName, code: newCourseCode });
    toast[result.success ? 'success' : 'error'](result.message);
    
    if (result.success) {
      fetchCourses(); // Re-fetch the list
      setIsModalOpen(false); // Close the modal
      setNewCourseName("");
      setNewCourseCode("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="text-gray-500">Add, edit, or remove course subjects.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Course</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code</Label>
                <Input id="code" placeholder="e.g., CS201" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" placeholder="e.g., Data Structures" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCourse}>Save Course</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={2}>Loading courses...</TableCell></TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}