'use client';

import { useState } from 'react';
import { Event, getEventsByMonth } from '@/lib/eventsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface EventsCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

export function EventsCalendar({ events, onEventClick, onDateClick }: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthEvents = getEventsByMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);

  const getEventsForDate = (date: Date) => {
    return monthEvents.filter(event => isSameDay(new Date(event.date), date));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getTypeColor = (type: Event['type']) => {
    const colors = {
      hackathon: 'bg-purple-500',
      seminar: 'bg-blue-500',
      workshop: 'bg-green-500',
      conference: 'bg-orange-500',
      cultural: 'bg-pink-500',
      sports: 'bg-red-500',
      academic: 'bg-gray-500'
    };
    return colors[type] || colors.academic;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Events Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h3 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[80px] p-1 border rounded-md cursor-pointer transition-colors
                  ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 text-gray-400'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => onDateClick?.(day)}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1 rounded text-white truncate cursor-pointer
                        ${getTypeColor(event.type)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Type Legend */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Event Types</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'hackathon', label: 'Hackathon' },
              { type: 'seminar', label: 'Seminar' },
              { type: 'workshop', label: 'Workshop' },
              { type: 'conference', label: 'Conference' },
              { type: 'cultural', label: 'Cultural' },
              { type: 'sports', label: 'Sports' },
              { type: 'academic', label: 'Academic' }
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getTypeColor(type as Event['type'])}`} />
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
