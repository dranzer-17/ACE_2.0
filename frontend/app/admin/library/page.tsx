"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Users, Clock } from "lucide-react";

// Define Types
type Book = { id: number; title: string; author: string; description: string; category: string; total_copies: number; available_copies: number; };
type BookAllocation = { id: number; book: { title: string }; student: { full_name: string }; due_date: string; status: string; };
type BookCreateRequest = { title: string; author: string; isbn: string; description: string; category: string; total_copies: number; };

export default function AdminLibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allocations, setAllocations] = useState<BookAllocation[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState<BookCreateRequest>({
    title: "", author: "", isbn: "", description: "", category: "", total_copies: 1
  });

  const fetchData = async () => {
    setLoading(true);
    const [booksRes, allocationsRes] = await Promise.all([
      apiService.getAdminBooks(),
      apiService.getAdminAllocations(),
    ]);
    if (booksRes.success) setBooks(booksRes.data);
    else toast.error(booksRes.message);
    if (allocationsRes.success) setAllocations(allocationsRes.data);
    else toast.error(allocationsRes.message);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await apiService.addBook(newBook);
    toast[result.success ? "success" : "error"](result.message);
    if (result.success) {
      setNewBook({ title: "", author: "", isbn: "", description: "", category: "", total_copies: 1 });
      setShowAddForm(false);
      fetchData();
    }
  };

  const handleReturnBook = async (allocationId: number) => {
    const result = await apiService.markBookReturned(allocationId);
    toast[result.success ? "success" : "error"](result.message);
    if (result.success) {
      fetchData();
    }
  };

  if (loading) return <div className="p-8">Loading Library Data...</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Library Management</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showAddForm ? "Cancel" : "Add Book"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader><CardTitle>Add New Book</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1"><Label htmlFor="title">Title</Label><Input id="title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} required /></div>
                <div className="space-y-1"><Label htmlFor="author">Author</Label><Input id="author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} required /></div>
                <div className="space-y-1"><Label htmlFor="isbn">ISBN</Label><Input id="isbn" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} required /></div>
                <div className="space-y-1"><Label htmlFor="category">Category</Label><Input id="category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} /></div>
              </div>
              <div className="space-y-1"><Label htmlFor="description">Description</Label><Textarea id="description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} /></div>
              <div className="space-y-1"><Label htmlFor="copies">Total Copies</Label><Input id="copies" type="number" min="1" value={newBook.total_copies} onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) || 1 })} required /></div>
              <div className="flex gap-2"><Button type="submit">Add Book</Button></div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Book Inventory</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card key={book.id} className="flex flex-col">
              <CardHeader><CardTitle>{book.title}</CardTitle><CardDescription>by {book.author}</CardDescription></CardHeader>
              <CardContent className="flex-1"><p className="text-sm text-gray-600 line-clamp-3">{book.description}</p></CardContent>
              <CardFooter className="flex justify-between items-center">
                <Badge variant={book.available_copies > 0 ? "default" : "secondary"}>{book.available_copies}/{book.total_copies} Available</Badge>
                <Badge variant="outline">{book.category}</Badge>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Active Allocations</CardTitle><CardDescription>Books currently borrowed by students</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocations.filter(a => a.status === 'active').map((allocation) => (
              <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{allocation.book.title}</h4>
                  <p className="text-sm text-gray-600">To: {allocation.student?.full_name}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(allocation.due_date).toLocaleDateString()}</p>
                </div>
                <Button onClick={() => handleReturnBook(allocation.id)} variant="outline" size="sm">Mark Returned</Button>
              </div>
            ))}
            {allocations.filter(a => a.status === 'active').length === 0 && (<p className="text-gray-500 text-center py-4">No active allocations</p>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}