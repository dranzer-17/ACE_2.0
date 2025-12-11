# Backend Data Seeding

This section describes the initial JSON data files used by the backend to populate some modules with sample data at startup, primarily for development and demonstration purposes.

## `backend/app/chat_data.json`

This file contains an array of predefined chat rooms with participant details. It's used to simulate initial chat room availability.

### Structure
An object with a `rooms` array. Each room object contains:
-   `id`: Unique identifier for the room.
-   `name`: Display name of the chat room.
-   `type`: Type of room (e.g., 'university', 'group').
-   `participants`: An array of user IDs participating in the room.
-   `unreadCount`: Number of unread messages (for simulation).
-   `createdAt`: Timestamp of room creation.

### Example (`rooms` array excerpt)

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
    // ... other rooms
  ]
}
```

## `backend/app/library_data.json`

This file contains an array of predefined books for the library system. It's used to populate the initial library catalog.

### Structure
An array of book objects. Each book object contains:
-   `title`: Title of the book.
-   `author`: Author(s) of the book.
-   `isbn`: International Standard Book Number (unique).
-   `description`: Short description of the book.
-   `category`: Genre or subject category.
-   `total_copies`: Total number of copies owned by the library.
-   `available_copies`: Number of copies currently available for allocation.

### Example (array excerpt)

```json
[
  {
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "description": "A comprehensive guide to writing clean, maintainable code...",
    "category": "Programming",
    "total_copies": 3,
    "available_copies": 3
  },
  // ... other books
]
```

## `backend/app/menu_data.json`

This file contains an array of menu items available in the canteen. It's used to seed the canteen menu.

### Structure
An array of menu item objects. Each item contains:
-   `name`: Name of the food item.
-   `description`: Short description.
-   `price`: Price of the item.
-   `category`: Comma-separated categories (e.g., 'veg', 'non-veg', 'jain').

### Example (array excerpt)

```json
[
  {
    "name": "Samosa",
    "description": "Crispy pastry with spiced potato filling.",
    "price": 20.00,
    "category": "veg,jain"
  },
  // ... other menu items
]
```

## `backend/app/messages_data.json`

This file contains simulated chat messages for various rooms. It's used to provide context and history for the chat feature.

### Structure
An object with a `messages` array. Each message object contains:
-   `id`: Unique identifier for the message.
-   `roomId`: ID of the chat room the message belongs to.
-   `senderId`: ID of the user who sent the message.
-   `senderName`: Display name of the sender.
-   `senderAvatar`: URL to the sender's avatar image.
-   `content`: The message text content.
-   `timestamp`: ISO 8601 timestamp of when the message was sent.
-   `isRead`: Boolean indicating if the message has been read.
-   `messageType`: Type of message (e.g., 'text').

### Example (`messages` array excerpt)

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
    // ... other messages
  ]
}
```