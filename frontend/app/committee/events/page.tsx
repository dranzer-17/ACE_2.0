'use client';

import { useState, useMemo, useEffect } from 'react';
import { eventsData, getUpcomingEvents, getFeaturedEvents, getHackathons, Event } from '@/lib/eventsData';
import { EventCard } from '@/components/events/EventCard';
import { EventsCalendar } from '@/components/events/EventsCalendar';
import { EventFilters } from '@/components/events/EventFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, List, Trophy, Star, Users, Plus, Edit, BarChart3 } from 'lucide-react';

interface FilterState {
  search: string;
  type: string;
  category: string;
  status: string;
  featured: boolean | null;
}

export default function CommitteeEventsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    category: '',
    status: '',
    featured: null
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const upcomingEvents = getUpcomingEvents();
  const featuredEvents = getFeaturedEvents();
  const hackathons = getHackathons();

  const filteredEvents = useMemo(() => {
    let filtered = eventsData;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(event => event.type === filters.type);
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    // Apply featured filter
    if (filters.featured !== null) {
      filtered = filtered.filter(event => event.isFeatured === filters.featured);
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filters]);

  const handleEventRegister = (eventId: string) => {
    // TODO: Implement registration logic
    console.log('Registering for event:', eventId);
    alert('Registration functionality will be implemented soon!');
  };

  const handleEventViewDetails = (eventId: string) => {
    // TODO: Implement event details modal/page
    console.log('Viewing details for event:', eventId);
    alert('Event details will be shown in a modal/page soon!');
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: Implement edit event functionality
    console.log('Editing event:', eventId);
    alert('Edit event functionality will be implemented soon!');
  };

  const handleCreateEvent = () => {
    // TODO: Implement create event functionality
    console.log('Creating new event');
    alert('Create event functionality will be implemented soon!');
  };

  const handleEventClick = (event: Event) => {
    handleEventViewDetails(event.id);
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // TODO: Show events for specific date
  };

  const getTabEvents = () => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'featured':
        return featuredEvents;
      case 'hackathons':
        return hackathons;
      default:
        return filteredEvents;
    }
  };

  const currentEvents = getTabEvents();

  // Committee managed events
  const committeeManagedEvents = eventsData.filter(event => 
    event.organizer.includes('ACE Committee') || 
    event.organizer.includes('Committee')
  );

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Committee Events Management</h1>
          <p className="text-gray-600 mt-2">
            Plan, organize, and manage college events and hackathons
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreateEvent} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
          <Badge variant="outline" className="text-green-600 border-green-200">
            {upcomingEvents.length} Upcoming
          </Badge>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            {committeeManagedEvents.length} Managed
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{eventsData.length}</p>
                <p className="text-sm text-gray-600">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hackathons.length}</p>
                <p className="text-sm text-gray-600">Hackathons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Edit className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{committeeManagedEvents.length}</p>
                <p className="text-sm text-gray-600">Committee Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {eventsData.reduce((sum, event) => sum + (event.currentParticipants || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Committee Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Committee Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Plus className="h-6 w-6" />
              <span>Create Event</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Edit className="h-6 w-6" />
              <span>Manage Events</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span>Registrations</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            All Events
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="hackathons" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Hackathons
          </TabsTrigger>
          <TabsTrigger value="managed" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Committee Events
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Events List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <EventFilters
              events={activeTab === 'managed' ? committeeManagedEvents : (activeTab === 'all' ? eventsData : currentEvents)}
              filteredEvents={activeTab === 'managed' ? committeeManagedEvents : currentEvents}
              onFilterChange={setFilters}
            />

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeTab === 'managed' ? committeeManagedEvents : currentEvents).map((event) => (
                <div key={event.id} className="relative">
                  <EventCard
                    event={event}
                    onRegister={handleEventRegister}
                    onViewDetails={handleEventViewDetails}
                    showRegisterButton={true}
                  />
                  {/* Committee Edit Button */}
                  {committeeManagedEvents.includes(event) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {currentEvents.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No events found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or create a new event.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            <EventsCalendar
              events={eventsData}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
            />
          </div>
        </div>
      </Tabs>
    </div>
  );
}
