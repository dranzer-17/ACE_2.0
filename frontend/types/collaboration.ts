export type PostType = 'task' | 'research' | 'hackathon' | 'volunteering';
export type PostStatus = 'open' | 'in_progress' | 'closed';

export interface User {
  id: number;
  full_name: string;
  email: string;
}

export interface CollaborationPost {
  id: number;
  creator_id: number;
  post_type: PostType;
  title: string;
  description: string;
  tags: string[];
  status: PostStatus;
  created_at: string;
  creator?: User;
}

export interface ChatConversation {
  id: number;
  post_id: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  sent_at: string;
  sender?: User;
}
