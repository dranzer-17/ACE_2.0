"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// --- Define the shape of the props this component expects ---
export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'veg' | 'non-veg' | 'jain';
};

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void; // A function to call when the button is clicked
}

// --- Category Badge Colors ---
const categoryColors = {
  veg: "border-green-500 text-green-500",
  "non-veg": "border-red-500 text-red-500",
  jain: "border-yellow-500 text-yellow-500",
};

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardContent className="flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <div
            className={`px-2 py-1 text-xs font-semibold border rounded-full ${
              categoryColors[item.category] || "border-gray-500 text-gray-500"
            }`}
          >
            {item.category.toUpperCase()}
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xl font-bold">₹{item.price}</p>
        <Button onClick={() => onAddToCart(item)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}