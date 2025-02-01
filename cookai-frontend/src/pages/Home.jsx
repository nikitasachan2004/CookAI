import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  ChefHat, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { fetchRecommendations } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/RecipeCard'
import IngredientInput from '../components/IngredientInput'
import EquipmentSelector from '../components/EquipmentSelector'
import { mockRecipes } from '../data/mockRecipes'
import { getContainerClass, animations, transitions } from '../utils/theme'

/**
 * Home page component with hero section and recipe discovery
 * Features ingredient input, equipment selection, and AI-powered recommendations
 */
const Home = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const navigate = useNavigate()
  
  // Component state
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState([])
  const [healthPreference, setHealthPreference] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)

  // Health preference options
  const healthOptions = [
    { value: '', label: 'Any' },
    { value: 'healthy', label: 'Healthy' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'low-carb', label: 'Low Carb' },
  ]

  // Featured recipes for display when no search is made
  const featuredRecipes = mockRecipes.slice(0, 3)

  // Stats for hero section
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Cooks' },
    { icon: ChefHat, value: '10K+', label: 'Recipes' },
    { icon: Clock, value: '<30min', label: 'Avg Cook Time' },
  ]

  // Handle finding recipes
  const handleFindRecipes = async () => {
    if (availableIngredients.length === 0) {
      setError('Please add at least one ingredient')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      const payload = {
        available_ingredients: availableIngredients,
        equipment: selectedEquipment,
        health_preference: healthPreference || undefined
      }
      
      const response = await fetchRecommendations(payload)
      
      if (response.success && response.recommendations) {
        setRecommendations(response.recommendations)
        setShowResults(true)
        
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ 
            behavior: 'smooth' 
          })
        }, 100)
      } else {
        throw new Error(response.message || 'Failed to get recommendations')
      }
    } catch (error) {
      console.error('Recommendation error:', error)
      setError(error.message || 'Failed to get recommendations. Please try again.')
      
      // Fallback to mock data for demo
      const fallbackRecipes = mockRecipes
        .filter(recipe => {
          // Simple ingredient matching for demo
          const hasIngredient = availableIngredients.some(ingredient =>
            recipe.ingredients.some(recipeIngredient =>
              recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
          
          // Health preference filtering
          const matchesHealth = !healthPreference || 
            recipe.tags.some(tag => tag.toLowerCase().includes(healthPreference.toLowerCase()))
          
          return hasIngredient && matchesHealth
        })
        .slice(0, 6)
      
      setRecommendations(fallbackRecipes)
      setShowResults(true)
      setError(null) // Clear error since we have fallback data
    } finally {
      setIsLoading(false)
    }
  }

  // Handle viewing all recommendations
  const handleViewAllRecommendations = () => {
    const params = new URLSearchParams()
    if (availableIngredients.length > 0) {
      params.set('ingredients', availableIngredients.join(','))
    }
    if (selectedEquipment.length > 0) {
      params.set('equipment', selectedEquipment.join(','))
    }
    if (healthPreference) {
      params.set('health', healthPreference)
    }
    
    navigate(`/recommendations?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Background Elements - Subtle and Premium */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className={getContainerClass('lg')}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8 lg:space-y-10"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center space-x-2 badge badge-primary text-sm font-semibold"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered Recipe Discovery</span>
                </motion.div>
                
                <h1 className="text-gray-900 dark:text-white">
                  Cook Smarter With{' '}
                  <span className="gradient-text block sm:inline mt-2 sm:mt-0">CookAI</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                  Transform your ingredients into delicious meals with 
                  AI-powered recipe recommendations tailored to your taste.
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => document.getElementById('recipe-finder')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary flex items-center justify-center space-x-2 text-base group"
                >
                  <Search className="h-5 w-5" />
                  <span>Find Recipes Now</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="btn-secondary flex items-center justify-center space-x-2 text-base">
                  <Play className="h-4 w-4" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-200 dark:border-gray-800"
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="text-center space-y-2">
                      <div className="flex items-center justify-center mb-3">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                          <Icon className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:pl-8"
            >
              <div className="relative z-10">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="grid grid-cols-2 gap-4 lg:gap-6"
                >
                  {featuredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                      className={index === 0 ? 'col-span-2' : ''}
                    >
                      <RecipeCard 
                        recipe={recipe} 
                        size="sm"
                        showMatchScore={false}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              {/* Subtle background decoration */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 to-teal-50 
                            dark:from-orange-900/10 dark:to-teal-900/10 rounded-3xl transform rotate-2 scale-105" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recipe Finder Section */}
      <section id="recipe-finder" className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
        <div className={getContainerClass()}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-gray-900 dark:text-white mb-4">
              What can you cook today?
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Tell us what ingredients you have and your dietary preferences. 
              Our AI will find the perfect recipes for you.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl p-8 lg:p-10 space-y-8"
            >
              {/* Ingredients Input */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  Available Ingredients
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add ingredients you have on hand</p>
                <IngredientInput
                  ingredients={availableIngredients}
                  onChange={setAvailableIngredients}
                  placeholder="Type an ingredient and press Enter (e.g., chicken, tomatoes, rice)"
                />
              </div>

              {/* Equipment Selection */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  Available Equipment
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select kitchen tools you can use</p>
                <EquipmentSelector
                  selectedEquipment={selectedEquipment}
                  onChange={setSelectedEquipment}
                />
              </div>

              {/* Health Preferences */}
              <div className="space-y-3">
                <label className="block text-lg font-bold text-gray-900 dark:text-white">
                  Dietary Preferences
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your dietary requirements</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {healthOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setHealthPreference(
                        healthPreference === option.value ? '' : option.value
                      )}
                      className={`p-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-semibold ${
                        healthPreference === option.value
                          ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800/50 rounded-2xl"
                  >
                    <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Find Recipes Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleFindRecipes}
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center space-x-2 py-4 text-lg font-bold shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Finding perfect recipes...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6" />
                    <span>Find My Recipes</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && (
          <motion.section
            id="results-section"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="py-20"
          >
            <div className={getContainerClass()}>
              <div className="text-center mb-12 lg:mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center space-x-2 badge badge-secondary shadow-md mb-6"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Found {recommendations.length} perfect recipes</span>
                </motion.div>
                
                <h2 className="text-gray-900 dark:text-white mb-4">
                  Your Recipe Recommendations
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400">
                  Based on your ingredients and preferences
                </p>
              </div>

              {/* Recipe Grid */}
              <motion.div
                variants={animations.containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              >
                {recommendations.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    variants={animations.listItemVariants}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <RecipeCard
                      recipe={recipe}
                      showMatchScore={true}
                      matchScore={Math.floor(Math.random() * 30) + 70} // Mock match score
                      whySuggested={`Contains ${availableIngredients[0] || 'key ingredients'} and matches your preferences`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* View All Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleViewAllRecommendations}
                  className="btn-secondary inline-flex items-center space-x-2 text-base font-semibold px-8"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>View All Recommendations</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-white dark:bg-gray-950">
        <div className={getContainerClass()}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 lg:mb-20"
          >
            <h2 className="text-gray-900 dark:text-white mb-4">
              Why Choose CookAI?
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of cooking with AI-powered personalization
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: Sparkles,
                title: 'AI-Powered Matching',
                description: 'Advanced AI analyzes your ingredients and preferences to suggest the perfect recipes every time'
              },
              {
                icon: Users,
                title: 'Personalized Experience',
                description: 'Get recommendations tailored to your taste, dietary restrictions, and cooking style'
              },
              {
                icon: TrendingUp,
                title: 'Smart Learning',
                description: 'The more you cook with us, the better our recommendations become for your unique taste'
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center p-8 lg:p-10 card group hover:border-orange-200 dark:hover:border-orange-800"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600
                                rounded-2xl mb-6 shadow-lg shadow-orange-500/25 group-hover:shadow-xl group-hover:shadow-orange-500/30
                                transition-all duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home