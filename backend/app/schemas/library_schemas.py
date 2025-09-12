from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookCreate(BaseModel):
    title: str
    author: str
    isbn: str
    description: Optional[str] = None
    category: Optional[str] = None
    total_copies: int = 1

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    total_copies: Optional[int] = None
    status: Optional[str] = None

# We can add more detailed response schemas later if needed