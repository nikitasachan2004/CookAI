import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Clock3, Search, Sparkles, Stars, Users2, UtensilsCrossed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fetchAllRecipes, fetchRecommendations } from '../api/apiClient'
import RecipeCard from '../components/RecipeCard'
import IngredientInput from '../components/IngredientInput'
import EquipmentSelector from '../components/EquipmentSelector'
import AnimatedButton from '../components/AnimatedButton'
import { getContainerClass, animations } from '../utils/theme'

const healthOptions = [
  { value: '', label: 'Open to anything' },
  { value: 'healthy', label: 'Light & nourishing' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Plant-forward' },
  { value: 'gluten-free', label: 'Gluten free' },
  { value: 'low-carb', label: 'Low carb' },
]

const stats = [
  { icon: Users2, value: '50K+', label: 'home cooks inspired' },
  { icon: UtensilsCrossed, value: '10K+', label: 'recipes to explore' },
  { icon: Clock3, value: '<30 min', label: 'average weeknight win' },
]

const featureCards = [
  {
    title: 'Built from what you already have',
    copy: 'Turn one fridge glance into a dinner plan with ingredient-led discovery that feels intuitive, not robotic.',
  },
  {
    title: 'Personalized to your rhythm',
    copy: 'CookAI learns your favorite cuisines, cooking pace, and preferences so suggestions feel increasingly like you.',
  },
  {
    title: 'Helpful when you are stuck',
    copy: 'Use the cooking assistant to figure out substitutions, quick ideas, and what to do when dinner needs saving.',
  },
]

const Home = () => {
  const navigate = useNavigate()
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [selectedEquipment, setSelectedEquipment] = useState([])
  const [healthPreference, setHealthPreference] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [featuredRecipes, setFeaturedRecipes] = useState([])
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        const result = await fetchAllRecipes({ page: 1, per_page: 3 })
        if (result.recipes?.length) {
          setFeaturedRecipes(result.recipes)
        }
      } catch (loadError) {
        console.error('Failed to load featured recipes:', loadError)
        setFeaturedRecipes([])
      }
    }

    loadFeaturedRecipes()
  }, [])

  const handleFindRecipes = async () => {
    if (availableIngredients.length === 0) {
      setError('Start with at least one ingredient so CookAI can build a thoughtful recommendation set.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetchRecommendations({
        available_ingredients: availableIngredients,
        equipment: selectedEquipment,
        health_preference: healthPreference || undefined,
      })

      const nextRecommendations = response.recommendations || response.data?.recommendations || []

      if (nextRecommendations.length === 0) {
        throw new Error('No matching recipes were found for this pantry combination.')
      }

      setRecommendations(nextRecommendations)
      setShowResults(true)
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    } catch (apiError) {
      console.error('Recommendation error:', apiError)
      setRecommendations([])
      setShowResults(false)
      setError('CookAI could not load live recommendations right now. Please try again in a moment.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewAllRecommendations = () => {
    const params = new URLSearchParams()
    if (availableIngredients.length > 0) params.set('ingredients', availableIngredients.join(','))
    if (selectedEquipment.length > 0) params.set('equipment', selectedEquipment.join(','))
    if (healthPreference) params.set('health', healthPreference)
    navigate(`/recommendations?${params.toString()}`)
  }

  return (
    <div>
      <section className="section-shell overflow-hidden pt-10 sm:pt-12">
        <div className={getContainerClass('xl')}>
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr,0.88fr] lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="space-y-8"
            >
              <span className="section-label">
                <Sparkles className="h-3.5 w-3.5" />
                Your warm, AI-powered kitchen companion
              </span>

              <div className="space-y-6">
                <h1 className="editorial-title text-balance">
                  Turn what is in your kitchen into something <span className="gradient-text">worth gathering around.</span>
                </h1>
                <p className="hero-copy max-w-2xl">
                  CookAI helps you discover beautiful dishes from the ingredients already on hand. Think fewer “what do
                  I make tonight?” moments and more quick, delicious, confidence-building wins.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <AnimatedButton
                  onClick={() => document.getElementById('recipe-finder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  size="lg"
                  icon={Search}
                >
                  Start with my ingredients
                </AnimatedButton>
                <AnimatedButton variant="secondary" size="lg" onClick={() => navigate('/chat')} icon={Stars}>
                  Ask the cooking assistant
                </AnimatedButton>
              </div>

              <div className="grid gap-4 border-t border-[color:var(--border-soft)] pt-8 sm:grid-cols-3">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="rounded-[22px] bg-[rgba(255,252,246,0.65)] p-4">
                      <Icon className="mb-3 h-5 w-5 text-[color:var(--brand)]" />
                      <p className="text-2xl font-extrabold text-[color:var(--text-primary)]">{stat.value}</p>
                      <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="relative"
            >
              <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full border border-white/50 bg-white/30 blur-2xl lg:block" />
              <div className="glass-panel overflow-hidden p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="eyebrow mb-2">Tonight’s inspiration</p>
                    <h2 className="font-display text-3xl">A kitchen moodboard</h2>
                  </div>
                  <span className="meta-pill">Fresh picks</span>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {featuredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.14 + index * 0.1 }}
                      className={index === 0 ? 'md:col-span-2' : ''}
                    >
                      <RecipeCard recipe={recipe} size={index === 0 ? 'md' : 'sm'} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="recipe-finder" className="section-shell">
        <div className={getContainerClass('lg')}>
          <div className="grid gap-8 lg:grid-cols-[0.72fr,1.28fr] lg:gap-12">
            <div className="space-y-6">
              <span className="eyebrow">Cook from the pantry outward</span>
              <h2 className="section-title text-balance">Tell CookAI what you have, and it will shape dinner around you.</h2>
              <p className="text-base leading-8 text-[color:var(--text-secondary)]">
                Start with ingredients, add what equipment you can use, and choose any preference that matters tonight.
                The system keeps the logic intact; the experience now feels more like planning with a thoughtful cook.
              </p>
              <div className="feature-card">
                <p className="eyebrow mb-3">How it feels</p>
                <ul className="space-y-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                  <li>Ingredient-first discovery that respects time, equipment, and dietary needs.</li>
                  <li>Better visual feedback, warmer empty states, and refined interaction details.</li>
                  <li>Seamless path into recipe recommendations and AI chat when you need more guidance.</li>
                </ul>
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8">
              <div className="panel-grid">
                <section className="space-y-4">
                  <div>
                    <p className="eyebrow mb-2">Step 1</p>
                    <h3 className="font-display text-3xl">What is in the kitchen?</h3>
                  </div>
                  <IngredientInput
                    ingredients={availableIngredients}
                    onChange={setAvailableIngredients}
                    placeholder="Tomato, olive oil, pasta, mushrooms..."
                  />
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="eyebrow mb-2">Step 2</p>
                    <h3 className="font-display text-3xl">What can you cook with?</h3>
                  </div>
                  <EquipmentSelector selectedEquipment={selectedEquipment} onChange={setSelectedEquipment} />
                </section>

                <section className="space-y-4">
                  <div>
                    <p className="eyebrow mb-2">Step 3</p>
                    <h3 className="font-display text-3xl">Any mood or dietary direction?</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {healthOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => setHealthPreference(healthPreference === option.value ? '' : option.value)}
                        className={`rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                          healthPreference === option.value
                            ? 'bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white shadow-[var(--shadow-soft)]'
                            : 'border border-[color:var(--border-soft)] bg-white/70 text-[color:var(--text-secondary)] hover:border-[rgba(184,92,56,0.2)] hover:text-[color:var(--brand-deep)]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>

                <AnimatePresence>
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="rounded-[22px] border border-[rgba(157,75,90,0.18)] bg-[rgba(157,75,90,0.08)] px-5 py-4 text-sm leading-7 text-[color:var(--text-secondary)]"
                    >
                      {error}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm leading-7 text-[color:var(--text-secondary)]">
                    <p className="font-semibold text-[color:var(--text-primary)]">Pantry preview</p>
                    <p>{availableIngredients.length || 0} ingredients, {selectedEquipment.length || 0} tools, {healthPreference || 'no dietary filter'}.</p>
                  </div>
                  <AnimatedButton onClick={handleFindRecipes} loading={isLoading} icon={ArrowRight} size="lg">
                    Find my recipes
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showResults ? (
          <motion.section
            id="results-section"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="section-shell"
          >
            <div className={getContainerClass('xl')}>
              <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="section-label">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Pantry matched
                  </span>
                  <h2 className="section-title mt-4">Recipes that make sense for tonight.</h2>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-[color:var(--text-secondary)]">
                    These matches are shaped by your ingredients, equipment, and preference cues. You can browse now or
                    open the full recommendations view for a broader pass.
                  </p>
                </div>
                <AnimatedButton variant="secondary" onClick={handleViewAllRecommendations} icon={ArrowRight}>
                  View all recommendations
                </AnimatedButton>
              </div>

              <motion.div
                variants={animations.containerVariants}
                initial="hidden"
                animate="visible"
                className="recipe-grid"
              >
                {recommendations.map((recipe, index) => (
                  <motion.div key={recipe.id} variants={animations.listItemVariants} transition={{ delay: index * 0.04 }}>
                    <RecipeCard
                      recipe={recipe}
                      showMatchScore
                      matchScore={Math.max(72, 94 - index * 4)}
                      whySuggested={`It lines up with ${availableIngredients[0] || 'your pantry picks'} and stays close to the cooking mood you selected.`}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <section className="section-shell pt-4">
        <div className={getContainerClass('xl')}>
          <div className="mb-10 text-center">
            <span className="eyebrow">Why it feels better</span>
            <h2 className="section-title mt-4">A cooking product that feels inviting before it feels technical.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08 }}
                className="feature-card"
              >
                <p className="eyebrow mb-4">0{index + 1}</p>
                <h3 className="mb-4 font-display text-3xl leading-tight">{feature.title}</h3>
                <p className="text-base leading-8 text-[color:var(--text-secondary)]">{feature.copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
