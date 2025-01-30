import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Clock, 
  Users, 
  Heart, 
  Star, 
  ChefHat, 
  Flame,
  CheckCircle,
  Sparkles
} from 'lucide-react'
import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import { likeRecipe } from '../api/apiClient'
import { formatTime, getDifficultyColor } from '../utils/helpers'

/**
 * RecipeCard component displaying recipe information with interactive features
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe object
 * @param {number} props.matchScore - Match percentage (0-100)
 * @param {string} props.whySuggested - Reason for suggestion
 * @param {Function} props.onLike - Callback for like action
 * @param {boolean} props.showMatchScore - Whether to show match score
 * @param {string} props.size - Card size variant ('sm', 'md', 'lg')
 */
const RecipeCard = ({ 
  recipe, 
  matchScore = null, 
  whySuggested = null,
  onLike = null,
  showMatchScore = false,
  size = 'md'
}) => {
  const { currentUser, isAuthenticated, isRecipeLiked, addLikedRecipe, removeLikedRecipe } = useAuth()
  const [isLiking, setIsLiking] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isLiked = isRecipeLiked(recipe.id)

  // Handle like/unlike recipe
  const handleLike = async (e) => {
    e.preventDefault() // Prevent navigation when clicking like button
    
    if (!isAuthenticated) {
      // Redirect to login or show auth modal
      return
    }

    if (isLiking) return

    setIsLiking(true)
    
    try {
      if (isLiked) {
        removeLikedRecipe(recipe.id)
      } else {
        await likeRecipe(currentUser.id, recipe.id)
        addLikedRecipe(recipe)
      }
      
      // Call parent callback if provided
      if (onLike) {
        onLike(recipe, !isLiked)
      }
    } catch (error) {
      console.error('Failed to like recipe:', error)
      // Revert optimistic update on error
      if (isLiked) {
        addLikedRecipe(recipe)
      } else {
        removeLikedRecipe(recipe.id)
      }
    } finally {
      setIsLiking(false)
    }
  }

  // Card size variants
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }

  const imageClasses = {
    sm: 'h-40',
    md: 'h-48',
    lg: 'h-56'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      className={`${sizeClasses[size]} w-full`}
    >
      <Link to={`/recipe/${recipe.id}`} className="block group">
        <div className="card overflow-hidden h-full flex flex-col">
          {/* Recipe Image */}
          <div className={`relative ${imageClasses[size]} overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}>
            {!imageError ? (
              <>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                
                {/* Loading skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 skeleton" />
                )}
                
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              // Fallback when image fails to load
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-teal-100 
                            dark:from-orange-900/20 dark:to-teal-900/20 
                            flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              </div>
            )}

            {/* Match Score Badge */}
            {showMatchScore && matchScore !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-3 left-3 badge badge-primary shadow-lg backdrop-blur-sm"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {matchScore}% match
              </motion.div>
            )}

            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLiking}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                isLiked 
                  ? 'bg-red-500 text-white scale-110' 
                  : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
              } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
            >
              <Heart 
                className={`h-5 w-5 transition-all duration-300 ${
                  isLiked ? 'fill-current' : ''
                }`} 
              />
            </motion.button>

            {/* Difficulty Badge */}
            <div className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md shadow-md ${
              getDifficultyColor(recipe.difficulty)
            }`}>
              {recipe.difficulty}
            </div>
          </div>

          {/* Recipe Content */}
          <div className="p-5 space-y-4 flex-1 flex flex-col">
            {/* Recipe Title */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors duration-200">
              {recipe.name}
            </h3>

            {/* Recipe Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="tag"
                >
                  {tag}
                </span>
              ))}
              {recipe.tags?.length > 3 && (
                <span className="tag text-gray-500 dark:text-gray-500">
                  +{recipe.tags.length - 3} more
                </span>
              )}
            </div>

            {/* Recipe Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 mt-auto">
              <div className="flex items-center space-x-4">
                {/* Cooking Time */}
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{formatTime(recipe.time)}</span>
                </div>
                
                {/* Servings */}
                {recipe.servings && (
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-4 w-4 text-teal-500" />
                    <span className="font-medium">{recipe.servings}</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-900 dark:text-white">4.8</span>
              </div>
            </div>

            {/* Why Suggested */}
            {whySuggested && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200/50 dark:border-orange-800/30"
              >
                <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                  <span className="font-semibold">Perfect match:</span> {whySuggested}
                </p>
              </motion.div>
            )}

            {/* Nutrition Preview */}
            {recipe.nutrition && (
              <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-800">
                <span>{recipe.nutrition.calories} cal</span>
                <span>{recipe.nutrition.protein}g protein</span>
                <span>{recipe.nutrition.carbs}g carbs</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    time: PropTypes.number,
    difficulty: PropTypes.string,
    servings: PropTypes.number,
    nutrition: PropTypes.object,
  }).isRequired,
  matchScore: PropTypes.number,
  whySuggested: PropTypes.string,
  onLike: PropTypes.func,
  showMatchScore: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}

export default RecipeCard