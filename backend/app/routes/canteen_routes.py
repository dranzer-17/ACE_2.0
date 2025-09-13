from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session, joinedload
from typing import List

from .. import database
from ..models import user_models as models
from ..schemas import canteen_schemas as schemas

router = APIRouter(
    prefix="/canteen",
    tags=["Canteen"]
)

# --- Placeholders for Authentication (keep as is) ---
def get_current_user_id_placeholder(user_id: int = Body(...)):
    return user_id


@router.get("/debug/info")
def get_debug_info(db: Session = Depends(database.get_db)):
    """
    Debug endpoint to check database state
    """
    users = db.query(models.User).all()
    menu_items = db.query(models.MenuItem).all()
    
    return {
        "users": [{"id": u.id, "name": u.full_name, "email": u.email} for u in users],
        "menu_items": [{"id": m.id, "name": m.name, "price": m.price} for m in menu_items]
    }

@router.get("/menu", response_model=List[schemas.MenuItem])
def get_menu(db: Session = Depends(database.get_db)):
    """
    Fetches all available menu items for students to view.
    """
    # This query is simple and should work, but we'll ensure it's robust.
    menu_items = db.query(models.MenuItem).filter(models.MenuItem.is_available == True).all()
    return menu_items

@router.post("/orders", status_code=status.HTTP_201_CREATED, response_model=schemas.Order)
def place_order(order_data: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    """
    Allows a student to place a new order.
    The user_id is now part of the order_data object.
    """
    print(f"Received order data: {order_data}")
    
    # Validate user exists
    user = db.query(models.User).filter(models.User.id == order_data.user_id).first()
    if not user:
        available_users = db.query(models.User).all()
        print(f"Available users: {[(u.id, u.full_name) for u in available_users]}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"User with ID {order_data.user_id} not found. Please ensure the user is registered."
        )
    
    # Validate all menu items exist
    for item_data in order_data.items:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item_data.menu_item_id).first()
        if not menu_item:
            available_items = db.query(models.MenuItem).all()
            print(f"Available menu items: {[(m.id, m.name) for m in available_items]}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Menu item with ID {item_data.menu_item_id} not found."
            )
        
    new_order = models.Order(user_id=order_data.user_id, status="placed")
    db.add(new_order)
    db.flush()  # Use flush to get the new_order.id before committing

    for item_data in order_data.items:
        new_order_item = models.OrderItem(
            order_id=new_order.id,
            menu_item_id=item_data.menu_item_id,
            quantity=item_data.quantity,
            special_instructions=item_data.special_instructions
        )
        db.add(new_order_item)
    
    db.commit()
    
    # Reload the order with all relationships to ensure proper serialization
    order_with_relations = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.user),
            joinedload(models.Order.items).joinedload(models.OrderItem.menu_item)
        )
        .filter(models.Order.id == new_order.id)
        .first()
    )
    
    return order_with_relations

# ===================================================================
# --- Admin-Facing Endpoints ---
# ===================================================================

@router.get("/admin/orders", response_model=List[schemas.Order])
def get_active_orders(db: Session = Depends(database.get_db)):
    """
    Fetches all orders that have not yet been delivered for the admin dashboard.
    """
    # --- THIS IS THE CORRECTED QUERY ---
    # We use `options(joinedload(...))` to tell SQLAlchemy to fetch the related
    # user and menu_item data in the same query. This prevents crashes and is more efficient.
    orders = (
        db.query(models.Order)
        .options(
            joinedload(models.Order.user), 
            joinedload(models.Order.items).joinedload(models.OrderItem.menu_item)
        )
        .filter(models.Order.status != "delivered")
        .order_by(models.Order.created_at.desc())
        .all()
    )
    return orders

@router.put("/admin/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, new_status: str = Body(..., embed=True), db: Session = Depends(database.get_db)):
    """
    Allows an admin to update the status of an order.
    """
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order

# The rest of the admin menu management routes are simple and should be correct
@router.post("/admin/menu", status_code=status.HTTP_201_CREATED, response_model=schemas.MenuItem)
def create_menu_item(item: schemas.MenuItemCreate, db: Session = Depends(database.get_db)):
    new_item = models.MenuItem(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/admin/menu/{item_id}", response_model=schemas.MenuItem)
def update_menu_item(item_id: int, item_data: schemas.MenuItemUpdate, db: Session = Depends(database.get_db)):
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
    Allows an admin to delete a menu item, but only if it's not part of any existing orders.
    """
    # 1. Check if this menu item is part of any order items
    existing_order_item = db.query(models.OrderItem).filter(models.OrderItem.menu_item_id == item_id).first()
    if existing_order_item:
        # If it exists in an order, block the deletion and return a friendly error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete this item because it is part of an existing order. Consider marking it as 'unavailable' instead."
        )

    # 2. Find the menu item to delete
    menu_item_to_delete = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not menu_item_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")
    
    # 3. If no orders are associated, proceed with deletion
    db.delete(menu_item_to_delete)
    db.commit()
    return