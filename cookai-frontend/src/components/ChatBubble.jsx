import React from 'react'
import { motion } from 'framer-motion'
import { User, Bot, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import PropTypes from 'prop-types'

/**
 * ChatBubble component for displaying chat messages
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object
 * @param {boolean} props.isBot - Whether message is from bot
 * @param {Function} props.onCopy - Copy message handler
 * @param {Function} props.onFeedback - Feedback handler
 */
const ChatBubble = ({ 
  message, 
  isBot = false, 
  onCopy, 
  onFeedback 
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    if (onCopy) onCopy(message.id)
  }

  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    }
  }

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-start space-x-3 mb-6 ${
        isBot ? 'justify-start' : 'justify-end flex-row-reverse space-x-reverse'
      }`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot 
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
          : 'bg-gradient-to-r from-secondary-500 to-accent-500'
      }`}>
        {isBot ? (
          <Bot className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md group ${
        isBot ? 'order-1' : 'order-2'
      }`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`px-4 py-3 rounded-2xl shadow-lg relative ${
            isBot
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
          }`}
        >
          {/* Message Text */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Message Actions */}
          {isBot && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -bottom-8 left-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopy}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Copy message"
              >
                <Copy className="h-3 w-3" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onFeedback?.(message.id, 'positive')}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                aria-label="Good response"
              >
                <ThumbsUp className="h-3 w-3" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onFeedback?.(message.id, 'negative')}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                aria-label="Poor response"
              >
                <ThumbsDown className="h-3 w-3" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
          isBot ? 'text-left' : 'text-right'
        }`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'Now'}
        </div>
      </div>
    </motion.div>
  )
}

ChatBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  }).isRequired,
  isBot: PropTypes.bool,
  onCopy: PropTypes.func,
  onFeedback: PropTypes.func
}

export default ChatBubble