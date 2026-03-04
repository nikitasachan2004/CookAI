import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Flame, Heart, Star, Users, ChefHat, CheckCircle2 } from 'lucide-react'
import PropTypes from 'prop-types'
import { useAuth } from '../context/AuthContext'
import { likeRecipe } from '../api/apiClient'
import { formatTime, getDifficultyColor } from '../utils/helpers'

const RecipeCard = ({
  recipe,
  matchScore = null,
  whySuggested = null,
  onLike = null,
  showMatchScore = false,
  size = 'md',
}) => {
  const { currentUser, isAuthenticated, isRecipeLiked, addLikedRecipe, removeLikedRecipe } = useAuth()
  const [isLiking, setIsLiking] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const isLiked = isRecipeLiked(recipe.id)

  const handleLike = async (event) => {
    event.preventDefault()
    if (!isAuthenticated || isLiking) return

    setIsLiking(true)
    try {
      if (isLiked) {
        removeLikedRecipe(recipe.id)
      } else {
        await likeRecipe(currentUser.id, recipe.id)
        addLikedRecipe(recipe)
      }
      onLike?.(recipe, !isLiked)
    } catch (error) {
      console.error('Failed to like recipe:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const sizeClasses = {
    sm: 'min-h-[20rem]',
    md: 'min-h-[23rem]',
    lg: 'min-h-[25rem]',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="h-full"
    >
      <Link to={`/recipe/${recipe.id}`} className="block h-full">
        <article className={`card flex h-full flex-col ${sizeClasses[size] || sizeClasses.md}`}>
          <div className="relative overflow-hidden rounded-t-[28px]">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
              {showMatchScore && matchScore !== null ? (
                <span className="meta-pill bg-[rgba(38,23,15,0.74)] text-white">
                  {matchScore}% match
                </span>
              ) : null}
              {recipe.cuisine ? <span className="meta-pill capitalize">{recipe.cuisine}</span> : null}
            </div>

            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                isLiked
                  ? 'border-transparent bg-[linear-gradient(135deg,var(--berry)_0%,var(--brand)_100%)] text-white'
                  : 'border-white/40 bg-white/70 text-[color:var(--text-primary)] backdrop-blur-md'
              }`}
              aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {!imageError && recipe.image ? (
              <>
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className={`h-60 w-full object-cover transition duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                {!imageLoaded ? <div className="skeleton absolute inset-0 h-60 w-full" /> : null}
              </>
            ) : (
              <div className="flex h-60 w-full items-center justify-center bg-[linear-gradient(145deg,rgba(184,92,56,0.12),rgba(217,143,43,0.18))]">
                <div className="flex flex-col items-center gap-3 text-center">
                  <ChefHat className="h-12 w-12 text-[color:var(--brand-deep)]" />
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">Image placeholder</p>
                    <p className="mt-1 text-xs text-[color:var(--text-secondary)]">Add your recipe image here later</p>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(38,23,15,0.65)] to-transparent" />
          </div>

          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl leading-tight text-[color:var(--text-primary)] transition-colors group-hover:text-[color:var(--brand-deep)]">
                  {recipe.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                  {recipe.tags?.slice(0, 2).join(' · ') || 'A comforting kitchen favorite'}
                </p>
              </div>
              <div className="meta-pill shrink-0">
                <Star className="h-3.5 w-3.5 fill-current text-[color:var(--highlight)]" />
                <span>4.8</span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {recipe.tags?.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-[rgba(184,92,56,0.08)] px-3 py-1 text-xs font-semibold capitalize text-[color:var(--brand-deep)]">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm text-[color:var(--text-secondary)]">
                <div className="rounded-2xl bg-[rgba(255,255,255,0.56)] px-3 py-3">
                  <Clock className="mb-2 h-4 w-4 text-[color:var(--brand)]" />
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Time</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-primary)]">{formatTime(recipe.time)}</p>
                </div>
                <div className="rounded-2xl bg-[rgba(255,255,255,0.56)] px-3 py-3">
                  <Users className="mb-2 h-4 w-4 text-[color:var(--secondary-500)] text-[color:var(--herb)]" />
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Serves</p>
                  <p className="mt-1 font-semibold text-[color:var(--text-primary)]">{recipe.servings || 2}</p>
                </div>
                <div className="rounded-2xl bg-[rgba(255,255,255,0.56)] px-3 py-3">
                  <Flame className="mb-2 h-4 w-4 text-[color:var(--highlight)]" />
                  <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Skill</p>
                  <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </p>
                </div>
              </div>

              {whySuggested ? (
                <div className="rounded-[20px] border border-[rgba(93,123,93,0.16)] bg-[rgba(93,123,93,0.08)] p-4 text-sm text-[color:var(--text-secondary)]">
                  <p className="inline-flex items-center gap-2 font-semibold text-[color:var(--secondary-700)]">
                    <CheckCircle2 className="h-4 w-4" />
                    Why it fits
                  </p>
                  <p className="mt-2 leading-6">{whySuggested}</p>
                </div>
              ) : null}
            </div>
          </div>
        </article>
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
    cuisine: PropTypes.string,
  }).isRequired,
  matchScore: PropTypes.number,
  whySuggested: PropTypes.string,
  onLike: PropTypes.func,
  showMatchScore: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default RecipeCard
