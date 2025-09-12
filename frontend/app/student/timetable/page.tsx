"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";

// --- Import UI Components ---
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- Define Types ---
type Course = { id: number; name: string; code: string; };
type Classroom = { id: number; name: string; capacity: number | null; };
type Faculty = { id: number; full_name: string; };
type TimetableSlot = {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  course: Course;
  faculty: Faculty;
  classroom: Classroom;
};

// --- Constants for the Grid ---
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00"];
const branches = ["AI", "COMPS", "IT", "MECHANICAL", "ROBOTICS", "ELECTRONICS"];
const years = [{label: "First Year", value: 1}, {label: "Second Year", value: 2}, {label: "Third Year", value: 3}, {label: "Final Year", value: 4}];

const defaultSlotState = { course_id: 0, faculty_id: 0, classroom_id: 0 };

export default function ManageTimetablePage() {
  // --- State Management ---
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const [selectedYear, setSelectedYear] = useState(years[0].value);
  
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(defaultSlotState);
  const [clickedCell, setClickedCell] = useState<{ day: number; time: string } | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    // Fetch prerequisites for the modal dropdowns
    const fetchPrerequisites = async () => {
      const [coursesRes, facultyRes, classroomsRes] = await Promise.all([
        apiService.getCourses(),
        apiService.getFaculty(),
        apiService.getClassrooms()
      ]);
      if (coursesRes.success) setCourses(coursesRes.data);
      if (facultyRes.success) setFaculty(facultyRes.data);
      if (classroomsRes.success) setClassrooms(classroomsRes.data);
    };
    fetchPrerequisites();
  }, []);

  useEffect(() => {
    // Fetch the timetable whenever the selected branch or year changes
    const fetchTimetable = async () => {
      if (selectedBranch && selectedYear) {
        const result = await apiService.getTimetable(selectedBranch, selectedYear);
        if (result.success) setTimetable(result.data);
        else toast.error(result.message);
      }
    };
    fetchTimetable();
  }, [selectedBranch, selectedYear]);

  // --- Memoized Grid for Performance ---
  const timetableGrid = useMemo(() => {
    const grid = new Map<string, TimetableSlot>();
    timetable.forEach(slot => {
      const key = `${slot.day_of_week}-${slot.start_time}`;
      grid.set(key, slot);
    });
    return grid;
  }, [timetable]);

  // --- Event Handlers ---
  const handleCellClick = (dayIndex: number, time: string) => {
    const key = `${dayIndex + 1}-${time}`;
    const existingSlot = timetableGrid.get(key);
    
    if (existingSlot) {
      // Editing an existing slot
      setModalData({
        id: existingSlot.id,
        course_id: existingSlot.course.id,
        faculty_id: existingSlot.faculty.id,
        classroom_id: existingSlot.classroom.id,
      });
    } else {
      // Adding a new slot
      setModalData(defaultSlotState);
    }
    setClickedCell({ day: dayIndex + 1, time });
    setIsModalOpen(true);
  };

  const handleSaveSlot = async () => {
    if (!clickedCell) return;
    
    const slotData = {
      ...modalData,
      day_of_week: clickedCell.day,
      start_time: clickedCell.time,
      end_time: "11:00:00", // Simplified for now
      branch: selectedBranch,
      year: selectedYear,
    };
    
    // For now, we only support creating new slots
    const result = await apiService.createTimetableSlot(slotData);
    toast[result.success ? "success" : "error"](result.message);

    if (result.success) {
      const newTimetable = await apiService.getTimetable(selectedBranch, selectedYear);
      if(newTimetable.success) setTimetable(newTimetable.data);
      setIsModalOpen(false);
    }
  };

  const handleDeleteSlot = async () => {
     if (!modalData.id) return;
     const result = await apiService.deleteTimetableSlot(modalData.id);
     toast[result.success ? "success" : "error"](result.message);
     if(result.success) {
        setTimetable(prev => prev.filter(slot => slot.id !== modalData.id));
        setIsModalOpen(false);
     }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Timetable Management</h1>

      {/* --- Controls --- */}
      <div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div><Label>Branch</Label><Select value={selectedBranch} onValueChange={setSelectedBranch}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Year</Label><Select value={String(selectedYear)} onValueChange={v => setSelectedYear(parseInt(v))}> <SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y.value} value={String(y.value)}>{y.label}</SelectItem>)}</SelectContent></Select></div>
      </div>

      {/* --- Timetable Grid --- */}
      <div className="grid grid-cols-6 gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div></div> {/* Empty top-left corner */}
        {days.map(day => <div key={day} className="text-center font-bold">{day}</div>)}

        {timeSlots.map(time => (
          <React.Fragment key={time}>
            <div className="font-semibold p-2 text-right">{new Date(`1970-01-01T${time}Z`).toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true})}</div>
            {days.map((day, dayIndex) => {
              const key = `${dayIndex + 1}-${time}`;
              const slot = timetableGrid.get(key);
              return (
                <div key={key} onClick={() => handleCellClick(dayIndex, time)} className="h-28 p-2 border rounded-md cursor-pointer bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  {slot && (
                    <div className={`h-full p-2 rounded text-white bg-blue-500 text-xs flex flex-col justify-between`}>
                      <div>
                        <p className="font-bold">{slot.course.code}</p>
                        <p>{slot.faculty.full_name}</p>
                      </div>
                      <p className="text-right font-semibold">{slot.classroom.name}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      
      {/* --- Add/Edit Modal --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{modalData.id ? "Edit" : "Add"} Lecture Slot</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Course</Label><Select value={String(modalData.course_id)} onValueChange={v => setModalData({...modalData, course_id: parseInt(v)})}><SelectTrigger><SelectValue placeholder="Select a course..." /></SelectTrigger><SelectContent>{courses.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.code} - {c.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Faculty</Label><Select value={String(modalData.faculty_id)} onValueChange={v => setModalData({...modalData, faculty_id: parseInt(v)})}><SelectTrigger><SelectValue placeholder="Select a faculty..." /></SelectTrigger><SelectContent>{faculty.map(f => <SelectItem key={f.id} value={String(f.id)}>{f.full_name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Classroom</Label><Select value={String(modalData.classroom_id)} onValueChange={v => setModalData({...modalData, classroom_id: parseInt(v)})}><SelectTrigger><SelectValue placeholder="Select a classroom..." /></SelectTrigger><SelectContent>{classrooms.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <DialogFooter className="flex justify-between w-full">
                {modalData.id ? (<Button variant="destructive" onClick={handleDeleteSlot}>Delete</Button>) : (<div></div>)}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveSlot}>Save</Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}