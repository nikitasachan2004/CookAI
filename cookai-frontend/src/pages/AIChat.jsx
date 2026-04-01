import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Download, Loader2, RotateCcw, Send, Sparkles } from 'lucide-react'
import { fetchRecommendations, sendChatMessage, generateRecipeFromChat } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import ChatBubble from '../components/ChatBubble'
import AnimatedButton from '../components/AnimatedButton'

const starterPrompts = [
  'I have tomato sauce, basil, and pasta. What should I cook?',
  'Give me a quick vegetarian dinner in 20 minutes.',
  'What can I make for a cozy Sunday breakfast?',
  'I need a light dinner with chicken and greens.',
  'Suggest something comforting but not too heavy.',
  'Help me rescue leftover rice and vegetables.',
]

const getFallbackResponse = (message) => {
  const query = message.toLowerCase()

  if (query.includes('beef')) {
    return 'Beef gives you a few strong directions: a quick garlic stir-fry, tacos, a tomato-rich mince sauce, or a simple skillet with onions and peppers. Add one or two ingredients you already have and I can narrow it down properly.'
  }

  if (query.includes('rice') || query.includes('vegetable')) {
    return 'Leftover rice and vegetables are perfect for fried rice, a quick skillet bowl, or a soupier rice pan with garlic, soy, chili, or egg if you have them. Tell me which extras you have and I will tighten the plan.'
  }

  if (query.includes('pasta')) {
    return 'A tomato-forward pasta is your strongest direction. If you have garlic, olive oil, or basil, build a quick sauce, finish with pasta water, and top with something sharp like parmesan or chili flakes. Keep it simple and let the ingredients do the work.'
  }

  if (query.includes('breakfast')) {
    return 'For breakfast, think in layers: something warm, something fresh, and a little texture. Toast with eggs and greens, yogurt with fruit and nuts, or a quick savory skillet all work beautifully depending on what you have.'
  }

  return 'Tell me the ingredients you have, how much time you want to spend, and the kind of meal you are craving. I can turn that into a useful cooking direction right away.'
}

const buildRecommendationFallback = (message, recipes = []) => {
  if (recipes.length > 0) {
    const topRecipes = recipes.slice(0, 3).map((recipe) => recipe.title || recipe.name).filter(Boolean)
    return `I could not get a full AI reply just now, but these recipe matches look strong: ${topRecipes.join(', ')}. Tell me which one sounds best and I can help you adapt it.`
  }

  return getFallbackResponse(message)
}

const resolveBotReply = (response, messageText) => {
  const primaryReply = response?.response || response?.message
  if (primaryReply && primaryReply.trim()) {
    return primaryReply.trim()
  }

  const suggestedRecipes = Array.isArray(response?.recipes) ? response.recipes : []
  return buildRecommendationFallback(messageText, suggestedRecipes)
}

