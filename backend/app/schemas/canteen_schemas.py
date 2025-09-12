from pydantic import BaseModel, constr
from typing import List, Optional
from decimal import Decimal
import datetime

# ===================================================================
# --- Menu Item Schemas ---
# ===================================================================

# Base schema for a menu item, containing common fields
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    # Enforce category can only be one of these values
    category: str
    is_available: bool = True

# Schema for creating a new menu item (used by Admin)
class MenuItemCreate(MenuItemBase):
    pass

# Schema for updating an existing menu item (used by Admin)
class MenuItemUpdate(MenuItemBase):
    pass

# Schema for sending menu item data to the frontend (includes the ID)
class MenuItem(MenuItemBase):
    id: int

    class Config:
        from_attributes = True

# ===================================================================
# --- Order Schemas ---
# ===================================================================

# Schema for a single item within a new order request (sent from Student)
class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int
    special_instructions: Optional[str] = None

# Schema for the entire new order request (sent from Student)
class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    user_id: int

# --- Schemas for Reading Order Data ---

# Schema for displaying a single item within an existing order
class OrderItem(BaseModel):
    id: int
    quantity: int
    special_instructions: Optional[str] = None
    menu_item: MenuItem # Nest the full menu item details

    class Config:
        from_attributes = True

# Schema for displaying a user's details within an order (for Admin view)
class UserInOrder(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True

# Schema for sending full order details to the frontend
class Order(BaseModel):
    id: int
    user: UserInOrder # Nest the user's details
    status: str
    created_at: datetime.datetime
    items: List[OrderItem] # A list of items in the order

    class Config:
        from_attributes = True