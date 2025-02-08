import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Settings, Heart, TrendingUp, Award, 
  Calendar, Clock, ChefHat, Edit3, Save, X
} from 'lucide-react'
import { 
  PieChart, Pie, Cell, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getUserStatistics, updateUserPreferencesLegacy as updateUserPreferences } from '../api/apiClient'
import RecipeCard from '../components/RecipeCard'
import AnimatedButton from '../components/AnimatedButton'
import { mockRecipes } from '../data/mockRecipes'

/**
 * Profile page with user statistics, preferences, and liked recipes
 * TODO: Complete implementation with Recharts analytics and preference editing
 */
const Profile = () => {
  const { currentUser, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [statistics, setStatistics] = useState(null)
  const [likedRecipes, setLikedRecipes] = useState([])
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    preferences: currentUser?.preferences || {
      dietary: [],
      cuisine: [],
      cookingLevel: 'intermediate',
      maxCookTime: 60
    }
  })
  
  // Load user data on mount
  useEffect(() => {
    loadUserData()
  }, [])
  
  const loadUserData = async () => {
    try {
      // Load user statistics
      const stats = await getUserStatistics(currentUser.id)
      setStatistics(stats)
      
      // Load liked recipes (mock for now)
      const liked = mockRecipes.filter(recipe => 
        currentUser?.liked_recipes?.includes(recipe.id)
      )
      setLikedRecipes(liked)
      
    } catch (error) {
      console.error('Failed to load user data:', error)
      
      // Mock statistics for demo
      setStatistics({
        recipesCooked: 42,
        totalCookTime: 1260, // minutes
        favoriteCategories: [
          { name: 'Italian', value: 35, color: '#f19640' },
          { name: 'Asian', value: 25, color: '#14b8a6' },
          { name: 'Mediterranean', value: 20, color: '#d946ef' },
          { name: 'American', value: 20, color: '#6366f1' }
        ],
        skillProgression: [
          { skill: 'Knife Skills', current: 8, max: 10 },
          { skill: 'Seasoning', current: 7, max: 10 },
          { skill: 'Timing', current: 6, max: 10 },
          { skill: 'Presentation', current: 5, max: 10 },
          { skill: 'Creativity', current: 7, max: 10 }
        ],
        recentActivity: [
          { date: '2024-10-05', action: 'Cooked Pasta Carbonara', type: 'cook' },
          { date: '2024-10-04', action: 'Liked Chicken Tikka Masala', type: 'like' },
          { date: '2024-10-03', action: 'Completed Beef Stir Fry', type: 'cook' }
        ]
      })
      
      setLikedRecipes(mockRecipes.slice(0, 6))
    }
  }
  
  // Handle profile edit
  const handleSaveProfile = async () => {
    try {
      await updateUserPreferences(currentUser.id, editForm.preferences)
      updateUser({ ...currentUser, ...editForm })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }
  
  const handleCancelEdit = () => {
    setEditForm({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      preferences: currentUser?.preferences || {
        dietary: [],
        cuisine: [],
        cookingLevel: 'intermediate',
        maxCookTime: 60
      }
    })
    setIsEditing(false)
  }
  
  // Tab navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'statistics', label: 'Statistics', icon: TrendingUp },
    { id: 'recipes', label: 'Liked Recipes', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]
  
  // TODO: Complete implementation of these preference options
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo']
  const cuisineOptions = ['italian', 'asian', 'mediterranean', 'mexican', 'indian', 'american']
  
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-2xl mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full 
                            flex items-center justify-center text-white text-2xl font-bold">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser?.name || 'User'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser?.email}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined October 2024</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Award className="h-4 w-4" />
                    <span>Home Chef Level</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <AnimatedButton
                    onClick={handleSaveProfile}
                    icon={Save}
                    size="sm"
                  >
                    Save Changes
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleCancelEdit}
                    variant="ghost"
                    icon={X}
                    size="sm"
                  >
                    Cancel
                  </AnimatedButton>
                </>
              ) : (
                <AnimatedButton
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  icon={Edit3}
                  size="sm"
                >
                  Edit Profile
                </AnimatedButton>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </motion.div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Quick Stats */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl text-center">
                      <ChefHat className="h-8 w-8 text-primary-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statistics?.recipesCooked || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Recipes Cooked
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl text-center">
                      <Clock className="h-8 w-8 text-secondary-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.floor((statistics?.totalCookTime || 0) / 60)}h
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Time Cooking
                      </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl text-center">
                      <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {likedRecipes.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Liked Recipes
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {/* TODO: Map through real activity data */}
                      {statistics?.recentActivity?.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'cook' ? 'bg-green-500' :
                            activity.type === 'like' ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                          No recent activity
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Cooking Preferences */}
                <div className="space-y-6">
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Cooking Preferences
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Skill Level
                        </label>
                        <p className="text-gray-900 dark:text-white capitalize">
                          {currentUser?.preferences?.cookingLevel || 'Intermediate'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Max Cook Time
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {currentUser?.preferences?.maxCookTime || 60} minutes
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Dietary Preferences
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentUser?.preferences?.dietary?.map((diet) => (
                            <span key={diet} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 
                                                     text-primary-700 dark:text-primary-300 text-xs rounded-full capitalize">
                              {diet}
                            </span>
                          )) || (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">No restrictions</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Statistics Tab */}
            {activeTab === 'statistics' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* TODO: Implement Recharts components */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Favorite Cuisines
                  </h3>
                  <div className="h-64">
                    {/* TODO: Replace with actual PieChart */}
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      Chart will be implemented with Recharts
                    </div>
                  </div>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Skill Progression
                  </h3>
                  <div className="h-64">
                    {/* TODO: Replace with actual RadarChart */}
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      Radar chart will be implemented with Recharts
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Liked Recipes Tab */}
            {activeTab === 'recipes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Liked Recipes ({likedRecipes.length})
                  </h2>
                </div>
                
                {likedRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedRecipes.map((recipe) => (
                      <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No liked recipes yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start exploring recipes and like the ones you want to try!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Account Settings
                </h2>
                
                <div className="space-y-6">
                  {/* TODO: Implement settings form */}
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          disabled={!isEditing}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Cooking Preferences
                    </h3>
                    {/* TODO: Implement preference editing */}
                    <p className="text-gray-600 dark:text-gray-400">
                      Preference editing will be implemented here
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Profile