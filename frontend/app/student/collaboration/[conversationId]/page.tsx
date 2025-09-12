"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  text: string;
}

// Assume you have a way to get the current user's ID
const CURRENT_USER_ID = 1; // Replace with actual authenticated user ID

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const params = useParams();
  const conversationId = params.conversationId as string;

  useEffect(() => {
    if (!conversationId) return;

    // Connect to the WebSocket server
    ws.current = new WebSocket(`ws://localhost:8000/api/chat/ws/${conversationId}/${CURRENT_USER_ID}`);

    ws.current.onopen = () => console.log("WebSocket connected!");
    ws.current.onclose = () => console.log("WebSocket disconnected!");

    // Listen for messages from the server
    ws.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, { text: event.data }]);
    };

    // Clean up the connection when the component unmounts
    return () => {
      ws.current?.close();
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (ws.current && input.trim()) {
      ws.current.send(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto border p-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}