from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .user_models import Base
import enum

class PostType(enum.Enum):
    task = "task"
    research = "research"
    hackathon = "hackathon"
    volunteering = "volunteering"

class PostStatus(enum.Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"

class CollaborationPost(Base):
    __tablename__ = "collaboration_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_type = Column(Enum(PostType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tags = Column(ARRAY(String))
    status = Column(Enum(PostStatus), default=PostStatus.open)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    creator = relationship("User", back_populates="collaboration_posts")
    conversations = relationship("ChatConversation", back_populates="post")

class ChatConversation(Base):
    __tablename__ = "chat_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("collaboration_posts.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    post = relationship("CollaborationPost", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation")
    participants = relationship("ConversationParticipant", back_populates="conversation")

class ConversationParticipant(Base):
    __tablename__ = "conversation_participants"
    
    conversation_id = Column(Integer, ForeignKey("chat_conversations.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)

    # Relationships
    conversation = relationship("ChatConversation", back_populates="participants")
    user = relationship("User")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("chat_conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    conversation = relationship("ChatConversation", back_populates="messages")
    sender = relationship("User")
