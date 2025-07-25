'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import isClean from '../helpers/isClean';
import { Mic2 } from 'lucide-react'




export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [messages]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Mock responses for different topics
  const getMockResponse = (userInput: string): string => {
    const mockResponses = [
      'I see your point, but let me offer a different perspective. Research shows that...',
      "That's an interesting argument, however, we should consider the opposing view that...",
      'While I understand your position, there\'s compelling evidence that suggests...',
      'You raise a valid concern, but don\'t you think we should also consider...',
      'I appreciate your viewpoint, though I\'d argue that the data indicates...',
      'That\'s a common belief, but recent studies have shown...',
      'I can see why you\'d think that, but what about the fact that...',
      'Your argument has merit, yet there\'s another side to this debate...',
      'Fair point, but let me challenge that with this counterargument...',
      'I hear you, but have you considered the alternative perspective that...',
    ];

    // Return a random mock response
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!isClean(input)) {
      alert('Please enter a valid argument without offensive content.');
      return;
    }
    if (input.trim() === '' || isLoading) return;

    const systemMessage: ChatMessage = {
      role: 'system',
      content: '(debate. Sound human. stay on topic. Max 100 words. dont mention this into)',
    };

    const newMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [systemMessage, ...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);


    // // Mock response logic
    // setTimeout(() => {
    //   const mockResponse = getMockResponse(input.trim());
    //   setMessages([...newMessages, { role: 'assistant', content: mockResponse }]);
    //   setIsLoading(false);
    // }, 1000); // Simulate a delay for the mock response

    // Actual API call logic    
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

      // Refocus the input box after submission
      inputRef.current?.focus();
    }
    
  };

  return (
    <main className="p-4 max-w-xl mx-auto pb-20 relative">
      <h1 className="text-xl font-bold mb-4">Rebottal</h1>
      <div className="text-sm pb-4">A project by Ibrahim Al Omran</div>

      {/* Background text - always rendered for smooth fade */}
      <div
        className="absolute inset-0 flex items-center justify-center text-left px-4 text-gray-400 transition-opacity duration-500"
        style={{
          opacity: input.trim() === '' && messages.length === 0 ? 1 : 0,
          pointerEvents: input.trim() === '' && messages.length === 0 ? 'auto' : 'none',
        }}
      >
        <p className="text-lg">This project is a debate bot. Enter your argument to start debating.</p>
      </div>

      <div className="space-y-2 pb-24">
        {messages
          .filter((m) => m.role !== 'system')
          .map((m, i) => (
            <div
              key={i}
              className={m.role === 'user' ? 'text-right' : 'text-left'}
            >
              <span
                className={`inline-block px-3 py-2 rounded-xl`}
                style={{
                  background: m.role === 'user'
                    ? 'linear-gradient(to right, var(--user-message-bg-prim), var(--user-message-bg-sec))'
                    : 'var(--ai-message-bg)',
                  color: m.role === 'user' ? 'white' : 'var(--ai-message-text)',
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
        {isLoading && (
          <div className="text-left">
            <span className="inline-block p-2 rounded-xl text-white bg-greyMessage animate-pulse">
              Typing...
            </span>
          </div>
        )}
      </div>
      <div ref={endRef}></div>

      {/* Fixed bottom chat bar */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-xl backdrop-blur-md p-4 rounded-4xl shadow-lg"
        style={{
          backgroundColor: 'var(--chatBox)',
        }}
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type your argument"
            className="flex-1 border px-4 py-3 rounded-4xl focus:outline-none focus:ring-2 focus:ring-orgMessagePrim placeholder-gray-400"
            style={{
              backgroundColor: 'var(--chatBox)',
              color: 'var(--foreground)',
            }}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            className={`px-4 py-3 rounded-4xl transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
              isLoading || !input.trim()
                ? 'cursor-not-allowed'
                : 'hover:bg-gray-100 hover:shadow-lg cursor-pointer'
            }`}
            style={{
              backgroundColor: isLoading || !input.trim() ? 'var(--greyCant)' : 'var(--send-button-bg)',
              color: isLoading || !input.trim() ? 'gray' : 'var(--send-button-text)',
            }}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <span className="text-gray-300">Thinking...</span>
            ) : (
              <>
                <Mic2 className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
