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
type Classroom = {
  id: number;
  name: string;
  capacity: number | null;
};

export default function ManageClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for the "Add Classroom" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState("");
  const [newClassroomCapacity, setNewClassroomCapacity] = useState<number>(0);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    const result = await apiService.getClassrooms();
    if (result.success) {
      setClassrooms(result.data);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleAddClassroom = async () => {
    if (!newClassroomName) {
      toast.error("Please provide a classroom name.");
      return;
    }
    
    const result = await apiService.createClassroom({ 
      name: newClassroomName, 
      capacity: newClassroomCapacity 
    });
    toast[result.success ? 'success' : 'error'](result.message);
    
    if (result.success) {
      fetchClassrooms(); // Re-fetch the list
      setIsModalOpen(false); // Close the modal
      setNewClassroomName("");
      setNewClassroomCapacity(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Classrooms</h1>
          <p className="text-gray-500">Add, edit, or remove rooms and labs.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Classroom</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Classroom</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Classroom Name</Label>
                <Input id="name" placeholder="e.g., CR 61, Electronics Lab" value={newClassroomName} onChange={(e) => setNewClassroomName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" value={newClassroomCapacity} onChange={(e) => setNewClassroomCapacity(parseInt(e.target.value, 10) || 0)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddClassroom}>Save Classroom</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classroom Name</TableHead>
                <TableHead>Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={2}>Loading classrooms...</TableCell></TableRow>
              ) : (
                classrooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.capacity || 'N/A'}</TableCell>
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