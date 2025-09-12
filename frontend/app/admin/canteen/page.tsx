"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// --- Define Types to match our API response ---
type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
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
    user: { full_name: string };
    items: OrderItem[];
}

// Default state for the menu item form
const defaultItemState = {
    id: null, name: "", description: "", price: 0, category: "veg", is_available: true
};

export default function AdminCanteenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(defaultItemState);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(["veg"]));

  const fetchAllData = async () => {
    setIsLoading(true);
    const [ordersResult, menuResult] = await Promise.all([
      apiService.getAdminOrders(),
      apiService.getMenu()
    ]);

    if (ordersResult.success) {
      setOrders(ordersResult.data);
    } else {
      toast.error(ordersResult.message);
    }

    if (menuResult.success) {
      setMenu(menuResult.data);
    } else {
      toast.error(menuResult.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    const result = await apiService.updateOrderStatus(orderId, newStatus);
    toast[result.success ? 'success' : 'error'](result.message);
    if (result.success) {
      fetchAllData(); // Re-fetch all data to update the UI
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
            newSet.delete(category);
        } else {
            newSet.add(category);
        }
        return newSet;
    });
  };

  const openEditModal = (item: MenuItem) => {
    setCurrentItem(item);
    setSelectedCategories(new Set(item.category.split(',').filter(Boolean)));
    setIsModalOpen(true);
  };
  
  const openAddModal = () => {
    setCurrentItem(defaultItemState);
    setSelectedCategories(new Set(["veg"]));
    setIsModalOpen(true);
  };

  const handleSaveMenuItem = async () => {
    setIsLoading(true);
    const itemData = { 
        ...currentItem,
        category: Array.from(selectedCategories).join(',')
    };
    delete itemData.id;

    const result = currentItem.id
      ? await apiService.updateMenuItem(currentItem.id, itemData)
      : await apiService.createMenuItem(itemData);

    toast[result.success ? 'success' : 'error'](result.message);
    if (result.success) {
      fetchAllData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  
  const handleDeleteMenuItem = async (itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
        const result = await apiService.deleteMenuItem(itemId);
        toast[result.success ? 'success' : 'error'](result.message);
        if (result.success) {
          fetchAllData();
        }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Canteen Management</h1>

      <Tabs defaultValue="menu">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Active Orders ({orders.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="menu" className="mt-4">
            <div className="flex justify-end mb-4">
                <Button onClick={openAddModal}><PlusCircle className="mr-2 h-4 w-4" /> Add New Item</Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {menu.map(item => (
                    <Card key={item.id}>
                        <CardHeader><CardTitle>{item.name}</CardTitle><CardDescription>{item.description}</CardDescription></CardHeader>
                        <CardContent>
                            <p className="text-lg font-bold">₹{item.price}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                               {item.category.split(',').map(cat => <span key={cat} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">{cat.toUpperCase()}</span>)}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => openEditModal(item)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteMenuItem(item.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          {orders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Order #{order.id}</CardTitle>
                        <CardDescription>By: {order.user.full_name}</CardDescription>
                      </div>
                      <span className="text-sm font-bold px-2 py-1 bg-blue-100 text-blue-800 rounded-md dark:bg-blue-900/50 dark:text-blue-300">
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="border-t pt-2 first:border-t-0">
                        <p className="font-semibold">{item.quantity} x {item.menu_item.name}</p>
                        {item.special_instructions && <p className="text-sm text-amber-600 pl-2"><strong>Instructions:</strong> "{item.special_instructions}"</p>}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                      {order.status === 'placed' && <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'preparing')}>Mark as Preparing</Button>}
                      {order.status === 'preparing' && <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'ready_for_pickup')}>Mark as Ready</Button>}
                      {order.status === 'ready_for_pickup' && <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleUpdateStatus(order.id, 'delivered')}>Mark as Delivered</Button>}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border-dashed border-2 rounded-lg"><p className="text-gray-500">No active orders at the moment.</p></div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>{currentItem.id ? 'Edit' : 'Add'} Menu Item</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2"><Label>Name</Label><Input value={currentItem.name} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={currentItem.description} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} /></div>
                <div className="space-y-2"><Label>Price</Label><Input type="number" value={currentItem.price} onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value) || 0})} /></div>
                <div className="space-y-2">
                    <Label>Categories</Label>
                    <div className="flex items-center space-x-4 pt-2">
                       {['veg', 'non-veg', 'jain'].map(cat => (
                           <div key={cat} className="flex items-center space-x-2">
                               <Checkbox id={`modal-${cat}`} checked={selectedCategories.has(cat)} onCheckedChange={() => handleCategoryChange(cat)} />
                               <Label htmlFor={`modal-${cat}`} className="capitalize font-normal">{cat}</Label>
                           </div>
                       ))}
                    </div>
                </div>
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