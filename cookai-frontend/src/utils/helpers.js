/**
 * Utility helper functions for CookAI frontend
 * Common functions used across components
 */

/**
 * Format cooking time from minutes to human-readable string
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
export const formatTime = (minutes) => {
  if (!minutes || minutes < 1) return '< 1 min'
  
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Normalize ingredient name for comparison
 * @param {string} ingredient - Raw ingredient name
 * @returns {string} Normalized ingredient name
 */
export const normalizeIngredient = (ingredient) => {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
}

/**
 * Calculate match percentage between available and required ingredients
 * @param {string[]} availableIngredients - User's available ingredients
 * @param {string[]} requiredIngredients - Recipe's required ingredients
 * @param {string[]} essentialIngredients - Recipe's essential ingredients
 * @returns {number} Match percentage (0-100)
 */
export const calculateMatchPercentage = (availableIngredients, requiredIngredients, essentialIngredients = []) => {
  if (!requiredIngredients.length) return 0
  
  const normalizedAvailable = availableIngredients.map(normalizeIngredient)
  const normalizedRequired = requiredIngredients.map(normalizeIngredient)
  const normalizedEssential = essentialIngredients.map(normalizeIngredient)
  
  let matchCount = 0
  let essentialMatchCount = 0
  
  normalizedRequired.forEach(required => {
    const isMatched = normalizedAvailable.some(available => 
      available.includes(required) || required.includes(available)
    )
    
    if (isMatched) {
      matchCount++
      
      if (normalizedEssential.includes(required)) {
        essentialMatchCount++
      }
    }
  })
  
  // Base match percentage
  const basePercentage = (matchCount / normalizedRequired.length) * 100
  
  // Bonus for essential ingredients
  const essentialBonus = essentialIngredients.length > 0 
    ? (essentialMatchCount / essentialIngredients.length) * 20 
    : 0
  
  return Math.min(100, Math.round(basePercentage + essentialBonus))
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Generate a random ID string
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Format nutrition value with unit
 * @param {string|number} value - Nutrition value
 * @param {string} unit - Unit (g, mg, kcal, etc.)
 * @returns {string} Formatted nutrition string
 */
export const formatNutrition = (value, unit = '') => {
  if (!value) return 'N/A'
  return typeof value === 'string' ? value : `${value}${unit}`
}

/**
 * Check if recipe matches dietary preferences
 * @param {Object} recipe - Recipe object
 * @param {string[]} preferences - User dietary preferences
 * @returns {boolean} Whether recipe matches preferences
 */
export const matchesDietaryPreferences = (recipe, preferences = []) => {
  if (!preferences.length) return true
  
  const recipeTags = recipe.tags.map(tag => tag.toLowerCase())
  
  return preferences.every(preference => {
    switch (preference.toLowerCase()) {
      case 'vegetarian':
        return recipeTags.includes('vegetarian') || recipeTags.includes('vegan')
      case 'vegan':
        return recipeTags.includes('vegan')
      case 'gluten-free':
        return recipeTags.includes('gluten-free')
      case 'dairy-free':
        return recipeTags.includes('dairy-free') || recipeTags.includes('vegan')
      case 'low-carb':
        return recipeTags.includes('low-carb') || recipeTags.includes('keto')
      case 'healthy':
        return recipeTags.includes('healthy') || recipeTags.includes('light')
      default:
        return recipeTags.includes(preference.toLowerCase())
    }
  })
}

/**
 * Get difficulty color class for styling
 * @param {string} difficulty - Recipe difficulty level
 * @returns {string} CSS class name
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'text-green-600 bg-green-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'hard':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with score and feedback
 */
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*]/.test(password)
  
  let score = 0
  const feedback = []
  
  if (password.length >= minLength) score++
  else feedback.push(`At least ${minLength} characters`)
  
  if (hasUpperCase) score++
  else feedback.push('One uppercase letter')
  
  if (hasLowerCase) score++
  else feedback.push('One lowercase letter')
  
  if (hasNumbers) score++
  else feedback.push('One number')
  
  if (hasSpecialChar) score++
  else feedback.push('One special character')
  
  return {
    score,
    isValid: score >= 4,
    strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong',
    feedback
  }
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error)
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.warn(`Failed to set ${key} in localStorage:`, error)
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error)
      return false
    }
  }
}