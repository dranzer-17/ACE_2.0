from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
import json
import os
from datetime import datetime, timezone
from typing import List, Optional
import uuid

# Chat data storage
CHAT_DATA_FILE = "app/chat_data.json"
MESSAGES_FILE = "app/messages_data.json"
USERS_FILE = "app/users_data.json"

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

# Initialize chat data if files don't exist
def initialize_chat_data():
    """Initialize chat data files with sample data"""
    
    # Sample users data
    if not os.path.exists(USERS_FILE):
        users_data = {
            "users": [
                {
                    "id": "1",
                    "name": "John Student",
                    "email": "john@university.edu",
                    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
                    "isOnline": True,
                    "role": "student",
                    "lastSeen": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "2",
                    "name": "Sarah Johnson",
                    "email": "sarah@university.edu",
                    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
                    "isOnline": True,
                    "role": "student",
                    "lastSeen": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "3",
                    "name": "Mike Chen",
                    "email": "mike@university.edu",
                    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
                    "isOnline": False,
                    "role": "student",
                    "lastSeen": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "4",
                    "name": "Emily Davis",
                    "email": "emily@university.edu",
                    "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                    "isOnline": True,
                    "role": "student",
                    "lastSeen": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "5",
                    "name": "Alex Rodriguez",
                    "email": "alex@university.edu",
                    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
                    "isOnline": True,
                    "role": "student",
                    "lastSeen": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "6",
                    "name": "Dr. Smith",
                    "email": "smith@university.edu",
                    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
                    "isOnline": False,
                    "role": "faculty",
                    "lastSeen": datetime.now(timezone.utc).isoformat()
                }
            ]
        }
        with open(USERS_FILE, 'w') as f:
            json.dump(users_data, f, indent=2)

    # Sample chat rooms data
    if not os.path.exists(CHAT_DATA_FILE):
        chat_data = {
            "rooms": [
                {
                    "id": "university_general",
                    "name": "University General",
                    "type": "university",
                    "participants": ["1", "2", "3", "4", "5", "6"],
                    "unreadCount": 0,
                    "createdAt": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "computer_science",
                    "name": "Computer Science Students",
                    "type": "group",
                    "participants": ["1", "2", "4", "5"],
                    "unreadCount": 2,
                    "createdAt": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "study_group",
                    "name": "Study Group",
                    "type": "group",
                    "participants": ["1", "3", "4"],
                    "unreadCount": 1,
                    "createdAt": datetime.now(timezone.utc).isoformat()
                }
            ]
        }
        with open(CHAT_DATA_FILE, 'w') as f:
            json.dump(chat_data, f, indent=2)

    # Sample messages data
    if not os.path.exists(MESSAGES_FILE):
        now = datetime.now(timezone.utc)
        messages_data = {
            "messages": [
                {
                    "id": str(uuid.uuid4()),
                    "roomId": "university_general",
                    "senderId": "2",
                    "senderName": "Sarah Johnson",
                    "senderAvatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
                    "content": "Hey everyone! How's everyone doing with the midterm exams?",
                    "timestamp": (now.replace(hour=10, minute=30)).isoformat(),
                    "isRead": True,
                    "messageType": "text"
                },
                {
                    "id": str(uuid.uuid4()),
                    "roomId": "university_general",
                    "senderId": "4",
                    "senderName": "Emily Davis",
                    "senderAvatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                    "content": "Pretty good! The math exam was challenging but I think I did well 😊",
                    "timestamp": (now.replace(hour=10, minute=35)).isoformat(),
                    "isRead": True,
                    "messageType": "text"
                },
                {
                    "id": str(uuid.uuid4()),
                    "roomId": "computer_science",
                    "senderId": "1",
                    "senderName": "John Student",
                    "senderAvatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
                    "content": "Anyone working on the AI project? Need some help with the neural network implementation",
                    "timestamp": (now.replace(hour=14, minute=20)).isoformat(),
                    "isRead": False,
                    "messageType": "text"
                },
                {
                    "id": str(uuid.uuid4()),
                    "roomId": "computer_science",
                    "senderId": "5",
                    "senderName": "Alex Rodriguez",
                    "senderAvatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
                    "content": "I can help! Which part are you struggling with?",
                    "timestamp": (now.replace(hour=14, minute=25)).isoformat(),
                    "isRead": False,
                    "messageType": "text"
                },
                {
                    "id": str(uuid.uuid4()),
                    "roomId": "study_group",
                    "senderId": "4",
                    "senderName": "Emily Davis",
                    "senderAvatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                    "content": "Study session tomorrow at the library at 2 PM. Who's joining?",
                    "timestamp": (now.replace(hour=16, minute=45)).isoformat(),
                    "isRead": True,
                    "messageType": "text"
                }
            ]
        }
        with open(MESSAGES_FILE, 'w') as f:
            json.dump(messages_data, f, indent=2)

def load_data(file_path: str):
    """Load data from JSON file"""
    if not os.path.exists(file_path):
        return {}
    with open(file_path, 'r') as f:
        return json.load(f)

def save_data(file_path: str, data: dict):
    """Save data to JSON file"""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

