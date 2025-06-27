import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { libraryService } from '@/services/api/libraryService';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [libraryItems, setLibraryItems] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadLibrary = async () => {
    try {
      const data = await libraryService.getAll();
      setLibraryItems(data);
      
      if (data.length === 0) {
        setError('No validated content available for chat. Please validate some content first.');
      }
    } catch (err) {
      setError('Failed to load library content.');
    }
  };

  useEffect(() => {
    loadLibrary();
    
    // Add welcome message
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: "Hello! I'm your AI assistant for your validated content library. I can help you find information, summarize content, and answer questions based on your expertly validated materials. What would you like to know?",
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const simulateAIResponse = (userMessage) => {
    // Simple simulation of AI responses based on validated content
    const responses = [
      "Based on your validated content library, I found relevant information that addresses your question. Let me summarize the key points from the expert-validated materials.",
      "I've searched through your validated content and found several relevant pieces. Here's what the experts confirmed about this topic.",
      "Drawing from your library of validated content, I can provide you with expert-verified information on this subject.",
      "Your validated content library contains valuable insights on this topic. Let me share what the experts have validated.",
      "I found matching content in your library that has been validated by subject matter experts. Here's the relevant information."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (libraryItems.length === 0) {
      toast.error('No validated content available. Please submit and validate content first.');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse = {
      id: Date.now() + 1,
      type: 'assistant',
      content: simulateAIResponse(inputMessage),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Summarize my validated content",
    "What are the key insights from my library?",
    "Find content about specific topics",
    "Show me expert recommendations"
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  if (error && libraryItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            AI Chat
          </h1>
          <p className="text-gray-600 font-body mt-2">
            Chat with AI about your validated content library
          </p>
        </div>
        
        <Empty
          title="No validated content for chat"
          description="You need validated content in your library to start chatting. Submit your AI-generated content for expert validation first."
          actionText="Submit Content"
          onAction={() => window.location.href = '/submit'}
          icon="MessageCircle"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          AI Chat
        </h1>
        <p className="text-gray-600 font-body mt-2">
          Chat with AI about your validated content library ({libraryItems.length} items available)
        </p>
      </div>

      <div className="card flex-1 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {messages.length === 0 ? (
            <Loading type="chat" />
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-xs lg:max-w-md px-4 py-3 rounded-lg font-body
                  ${message.type === 'user'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                  }
                `}>
                  <p>{message.content}</p>
                </div>
              </motion.div>
            ))
          )}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-2">
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-gray-600 font-body">AI is thinking...</span>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 font-body mb-3">Try these quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 font-body"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Ask about your validated content..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              loading={isLoading}
              icon="Send"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChat;