import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  ChefHat,
  Heart,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { darkMode } from '../utils/theme'

/**
 * Header component with navigation, search, and user controls
 * Features responsive design, dark mode toggle, and user authentication
 */
const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Component state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize dark mode on mount
  useEffect(() => {
    darkMode.init()
    setIsDark(darkMode.isDark())
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileOpen(false)
  }, [location.pathname])

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    darkMode.toggle()
    setIsDark(darkMode.isDark())
  }

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recommendations?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
  }

  // Navigation links
  const navLinks = [
    { path: '/', label: 'Home', icon: ChefHat },
    { path: '/recommendations', label: 'Recipes', icon: Search },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
  ]

  return (
    <header className="navbar-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3 group" aria-label="CookAI Home">
              <div className="relative p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/25 group-hover:shadow-xl group-hover:shadow-orange-500/30 transition-all duration-300">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text leading-none">
                  CookAI
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                  AI Recipe Discovery
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" aria-label="Main navigation">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients..."
                aria-label="Search recipes and ingredients"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-800 
                         bg-white dark:bg-gray-900
                         focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
                         transition-all duration-200 text-sm
                         placeholder:text-gray-400
                         shadow-sm focus:shadow-md"
              />
            </form>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDarkModeToggle}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 
                       hover:bg-gray-100 dark:hover:bg-gray-800/50 
                       hover:text-gray-900 dark:hover:text-white
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Profile or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full 
                           hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 
                                rounded-full flex items-center justify-center text-white text-sm font-bold
                                shadow-md ring-2 ring-white dark:ring-gray-900">
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser?.name || 'User'}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl 
                                 border border-gray-200 dark:border-gray-800 py-2 z-50
                                 ring-1 ring-black ring-opacity-5"
                        role="menu"
                        aria-orientation="vertical"
                      >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                      >
                        <Heart className="h-4 w-4" />
                        <span>Liked Recipes</span>
                      </Link>
                      
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 
                                 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-800" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 
                                 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left rounded-lg mx-1"
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn-ghost text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm inline-flex items-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-600 dark:text-gray-400 
                       hover:bg-gray-100 dark:hover:bg-gray-800/50 
                       hover:text-gray-900 dark:hover:text-white
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 py-6 space-y-6"
            >
              {/* Mobile Search */}
              <div className="px-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    aria-label="Search recipes"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-800 
                             bg-white dark:bg-gray-900
                             focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
                             transition-all duration-200 text-sm
                             placeholder:text-gray-400"
                  />
                </form>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-1 px-2" aria-label="Mobile navigation">
                {navLinks.map(({ path, label, icon: Icon }) => {
                  const isActive = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="px-2 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to="/login"
                    className="block w-full text-center btn-ghost py-3"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center btn-primary py-3"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header