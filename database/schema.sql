-- Enum for different types of collaboration posts
CREATE TYPE post_type_enum AS ENUM ('task', 'research', 'hackathon', 'volunteering');

-- Table to store the collaboration posts/listings
CREATE TABLE collaboration_posts (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_type post_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[], -- For easy searching, e.g., ['python', 'machine-learning', 'react']
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'closed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table to represent a chat conversation, linked to a post
CREATE TABLE chat_conversations (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES collaboration_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction table to manage participants in a conversation (many-to-many)
CREATE TABLE conversation_participants (
    conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, user_id)
);

-- Table to store the actual chat messages
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL, -- Keep message even if user is deleted
    content TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster queries on foreign keys and timestamps
CREATE INDEX ON collaboration_posts (creator_id);
CREATE INDEX ON chat_conversations (post_id);
CREATE INDEX ON chat_messages (conversation_id, sent_at);```

---

### **2. Backend (FastAPI)**

The backend will handle creating posts, initiating chats, and managing the real-time WebSocket connections.

#### **a. SQLAlchemy Models (`backend/app/models/`)**

Create new files for `collaboration.py` and `chat.py`.

**`backend/app/models/collaboration.py`**
```python
from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from .base import Base # Your declarative base
from .feedback import FeedbackCategory # Re-using enum from previous example

class CollaborationPost(Base):
    __tablename__ = "collaboration_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    post_type = Column(Enum(FeedbackCategory, name="post_type_enum"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tags = Column(ARRAY(String))
    status = Column(String, default="open")

    creator = relationship("User", back_populates="collaboration_posts")
    conversation = relationship("ChatConversation", uselist=False, back_populates="post")