import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  loginUser, 
  registerUser, 
  getCurrentUserProfile, 
  refreshToken,
  verifyToken,
  logoutUser
} from '../api/apiClient'

/**
 * Authentication Context for managing user state and auth operations
 * Provides login, logout, register functionality with JWT token management
 */

const AuthContext = createContext({})

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * AuthProvider component that wraps the app and provides auth state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('cookaiToken')
      const storedUser = localStorage.getItem('cookaiUser')

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser)
        
        // Verify token is still valid
        try {
          await verifyToken(storedToken)
          
          setToken(storedToken)
          setCurrentUser(user)
          setIsAuthenticated(true)
          
          // Refresh user data from server
          try {
            const freshUserData = await getCurrentUserProfile()
            if (freshUserData.status === 'success') {
              setCurrentUser(freshUserData.data.user)
              localStorage.setItem('cookaiUser', JSON.stringify(freshUserData.data.user))
            }
          } catch (error) {
            console.warn('Failed to refresh user data:', error)
          }
        } catch (tokenError) {
          console.warn('Token verification failed:', tokenError)
          // Try to refresh token
          try {
            const refreshResponse = await refreshToken()
            if (refreshResponse.status === 'success') {
              setToken(refreshResponse.data.token)
              setCurrentUser(refreshResponse.data.user)
              setIsAuthenticated(true)
            } else {
              throw new Error('Token refresh failed')
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            // Clear invalid data
            localStorage.removeItem('cookaiToken')
            localStorage.removeItem('cookaiUser')
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      // Clear invalid data
      localStorage.removeItem('cookaiToken')
      localStorage.removeItem('cookaiUser')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result with success status
   */
  const login = async (email, password) => {
    try {
      setIsLoading(true)
      
      // Call API login endpoint
      const response = await loginUser(email, password)
      
      if (response.status === 'success') {
        // Extract token and user data
        const { token, user } = response.data
        
        // Update state
        setToken(token)
        setCurrentUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.message || 'Login failed'
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register new user with health profile
   * @param {Object} userData - Complete user registration data including health info
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    try {
      setIsLoading(true)
      
      // Call API register endpoint
      const response = await registerUser(userData)
      
      if (response.status === 'success') {
        // Extract token and user data
        const { token, user } = response.data
        
        // Update state with auto-login
        setToken(token)
        setCurrentUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.message || 'Registration failed'
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout user and clear all auth data
   */
  const logout = () => {
    // Call API logout utility
    logoutUser()
    
    // Clear state
    setToken(null)
    setCurrentUser(null)
    setIsAuthenticated(false)
    
    // Redirect to home page
    window.location.href = '/'
  }

  /**
   * Update current user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('cookaiUser', JSON.stringify(userData))
  }

  /**
   * Add liked recipe to user profile
   * @param {Object} recipe - Recipe object to like
   */
  const addLikedRecipe = (recipe) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        liked_recipes: [...(currentUser.liked_recipes || []), recipe.id]
      }
      updateUser(updatedUser)
    }
  }

  /**
   * Remove liked recipe from user profile
   * @param {string} recipeId - Recipe ID to unlike
   */
  const removeLikedRecipe = (recipeId) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        liked_recipes: (currentUser.liked_recipes || []).filter(id => id !== recipeId)
      }
      updateUser(updatedUser)
    }
  }

  /**
   * Check if user has liked a specific recipe
   * @param {string} recipeId - Recipe ID to check
   * @returns {boolean} Whether recipe is liked
   */
  const isRecipeLiked = (recipeId) => {
    if (!currentUser || !currentUser.liked_recipes) return false
    return currentUser.liked_recipes.includes(recipeId)
  }

  // Context value
  const value = {
    // State
    currentUser,
    isAuthenticated,
    isLoading,
    token,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    addLikedRecipe,
    removeLikedRecipe,
    isRecipeLiked,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext