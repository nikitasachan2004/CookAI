import React from 'react'
import { motion } from 'framer-motion'
import { Bot, Copy, ThumbsDown, ThumbsUp, User } from 'lucide-react'
import PropTypes from 'prop-types'

const ChatBubble = ({ message, isBot = false, onCopy, onFeedback }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      onCopy?.(message.id)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 ${isBot ? '' : 'justify-end'}`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
        isBot
          ? 'bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white'
          : 'bg-[linear-gradient(135deg,var(--herb)_0%,var(--brand)_100%)] text-white'
      }`}>
        {isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </div>

      <div className={`group max-w-[min(42rem,calc(100%-4rem))] ${isBot ? '' : 'order-first'}`}>
        <div
          className={`rounded-[26px] px-5 py-4 shadow-[var(--shadow-soft)] ${
            isBot
              ? 'border border-[color:var(--border-soft)] bg-[rgba(255,252,246,0.92)] text-[color:var(--text-primary)]'
              : 'bg-[linear-gradient(135deg,var(--brand-deep)_0%,var(--brand)_100%)] text-white'
          }`}
        >
          <div className="whitespace-pre-wrap text-sm leading-7 sm:text-[15px]">{message.content}</div>
        </div>

        <div className={`mt-2 flex items-center gap-3 text-xs text-[color:var(--text-muted)] ${isBot ? '' : 'justify-end'}`}>
          <span>{message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Now'}</span>
          {isBot ? (
            <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={handleCopy} className="rounded-full p-1.5 hover:bg-white/70" aria-label="Copy message">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => onFeedback?.(message.id, 'positive')} className="rounded-full p-1.5 hover:bg-white/70" aria-label="Positive feedback">
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => onFeedback?.(message.id, 'negative')} className="rounded-full p-1.5 hover:bg-white/70" aria-label="Negative feedback">
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}

ChatBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  isBot: PropTypes.bool,
  onCopy: PropTypes.func,
  onFeedback: PropTypes.func,
}

export default ChatBubble