@router.get("/rooms/{user_id}")
async def get_chat_rooms(user_id: str):
    """Get all chat rooms for a user"""
    initialize_chat_data()
    
    chat_data = load_data(CHAT_DATA_FILE)
    users_data = load_data(USERS_FILE)
    messages_data = load_data(MESSAGES_FILE)
    
    rooms = []
    for room in chat_data.get("rooms", []):
        if user_id in room["participants"]:
            # Get participants details
            participants = []
            for participant_id in room["participants"]:
                user = next((u for u in users_data.get("users", []) if u["id"] == participant_id), None)
                if user:
                    participants.append(user)
            
            # Get last message
            last_message = None
            room_messages = [m for m in messages_data.get("messages", []) if m["roomId"] == room["id"]]
            if room_messages:
                last_message = max(room_messages, key=lambda x: x["timestamp"])
            
            # Count unread messages
            unread_count = len([m for m in room_messages if not m["isRead"] and m["senderId"] != user_id])
            
            room_data = {
                "id": room["id"],
                "name": room["name"],
                "type": room["type"],
                "participants": participants,
                "lastMessage": last_message,
                "unreadCount": unread_count
            }
            rooms.append(room_data)
    
    return JSONResponse(content={
        "success": True,
        "data": rooms,
        "message": "Chat rooms loaded successfully"
    })

@router.get("/messages/{room_id}")
async def get_chat_messages(room_id: str, limit: int = Query(50, ge=1, le=100)):
    """Get messages for a specific chat room"""
    initialize_chat_data()
    
    messages_data = load_data(MESSAGES_FILE)
    room_messages = [m for m in messages_data.get("messages", []) if m["roomId"] == room_id]
    
    # Sort by timestamp (newest first) and limit
    room_messages.sort(key=lambda x: x["timestamp"], reverse=True)
    room_messages = room_messages[:limit]
    
    # Sort back to chronological order (oldest first)
    room_messages.reverse()
    
    return JSONResponse(content={
        "success": True,
        "data": room_messages,
        "message": "Messages loaded successfully"
    })

@router.post("/send")
async def send_chat_message(message_data: dict):
    """Send a new message to a chat room"""
    initialize_chat_data()
    
    try:
        room_id = message_data.get("roomId")
        sender_id = message_data.get("senderId")
        content = message_data.get("content")
        message_type = message_data.get("messageType", "text")
        
        if not all([room_id, sender_id, content]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Load existing data
        messages_data = load_data(MESSAGES_FILE)
        users_data = load_data(USERS_FILE)
        
        # Find sender details
        sender = next((u for u in users_data.get("users", []) if u["id"] == sender_id), None)
        if not sender:
            raise HTTPException(status_code=404, detail="Sender not found")
        
        # Create new message
        new_message = {
            "id": str(uuid.uuid4()),
            "roomId": room_id,
            "senderId": sender_id,
            "senderName": sender["name"],
            "senderAvatar": sender.get("avatar"),
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "isRead": False,
            "messageType": message_type
        }
        
        # Add message to data
        if "messages" not in messages_data:
            messages_data["messages"] = []
        messages_data["messages"].append(new_message)
        
        # Save data
        save_data(MESSAGES_FILE, messages_data)
        
        return JSONResponse(content={
            "success": True,
            "data": new_message,
            "message": "Message sent successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users/online")
async def get_online_users():
    """Get list of online users"""
    initialize_chat_data()
    
    users_data = load_data(USERS_FILE)
    online_users = [u for u in users_data.get("users", []) if u.get("isOnline", False)]
    
    return JSONResponse(content={
        "success": True,
        "data": online_users,
        "message": "Online users loaded successfully"
    })

@router.post("/users/{user_id}/online")
async def set_user_online(user_id: str, is_online: bool = True):
    """Set user online status"""
    initialize_chat_data()
    
    users_data = load_data(USERS_FILE)
    
    # Update user status
    for user in users_data.get("users", []):
        if user["id"] == user_id:
            user["isOnline"] = is_online
            user["lastSeen"] = datetime.now(timezone.utc).isoformat()
            break
    
    save_data(USERS_FILE, users_data)
    
    return JSONResponse(content={
        "success": True,
        "message": f"User status updated to {'online' if is_online else 'offline'}"
    })

@router.post("/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    """Mark a message as read"""
    initialize_chat_data()
    
    messages_data = load_data(MESSAGES_FILE)
    
    # Find and update message
    for message in messages_data.get("messages", []):
        if message["id"] == message_id:
            message["isRead"] = True
            break
    
    save_data(MESSAGES_FILE, messages_data)
    
    return JSONResponse(content={
        "success": True,
        "message": "Message marked as read"
    })

@router.post("/rooms")
async def create_chat_room(room_data: dict):
    """Create a new chat room"""
    initialize_chat_data()
    
    try:
        name = room_data.get("name")
        room_type = room_data.get("type", "group")
        participants = room_data.get("participants", [])
        
        if not name or not participants:
            raise HTTPException(status_code=400, detail="Name and participants are required")
        
        chat_data = load_data(CHAT_DATA_FILE)
        
        new_room = {
            "id": str(uuid.uuid4()),
            "name": name,
            "type": room_type,
            "participants": participants,
            "unreadCount": 0,
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        
        if "rooms" not in chat_data:
            chat_data["rooms"] = []
        chat_data["rooms"].append(new_room)
        
        save_data(CHAT_DATA_FILE, chat_data)
        
        return JSONResponse(content={
            "success": True,
            "data": new_room,
            "message": "Chat room created successfully"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Initialize data on startup
initialize_chat_data()
