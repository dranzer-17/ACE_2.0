'use client';

import { Event } from '@/lib/eventsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  showRegisterButton?: boolean;
}

export function EventCard({ 
  event, 
  onRegister, 
  onViewDetails, 
  showRegisterButton = true 
}: EventCardProps) {
  const eventDate = new Date(event.date);
  const isRegistrationOpen = event.registrationRequired && 
    event.registrationDeadline && 
    new Date(event.registrationDeadline) > new Date();
  
  const isFullyBooked = event.maxParticipants && 
    event.currentParticipants && 
    event.currentParticipants >= event.maxParticipants;

  const getTypeColor = (type: Event['type']) => {
    const colors = {
      hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
      seminar: 'bg-blue-100 text-blue-800 border-blue-200',
      workshop: 'bg-green-100 text-green-800 border-green-200',
      conference: 'bg-orange-100 text-orange-800 border-orange-200',
      cultural: 'bg-pink-100 text-pink-800 border-pink-200',
      sports: 'bg-red-100 text-red-800 border-red-200',
      academic: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.academic;
  };

  const getStatusColor = (status: Event['status']) => {
    const colors = {
      upcoming: 'bg-green-100 text-green-800 border-green-200',
      ongoing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.upcoming;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${event.isFeatured ? 'ring-2 ring-yellow-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {event.title}
          </CardTitle>
          {event.isFeatured && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={getTypeColor(event.type)}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </Badge>
          <Badge className={getStatusColor(event.status)}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{format(eventDate, 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {event.currentParticipants || 0}
              {event.maxParticipants && ` / ${event.maxParticipants}`} participants
            </span>
          </div>
        </div>

        {event.tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{event.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {event.prizes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
            <p className="text-sm font-medium text-yellow-800">Prizes</p>
            <p className="text-xs text-yellow-700">{event.prizes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {showRegisterButton && event.registrationRequired && (
            <Button
              size="sm"
              className="flex-1"
              disabled={!isRegistrationOpen || isFullyBooked}
              onClick={() => onRegister?.(event.id)}
            >
              {isFullyBooked ? 'Fully Booked' : 
               !isRegistrationOpen ? 'Registration Closed' : 'Register'}
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(event.id)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
