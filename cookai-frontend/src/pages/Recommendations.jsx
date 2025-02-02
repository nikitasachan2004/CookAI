import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Filter, SortAsc, Grid, List, Search, X } from 'lucide-react'
import { fetchRecommendations, searchRecipes } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/RecipeCard'
import { mockRecipes } from '../data/mockRecipes'
import { getContainerClass, animations } from '../utils/theme'

/**
 * Recommendations page with filtering, sorting, and search functionality
 * TODO: Complete implementation with advanced filtering and pagination
 */
const Recommendations = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // State management
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Filter and sort state
  const [filters, setFilters] = useState({
    cuisine: '',
    difficulty: '',
    maxTime: '',
    tags: [],
    minRating: 0
  })
  const [sortBy, setSortBy] = useState('relevance')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [recipesPerPage] = useState(12)
  
  // Initialize from URL params
  useEffect(() => {
    const ingredients = searchParams.get('ingredients')?.split(',') || []
    const equipment = searchParams.get('equipment')?.split(',') || []
    const health = searchParams.get('health') || ''
    const search = searchParams.get('search') || ''
    
    setSearchQuery(search)
    loadRecommendations({ ingredients, equipment, health, search })
  }, [searchParams])
  
  // Load recommendations from API or fallback to mock data
  const loadRecommendations = async (params = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      let result
      
      if (params.search) {
        // Search recipes by query
        result = await searchRecipes({ q: params.search })
      } else if (params.ingredients?.length > 0) {
        // Get recommendations based on ingredients
        result = await fetchRecommendations({
          available_ingredients: params.ingredients,
          equipment: params.equipment || [],
          health_preference: params.health
        })
      } else {
        // Get all recipes
        result = await fetchRecommendations({})
      }
      
      if (result.success) {
        setRecipes(result.recommendations || result.recipes || [])
      } else {
        throw new Error(result.message || 'Failed to load recipes')
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error)
      setError(error.message)
      
      // Fallback to mock data for demo
      setRecipes(mockRecipes)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...recipes]
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
    
    // Apply cuisine filter
    if (filters.cuisine) {
      filtered = filtered.filter(recipe => 
        recipe.cuisine?.toLowerCase() === filters.cuisine.toLowerCase()
      )
    }
    
    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(recipe => 
        recipe.difficulty?.toLowerCase() === filters.difficulty.toLowerCase()
      )
    }
    
    // Apply time filter
    if (filters.maxTime) {
      const maxTime = parseInt(filters.maxTime)
      filtered = filtered.filter(recipe => recipe.time <= maxTime)
    }
    
    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.tags.every(tag =>
          recipe.tags.some(recipeTag => 
            recipeTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'time-asc':
        filtered.sort((a, b) => a.time - b.time)
        break
      case 'time-desc':
        filtered.sort((a, b) => b.time - a.time)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'difficulty':
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
        filtered.sort((a, b) => 
          (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
        )
        break
      default: // relevance
        // Keep original order or add relevance scoring
        break
    }
    
    setFilteredRecipes(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [recipes, filters, sortBy, searchQuery])
  
  // Pagination
  const indexOfLastRecipe = currentPage * recipesPerPage
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe)
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage)
  
  // TODO: Implement these handler functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }
  
  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }
  
  const clearFilters = () => {
    setFilters({
      cuisine: '',
      difficulty: '',
      maxTime: '',
      tags: [],
      minRating: 0
    })
    setSearchQuery('')
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading delicious recipes...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen py-8">
      <div className={getContainerClass()}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Recipe Recommendations
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {filteredRecipes.length} recipes found
            {searchParams.get('ingredients') && (
              <span> for ingredients: {searchParams.get('ingredients')}</span>
            )}
          </p>
        </motion.div>
        
        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6 rounded-2xl mb-8 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients, or cuisines..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* TODO: Implement filter dropdowns */}
            <select
              value={filters.cuisine}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="asian">Asian</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="american">American</option>
            </select>
            
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option value="relevance">Most Relevant</option>
              <option value="time-asc">Quick Recipes</option>
              <option value="time-desc">Longer Recipes</option>
              <option value="name">Alphabetical</option>
              <option value="difficulty">By Difficulty</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Active Filters */}
          {(filters.cuisine || filters.difficulty || filters.tags.length > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {/* TODO: Show active filter tags with remove buttons */}
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Recipe Grid/List */}
        {filteredRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              No recipes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Start New Search
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={animations.containerVariants}
              initial="hidden"
              animate="visible"
              className={`${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-6'
              }`}
            >
              {currentRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  variants={animations.listItemVariants}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <RecipeCard
                    recipe={recipe}
                    size={viewMode === 'list' ? 'lg' : 'md'}
                    showMatchScore={true}
                    matchScore={Math.floor(Math.random() * 30) + 70}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-12"
              >
                {/* TODO: Implement pagination component */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === i + 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Recommendations