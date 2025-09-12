from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import List

from .. import database
from ..models import user_models as models
from ..schemas import canteen_schemas as schemas

router = APIRouter(
    prefix="/canteen",
    tags=["Canteen"]
)

# --- A placeholder for authentication ---
# In a real app, this would decode a JWT token to get the user.
# For the hackathon, we will pass the user_id in the request body for simplicity.
def get_current_user_id_placeholder(user_id: int = Body(...)):
    return user_id

# --- A placeholder for admin role check ---
# In a real app, this would check the user's role from a JWT.
def require_admin_role_placeholder(user_id: int = Body(...), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or user.role.name != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id

# ===================================================================
# --- Student-Facing Endpoints ---
# ===================================================================

@router.get("/menu", response_model=List[schemas.MenuItem])
def get_menu(db: Session = Depends(database.get_db)):
    """
    Fetches all available menu items for students to view.
    """
    menu_items = db.query(models.MenuItem).filter(models.MenuItem.is_available == True).all()
    return menu_items

@router.post("/orders", status_code=status.HTTP_201_CREATED, response_model=schemas.Order)
def place_order(order_data: schemas.OrderCreate, db: Session = Depends(database.get_db), user_id: int = Depends(get_current_user_id_placeholder)):
    """
    Allows a student to place a new order.
    NOTE: The user_id is passed in the request body for this hackathon version.
    """
    # Create the main order entry
    new_order = models.Order(user_id=user_id, status="placed")
    db.add(new_order)
    db.commit()

    # Add each item from the order request to the database
    for item in order_data.items:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Menu item with id {item.menu_item_id} not found")
        
        new_order_item = models.OrderItem(
            order_id=new_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
            special_instructions=item.special_instructions
        )
        db.add(new_order_item)
    
    db.commit()
    db.refresh(new_order)
    return new_order

# ===================================================================
# --- Admin-Facing Endpoints ---
# ===================================================================

@router.get("/admin/orders", response_model=List[schemas.Order])
def get_active_orders(db: Session = Depends(database.get_db)): # Add require_admin_role_placeholder dependency later
    """
    Fetches all orders that have not yet been delivered for the admin dashboard.
    """
    orders = db.query(models.Order).filter(models.Order.status != "delivered").order_by(models.Order.created_at.desc()).all()
    return orders

@router.put("/admin/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, new_status: str = Body(..., embed=True), db: Session = Depends(database.get_db)):
    """
    Allows an admin to update the status of an order (e.g., preparing, ready_for_pickup, delivered).
    """
    order_query = db.query(models.Order).filter(models.Order.id == order_id)
    order = order_query.first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    order_query.update({"status": new_status})
    db.commit()
    db.refresh(order)
    return order

@router.post("/admin/menu", status_code=status.HTTP_201_CREATED, response_model=schemas.MenuItem)
def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(database.get_db)):
    """
    Allows an admin to add a new item to the menu.
    """
    new_item = models.MenuItem(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/admin/menu/{item_id}", response_model=schemas.MenuItem)
def update_menu_item(item_id: int, item_data: schemas.MenuItemUpdate, db: Session = Depends(database.get_db)):
    """
    Allows an admin to update an existing menu item.
    """
    item_query = db.query(models.MenuItem).filter(models.MenuItem.id == item_id)
    menu_item = item_query.first()
    if not menu_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    
    item_query.update(item_data.dict())
    db.commit()
    db.refresh(menu_item)
    return menu_item

@router.delete("/admin/menu/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(item_id: int, db: Session = Depends(database.get_db)):
    """
    Allows an admin to delete a menu item.
    """
    item_query = db.query(models.MenuItem).filter(models.MenuItem.id == item_id)
    if not item_query.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    
    item_query.delete(synchronize_session=False)
    db.commit()
    return
