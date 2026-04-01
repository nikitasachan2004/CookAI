import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChefHat, Menu, Search, User, X, LogOut, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/recommendations', label: 'Recipes' },
  { path: '/chat', label: 'Kitchen Chat' },
]

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleSearch = (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/recommendations?search=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
        <div className={`navbar-glass rounded-full px-4 py-3 sm:px-6 ${scrolled ? 'shadow-glass' : ''}`}>
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--brand)_0%,var(--highlight)_100%)] text-white shadow-glass">
                <ChefHat className="h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                <p className="eyebrow">CookAI</p>
                <p className="font-display text-2xl leading-none text-[color:var(--text-primary)]">Cook with feeling</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => {
                const active = location.pathname === link.path
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-[rgba(184,92,56,0.12)] text-[color:var(--brand-deep)]'
                        : 'text-[color:var(--text-secondary)] hover:bg-white/70 hover:text-[color:var(--text-primary)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            <form onSubmit={handleSearch} className="hidden flex-1 max-w-sm lg:block">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by ingredient, dish, or cuisine"
                  className="input-field rounded-full !py-3 pl-11 pr-4"
                />
              </label>
            </form>

            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="btn-ghost">
                    <Heart className="h-4 w-4" />
                    <span>Saved</span>
                  </Link>
                  <Link to="/profile" className="btn-secondary !px-3 !py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--secondary-500),var(--accent-500))] bg-[linear-gradient(135deg,var(--herb),var(--highlight))] text-white">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[8rem] truncate">{currentUser?.name || 'Profile'}</span>
                  </Link>
                  <button onClick={logout} className="btn-ghost">
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost">Sign in</Link>
                  <Link to="/signup" className="btn-primary">Start Cooking</Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="btn-secondary !rounded-full !p-3 md:hidden"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden md:hidden"
              >
                <div className="mt-4 grid gap-3 rounded-[28px] border border-[color:var(--border-soft)] bg-[rgba(255,252,246,0.82)] p-4">
                  <form onSubmit={handleSearch}>
                    <label className="relative block">
                      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search dishes or ingredients"
                        className="input-field rounded-full !py-3 pl-11 pr-4"
                      />
                    </label>
                  </form>

                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-secondary)] hover:bg-white"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-secondary)] hover:bg-white">
                        <span className="inline-flex items-center gap-2"><User className="h-4 w-4" /> Profile</span>
                      </Link>
                      <Link to="/chat" className="rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-secondary)] hover:bg-white">
                        <span className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Kitchen Chat</span>
                      </Link>
                      <button onClick={logout} className="btn-primary w-full justify-center">Sign out</button>
                    </>
                  ) : (
                    <div className="grid gap-3 pt-2">
                      <Link to="/login" className="btn-secondary justify-center">Sign in</Link>
                      <Link to="/signup" className="btn-primary justify-center">Create account</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header
