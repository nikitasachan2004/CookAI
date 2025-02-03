import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Clock, Users, ChefHat, Star, Heart, Share2, 
  ArrowLeft, Play, Pause, RotateCcw, Timer,
  CheckCircle2, Circle, MessageCircle, Bookmark
} from 'lucide-react'
import { fetchRecipeById, likeRecipe } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import { mockRecipes } from '../data/mockRecipes'
import { formatTime, getDifficultyColor } from '../utils/helpers'
import AnimatedButton from '../components/AnimatedButton'

/**
 * RecipeDetail page with step-by-step cooking mode and AI assistance
 * TODO: Complete implementation with cooking timer and AI chat integration
 */
const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, isAuthenticated, isRecipeLiked, addLikedRecipe, removeLikedRecipe } = useAuth()
  
  // State management
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  
  // Cooking mode state
  const [cookingMode, setCookingMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [timer, setTimer] = useState({ minutes: 0, seconds: 0, isActive: false })
  
  // Load recipe data
  useEffect(() => {
    loadRecipe()
  }, [id])
  
  // Check if recipe is liked
  useEffect(() => {
    if (recipe && isAuthenticated) {
      setIsLiked(isRecipeLiked(recipe.id))
    }
  }, [recipe, isAuthenticated, isRecipeLiked])
  
  const loadRecipe = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetchRecipeById(id)
      
      if (result.success) {
        setRecipe(result.recipe)
      } else {
        throw new Error(result.message || 'Recipe not found')
      }
    } catch (error) {
      console.error('Failed to load recipe:', error)
      setError(error.message)
      
      // Fallback to mock data
      const mockRecipe = mockRecipes.find(r => r.id.toString() === id)
      if (mockRecipe) {
        setRecipe(mockRecipe)
        setError(null)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated || !recipe) return
    
    try {
      if (isLiked) {
        removeLikedRecipe(recipe.id)
      } else {
        await likeRecipe(currentUser.id, recipe.id)
        addLikedRecipe(recipe)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Failed to like recipe:', error)
    }
  }
  
  // Cooking mode functions
  const startCookingMode = () => {
    setCookingMode(true)
    setCurrentStep(0)
    setCompletedSteps(new Set())
  }
  
  const exitCookingMode = () => {
    setCookingMode(false)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setTimer({ minutes: 0, seconds: 0, isActive: false })
  }
  
  const toggleStepComplete = (stepIndex) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepIndex)) {
      newCompleted.delete(stepIndex)
    } else {
      newCompleted.add(stepIndex)
    }
    setCompletedSteps(newCompleted)
  }
  
  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  // Timer functions (TODO: Implement full timer functionality)
  const startTimer = (minutes) => {
    setTimer({ minutes, seconds: 0, isActive: true })
    // TODO: Implement countdown logic
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading recipe...</p>
        </div>
      </div>
    )
  }
  
  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">{error || 'The recipe you\'re looking for doesn\'t exist.'}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }
  
  // Cooking Mode View
  if (cookingMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Cooking Mode Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={exitCookingMode}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Exit Cooking Mode</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{recipe.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {recipe.steps.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* TODO: Add timer display */}
              <button
                onClick={() => startTimer(5)}
                className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Timer className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Current Step */}
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => toggleStepComplete(currentStep)}
                className={`flex-shrink-0 mt-1 ${
                  completedSteps.has(currentStep) ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                {completedSteps.has(currentStep) ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Step {currentStep + 1}
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {recipe.steps[currentStep]}
                </p>
              </div>
            </div>
            
            {/* Step Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex space-x-2">
                {recipe.steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-primary-500'
                        : completedSteps.has(index)
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStep}
                disabled={currentStep === recipe.steps.length - 1}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === recipe.steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
  
  // Normal Recipe View
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Recipes</span>
        </motion.button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recipe Image and Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 hidden items-center justify-center">
                <ChefHat className="h-16 w-16 text-gray-400" />
              </div>
              
              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`p-3 rounded-full backdrop-blur-sm shadow-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 backdrop-blur-sm shadow-lg"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Recipe Title and Meta */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {recipe.name}
                  </h1>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 
                                 text-sm rounded-full capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">4.8</span>
                  <span className="text-gray-500 dark:text-gray-400">(124 reviews)</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cook Time</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatTime(recipe.time)}</p>
                </div>
                
                <div className="text-center">
                  <Users className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Servings</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{recipe.servings || 4}</p>
                </div>
                
                <div className="text-center">
                  <ChefHat className="h-6 w-6 text-primary-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Difficulty</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    getDifficultyColor(recipe.difficulty)
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Sidebar - Ingredients and Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Start Cooking Button */}
            <AnimatedButton
              onClick={startCookingMode}
              icon={Play}
              className="w-full py-4 text-lg font-semibold"
            >
              Start Cooking
            </AnimatedButton>
            
            {/* Ingredients */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                  >
                    <Circle className="h-2 w-2 text-primary-500 fill-current flex-shrink-0" />
                    <span className="capitalize">{ingredient}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Equipment */}
            {recipe.equipment && recipe.equipment.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Equipment Needed
                </h3>
                <ul className="space-y-2">
                  {recipe.equipment.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <ChefHat className="h-4 w-4 text-primary-500" />
                      <span className="capitalize">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Nutrition Info */}
            {recipe.nutrition && (
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Nutrition Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Calories</span>
                    <span className="font-medium text-gray-900 dark:text-white">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Protein</span>
                    <span className="font-medium text-gray-900 dark:text-white">{recipe.nutrition.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Carbs</span>
                    <span className="font-medium text-gray-900 dark:text-white">{recipe.nutrition.carbs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Fat</span>
                    <span className="font-medium text-gray-900 dark:text-white">{recipe.nutrition.fat}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Instructions
          </h2>
          
          <div className="space-y-6">
            {recipe.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex space-x-4 glass-panel p-6 rounded-2xl"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* AI Assistant Button (TODO) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6"
        >
          <button className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
            <MessageCircle className="h-6 w-6" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default RecipeDetail