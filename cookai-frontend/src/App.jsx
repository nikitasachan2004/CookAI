import React from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'
import RecipeDetail from './pages/RecipeDetail'
import AIChat from './pages/AIChat'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  const location = useLocation()

  return (
    <div className="page-shell min-h-screen">
      <div className="floating-orb left-[-10rem] top-24 h-72 w-72 bg-primary-300/25" />
      <div className="floating-orb right-[-8rem] top-[24rem] h-80 w-80 bg-secondary-300/20" />
      <div className="floating-orb bottom-16 left-1/3 h-64 w-64 bg-accent-300/18" />

      <Header />

      <main className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <section className="section-shell">
                    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
                      <div className="glass-panel p-10 sm:p-14">
                        <p className="eyebrow mb-4">Wrong Turn</p>
                        <h1 className="page-title mb-6">This recipe page has gone off the menu.</h1>
                        <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-[color:var(--text-secondary)]">
                          The page you asked for is not available right now, but there are plenty of beautiful
                          dishes waiting back at the kitchen.
                        </p>
                        <Link to="/" className="btn-primary">
                          Return Home
                        </Link>
                      </div>
                    </div>
                  </section>
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
