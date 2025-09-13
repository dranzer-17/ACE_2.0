"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiService } from "@/app/lib/apiService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";

// --- Define Types ---
type Book = {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  available_copies: number;
  total_copies: number;
};

type Allocation = {
  id: number;
  book: { title: string; author: string };
  due_date: string;
  // Add derived properties for easier UI rendering
  is_overdue?: boolean;
  days_remaining?: number;
};

type Queue = {
  id: number;
  book: { title: string; author: string };
  position: number;
  status: 'waiting' | 'notified';
  expires_at?: string;
};

type MyBooksResponse = {
  allocated_books: Allocation[];
  queued_books: Queue[];
};

export default function StudentLibraryPage() {
  const { user } = useAuth(); // Get the logged-in user
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<MyBooksResponse>({
    allocated_books: [],
    queued_books: [],
  });
  const [loading, setLoading] = useState(true);

  // Use useEffect to fetch data as soon as the user object is available
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        // If the user isn't loaded yet, do nothing.
        // The component will show the "Loading..." state.
        return;
      }

      setLoading(true);
      const [booksRes, myBooksRes] = await Promise.all([
        apiService.getStudentBooks(),
        apiService.getMyBooks(Number(user.id)), // Pass the logged-in user's ID
      ]);

      if (booksRes.success) {
        setBooks(booksRes.data);
      } else {
        toast.error(booksRes.message);
      }

      if (myBooksRes.success) {
        // Calculate derived properties like `days_remaining`
        const processedAllocations = myBooksRes.data.allocated_books.map((alloc: Allocation) => {
            const now = new Date();
            const dueDate = new Date(alloc.due_date);
            const diffTime = dueDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                ...alloc,
                days_remaining: Math.max(0, diffDays),
                is_overdue: diffDays < 0,
            };
        });
        setMyBooks({ ...myBooksRes.data, allocated_books: processedAllocations });
      } else {
        toast.error(myBooksRes.message);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]); // Re-run this effect if the user object changes (e.g., after login)

  const handleRequestBook = async (bookId: number) => {
    if (!user) {
      toast.error("You must be logged in to request a book.");
      return;
    }

    const result = await apiService.requestBook(bookId, Number(user.id)); // Pass user's ID
    toast[result.success ? "success" : "error"](result.data?.message || result.message);

    if (result.success) {
      // Re-fetch all data to update both "Browse" and "My Books" tabs
      const booksRes = await apiService.getStudentBooks();
      if(booksRes.success) setBooks(booksRes.data);
      const myBooksRes = await apiService.getMyBooks(Number(user.id));
      if(myBooksRes.success) setMyBooks(myBooksRes.data);
    }
  };

  // Add handlers for return, cancel, accept (placeholders for now)
  const handleReturnBook = (allocationId: number) => toast.info("Return functionality to be added.");
  const handleCancelQueue = (queueId: number) => toast.info("Cancel queue functionality to be added.");
  const handleAcceptNotification = (queueId: number) => toast.info("Accept notification functionality to be added.");


  if (loading) {
    return <div className="p-8">Loading Library...</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Library</h1>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Books</TabsTrigger>
          <TabsTrigger value="my-books">My Books</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {books.map((book) => (
            <Card key={book.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>by {book.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div className="flex justify-between w-full">
                  <Badge variant={book.available_copies > 0 ? "default" : "secondary"}>
                    {book.available_copies}/{book.total_copies} Available
                  </Badge>
                  <Badge variant="outline">{book.category}</Badge>
                </div>
                <Button onClick={() => handleRequestBook(book.id)} className="w-full">
                  {book.available_copies > 0 ? "Request Book" : "Join Queue"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="my-books" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Currently Allocated</CardTitle>
              <CardDescription>Books you have borrowed.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBooks.allocated_books.map((alloc) => (
                  <div key={alloc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{alloc.book.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">Due: {new Date(alloc.due_date).toLocaleDateString()}</span>
                        <Badge variant={alloc.is_overdue ? "destructive" : "default"}>
                          {alloc.is_overdue ? "Overdue" : `${alloc.days_remaining} days left`}
                        </Badge>
                      </div>
                    </div>
                    <Button onClick={() => handleReturnBook(alloc.id)} variant="outline" size="sm">Return Book</Button>
                  </div>
                ))}
                {myBooks.allocated_books.length === 0 && <p className="text-center text-gray-500 py-4">No books currently borrowed.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In Queue</CardTitle>
              <CardDescription>Books you are waiting for.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myBooks.queued_books.map((queue) => (
                  <div key={queue.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{queue.book.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant="outline">Position #{queue.position}</Badge>
                        <Badge variant={queue.status === 'notified' ? 'default' : 'secondary'}>
                          {queue.status === 'notified' ? 'Ready for pickup!' : 'Waiting'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {queue.status === 'notified' ? (
                        <Button onClick={() => handleAcceptNotification(queue.id)} size="sm" className="bg-green-600 hover:bg-green-700">Accept</Button>
                      ) : (
                        <Button onClick={() => handleCancelQueue(queue.id)} variant="outline" size="sm">Cancel</Button>
                      )}
                    </div>
                  </div>
                ))}
                {myBooks.queued_books.length === 0 && <p className="text-center text-gray-500 py-4">You are not in any queues.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}