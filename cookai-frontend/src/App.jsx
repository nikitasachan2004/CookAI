import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Layout Components
import Header from './components/Header'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'
import RecipeDetail from './pages/RecipeDetail'
import AIChat from './pages/AIChat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

// Route Protection
import PrivateRoute from './routes/PrivateRoute'

/**
 * Main App component with routing, animations, and layout structure.
 * Implements page transitions using Framer Motion.
 */
function App() {
  const location = useLocation()

  // Page transition variants for Framer Motion
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 20,
    },
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />
              
              {/* Fallback for 404 */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-8">Page not found</p>
                      <a href="/" className="btn-primary">
                        Return Home
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  )
}

export default App