"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/app/lib/apiService"; // Corrected path if your apiService is in lib
import { toast } from "sonner";

// --- Import UI Components ---
import { MenuItemCard, MenuItem } from "@/components/canteen/MenuCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- Define the shape of an item in our shopping cart ---
type CartItem = {
  menuItem: MenuItem;
  quantity: number;
  instructions: string;
};

// --- Define the shape of the successful order for the modal ---
type PlacedOrderDetails = {
  id: number;
  items: CartItem[];
  totalPrice: number;
};

export default function StudentCanteenPage() {
  const { user } = useAuth();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // State for the "Add to Cart" modal
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState<string>("");

  // --- NEW STATE for the success modal ---
  const [lastOrder, setLastOrder] = useState<PlacedOrderDetails | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      const result = await apiService.getMenu();
      if (result.success) {
        setMenu(result.data);
      } else {
        toast.error(result.message);
      }
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  const handleFilterChange = (category: string) => {
    setFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(category)) {
        newFilters.delete(category);
      } else {
        newFilters.add(category);
      }
      return Array.from(newFilters);
    });
  };

  const filteredMenu =
    filters.length > 0
      ? menu.filter((item) =>
          filters.some(filterCat => item.category.split(',').includes(filterCat))
        )
      : menu;

  const handleOpenAddToCartModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setInstructions("");
  };

  const handleConfirmAddToCart = () => {
    if (!selectedItem || quantity < 1) return;
    const existingItemIndex = cart.findIndex(ci => ci.menuItem.id === selectedItem.id && ci.instructions === instructions);

    if (existingItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { menuItem: selectedItem, quantity, instructions }]);
    }
    toast.success(`${quantity} x ${selectedItem.name} added to cart.`);
    setSelectedItem(null);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };
  
  const totalCartPrice = cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);

  // --- UPDATED Order Submission ---
  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) return;
    setIsPlacingOrder(true);

    console.log("Current user:", user);
    console.log("User ID:", user.id, "Type:", typeof user.id);

    const fullOrderData = {
      user_id: parseInt(user.id), // Convert string ID to integer
      items: cart.map(ci => ({
        menu_item_id: ci.menuItem.id,
        quantity: ci.quantity,
        special_instructions: ci.instructions,
      })),
    };
    
    console.log("Order data being sent:", fullOrderData);
    
    const result = await apiService.placeOrder(fullOrderData);

    if (result.success && result.order) { // Check for `result.order`
      setLastOrder({
        id: result.order.id, // Use the new `order` property
        items: cart,
        totalPrice: totalCartPrice
      });
      setCart([]);
    } else {
      toast.error(result.message);
    }
    setIsPlacingOrder(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Canteen Menu</h1>

      <div className="flex items-center space-x-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="font-semibold">Preferences:</p>
        {['veg', 'non-veg', 'jain'].map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox id={category} onCheckedChange={() => handleFilterChange(category)} />
            <Label htmlFor={category} className="capitalize">{category}</Label>
          </div>
        ))}
      </div>

      {isLoading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map((item) => (
            <MenuItemCard key={item.id} item={item} onAddToCart={handleOpenAddToCartModal} />
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg" size="icon">
              <ShoppingCart />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Your Order</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {cart.map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{item.quantity} x {item.menuItem.name}</p>
                    {item.instructions && <p className="text-xs text-gray-500">"{item.instructions}"</p>}
                  </div>
                  <div className="flex items-center gap-4">
                     <p>₹{(item.menuItem.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}><X className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="flex-col items-stretch gap-2">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalCartPrice.toFixed(2)}</span>
                </div>
              <Button size="lg" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!selectedItem} onOpenChange={(isOpen) => !isOpen && setSelectedItem(null)}>
          <DialogContent>
              <DialogHeader><DialogTitle>Add "{selectedItem?.name}" to Cart</DialogTitle></DialogHeader>
              <div className="space-y-4">
                  <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} />
                  </div>
                  <div>
                      <Label htmlFor="instructions">Special Instructions (optional)</Label>
                      <Textarea id="instructions" placeholder="e.g., extra spicy, no salt..." value={instructions || ""} onChange={(e) => setInstructions(e.target.value)} />
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedItem(null)}>Cancel</Button>
                  <Button onClick={handleConfirmAddToCart}>Confirm Add</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {/* --- NEW "ORDER SUCCESS" MODAL --- */}
      <Dialog open={!!lastOrder} onOpenChange={() => setLastOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-600">Order Placed Successfully!</DialogTitle>
            <DialogDescription>Your order #{lastOrder?.id} has been sent to the canteen.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[50vh] overflow-y-auto">
            {lastOrder?.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{item.quantity} x {item.menuItem.name}</p>
                  {item.instructions && <p className="text-xs text-gray-500">"{item.instructions}"</p>}
                </div>
                <p>₹{(item.menuItem.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
              <span>Total</span>
              <span>₹{lastOrder?.totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setLastOrder(null)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}