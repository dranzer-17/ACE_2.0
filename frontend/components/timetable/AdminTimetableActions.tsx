'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Course ,Room} from "@/app/lib/types"; // Import types

export function AdminTimetableActions() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // State for form data
    const [courses, setCourses] = useState<Course[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    
    // State for form inputs
    const [courseId, setCourseId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [dayOfWeek, setDayOfWeek] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');

    // Fetch courses and rooms when the dialog is opened
    useEffect(() => {
        if (isDialogOpen) {
            const fetchData = async () => {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                // In a real app, you would create GET /courses and GET /rooms endpoints
                // For now, we'll use placeholder data.
                // const coursesRes = await fetch(`${API_URL}/courses`);
                // const roomsRes = await fetch(`${API_URL}/rooms`);
                // setCourses(await coursesRes.json());
                // setRooms(await roomsRes.json());

                // Placeholder data based on your backend seed:
                setCourses([
                    { id: 1, course_name: "Intro to Python", course_code: "CS101", faculty_id: 2, faculty: null },
                    { id: 2, course_name: "Database Systems", course_code: "CS205", faculty_id: 2, faculty: null }
                ]);
                setRooms([
                    { id: 1, room_number: "A-101", capacity: 50, is_lab: false },
                    { id: 2, room_number: "B-205 (Lab)", capacity: 30, is_lab: true }
                ]);
            };
            fetchData();
        }
    }, [isDialogOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        try {
            const response = await fetch(`${API_URL}/timetable/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: parseInt(courseId),
                    room_id: parseInt(roomId),
                    day_of_week: parseInt(dayOfWeek),
                    start_time: `${startTime}:00`,
                    end_time: `${endTime}:00`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to create entry");
            }

            toast({ title: "Success!", description: "New timetable entry created." });
            setIsDialogOpen(false);
            window.location.reload(); // Easiest way to show the new entry

        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Timetable Entry
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Timetable Entry</DialogTitle>
                    <DialogDescription>Schedule a new class for the campus timetable.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Course Selection Dropdown */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="course" className="text-right">Course</Label>
                        <Select onValueChange={setCourseId} value={courseId}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a course" /></SelectTrigger>
                            <SelectContent>{courses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.course_name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {/* Room Selection Dropdown */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="room" className="text-right">Room</Label>
                        <Select onValueChange={setRoomId} value={roomId}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a room" /></SelectTrigger>
                            <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.room_number}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    {/* Day Selection Dropdown */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day" className="text-right">Day</Label>
                        <Select onValueChange={setDayOfWeek} value={dayOfWeek}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a day" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Monday</SelectItem>
                                <SelectItem value="2">Tuesday</SelectItem>
                                <SelectItem value="3">Wednesday</SelectItem>
                                <SelectItem value="4">Thursday</SelectItem>
                                <SelectItem value="5">Friday</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Time Inputs */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-time" className="text-right">Start Time</Label>
                        <Input id="start-time" type="time" className="col-span-3" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end-time" className="text-right">End Time</Label>
                        <Input id="end-time" type="time" className="col-span-3" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Entry</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}