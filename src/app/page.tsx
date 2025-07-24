'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import isClean from '../helpers/isClean';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isClean(input)) {
      alert('Please enter a valid argument without offensive content.');
      return;
    }
    if (input.trim() === '' || isLoading) return;

    // Add the system message at the beginning of the conversation
    const systemMessage: ChatMessage = {
      role: 'system',
      content: 'You are a debate assistant. Provide counterarguments. Sound human and natural. Max 100 words.',
    };

    const newMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [systemMessage, ...messages, newMessage]; // Include system message for API
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending messages to API:', newMessages);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('API response:', data);

      if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto">
        
      <h1 className="text-xl font-bold mb-4">Debate Bot</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your argument"
          className="flex-1 border px-2 py-1 rounded"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-greyCan hover:pointer text-white px-3 py-1 rounded disabled:bg-greyCant" 
          disabled={isLoading || !input.trim()}
        >
          {isLoading && <p className="text-gray-500">Thinking...</p>}
            Submit
        </button>
      </form>
      <div className="space-y-2">
        {messages
          .filter((m) => m.role !== 'system') // Exclude system messages from rendering
          .map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className={`inline-block p-2 rounded text-white ${m.role === 'user' ? 'bg-gray-700' : 'bg-gray-600'}`}>
                {m.content}
              </span>
            </div>
          ))}
      </div>
    </main>
  );
}
