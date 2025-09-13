# Events System Components

This directory contains all the components and utilities for the college events management system.

## Components

### EventCard
A reusable card component that displays event information including:
- Event title, description, and details
- Date, time, and location
- Event type and status badges
- Registration information
- Action buttons (Register, View Details)

### EventsCalendar
A calendar view component that shows events organized by month with:
- Monthly navigation
- Event indicators on calendar dates
- Color-coded event types
- Interactive date and event clicking
- Event type legend

### EventFilters
A filtering component that allows users to filter events by:
- Search text (title, description, tags)
- Event type (hackathon, seminar, workshop, etc.)
- Category (tech, business, cultural, etc.)
- Status (upcoming, ongoing, completed)
- Featured events toggle

## Data Structure

### Event Interface
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'hackathon' | 'seminar' | 'workshop' | 'conference' | 'cultural' | 'sports' | 'academic';
  category: 'tech' | 'business' | 'cultural' | 'sports' | 'academic';
  organizer: string;
  maxParticipants?: number;
  currentParticipants?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  image?: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured: boolean;
  prizes?: string;
  sponsors?: string[];
}
```

## Usage

### Student Events Page
- View all events with calendar integration
- Filter and search events
- Register for events
- View event details
- Separate tabs for different event categories

### Faculty Events Page
- All student features plus:
- Create and manage their own events
- Edit events they organize
- View registration analytics

### Committee Events Page
- All faculty features plus:
- Manage committee-organized events
- Access to analytics and reporting
- Enhanced event management tools

### Admin Events Page
- Complete administrative control:
- Create, edit, and delete any event
- Export/import event data
- Advanced analytics and reporting
- User registration management
- System settings

## Features

### Event Types
- **Hackathons**: Tech competitions with prizes
- **Seminars**: Educational presentations
- **Workshops**: Hands-on learning sessions
- **Conferences**: Professional gatherings
- **Cultural**: Arts and cultural events
- **Sports**: Athletic competitions
- **Academic**: Educational events

### Event Categories
- **Tech**: Technology-focused events
- **Business**: Business and entrepreneurship
- **Cultural**: Arts and culture
- **Sports**: Athletic activities
- **Academic**: Educational content

### Key Features
- Calendar integration with month navigation
- Advanced filtering and search
- Event registration system
- Featured events highlighting
- Real-time participant tracking
- Responsive design for all devices
- Role-based access control

## Dummy Data

The system includes comprehensive dummy data featuring:
- Mumbai Tech Hackathon 2024
- FinTech Innovation Summit
- AI/ML Workshop Series
- Startup Pitch Competition
- Mumbai Heritage Tech Challenge
- Cybersecurity Awareness Seminar
- Green Tech Innovation Challenge
- Digital Marketing Masterclass
- Mumbai Smart City Hackathon
- Women in Tech Conference

All events are designed to reflect Mumbai college culture with relevant sponsors, locations, and themes.
