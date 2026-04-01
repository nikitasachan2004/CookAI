import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import PropTypes from 'prop-types'

const AnimatedButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  ...props
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-primary bg-none !bg-[linear-gradient(135deg,#9d4b5a_0%,#b85c38_100%)]',
    success: 'btn-primary bg-none !bg-[linear-gradient(135deg,#5d7b5d_0%,#d98f2b_100%)]',
  }

  const sizes = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-6 py-3 text-sm sm:text-base',
    lg: 'px-7 py-4 text-base',
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -2, scale: 1.01 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className} ${(disabled || loading) ? 'cursor-not-allowed opacity-60' : ''}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Working...</span>
        </>
      ) : (
        <>
          {Icon ? <Icon className="h-4 w-4" /> : null}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  )
}

AnimatedButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  icon: PropTypes.elementType,
}

export default AnimatedButton
