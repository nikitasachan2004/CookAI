import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Loader2, RotateCcw, Download } from 'lucide-react'
import { sendChatMessage, generateRecipeFromChat } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import ChatBubble from '../components/ChatBubble'
import AnimatedButton from '../components/AnimatedButton'

/**
 * AIChat page for conversational recipe assistance
 * TODO: Complete implementation with OpenAI integration and recipe generation
 */
const AIChat = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi there! I'm your AI cooking assistant. I can help you find recipes, answer cooking questions, provide substitutions, and even generate custom recipes based on your preferences. What would you like to cook today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  // Quick action prompts
  const quickPrompts = [
    "What can I make with chicken and rice?",
    "I need a quick 15-minute dinner",
    "Suggest a healthy breakfast recipe",
    "Help me plan a romantic dinner",
    "What's a good vegetarian pasta dish?",
    "I have 30 minutes, what can I cook?"
  ]
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  // Handle sending messages
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return
    
    const userMessage = {
      id: Date.now(),
      content: messageText.trim(),
      isBot: false,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)
    
    try {
      // TODO: Implement actual API call to AI service
      const response = await sendChatMessage({
        message: messageText,
        context: {
          userId: currentUser?.id,
          previousMessages: messages.slice(-5) // Send last 5 messages for context
        }
      })
      
      // Simulate typing delay
      setTimeout(() => {
        setIsTyping(false)
        
        const botMessage = {
          id: Date.now() + 1,
          content: response.message || generateMockResponse(messageText),
          isBot: true,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
      }, 1000)
      
    } catch (error) {
      console.error('Chat error:', error)
      setIsTyping(false)
      
      // Fallback response
      const errorMessage = {
        id: Date.now() + 1,
        content: generateMockResponse(messageText),
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Generate mock AI responses for demo
  const generateMockResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('chicken')) {
      return "Great choice! Chicken is versatile and delicious. Here are some ideas:\n\n🍗 **Garlic Herb Roasted Chicken** - Perfect for dinner with herbs and vegetables\n🥗 **Chicken Caesar Salad** - Light and refreshing for lunch\n🍜 **Chicken Noodle Soup** - Comforting and warming\n🌮 **Chicken Tacos** - Quick and flavorful\n\nWhich style sounds most appealing to you? I can provide a detailed recipe!"
    }
    
    if (message.includes('quick') || message.includes('15 minute')) {
      return "Perfect! Here are some fantastic 15-minute meals:\n\n⚡ **Spaghetti Aglio e Olio** - Pasta with garlic and olive oil\n🥪 **Grilled Cheese & Tomato Soup** - Classic comfort combo\n🍳 **Scrambled Eggs with Toast** - Protein-packed and filling\n🥙 **Mediterranean Wrap** - Fresh and healthy\n\nWould you like the full recipe for any of these?"
    }
    
    if (message.includes('healthy') || message.includes('breakfast')) {
      return "Wonderful! Healthy breakfasts set the tone for the day. Try these:\n\n🥣 **Overnight Oats with Berries** - Prep the night before\n🥑 **Avocado Toast with Poached Egg** - Rich in healthy fats\n🫐 **Greek Yogurt Parfait** - Protein and probiotics\n🥤 **Green Smoothie Bowl** - Packed with nutrients\n\nWhich one interests you most? I can share the complete recipe!"
    }
    
    if (message.includes('vegetarian') || message.includes('pasta')) {
      return "Excellent! Vegetarian pasta dishes are so satisfying. Here are my favorites:\n\n🍝 **Creamy Mushroom Alfredo** - Rich and indulgent\n🍅 **Fresh Tomato Basil Pasta** - Light and aromatic\n🧄 **Cacio e Pepe** - Simple Roman classic\n🥬 **Spinach and Ricotta Ravioli** - Homemade goodness\n\nShall I walk you through making any of these?"
    }
    
    return "That's an interesting question! I'd love to help you with that. Could you provide a bit more detail about what you're looking for? For example:\n\n• What ingredients do you have available?\n• Any dietary restrictions or preferences?\n• How much time do you have for cooking?\n• What type of meal are you planning?\n\nThe more you tell me, the better I can assist you! 👨‍🍳"
  }
  
  // Handle quick prompt selection
  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt)
  }
  
  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  // Clear conversation
  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        content: "Hi there! I'm your AI cooking assistant. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }
    ])
  }
  
  // TODO: Implement recipe generation from conversation
  const generateRecipe = async () => {
    setIsLoading(true)
    try {
      const response = await generateRecipeFromChat({
        conversation: messages,
        preferences: currentUser?.preferences || {}
      })
      
      // Handle generated recipe
      console.log('Generated recipe:', response)
    } catch (error) {
      console.error('Recipe generation failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI Cooking Assistant
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your personal chef for recipe ideas and cooking tips
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* TODO: Add recipe generation button */}
              <AnimatedButton
                onClick={generateRecipe}
                variant="secondary"
                size="sm"
                icon={Download}
                disabled={messages.length < 3}
              >
                Generate Recipe
              </AnimatedButton>
              
              <button
                onClick={clearConversation}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isBot={message.isBot}
                onCopy={(messageId) => {
                  // TODO: Show copy success feedback
                  console.log('Copied message:', messageId)
                }}
                onFeedback={(messageId, type) => {
                  // TODO: Send feedback to improve AI responses
                  console.log('Feedback:', messageId, type)
                }}
              />
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Try asking me about:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {quickPrompts.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="p-3 text-left text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                           border border-gray-200 dark:border-gray-700 rounded-xl transition-colors"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about cooking, recipes, or ingredients..."
                rows={1}
                className="w-full resize-none px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl 
                         bg-gray-50 dark:bg-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 
                         transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <AnimatedButton
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              loading={isLoading}
              icon={isLoading ? Loader2 : Send}
              className="px-4 py-3"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </AnimatedButton>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AIChat