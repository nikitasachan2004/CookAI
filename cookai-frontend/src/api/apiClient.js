import axios from 'axios'

/**
 * API Client for CookAI Backend
 * Handles all HTTP requests with automatic token attachment and error handling
 */

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cookaiToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('cookaiToken')
      localStorage.removeItem('cookaiUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ================================
// AUTHENTICATION ENDPOINTS
// ================================

/**
 * User registration with health profile
 * @param {Object} userData - Complete user registration data
 * @returns {Promise<Object>} Registration response with user and token
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
      activity_level: userData.activityLevel,
      dietary_preference: userData.dietaryPreference
    })
    
    // Store token and user data
    if (response.data.status === 'success') {
      const { token, user } = response.data.data
      localStorage.setItem('cookaiToken', token)
      localStorage.setItem('cookaiUser', JSON.stringify(user))
    }
    
    return response.data
  } catch (error) {
    console.error('Registration error:', error)
    throw error.response?.data || error
  }
}

/**
 * User login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with user and token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    })
    
    // Store token and user data
    if (response.data.status === 'success') {
      const { token, user } = response.data.data
      localStorage.setItem('cookaiToken', token)
      localStorage.setItem('cookaiUser', JSON.stringify(user))
    }
    
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error.response?.data || error
  }
}

/**
 * Refresh JWT token
 * @returns {Promise<Object>} Refresh response with new token
 */
export const refreshToken = async () => {
  try {
    const response = await api.post('/api/auth/refresh')
    
    if (response.data.status === 'success') {
      const { token, user } = response.data.data
      localStorage.setItem('cookaiToken', token)
      localStorage.setItem('cookaiUser', JSON.stringify(user))
    }
    
    return response.data
  } catch (error) {
    console.error('Token refresh error:', error)
    throw error.response?.data || error
  }
}

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/api/auth/profile')
    return response.data
  } catch (error) {
    console.error('Get profile error:', error)
    throw error.response?.data || error
  }
}

/**
 * Update current user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Update response
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/auth/profile', profileData)
    
    // Update stored user data
    if (response.data.status === 'success') {
      localStorage.setItem('cookaiUser', JSON.stringify(response.data.data.user))
    }
    
    return response.data
  } catch (error) {
    console.error('Update profile error:', error)
    throw error.response?.data || error
  }
}

/**
 * Verify JWT token
 * @param {string} token - Token to verify
 * @returns {Promise<Object>} Verification response
 */
export const verifyToken = async (token) => {
  try {
    const response = await api.post('/api/auth/verify-token', { token })
    return response.data
  } catch (error) {
    console.error('Token verification error:', error)
    throw error.response?.data || error
  }
}

/**
 * Logout user (clear local storage)
 */
export const logoutUser = () => {
  localStorage.removeItem('cookaiToken')
  localStorage.removeItem('cookaiUser')
}

// ================================
// AI CHAT ENDPOINTS
// ================================

/**
 * Send message to AI cooking assistant
 * @param {Object} chatData - Chat message data
 * @returns {Promise<Object>} AI response
 */
export const sendAIChatMessage = async (chatData) => {
  try {
    const response = await api.post('/api/chat', {
      message: chatData.message,
      user_profile: chatData.userProfile,
      conversation_history: chatData.conversationHistory
    })
    return response.data
  } catch (error) {
    console.error('AI Chat error:', error)
    throw error.response?.data || error
  }
}

/**
 * Generate recipe from ingredients using AI
 * @param {Object} recipeData - Ingredients and preferences
 * @returns {Promise<Object>} Generated recipe
 */
export const generateRecipeFromIngredients = async (recipeData) => {
  try {
    const response = await api.post('/api/generate-recipe', {
      ingredients: recipeData.ingredients,
      user_profile: recipeData.userProfile
    })
    return response.data
  } catch (error) {
    console.error('Recipe generation error:', error)
    throw error.response?.data || error
  }
}

/**
 * Generate personalized meal plan
 * @param {Object} mealPlanData - Meal plan preferences
 * @returns {Promise<Object>} Generated meal plan
 */
export const generateMealPlan = async (mealPlanData) => {
  try {
    const response = await api.post('/api/meal-plan', {
      days: mealPlanData.days || 7,
      user_profile: mealPlanData.userProfile
    })
    return response.data
  } catch (error) {
    console.error('Meal plan generation error:', error)
    throw error.response?.data || error
  }
}

// ================================
// ENHANCED RECOMMENDATION ENDPOINTS
// ================================

/**
 * Get ML-powered recipe recommendations
 * @param {Object} recommendationData - Ingredients, preferences, and constraints
 * @returns {Promise<Object>} Personalized recipe recommendations
 */
