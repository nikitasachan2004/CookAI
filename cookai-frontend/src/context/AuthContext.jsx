import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  getCurrentUserProfile,
  getFavorites,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  verifyToken,
} from '../api/apiClient'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('cookaiToken'))

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('cookaiToken')
        const storedUser = localStorage.getItem('cookaiUser')
        if (!storedToken) return

        let parsedUser = null
        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser)
          } catch (error) {
            localStorage.removeItem('cookaiUser')
          }
        }

        if (parsedUser) {
          setCurrentUser(parsedUser)
        }
        setToken(storedToken)

        const valid = await verifyToken()
        if (!valid) {
          const refreshed = await refreshToken().catch(() => null)
          if (!refreshed?.access_token) {
            logoutUser()
            setCurrentUser(null)
            setToken(null)
            setIsAuthenticated(false)
            return
          }
        }

        const freshUser = await getCurrentUserProfile().catch(() => parsedUser)
        if (!freshUser) {
          logoutUser()
          setCurrentUser(null)
          setToken(null)
          setIsAuthenticated(false)
          return
        }

        const favorites = await getFavorites().catch(() => [])
        const enrichedUser = {
          ...freshUser,
          liked_recipes: favorites.map((recipe) => recipe.id),
        }
        setCurrentUser(enrichedUser)
        localStorage.setItem('cookaiUser', JSON.stringify(enrichedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        logoutUser()
        setCurrentUser(null)
        setToken(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await loginUser(email, password)
      const favorites = await getFavorites().catch(() => [])
      const user = {
        ...response.user,
        liked_recipes: favorites.map((recipe) => recipe.id),
      }
      setCurrentUser(user)
      setToken(response.access_token)
      setIsAuthenticated(true)
      localStorage.setItem('cookaiUser', JSON.stringify(user))
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error?.error || error?.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setIsLoading(true)
      const response = await registerUser(userData)
      const user = {
        ...response.user,
        liked_recipes: [],
      }
      setCurrentUser(user)
      setToken(response.access_token)
      setIsAuthenticated(true)
      localStorage.setItem('cookaiUser', JSON.stringify(user))
      return { success: true, user }
    } catch (error) {
      return { success: false, error: error?.error || error?.message || 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    logoutUser()
    setCurrentUser(null)
    setToken(null)
    setIsAuthenticated(false)
    window.location.href = '/'
  }

  const updateUser = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('cookaiUser', JSON.stringify(userData))
  }

  const addLikedRecipe = (recipe) => {
    if (!currentUser) return
    const liked = Array.from(new Set([...(currentUser.liked_recipes || []), recipe.id]))
    updateUser({ ...currentUser, liked_recipes: liked })
  }

  const removeLikedRecipe = (recipeId) => {
    if (!currentUser) return
    updateUser({
      ...currentUser,
      liked_recipes: (currentUser.liked_recipes || []).filter((id) => id !== recipeId),
    })
  }

  const isRecipeLiked = (recipeId) => {
    return Boolean(currentUser?.liked_recipes?.includes(recipeId))
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        token,
        login,
        register,
        logout,
        updateUser,
        addLikedRecipe,
        removeLikedRecipe,
        isRecipeLiked,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