const AIChat = () => {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Welcome in. Tell me what is in your kitchen, what mood you are cooking for, or what problem dinner needs to solve.',
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      content: messageText.trim(),
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((current) => [...current, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await sendChatMessage({
        message: messageText.trim(),
        history: messages.slice(-2).map((message) => ({
          role: message.isBot ? 'assistant' : 'user',
          content: message.content,
        })),
      })

      const botMessage = {
        id: Date.now() + 1,
        content: resolveBotReply(response, messageText),
        isBot: true,
        timestamp: new Date(),
      }

      setTimeout(() => {
        setIsTyping(false)
        setMessages((current) => [...current, botMessage])
      }, 700)
    } catch (error) {
      console.error('Chat error:', error)
      setIsTyping(false)
      const fallbackRecommendations = await fetchRecommendations({
        user_input: messageText.trim(),
      }).catch(() => ({ recommendations: [] }))

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          content: buildRecommendationFallback(messageText, fallbackRecommendations.recommendations),
          isBot: true,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        content: 'Welcome in. Tell me what is in your kitchen, what mood you are cooking for, or what problem dinner needs to solve.',
        isBot: true,
        timestamp: new Date(),
      },
    ])
  }

  const generateRecipe = async () => {
    setIsGeneratingRecipe(true)
    try {
      await generateRecipeFromChat({
        conversation: messages,
        preferences: currentUser?.preferences || {},
      })
    } catch (error) {
      console.error('Recipe generation failed:', error)
    } finally {
      setIsGeneratingRecipe(false)
    }
  }

  return (
    <section className="section-shell pt-8">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:grid lg:grid-cols-[0.72fr,1.28fr] lg:px-8">
        <aside className="space-y-6">
          <div className="glass-panel p-6 sm:p-8">
            <span className="section-label">
              <Sparkles className="h-3.5 w-3.5" />
              Kitchen chat
            </span>
            <h1 className="page-title mt-5 text-balance">Talk through dinner like you are standing at the counter with a smart sous chef.</h1>
            <p className="mt-4 text-base leading-8 text-[color:var(--text-secondary)]">
              Ask for ideas, substitutions, quick meals, or what to do with the ingredients already sitting in front of
              you. The backend logic is unchanged; the experience is now more intimate and calm.
            </p>

            <div className="mt-8 grid gap-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="rounded-[22px] border border-[color:var(--border-soft)] bg-white/70 px-4 py-4 text-left text-sm leading-7 text-[color:var(--text-secondary)] transition-all hover:border-[rgba(184,92,56,0.2)] hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="glass-panel flex min-h-[70vh] flex-col overflow-hidden">
          <div className="flex flex-col gap-5 border-b border-[color:var(--border-soft)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white shadow-[var(--shadow-soft)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow mb-1">AI cooking assistant</p>
                <h2 className="font-display text-3xl">Grounded, practical help</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <AnimatedButton
                onClick={generateRecipe}
                variant="secondary"
                size="sm"
                icon={Download}
                loading={isGeneratingRecipe}
                disabled={messages.length < 3}
              >
                Build recipe
              </AnimatedButton>
              <AnimatedButton onClick={clearConversation} variant="ghost" size="sm" icon={RotateCcw}>
                Reset
              </AnimatedButton>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} isBot={message.isBot} />
            ))}

            <AnimatePresence>
              {isTyping ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="rounded-[24px] border border-[color:var(--border-soft)] bg-[rgba(255,252,246,0.92)] px-5 py-4 shadow-[var(--shadow-soft)]">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-simmer rounded-full bg-[color:var(--brand)]" />
                        <span className="h-2 w-2 animate-simmer rounded-full bg-[color:var(--highlight)] [animation-delay:0.1s]" />
                        <span className="h-2 w-2 animate-simmer rounded-full bg-[color:var(--herb)] [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[color:var(--border-soft)] px-5 py-5 sm:px-6">
            <div className="rounded-[26px] border border-[color:var(--border-soft)] bg-white/75 p-3 shadow-[var(--shadow-soft)]">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Tell me what you have, what you want to eat, or what is going wrong in the pan..."
                rows={2}
                className="textarea-field !min-h-[7rem] !border-0 !bg-transparent !px-2 !py-2 !shadow-none"
              />
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                  Enter to send. Shift + Enter for a new line.
                </p>
                <AnimatedButton
                  onClick={() => handleSendMessage()}
                  loading={isLoading}
                  disabled={!inputMessage.trim() || isLoading}
                  icon={isLoading ? Loader2 : Send}
                >
                  Send
                </AnimatedButton>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[color:var(--text-muted)]">
              <span className="meta-pill">Ask for substitutions</span>
              <span className="meta-pill">Find a quick dinner</span>
              <span className="meta-pill">Plan around ingredients you already own</span>
              <span className="meta-pill"><ArrowUpRight className="h-3 w-3" /> Grounded in retrieved recipes when available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIChat
