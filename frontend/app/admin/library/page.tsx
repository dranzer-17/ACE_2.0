"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Book, BookAllocation, BookCreateRequest } from "@/types/library";
import { Plus, BookOpen, Users, Clock } from "lucide-react";

export default function AdminLibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [allocations, setAllocations] = useState<BookAllocation[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBook, setNewBook] = useState<BookCreateRequest>({
    title: "",
    author: "",
    isbn: "",
    description: "",
    category: "",
    total_copies: 1
  });

  useEffect(() => {
    fetchBooks();
    fetchAllocations();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/library/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/library/allocations");
      const data = await response.json();
      setAllocations(data);
    } catch (error) {
      console.error("Failed to fetch allocations:", error);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/admin/library/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        setNewBook({
          title: "",
          author: "",
          isbn: "",
          description: "",
          category: "",
          total_copies: 1
        });
        setShowAddForm(false);
        fetchBooks();
      }
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const handleReturnBook = async (allocationId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/library/allocations/${allocationId}/return`, {
        method: "POST",
      });

      if (response.ok) {
        fetchBooks();
        fetchAllocations();
      }
    } catch (error) {
      console.error("Failed to return book:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Library Management</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Add Book Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="copies">Total Copies</Label>
                <Input
                  id="copies"
                  type="number"
                  min="1"
                  value={newBook.total_copies}
                  onChange={(e) => setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Book</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {book.title}
              </CardTitle>
              <CardDescription>by {book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{book.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant={book.available_copies > 0 ? "default" : "secondary"}>
                    {book.available_copies}/{book.total_copies} Available
                  </Badge>
                  <Badge variant="outline">{book.category}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {book.active_allocations || 0} Active
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {book.queue_count || 0} Queued
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Allocations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Allocations</CardTitle>
          <CardDescription>Books currently allocated to students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocations.filter(a => a.status === 'active').map((allocation) => (
              <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{allocation.book.title}</h4>
                  <p className="text-sm text-gray-600">
                    Allocated to: {allocation.student?.full_name} ({allocation.student?.email})
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(allocation.due_date).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleReturnBook(allocation.id)}
                  variant="outline"
                  size="sm"
                >
                  Mark Returned
                </Button>
              </div>
            ))}
            {allocations.filter(a => a.status === 'active').length === 0 && (
              <p className="text-gray-500 text-center py-4">No active allocations</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}