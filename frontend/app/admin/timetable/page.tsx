import { AdminTimetableActions } from "@/components/timetable/AdminTimetableActions";

export default async function AdminTimetablePage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
                    <p className="text-muted-foreground">Oversee and manage all campus schedules.</p>
                </div>
                {/* The client component with all the interactive logic */}
                <AdminTimetableActions />
            </div>
            
            {/* You could display the full timetable here for admins */}
            <div className="mt-8 border-dashed border-2 rounded-lg p-8 text-center">
              <p className="text-muted-foreground">Full campus timetable display can be added here.</p>
            </div>
        </div>
    );
}