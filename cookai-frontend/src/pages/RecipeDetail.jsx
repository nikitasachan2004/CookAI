import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, ChefHat, Circle, Clock, Heart, Play, Share2, Star, Users } from 'lucide-react'
import { fetchRecipeById, likeRecipe, normalizeRecipe } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'
import { mockRecipes } from '../data/mockRecipes'
import { formatTime, getDifficultyColor } from '../utils/helpers'
import AnimatedButton from '../components/AnimatedButton'
import { RECIPE_PLACEHOLDER_IMAGE, resolveRecipeImage } from '../utils/recipeImage'

const RecipeDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, isAuthenticated, isRecipeLiked, addLikedRecipe, removeLikedRecipe } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [cookingMode, setCookingMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true)
      try {
        const result = await fetchRecipeById(id)
        setRecipe(result.recipe || normalizeRecipe(mockRecipes.find((candidate) => String(candidate.id) === String(id))))
      } catch (error) {
        console.error('Failed to load recipe:', error)
        setRecipe(normalizeRecipe(mockRecipes.find((candidate) => String(candidate.id) === String(id))))
      } finally {
        setIsLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  useEffect(() => {
    if (recipe && isAuthenticated) {
      setIsLiked(isRecipeLiked(recipe.id))
    }
  }, [isAuthenticated, isRecipeLiked, recipe])

  useEffect(() => {
    setImageError(false)
  }, [recipe?.id])

  const handleLike = async () => {
    if (!isAuthenticated || !recipe) return
    try {
      if (isLiked) {
        removeLikedRecipe(recipe.id)
      } else {
        await likeRecipe(currentUser.id, recipe.id)
        addLikedRecipe(recipe)
      }
      setIsLiked((current) => !current)
    } catch (error) {
      console.error('Failed to like recipe:', error)
    }
  }

  const toggleStepComplete = (stepIndex) => {
    setCompletedSteps((current) => {
      const next = new Set(current)
      if (next.has(stepIndex)) next.delete(stepIndex)
      else next.add(stepIndex)
      return next
    })
  }

  if (isLoading) {
    return (
      <section className="section-shell">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-panel p-12">
            <div className="cooking-loader" />
            <h1 className="mt-6 font-display text-4xl">Plating the details</h1>
          </div>
        </div>
      </section>
    )
  }

  if (!recipe) {
    return (
      <section className="section-shell">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-panel p-12">
            <h1 className="font-display text-5xl">Recipe not found</h1>
            <p className="mt-3 text-base leading-8 text-[color:var(--text-secondary)]">
              The dish you requested is not available right now.
            </p>
            <button onClick={() => navigate('/recommendations')} className="btn-primary mt-8">
              Back to recipes
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (cookingMode) {
    return (
      <section className="section-shell pt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-2">Cooking mode</p>
                <h1 className="font-display text-4xl">{recipe.name}</h1>
              </div>
              <AnimatedButton onClick={() => setCookingMode(false)} variant="secondary">
                Exit cooking mode
              </AnimatedButton>
            </div>

            <div className="mt-8 rounded-[28px] border border-[color:var(--border-soft)] bg-white/75 p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="meta-pill">Step {currentStep + 1} of {recipe.stepDetails.length}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => toggleStepComplete(currentStep)} className="mt-1 text-[color:var(--brand)]">
                  {completedSteps.has(currentStep) ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </button>
                <div>
                  <p className="text-lg leading-9 text-[color:var(--text-primary)]">{recipe.stepDetails[currentStep]?.instruction}</p>
                  {recipe.stepDetails[currentStep]?.timer_minutes ? (
                    <p className="mt-2 text-sm font-semibold text-[color:var(--brand)]">
                      Timer: {recipe.stepDetails[currentStep].timer_minutes} min
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <AnimatedButton onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))} variant="secondary">
                  Previous
                </AnimatedButton>
                <div className="flex gap-2">
                  {recipe.stepDetails.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-3 w-3 rounded-full ${index === currentStep ? 'bg-[color:var(--brand)]' : completedSteps.has(index) ? 'bg-[color:var(--herb)]' : 'bg-[rgba(112,71,33,0.18)]'}`}
                    />
                  ))}
                </div>
                <AnimatedButton onClick={() => setCurrentStep((step) => Math.min(step + 1, recipe.stepDetails.length - 1))}>
                  {currentStep === recipe.stepDetails.length - 1 ? 'Finish' : 'Next'}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const detailImage = imageError ? RECIPE_PLACEHOLDER_IMAGE : resolveRecipeImage(recipe)

  return (
    <section className="section-shell pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <div className="card overflow-hidden">
              <div className="relative h-[24rem] overflow-hidden">
                {detailImage ? (
                  <img
                    src={detailImage}
                    alt={recipe.name}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,rgba(184,92,56,0.12),rgba(217,143,43,0.18))]">
                    <div className="text-center">
                      <ChefHat className="mx-auto h-16 w-16 text-[color:var(--brand-deep)]" />
                      <p className="mt-4 text-sm font-semibold text-[color:var(--text-primary)]">Recipe image placeholder</p>
                      <p className="mt-1 text-xs text-[color:var(--text-secondary)]">You can add your own image asset later</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(38,23,15,0.72)] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {(recipe.tags || []).map((tag) => (
                      <span key={tag} className="meta-pill bg-[rgba(255,255,255,0.18)] text-white backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="font-display text-5xl text-white sm:text-6xl">{recipe.name}</h1>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <Clock className="mb-3 h-5 w-5 text-[color:var(--brand)]" />
                <p className="text-sm text-[color:var(--text-muted)]">Cook time</p>
                <p className="mt-1 font-semibold">{formatTime(recipe.time)}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <Users className="mb-3 h-5 w-5 text-[color:var(--herb)]" />
                <p className="text-sm text-[color:var(--text-muted)]">Servings</p>
                <p className="mt-1 font-semibold">{recipe.servings || 2}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <Star className="mb-3 h-5 w-5 text-[color:var(--highlight)]" />
                <p className="text-sm text-[color:var(--text-muted)]">Rating</p>
                <p className="mt-1 font-semibold">4.8</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <ChefHat className="mb-3 h-5 w-5 text-[color:var(--berry)]" />
                <p className="text-sm text-[color:var(--text-muted)]">Difficulty</p>
                <p className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8">
              <p className="eyebrow mb-4">Instructions</p>
              <h2 className="font-display text-4xl">Cook it step by step</h2>
              <div className="mt-8 grid gap-4">
                {recipe.stepDetails.map((step, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="flex gap-4 rounded-[24px] border border-[color:var(--border-soft)] bg-white/75 p-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-base leading-8 text-[color:var(--text-secondary)]">{step.instruction}</p>
                      {step.timer_minutes ? (
                        <p className="mt-2 text-sm font-semibold text-[color:var(--brand)]">Timer: {step.timer_minutes} min</p>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="glass-panel p-6 sm:p-8">
              <div className="flex gap-3">
                <AnimatedButton onClick={() => setCookingMode(true)} icon={Play} className="flex-1 justify-center">
                  Start cooking
                </AnimatedButton>
                <button onClick={handleLike} className={`flex h-12 w-12 items-center justify-center rounded-full ${isLiked ? 'bg-[linear-gradient(135deg,var(--berry)_0%,var(--brand)_100%)] text-white' : 'border border-[color:var(--border-soft)] bg-white/70 text-[color:var(--text-primary)]'}`}>
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border-soft)] bg-white/70 text-[color:var(--text-primary)]">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8">
              <p className="eyebrow mb-4">Ingredients</p>
              <h2 className="font-display text-4xl">Everything you need</h2>
              <div className="mt-8 grid gap-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-[18px] bg-white/70 px-4 py-3 text-sm text-[color:var(--text-secondary)]">
                    <Circle className="h-2.5 w-2.5 fill-current text-[color:var(--brand)]" />
                    <span className="capitalize">
                      {[ingredient.amount, ingredient.item].filter(Boolean).join(' ').trim() || ingredient.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {recipe.equipment?.length ? (
              <div className="glass-panel p-6 sm:p-8">
                <p className="eyebrow mb-4">Equipment</p>
                <h2 className="font-display text-4xl">Tools for the job</h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {recipe.equipment.map((item) => (
                    <span key={item} className="meta-pill capitalize">
                      <ChefHat className="h-3.5 w-3.5" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}

export default RecipeDetail
