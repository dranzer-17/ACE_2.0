from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...database import get_db
from ...models.collaboration import CollaborationPost
from ...models.user_models import User

router = APIRouter()

@router.get("/posts")
def get_collaboration_posts(db: Session = Depends(get_db)):
    """Get all collaboration posts with creator information"""
    posts = db.query(CollaborationPost).join(User).all()
    
    # Format the response to match frontend expectations
    formatted_posts = []
    for post in posts:
        formatted_post = {
            "id": post.id,
            "creator_id": post.creator_id,
            "post_type": post.post_type.value if post.post_type else None,
            "title": post.title,
            "description": post.description,
            "tags": post.tags or [],
            "status": post.status.value if post.status else "open",
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "creator": {
                "id": post.creator.id,
                "full_name": post.creator.full_name,
                "email": post.creator.email
            } if post.creator else None
        }
        formatted_posts.append(formatted_post)
    
    return formatted_posts

@router.post("/posts/{post_id}/initiate-chat")
def initiate_chat(post_id: int, db: Session = Depends(get_db)):
    """Initiate a chat conversation for a collaboration post"""
    # For now, return a mock conversation ID
    # This would typically create a new conversation in the database
    return {"conversation_id": f"conv_{post_id}_{1}"}