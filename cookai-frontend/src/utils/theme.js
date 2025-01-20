/**
 * Theme configuration and utility functions for CookAI
 * Provides consistent theming across the application
 */

// Theme tokens matching Tailwind config
export const theme = {
  colors: {
    primary: {
      50: '#fef7ee',
      100: '#fdedd6',
      200: '#fad7ac',
      300: '#f6ba77',
      400: '#f19640',
      500: '#ed7c1a',
      600: '#de6510',
      700: '#b84e10',
      800: '#933f14',
      900: '#773513',
    },
    secondary: {
      50: '#f0fdf9',
      100: '#ccfbef',
      200: '#99f6e0',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    accent: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
    }
  },
  
  // Glassmorphism effect styles
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    dark: {
      background: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }
  },
  
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Shadows
  shadows: {
    glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    large: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  }
}

/**
 * Get glass effect CSS properties
 * @param {string} variant - 'light' or 'dark'
 * @returns {Object} CSS properties object
 */
export const getGlassEffect = (variant = 'light') => {
  return theme.glass[variant]
}

/**
 * Generate gradient background classes
 * @param {string} direction - gradient direction
 * @param {string[]} colors - array of color stops
 * @returns {string} CSS class string
 */
export const getGradientClass = (direction = 'to-r', colors = ['primary-500', 'secondary-500']) => {
  return `bg-gradient-${direction} from-${colors[0]} to-${colors[1]}`
}

/**
 * Get responsive container classes
 * @param {string} size - container size variant
 * @returns {string} CSS class string
 */
export const getContainerClass = (size = 'default') => {
  const baseClasses = 'mx-auto px-4 sm:px-6 lg:px-8'
  
  switch (size) {
    case 'sm':
      return `${baseClasses} max-w-2xl`
    case 'md':
      return `${baseClasses} max-w-4xl`
    case 'lg':
      return `${baseClasses} max-w-6xl`
    case 'xl':
      return `${baseClasses} max-w-7xl`
    case 'full':
      return baseClasses
    default:
      return `${baseClasses} max-w-5xl`
  }
}

/**
 * Animation variants for Framer Motion
 */
export const animations = {
  // Page transitions
  pageVariants: {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  },
  
  // Card animations
  cardVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, scale: 1.02 }
  },
  
  // Button animations
  buttonVariants: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  },
  
  // Modal animations
  modalVariants: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  
  // List item animations
  listItemVariants: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  },
  
  // Fade animations
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  
  // Stagger animations for lists
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}

/**
 * Common transition configurations
 */
export const transitions = {
  default: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  },
  
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30
  },
  
  slow: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.5
  },
  
  fast: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.15
  }
}

/**
 * Dark mode theme utilities
 */
export const darkMode = {
  // Check if dark mode is enabled
  isDark: () => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  },
  
  // Toggle dark mode
  toggle: () => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', darkMode.isDark() ? 'true' : 'false')
  },
  
  // Set dark mode
  set: (enabled) => {
    if (typeof window === 'undefined') return
    if (enabled) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', enabled ? 'true' : 'false')
  },
  
  // Initialize dark mode from localStorage
  init: () => {
    if (typeof window === 'undefined') return
    
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = saved ? saved === 'true' : prefersDark
    darkMode.set(shouldBeDark)
  }
}

export default theme