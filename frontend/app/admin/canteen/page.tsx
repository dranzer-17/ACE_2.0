"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";
import Image from "next/image";

// --- Import UI Components ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Define Types to match our API response ---
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'veg' | 'non-veg' | 'jain';
  image_url: string;
  is_available: boolean;
};

type OrderItem = {
    quantity: number;
    special_instructions: string;
    menu_item: MenuItem;
}
type Order = {
    id: number;
    status: string;
    created_at: string;
    user: { full_name: string };
    items: OrderItem[];
}

// Default state for the menu item form
const defaultItemState = {
    id: null, name: "", description: "", price: 0, category: "veg", image_url: "", is_available: true
};

export default function AdminCanteenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State for the Add/Edit Menu Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(defaultItemState);

  // --- Data Fetching ---
  const fetchOrders = async () => {
    const result = await apiService.getAdminOrders();
    if (result.success) setOrders(result.data);
    else toast.error(result.message);
  };

  const fetchMenu = async () => {
    const result = await apiService.getMenu();
    if (result.success) setMenu(result.data);
    else toast.error(result.message);
  };

  useEffect(() => {
    fetchOrders();
    fetchMenu();
  }, []);

  // --- Event Handlers ---
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    const result = await apiService.updateOrderStatus(orderId, newStatus);
    toast[result.success ? 'success' : 'error'](result.message);
    if (result.success) fetchOrders(); // Re-fetch orders to show updated status
  };
  
  const handleFormChange = (field: string, value: any) => {
    setCurrentItem((prev: any) => ({ ...prev, [field]: value }));
  };
  
  const handleSaveMenuItem = async () => {
    setIsLoading(true);
    const itemData = { ...currentItem };
    delete itemData.id; // Don't send id in the body

    const result = currentItem.id
      ? await apiService.updateMenuItem(currentItem.id, itemData)
      : await apiService.createMenuItem(itemData);

    toast[result.success ? 'success' : 'error'](result.message);
    if (result.success) {
      fetchMenu(); // Re-fetch menu
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  
  const handleDeleteMenuItem = async (itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
        const result = await apiService.deleteMenuItem(itemId);
        toast[result.success ? 'success' : 'error'](result.message);
        if (result.success) fetchMenu(); // Re-fetch menu
    }
  };

  const openEditModal = (item: MenuItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  
  const openAddModal = () => {
    setCurrentItem(defaultItemState);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Canteen Management</h1>

      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Active Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
        </TabsList>

        {/* --- Active Orders Tab --- */}
        <TabsContent value="orders" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>By: {order.user.full_name} | Status: <span className="font-bold">{order.status}</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      <p className="font-semibold">{item.quantity} x {item.menu_item.name}</p>
                      {item.special_instructions && <p className="text-sm text-blue-500 pl-2">"{item.special_instructions}"</p>}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {order.status === 'placed' && <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'preparing')}>Mark Preparing</Button>}
                    {order.status === 'preparing' && <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'ready_for_pickup')}>Mark Ready</Button>}
                    {order.status === 'ready_for_pickup' && <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'delivered')}>Mark Delivered</Button>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* --- Menu Management Tab --- */}
        <TabsContent value="menu" className="mt-4">
            <div className="flex justify-end mb-4">
                <Button onClick={openAddModal}><PlusCircle className="mr-2 h-4 w-4" /> Add New Item</Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {menu.map(item => (
                    <Card key={item.id} className="relative">
                        <div className="absolute top-2 right-2 flex gap-1 z-10">
                            <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEditModal(item)}><Edit className="h-4 w-4" /></Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteMenuItem(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="relative w-full h-40">
                            <Image src={item.image_url || "/placeholder-food.jpg"} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" />
                        </div>
                        <CardHeader><CardTitle>{item.name}</CardTitle></CardHeader>
                        <CardContent><p className="text-lg font-bold">₹{item.price}</p></CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
      
      {/* --- Add/Edit Menu Item Modal --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{currentItem.id ? 'Edit' : 'Add'} Menu Item</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={currentItem.name} onChange={e => handleFormChange('name', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={currentItem.description} onChange={e => handleFormChange('description', e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" type="number" value={currentItem.price} onChange={e => handleFormChange('price', parseFloat(e.target.value))} /></div>
                <div className="space-y-2"><Label htmlFor="category">Category</Label>
                    <Select value={currentItem.category} onValueChange={(value: any) => handleFormChange('category', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="veg">Veg</SelectItem><SelectItem value="non-veg">Non-Veg</SelectItem><SelectItem value="jain">Jain</SelectItem></SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2"><Label htmlFor="image_url">Image URL</Label><Input id="image_url" value={currentItem.image_url} onChange={e => handleFormChange('image_url', e.target.value)} /></div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveMenuItem} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}