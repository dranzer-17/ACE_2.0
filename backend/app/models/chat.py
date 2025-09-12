from sqlalchemy import Column, Integer, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from .base import Base

# Association Table for Many-to-Many relationship
conversation_participants = Table('conversation_participants', Base.metadata,
    Column('conversation_id', Integer, ForeignKey('chat_conversations.id')),
    Column('user_id', Integer, ForeignKey('users.id'))
)

class ChatConversation(Base):
    __tablename__ = "chat_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("collaboration_posts.id"))

    post = relationship("CollaborationPost", back_populates="conversation")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")
    participants = relationship("User", secondary=conversation_participants, back_populates="conversations")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("chat_conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)

    conversation = relationship("ChatConversation", back_populates="messages")
    sender = relationship("User", back_populates="messages")

# Add relationships to User model in `user.py`
# class User(Base):
#   ...
#   collaboration_posts = relationship("CollaborationPost", back_populates="creator")
#   conversations = relationship("ChatConversation", secondary=conversation_participants, back_populates="participants")
#   messages = relationship("ChatMessage", back_populates="sender")