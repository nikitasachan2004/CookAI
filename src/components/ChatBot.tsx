import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, X, Send } from 'lucide-react';
import { sendChatMessage } from '../api';
import './ChatBot.css';

type Message = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: "Yo what's good! I'm Zesty, your CookAI culinary assistant. How can I hook you up today? no cap." }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input.trim() }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMessage];
      const res = await sendChatMessage(chatHistory);
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: res.text }] }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "fr fr the devs are broke and using a free API key 💀 so we hit a limit. Try again in a bit bro!" }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chatbot-window"
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar-bg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="chatbot-title">Zesty</h3>
                  <p className="chatbot-subtitle">CookAI Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chatbot-msg-row ${msg.role}`}
                >
                  <div className="chatbot-bubble-wrap">
                    <div className={`chatbot-icon ${msg.role}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`chatbot-bubble ${msg.role}`}>
                      {msg.parts[0].text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chatbot-msg-row model">
                  <div className="chatbot-bubble-wrap">
                    <div className="chatbot-icon model">
                      <Bot size={16} />
                    </div>
                    <div className="chatbot-bubble model">
                      <div className="chatbot-typing">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="chatbot-typing-dot" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="chatbot-typing-dot" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="chatbot-typing-dot" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="chatbot-input-area">
              <div className="chatbot-input-wrap">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Zesty anything..."
                  className="chatbot-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="chatbot-send-btn"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-toggle-btn"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
};
