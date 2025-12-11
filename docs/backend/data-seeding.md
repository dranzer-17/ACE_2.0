# Backend Data Seeding

This section describes the JSON files used to seed the backend database with initial data or to provide static data for various application features. These files are essential for setting up a functional development environment and understanding the data structures.

## `backend/app/applications_data.json`

This file contains sample application records for committee positions. Each entry represents a student's application with details about their resume, experience, and the status of their application.

```json
[
  {
    "id": "417b59bf-f946-4dab-a118-765fd54f1a7f",
    "student_id": "student123",
    "student_name": "John Doe",
    "student_email": "john.doe@college.edu",
    "committee_id": 1,
    "position_id": 1,
    "cover_message": "XCBFDH",
    "resume_skills": [
      "leadership",
      "communication",
      "programming",
      "event_planning",
      "teamwork"
    ],
    "experience": "DZSG",
    "recommendation_score": 50.0,
    "recommendation_reason": "Moderate match. You have 2 out of 4 required skills: communication, leadership",
    "applied_at": "2025-09-13T11:26:08.847049",
    "status": "accepted"
  }
]
```

## `backend/app/chat_data.json`

This file defines the initial chat rooms available in the application, including university-wide, group-specific, and study-group chats. It outlines the room ID, name, type, and participants.

```json
{
  "rooms": [
    {
      "id": "university_general",
      "name": "University General",
      "type": "university",
      "participants": ["1", "2", "3", "4", "5", "6"],
      "unreadCount": 0,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "computer_science",
      "name": "Computer Science Students",
      "type": "group",
      "participants": ["1", "2", "4", "5"],
      "unreadCount": 2,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "study_group",
      "name": "Study Group",
      "type": "group",
      "participants": ["1", "3", "4"],
      "unreadCount": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## `backend/app/committees_data.json`

This file contains data for various committees within the institution, including their descriptions, available positions, requirements, and deadlines. It serves as a comprehensive list of organizational bodies and opportunities.

```json
[
  {
    "id": 1,
    "name": "Student Council",
    "description": "The Student Council represents the voice of students and works to improve campus life through various initiatives and events.",
    "positions": [
      {
        "id": 1,
        "title": "President",
        "description": "Lead the student council and represent students in college administration meetings",
        "requirements": ["Leadership experience", "Public speaking", "Event management"],
        "skills_required": ["leadership", "communication", "management", "public_speaking"],
        "status": "open",
        "application_deadline": "2025-010-15"
      },
      {
        "id": 2,
        "title": "Vice President",
        "description": "Support the president and manage internal council operations",
        "requirements": ["Team management", "Organizational skills", "Communication"],
        "skills_required": ["leadership", "organization", "communication", "teamwork"],
        "status": "open",
        "application_deadline": "2025-010-15"
      },
      {
        "id": 3,
        "title": "Secretary",
        "description": "Maintain records, manage communications, and coordinate meetings",
        "requirements": ["Documentation skills", "Time management", "Communication"],
        "skills_required": ["documentation", "organization", "communication", "time_management"],
        "status": "open",
        "application_deadline": "2025-02-15"
      }
    ],
    "category": "governance",
    "contact_email": "studentcouncil@college.edu"
  }
]
```

## `backend/app/library_data.json`

This file provides a list of books available in the library, including their title, author, ISBN, description, category, and copy count. This data is used to populate the library system.

```json
[
  {
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "description": "A comprehensive guide to writing clean, maintainable code with practical examples and best practices.",
    "category": "Programming",
    "total_copies": 3,
    "available_copies": 3
  },
  {
    "title": "The Pragmatic Programmer",
    "author": "David Thomas, Andrew Hunt",
    "isbn": "9780201616224",
    "description": "Essential reading for software developers, covering practical approaches to programming and career development.",
    "category": "Programming",
    "total_copies": 2,
    "available_copies": 2
  }
]
```

## `backend/app/menu_data.json`

This file lists the food and beverage items available in the canteen, along with their prices, descriptions, and categories (e.g., veg, non-veg, jain). This data populates the canteen menu interface.

```json
[
  {
    "name": "Samosa",
    "description": "Crispy pastry with spiced potato filling.",
    "price": 20.00,
    "category": "veg,jain"
  },
  {
    "name": "Vada Pav",
    "description": "The classic Mumbai street food.",
    "price": 25.00,
    "category": "veg"
  },
  {
    "name": "Paneer Tikka Roll",
    "description": "Spiced paneer wrapped in a soft flatbread.",
    "price": 80.00,
    "category": "veg"
  }
]
```

## `backend/app/messages_data.json`

This file contains sample chat messages organized by room, including sender details, content, timestamps, and read status. It provides representative data for the chat functionality in the application.

```json
{
  "messages": [
    {
      "id": "msg_001",
      "roomId": "university_general",
      "senderId": "2",
      "senderName": "Sarah Johnson",
      "senderAvatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
      "content": "Hey everyone! How's everyone doing with the midterm exams?",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "isRead": true,
      "messageType": "text"
    },
    {
      "id": "msg_003",
      "roomId": "computer_science",
      "senderId": "1",
      "senderName": "John Student",
      "senderAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      "content": "Anyone working on the AI project? Need some help with the neural network implementation",
      "timestamp": "2024-01-15T14:20:00.000Z",
      "isRead": false,
      "messageType": "text"
    }
  ]
}
```