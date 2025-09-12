"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, MyBooksResponse } from "@/types/library";
import { BookOpen, Clock, Users, CheckCircle, XCircle } from "lucide-react";

export default function StudentLibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<MyBooksResponse>({ allocated_books: [], queued_books: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchMyBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/student/library/books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/student/library/my-books");
      const data = await response.json();
      setMyBooks(data);
    } catch (error) {
      console.error("Failed to fetch my books:", error);
    }
  };

  const handleRequestBook = async (bookId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/student/library/books/${bookId}/request`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchBooks();
        fetchMyBooks();
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to request book");
      }
    } catch (error) {
      console.error("Failed to request book:", error);
      alert("Failed to request book");
    }
  };

  const handleReturnBook = async (allocationId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/student/library/allocations/${allocationId}/return`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Book returned successfully!");
        fetchBooks();
        fetchMyBooks();
      }
    } catch (error) {
      console.error("Failed to return book:", error);
    }
  };

  const handleCancelQueue = async (queueId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/student/library/queue/${queueId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Queue request cancelled!");
        fetchBooks();
        fetchMyBooks();
      }
    } catch (error) {
      console.error("Failed to cancel queue:", error);
    }
  };

  const handleAcceptNotification = async (queueId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/student/library/notifications/${queueId}/accept`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchBooks();
        fetchMyBooks();
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to accept notification");
      }
    } catch (error) {
      console.error("Failed to accept notification:", error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Books</TabsTrigger>
          <TabsTrigger value="my-books">My Books</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant={book.is_available ? "default" : "secondary"}>
                        {book.available_copies}/{book.total_copies} Available
                      </Badge>
                      <Badge variant="outline">{book.category}</Badge>
                    </div>

                    {book.queue_count && book.queue_count > 0 && (
                      <div className="flex items-center gap-1 text-sm text-amber-600">
                        <Clock className="w-4 h-4" />
                        {book.queue_count} in queue
                      </div>
                    )}

                    <Button
                      onClick={() => handleRequestBook(book.id)}
                      disabled={!book.is_available && book.queue_count === 0}
                      className="w-full"
                      variant={book.is_available ? "default" : "outline"}
                    >
                      {book.is_available ? "Request Book" : "Join Queue"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-books" className="space-y-6">
          {/* Currently Allocated Books */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Currently Allocated Books
              </CardTitle>
              <CardDescription>Books you have borrowed (7-day limit)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBooks.allocated_books.map((allocation) => (
                  <div key={allocation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{allocation.book.title}</h4>
                      <p className="text-sm text-gray-600">by {allocation.book.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Due: {new Date(allocation.due_date).toLocaleDateString()}
                        </span>
                        <Badge variant={allocation.is_overdue ? "destructive" : "default"}>
                          {allocation.is_overdue ? "Overdue" : `${allocation.days_remaining} days left`}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleReturnBook(allocation.id)}
                      variant="outline"
                      size="sm"
                    >
                      Return Book
                    </Button>
                  </div>
                ))}
                {myBooks.allocated_books.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No books currently allocated</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Queue Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Queue Status
              </CardTitle>
              <CardDescription>Books you're waiting for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBooks.queued_books.map((queue) => (
                  <div key={queue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{queue.book.title}</h4>
                      <p className="text-sm text-gray-600">by {queue.book.author}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">Position #{queue.position}</Badge>
                        <Badge variant={queue.status === 'notified' ? 'default' : 'secondary'}>
                          {queue.status === 'notified' ? 'Ready for pickup!' : 'Waiting'}
                        </Badge>
                        {queue.status === 'notified' && queue.expires_at && (
                          <span className="text-sm text-amber-600">
                            Expires: {new Date(queue.expires_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {queue.status === 'notified' ? (
                        <Button
                          onClick={() => handleAcceptNotification(queue.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleCancelQueue(queue.id)}
                          variant="outline"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {myBooks.queued_books.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No books in queue</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}