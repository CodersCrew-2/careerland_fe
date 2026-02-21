'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! I'm your career assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    const userInput = input;
    setInput('');

    // Mock response
    setTimeout(() => {
      let response = "That's interesting! Tell me more.";
      if (userInput.toLowerCase().includes('career')) {
        response = "We have many career paths available. Have you checked the 'Explore Careers' section?";
      } else if (userInput.toLowerCase().includes('scholarship')) {
        response = "Scholarships are a great way to fund your education. Check out the Scholarships tab!";
      } else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        response = "Hello there! Ready to explore your future?";
      }
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 z-50"
          >
            <Card className="border-[var(--color-outline)]/30 shadow-2xl bg-[var(--color-surface)]">
              <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-[var(--color-outline)]/20">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[var(--color-primary)] rounded-full">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">CareerBot</CardTitle>
                </div>
                <Button variant="text" size="sm" onClick={() => setIsOpen(false)} className="p-1 h-auto">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isUser
                          ? 'bg-[var(--color-primary)] text-white rounded-tr-none'
                          : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] rounded-tl-none'
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-[var(--color-outline)]/20 flex gap-2">
                  <input
                    className="flex-1 bg-[var(--color-surface-variant)]/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button
                    variant="filled"
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                    onClick={handleSend}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full shadow-lg shadow-primary/30 flex items-center justify-center z-50 text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
