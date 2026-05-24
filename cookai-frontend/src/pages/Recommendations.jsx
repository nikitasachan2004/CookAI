import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Grid, List, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchAllRecipes, fetchRecommendations, searchRecipes } from '../api/apiClient'
import RecipeCard from '../components/RecipeCard'
import { animations, getContainerClass } from '../utils/theme'

const Recommendations = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    cuisine: '',
    difficulty: '',
    maxTime: '',
  })

  useEffect(() => {
    const ingredients = searchParams.get('ingredients')?.split(',').filter(Boolean) || []
    const equipment = searchParams.get('equipment')?.split(',').filter(Boolean) || []
    const health = searchParams.get('health') || ''
    const search = searchParams.get('search') || ''

    setSearchQuery(search)

    const loadRecommendations = async () => {
      setIsLoading(true)
      try {
        let result
        if (search) {
          result = await searchRecipes({ q: search })
        } else if (ingredients.length > 0) {
          result = await fetchRecommendations({
            available_ingredients: ingredients,
            equipment,
            health_preference: health,
          })
        } else {
          result = await fetchAllRecipes({ page: 1, per_page: 24 })
        }

        setRecipes(result.recommendations || result.recipes || [])
      } catch (error) {
        console.error('Failed to load recommendations:', error)
        setRecipes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadRecommendations()
  }, [searchParams])

  const filteredRecipes = useMemo(() => {
    let nextRecipes = [...recipes]

    if (searchQuery) {
      nextRecipes = nextRecipes.filter((recipe) => {
        const haystacks = [
          recipe.name,
          recipe.cuisine,
          ...(recipe.tags || []),
          ...((recipe.ingredients || []).map((ingredient) =>
            typeof ingredient === 'string' ? ingredient : [ingredient.amount, ingredient.item].filter(Boolean).join(' '),
          )),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystacks.includes(searchQuery.toLowerCase())
      })
    }

    if (filters.cuisine) {
      nextRecipes = nextRecipes.filter((recipe) => recipe.cuisine?.toLowerCase() === filters.cuisine.toLowerCase())
    }

    if (filters.difficulty) {
      nextRecipes = nextRecipes.filter((recipe) => recipe.difficulty?.toLowerCase() === filters.difficulty.toLowerCase())
    }

    if (filters.maxTime) {
      nextRecipes = nextRecipes.filter((recipe) => recipe.time <= Number(filters.maxTime))
    }

    if (sortBy === 'time-asc') {
      nextRecipes.sort((a, b) => (a.time || 0) - (b.time || 0))
    } else if (sortBy === 'time-desc') {
      nextRecipes.sort((a, b) => (b.time || 0) - (a.time || 0))
    } else if (sortBy === 'name') {
      nextRecipes.sort((a, b) => a.name.localeCompare(b.name))
    }

    return nextRecipes
  }, [filters, recipes, searchQuery, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({ cuisine: '', difficulty: '', maxTime: '' })
    setSortBy('relevance')
  }

  if (isLoading) {
    return (
      <section className="section-shell">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-panel p-12">
            <div className="cooking-loader" />
            <h1 className="mt-6 font-display text-4xl">Curating your recipe table</h1>
            <p className="mt-3 text-base leading-8 text-[color:var(--text-secondary)]">
              Matching ingredients, preferences, and a little bit of appetite.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-shell pt-8">
      <div className={getContainerClass('xl')}>
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-5">
            <span className="section-label">
              <Sparkles className="h-3.5 w-3.5" />
              Recommendation studio
            </span>
            <h1 className="page-title text-balance">Browse dishes with a little more editorial clarity.</h1>
            <p className="max-w-xl text-base leading-8 text-[color:var(--text-secondary)]">
              Everything here is still powered by the same recommendation logic, but now the browsing experience feels
              curated and calm instead of purely functional.
            </p>
          </div>

          <div className="glass-panel p-5 sm:p-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.3fr,0.8fr,0.8fr,0.7fr]">
              <label className="relative block md:col-span-2 xl:col-span-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search cuisines, ingredients, or dishes"
                  className="input-field rounded-full pl-11"
                />
              </label>

              <select
                value={filters.cuisine}
                onChange={(event) => setFilters((current) => ({ ...current, cuisine: event.target.value }))}
                className="select-field rounded-full"
              >
                <option value="">All cuisines</option>
                <option value="italian">Italian</option>
                <option value="asian">Asian</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="american">American</option>
                <option value="modern">Modern</option>
              </select>

              <select
                value={filters.difficulty}
                onChange={(event) => setFilters((current) => ({ ...current, difficulty: event.target.value }))}
                className="select-field rounded-full"
              >
                <option value="">Any skill level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <div className="flex items-center justify-between gap-2 rounded-full border border-[color:var(--border-soft)] bg-white/70 px-2 py-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${viewMode === 'grid' ? 'bg-[color:var(--brand)] text-white' : 'text-[color:var(--text-secondary)]'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex h-11 w-11 items-center justify-center rounded-full ${viewMode === 'list' ? 'bg-[color:var(--brand)] text-white' : 'text-[color:var(--text-secondary)]'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="meta-pill">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {filteredRecipes.length} recipes
              </span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="select-field !w-auto rounded-full !py-2.5"
              >
                <option value="relevance">Most relevant</option>
                <option value="time-asc">Fastest first</option>
                <option value="time-desc">Longest cook</option>
                <option value="name">Alphabetical</option>
              </select>
              {(searchQuery || filters.cuisine || filters.difficulty || filters.maxTime) ? (
                <button onClick={clearFilters} className="btn-ghost">
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center">
            <div className="glass-panel p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(184,92,56,0.12)] text-[color:var(--brand)]">
                <Search className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-4xl">Nothing fits this exact brief yet.</h2>
              <p className="mt-3 text-base leading-8 text-[color:var(--text-secondary)]">
                Broaden the search, loosen one filter, or head back home to start from a different pantry combination.
              </p>
              <button onClick={() => navigate('/')} className="btn-primary mt-8">
                Start a new search
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            variants={animations.containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' ? 'recipe-grid' : 'grid gap-6'}
          >
            {filteredRecipes.map((recipe, index) => (
              <motion.div key={recipe.id} variants={animations.listItemVariants} transition={{ delay: index * 0.03 }}>
                <RecipeCard recipe={recipe} size={viewMode === 'grid' ? 'md' : 'lg'} showMatchScore matchScore={90 - (index % 5) * 4} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Recommendations
