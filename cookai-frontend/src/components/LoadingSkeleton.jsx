import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * LoadingSkeleton component for better loading states
 * Premium shimmer effect for modern UX
 */
const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  if (variant === 'card') {
    return (
      <>
        {skeletons.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card overflow-hidden"
          >
            {/* Image skeleton */}
            <div className="h-48 skeleton" />
            
            {/* Content skeleton */}
            <div className="p-5 space-y-4">
              <div className="h-6 skeleton w-3/4 rounded-lg" />
              <div className="flex gap-2">
                <div className="h-6 skeleton w-16 rounded-lg" />
                <div className="h-6 skeleton w-20 rounded-lg" />
                <div className="h-6 skeleton w-16 rounded-lg" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 skeleton w-20 rounded-lg" />
                <div className="h-4 skeleton w-16 rounded-lg" />
              </div>
            </div>
          </motion.div>
        ))}
      </>
    )
  }

  if (variant === 'list') {
    return (
      <>
        {skeletons.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-4 p-4 rounded-2xl"
          >
            <div className="w-16 h-16 skeleton rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 skeleton w-3/4 rounded-lg" />
              <div className="h-3 skeleton w-1/2 rounded-lg" />
            </div>
          </motion.div>
        ))}
      </>
    )
  }

  if (variant === 'text') {
    return (
      <div className="space-y-3">
        {skeletons.map((index) => (
          <div
            key={index}
            className="h-4 skeleton rounded-lg"
            style={{ width: `${Math.random() * 30 + 70}%` }}
          />
        ))}
      </div>
    )
  }

  return null
}

LoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf(['card', 'list', 'text']),
  count: PropTypes.number
}

export default LoadingSkeleton
