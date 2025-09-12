"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Post {
  id: number;
  title: string;
  description: string;
  creator?: {
    full_name: string;
  };
}

export function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  const handleInitiateChat = async () => {
    // 1. Call the backend to create the conversation
    const res = await fetch(`/api/student/collaboration/posts/${post.id}/initiate-chat`, {
        method: 'POST',
        // headers with auth token...
    });
    const { conversation_id } = await res.json();

    // 2. Redirect to the chat page
    router.push(`/dashboard/chat/${conversation_id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription>By: {post.creator?.full_name || 'Unknown'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{post.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleInitiateChat}>Discuss Task</Button>
      </CardFooter>
    </Card>
  );
}