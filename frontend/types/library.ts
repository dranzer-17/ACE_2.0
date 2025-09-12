export type BookStatus = 'available' | 'allocated' | 'maintenance';
export type AllocationStatus = 'active' | 'returned' | 'overdue';
export type QueueStatus = 'waiting' | 'notified' | 'expired';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  category?: string;
  total_copies: number;
  available_copies: number;
  status: BookStatus;
  created_at: string;
  is_available?: boolean;
  queue_count?: number;
  active_allocations?: number;
}

export interface BookAllocation {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
  student?: {
    id: number;
    full_name: string;
    email: string;
  };
  allocated_at: string;
  due_date: string;
  returned_at?: string;
  status: AllocationStatus;
  notes?: string;
  days_remaining?: number;
  is_overdue?: boolean;
}

export interface BookQueue {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
    isbn: string;
  };
  position: number;
  requested_at: string;
  status: QueueStatus;
  notified_at?: string;
  expires_at?: string;
}

export interface MyBooksResponse {
  allocated_books: BookAllocation[];
  queued_books: BookQueue[];
}

export interface BookCreateRequest {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  category?: string;
  total_copies: number;
}
