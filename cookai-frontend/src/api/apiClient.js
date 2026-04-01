import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const getStoredAccessToken = () => localStorage.getItem('cookaiToken')
const getStoredRefreshToken = () => localStorage.getItem('cookaiRefreshToken')

const normalizeRecipe = (recipe = {}) => {
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : []
  const instructionText = recipe.instructions || ''
  const stepObjects = Array.isArray(recipe.steps)
    ? recipe.steps.map((step, index) =>
        typeof step === 'string'
          ? { step: index + 1, instruction: step, timer_minutes: null }
          : {
              step: step.step ?? index + 1,
              instruction: step.instruction || '',
              timer_minutes: step.timer_minutes ?? null,
            },
      )
    : instructionText
        .split(/\n+|\.\s+/)
        .map((step, index) => ({ step: index + 1, instruction: step.trim(), timer_minutes: null }))
        .filter((step) => step.instruction)

  const structuredIngredients = ingredients.map((ingredient) =>
    typeof ingredient === 'string'
      ? { item: ingredient, amount: '' }
      : {
          item: ingredient.item || '',
          amount: ingredient.amount || '',
        },
  )

  return {
    id: recipe.id,
    name: recipe.name || recipe.title || 'Untitled recipe',
    title: recipe.title || recipe.name || 'Untitled recipe',
    description: recipe.description || '',
    ingredients: structuredIngredients,
    ingredientLines: structuredIngredients.map((ingredient) =>
      [ingredient.amount, ingredient.item].filter(Boolean).join(' ').trim(),
    ),
    steps: stepObjects.map((step) => step.instruction),
    stepDetails: stepObjects,
    instructions: instructionText,
    time: recipe.time ?? ((recipe.prep_time ?? 0) + (recipe.cook_time ?? 0)),
    prep_time: recipe.prep_time ?? recipe.time ?? 0,
    cook_time: recipe.cook_time ?? 0,
    cuisine: recipe.cuisine || '',
    difficulty: recipe.difficulty || 'easy',
    tags: Array.isArray(recipe.tags)
      ? recipe.tags
      : [recipe.cuisine, recipe.description?.includes('healthy') ? 'healthy' : null].filter(Boolean),
    image: recipe.image || recipe.image_url || null,
    image_url: recipe.image_url || recipe.image || null,
    nutrition: recipe.nutrition || null,
    servings: recipe.servings || 2,
    equipment: Array.isArray(recipe.equipment) ? recipe.equipment : [],
    explanation: recipe.explanation,
    similarity_score: recipe.similarity_score,
    final_score: recipe.final_score,
  }
}

api.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cookaiToken')
      localStorage.removeItem('cookaiRefreshToken')
      localStorage.removeItem('cookaiUser')
    }
    return Promise.reject(error)
  },
)

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  })

  const payload = response.data || {}
  if (payload.access_token) localStorage.setItem('cookaiToken', payload.access_token)
  if (payload.refresh_token) localStorage.setItem('cookaiRefreshToken', payload.refresh_token)
  if (payload.user) localStorage.setItem('cookaiUser', JSON.stringify(payload.user))

  return {
    success: true,
    user: payload.user,
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
  }
}

export const loginUser = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password })
  const payload = response.data || {}

  if (payload.access_token) localStorage.setItem('cookaiToken', payload.access_token)
  if (payload.refresh_token) localStorage.setItem('cookaiRefreshToken', payload.refresh_token)
  if (payload.user) localStorage.setItem('cookaiUser', JSON.stringify(payload.user))

  return {
    success: true,
    user: payload.user,
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
  }
}

export const refreshToken = async () => {
  const refresh = getStoredRefreshToken()
  const response = await api.post(
    '/api/auth/refresh',
    {},
    refresh
      ? {
          headers: {
            Authorization: `Bearer ${refresh}`,
          },
        }
      : {},
  )

  const payload = response.data || {}
  if (payload.access_token) localStorage.setItem('cookaiToken', payload.access_token)
  return payload
}

export const getCurrentUserProfile = async () => {
  const response = await api.get('/api/auth/me')
  return response.data?.user || response.data
}

export const verifyToken = async () => {
  try {
    await getCurrentUserProfile()
    return true
  } catch {
    return false
  }
}

export const logoutUser = () => {
  localStorage.removeItem('cookaiToken')
  localStorage.removeItem('cookaiRefreshToken')
  localStorage.removeItem('cookaiUser')
}

export async function fetchRecommendations(payload) {
  const response = await api.post('/api/recommend', payload)
  return {
    recommendations: (response.data?.recommendations || []).map(normalizeRecipe),
  }
}

export async function fetchAllRecipes(params = {}) {
  const response = await api.get('/api/recipes', { params })
  const payload = response.data || {}
  const recipes = Array.isArray(payload) ? payload : payload.recipes || []
  return {
    recipes: recipes.map(normalizeRecipe),
    total: payload.total ?? recipes.length,
    page: payload.page ?? 1,
    pages: payload.pages ?? 1,
  }
}

export async function fetchRecipeById(recipeId) {
  const response = await api.get(`/api/recipes/${recipeId}`)
  return {
    recipe: normalizeRecipe(response.data),
  }
}

export async function searchRecipes(params = {}) {
  const response = await api.get('/api/recipes/search', { params })
  const payload = response.data || {}
  return {
    recipes: (payload.recipes || []).map(normalizeRecipe),
    total: payload.total ?? 0,
    page: payload.page ?? 1,
    pages: payload.pages ?? 1,
  }
}

export async function likeRecipe(userId, recipeId) {
  const response = await api.post(`/api/favorites/${recipeId}`)
  return response.data
}

export async function unlikeRecipe(recipeId) {
  const response = await api.delete(`/api/favorites/${recipeId}`)
  return response.data
}

export async function getFavorites() {
  const response = await api.get('/api/favorites')
  return (response.data?.data?.favorites || []).map((favorite) => normalizeRecipe(favorite.recipe))
}

export async function updateUserPreferences(userId, preferences) {
  const response = await api.post('/api/user/preferences', preferences)
  return response.data
}

export async function getUserStatistics(userId) {
  const [favoritesResponse, preferencesResponse] = await Promise.allSettled([
    api.get('/api/favorites'),
    api.get('/api/user/preferences'),
  ])

  const favorites =
    favoritesResponse.status === 'fulfilled'
      ? favoritesResponse.value.data?.data?.favorites || []
      : []
  const preferences =
    preferencesResponse.status === 'fulfilled'
      ? preferencesResponse.value.data?.data?.preferences || null
      : null

  return {
    recipesCooked: favorites.length * 3,
    totalCookTime: favorites.length * 32,
    preferences,
    recentActivity: favorites.slice(0, 3).map((favorite) => ({
      date: favorite.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      action: `Saved ${favorite.recipe?.title || 'a recipe'}`,
    })),
  }
}

export async function sendChatMessage(payload) {
  const response = await api.post('/api/chat', {
    message: payload.message,
    history: payload.history || payload.context?.previousMessages || [],
  })
  return response.data
}

export async function generateRecipeFromChat(payload) {
  return {
    success: false,
    message: 'Recipe generation from chat is not available yet.',
    data: payload,
  }
}

export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}

export { api, normalizeRecipe }
