'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MASCOT_VIDEO = 'https://uafn22926g.ufs.sh/f/F8enbsMKbqz7fZi9MdO8KyMuhwEP65jqSI9gVmofikc0lXRv';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! I'm your Career Buddy. Ask me anything about careers, paths, or how CareerLand works! 🚀", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    const userInput = input;
    setInput('');
    setTimeout(() => {
      let response = "That's a great question! Let me help you explore that.";
      if (userInput.toLowerCase().includes('career'))
        response = "We have many career paths available. Check out the Careers section to explore options tailored to you!";
      else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi'))
        response = "Hello! Ready to discover your dream career? 🎯";
      else if (userInput.toLowerCase().includes('roadmap'))
        response = "Your personalised roadmap is available on each Career page. Click on any career to see your path!";
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 900);
  };

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed right-5 z-50 flex flex-col"
            style={{
              bottom: 86,
              width: 280,
              borderRadius: 20,
              background: '#ffffff',
              border: '1.5px solid #e8edf3',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0"
                  style={{ border: '1.5px solid #e2e8f0' }}>
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={MASCOT_VIDEO} />
                  </video>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Career Buddy</p>
                  <p style={{ fontSize: 10, color: '#22a8e0', margin: 0, fontWeight: 600 }}>● Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
                style={{ color: '#94a3b8' }}>
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ height: 180, background: '#fafbfc' }}>
              {messages.map((msg, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: msg.isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: 12,
                    lineHeight: 1.5,
                    fontWeight: 500,
                    background: msg.isUser ? '#22a8e0' : '#ffffff',
                    color: msg.isUser ? '#ffffff' : '#1e293b',
                    border: msg.isUser ? 'none' : '1.5px solid #e8edf3',
                    boxShadow: msg.isUser ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="flex items-center gap-2 px-3 py-2.5"
              style={{ borderTop: '1px solid #f1f5f9', background: '#ffffff' }}>
              <input
                className="flex-1 text-[12px] outline-none"
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e8edf3',
                  borderRadius: 100,
                  padding: '7px 12px',
                  color: '#1e293b',
                }}
                placeholder="Type a message…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={handleSend}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#22a8e0' }}>
                <Send className="w-3 h-3 text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB — mascot video in infinite loop */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50"
        style={{
          width: isOpen ? 48 : 72,
          height: isOpen ? 48 : 72,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2.5px solid #ffffff',
          boxShadow: isOpen
            ? '0 2px 12px rgba(34,168,224,0.30), 0 1px 4px rgba(0,0,0,0.10)'
            : '0 4px 20px rgba(34,168,224,0.35), 0 2px 8px rgba(0,0,0,0.12)',
          background: '#ffffff',
          padding: 0,
          cursor: 'pointer',
          transition: 'width 0.22s ease, height 0.22s ease, box-shadow 0.22s ease',
        }}>
        <AnimatePresence mode="wait">
          {isOpen
            ? (
              <motion.div key="close"
                initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.18 }}
                className="w-full h-full flex items-center justify-center"
                style={{ background: '#22a8e0' }}>
                <X className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div key="mascot"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.18 }}
                className="w-full h-full">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src={MASCOT_VIDEO} />
                </video>
              </motion.div>
            )
          }
        </AnimatePresence>
      </motion.button>
    </>
  );
}