export const getEnhancedRecommendations = async (recommendationData) => {
  try {
    const response = await api.post('/api/recommend', {
      available_ingredients: recommendationData.availableIngredients || [],
      available_equipment: recommendationData.availableEquipment || [],
      user_preferences: recommendationData.userPreferences || {},
      max_results: recommendationData.maxResults || 10,
      exclude_recipe_ids: recommendationData.excludeRecipeIds || []
    })
    return response.data
  } catch (error) {
    console.error('Enhanced recommendations error:', error)
    throw error.response?.data || error
  }
}

/**
 * Get similar recipes to a given recipe
 * @param {number} recipeId - Base recipe ID
 * @param {number} maxResults - Maximum number of similar recipes
 * @returns {Promise<Object>} Similar recipes
 */
export const getSimilarRecipes = async (recipeId, maxResults = 5) => {
  try {
    const response = await api.get(`/api/recipes/${recipeId}/similar?max_results=${maxResults}`)
    return response.data
  } catch (error) {
    console.error('Similar recipes error:', error)
    throw error.response?.data || error
  }
}



/**
 * Get current user profile (alias for consistency)
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export async function getUserProfile(userId) {
  return await getCurrentUserProfile()
}

/**
 * Update user preferences (legacy function)
 * @param {string} userId - User ID
 * @param {Object} preferences - User preferences object
 * @returns {Promise} Updated user data
 */
export async function updateUserPreferencesLegacy(userId, preferences) {
  const response = await api.put(`/api/users/${userId}/preferences`, preferences)
  return response.data
}

// ================================
// RECIPE ENDPOINTS
// ================================

/**
 * Get recipe recommendations based on ingredients and equipment
 * @param {Object} payload - {available_ingredients: [], equipment: [], health_preference: string}
 * @returns {Promise} Array of recommended recipes
 */
export async function fetchRecommendations(payload) {
  const response = await api.post('/api/recommend', payload)
  return response.data
}

/**
 * Get all recipes with optional pagination
 * @param {Object} params - Query parameters {page, limit, tags}
 * @returns {Promise} Paginated recipes data
 */
export async function fetchAllRecipes(params = {}) {
  const response = await api.get('/api/recipes', { params })
  return response.data
}

/**
 * Get specific recipe by ID
 * @param {string} recipeId - Recipe ID
 * @returns {Promise} Recipe details
 */
export async function fetchRecipeById(recipeId) {
  const response = await api.get(`/api/recipes/${recipeId}`)
  return response.data
}

/**
 * Search recipes by tags
 * @param {Object} params - {tags: string, cuisine: string, difficulty: string}
 * @returns {Promise} Filtered recipes
 */
export async function searchRecipes(params) {
  const response = await api.get('/api/recipes/search', { params })
  return response.data
}

/**
 * Like a recipe
 * @param {string} userId - User ID
 * @param {string} recipeId - Recipe ID
 * @returns {Promise} Success response
 */
export async function likeRecipe(userId, recipeId) {
  const response = await api.post(`/api/users/${userId}/like`, { recipe_id: recipeId })
  return response.data
}

/**
 * Get personalized recommendations for user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @returns {Promise} Personalized recipe recommendations
 */
export async function getPersonalizedRecommendations(userId, filters = {}) {
  const response = await api.post(`/api/users/${userId}/recommendations`, filters)
  return response.data
}

/**
 * Get user statistics and analytics
 * @param {string} userId - User ID
 * @returns {Promise} User cooking statistics
 */
export async function getUserStatistics(userId) {
  const response = await api.get(`/api/users/${userId}/statistics`)
  return response.data
}

// ================================
// AI CHAT ENDPOINTS (Optional)
// ================================

/**
 * Send message to AI chat system
 * @param {Object} payload - {message: string, context?: Object}
 * @returns {Promise} AI response
 */
export async function sendChatMessage(payload) {
  const response = await api.post('/api/chat', payload)
  return response.data
}

/**
 * Generate recipe from AI chat conversation
 * @param {Object} payload - {conversation: [], preferences: Object}
 * @returns {Promise} Generated recipe
 */
export async function generateRecipeFromChat(payload) {
  const response = await api.post('/api/chat/generate-recipe', payload)
  return response.data
}

// ================================
// HEALTH CHECK ENDPOINTS
// ================================

/**
 * Check API health status
 * @returns {Promise} Health status
 */
export async function checkHealth() {
  const response = await api.get('/api/health')
  return response.data
}

/**
 * Check user service health
 * @returns {Promise} User service health
 */
export async function checkUserHealth() {
  const response = await api.get('/api/users/health')
  return response.data
}

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Upload image for ingredient recognition (placeholder)
 * @param {File} imageFile - Image file
 * @returns {Promise} Recognized ingredients
 */
export async function uploadIngredientImage(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  
  const response = await api.post('/api/ingredients/recognize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Get nutrition information for recipe
 * @param {string} recipeId - Recipe ID
 * @returns {Promise} Nutrition data
 */
export async function getRecipeNutrition(recipeId) {
  const response = await api.get(`/api/recipes/${recipeId}/nutrition`)
  return response.data
}

// Export the configured axios instance for custom requests
export { api }