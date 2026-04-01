import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, Heart, Settings, TrendingUp, User, ChefHat, Clock3, Save, Edit3, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getFavorites, getUserStatistics, updateUserPreferences } from '../api/apiClient'
import AnimatedButton from '../components/AnimatedButton'
import RecipeCard from '../components/RecipeCard'

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'recipes', label: 'Saved recipes', icon: Heart },
  { id: 'settings', label: 'Preferences', icon: Settings },
]

const Profile = () => {
  const { currentUser, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [statistics, setStatistics] = useState(null)
  const [likedRecipes, setLikedRecipes] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formState, setFormState] = useState({
    diet_type: currentUser?.preferences?.diet_type || '',
    preferred_cuisine: currentUser?.preferences?.preferred_cuisine || '',
    max_prep_time: currentUser?.preferences?.max_prep_time || 45,
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [stats, favorites] = await Promise.all([
          getUserStatistics(currentUser.id),
          getFavorites(),
        ])
        setStatistics(stats)
        setLikedRecipes(favorites)
      } catch (error) {
        console.error('Failed to load stats:', error)
        setStatistics({
          recipesCooked: 42,
          totalCookTime: 1260,
          recentActivity: [
            { date: '2026-03-14', action: 'Saved Creamy Mushroom Pasta' },
            { date: '2026-03-12', action: 'Cooked Mediterranean Quinoa Bowl' },
            { date: '2026-03-10', action: 'Asked for weeknight dinner ideas' },
          ],
        })
        setLikedRecipes([])
      }
    }

    loadProfile()
  }, [currentUser.id])

  const handleSave = async () => {
    try {
      await updateUserPreferences(currentUser.id, formState)
      updateUser({
        ...currentUser,
        preferences: {
          ...(currentUser.preferences || {}),
          ...formState,
        },
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save preferences:', error)
    }
  }

  return (
    <section className="section-shell pt-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.88fr,1.12fr] lg:items-end">
            <div className="flex items-start gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-3xl font-bold text-white shadow-glass">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="space-y-3">
                <span className="section-label">Your profile</span>
                <div>
                  <h1 className="page-title">{currentUser?.name || 'CookAI User'}</h1>
                  <p className="mt-2 text-base text-[color:var(--text-secondary)]">{currentUser?.email}</p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-[color:var(--text-secondary)]">
                  <span className="meta-pill"><Calendar className="h-3.5 w-3.5" /> Joined the CookAI kitchen</span>
                  <span className="meta-pill"><Award className="h-3.5 w-3.5" /> Home chef level</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <ChefHat className="mb-3 h-5 w-5 text-[color:var(--brand)]" />
                <p className="text-2xl font-bold">{statistics?.recipesCooked || 0}</p>
                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Recipes cooked</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <Clock3 className="mb-3 h-5 w-5 text-[color:var(--highlight)]" />
                <p className="text-2xl font-bold">{Math.floor((statistics?.totalCookTime || 0) / 60)}h</p>
                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Time in the kitchen</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(255,252,246,0.72)] p-5">
                <Heart className="mb-3 h-5 w-5 text-[color:var(--berry)]" />
                <p className="text-2xl font-bold">{likedRecipes.length}</p>
                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">Saved recipes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white shadow-[var(--shadow-soft)]'
                    : 'border border-[color:var(--border-soft)] bg-white/70 text-[color:var(--text-secondary)]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'overview' ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="glass-panel p-6 sm:p-8">
              <p className="eyebrow mb-4">Recent activity</p>
              <h2 className="font-display text-4xl">What you have been doing lately</h2>
              <div className="mt-8 grid gap-4">
                {(statistics?.recentActivity || []).map((activity, index) => (
                  <motion.div
                    key={`${activity.date}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-[22px] border border-[color:var(--border-soft)] bg-white/70 px-5 py-4"
                  >
                    <p className="font-semibold text-[color:var(--text-primary)]">{activity.action}</p>
                    <p className="mt-1 text-sm text-[color:var(--text-muted)]">{activity.date}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 sm:p-8">
              <p className="eyebrow mb-4">Taste profile</p>
              <h2 className="font-display text-4xl">Your current defaults</h2>
              <div className="mt-8 grid gap-4">
                <div className="rounded-[22px] bg-[rgba(255,252,246,0.72)] p-5">
                  <p className="text-sm font-semibold text-[color:var(--text-muted)]">Preferred cuisine</p>
                  <p className="mt-2 text-lg text-[color:var(--text-primary)]">{formState.preferred_cuisine || 'Open to anything'}</p>
                </div>
                <div className="rounded-[22px] bg-[rgba(255,252,246,0.72)] p-5">
                  <p className="text-sm font-semibold text-[color:var(--text-muted)]">Diet type</p>
                  <p className="mt-2 text-lg text-[color:var(--text-primary)]">{formState.diet_type || 'No restriction'}</p>
                </div>
                <div className="rounded-[22px] bg-[rgba(255,252,246,0.72)] p-5">
                  <p className="text-sm font-semibold text-[color:var(--text-muted)]">Ideal max prep time</p>
                  <p className="mt-2 text-lg text-[color:var(--text-primary)]">{formState.max_prep_time} minutes</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'recipes' ? (
          <div className="mt-8">
            <div className="mb-6">
              <p className="eyebrow mb-3">Saved recipes</p>
              <h2 className="font-display text-5xl">The dishes you want to come back to</h2>
            </div>
            <div className="recipe-grid">
              {likedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'settings' ? (
          <div className="mt-8 glass-panel p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-3">Personalization settings</p>
                <h2 className="font-display text-5xl">Refine what CookAI prioritizes for you</h2>
              </div>
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <AnimatedButton onClick={handleSave} icon={Save}>Save</AnimatedButton>
                    <AnimatedButton onClick={() => setIsEditing(false)} variant="ghost" icon={X}>Cancel</AnimatedButton>
                  </>
                ) : (
                  <AnimatedButton onClick={() => setIsEditing(true)} variant="secondary" icon={Edit3}>
                    Edit preferences
                  </AnimatedButton>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Preferred cuisine</span>
                <input
                  value={formState.preferred_cuisine}
                  onChange={(event) => setFormState((current) => ({ ...current, preferred_cuisine: event.target.value }))}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Italian, Asian, Mediterranean..."
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Diet type</span>
                <input
                  value={formState.diet_type}
                  onChange={(event) => setFormState((current) => ({ ...current, diet_type: event.target.value }))}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Vegetarian, vegan, low carb..."
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-semibold">Max prep time</span>
                <input
                  type="number"
                  value={formState.max_prep_time}
                  onChange={(event) => setFormState((current) => ({ ...current, max_prep_time: Number(event.target.value) }))}
                  disabled={!isEditing}
                  className="input-field"
                />
              </label>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Profile
