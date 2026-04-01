import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AnimatedButton from '../components/AnimatedButton'

const Login = () => {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || '/', { replace: true })
    }
  }, [isAuthenticated, location.state, navigate])

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.email) nextErrors.email = 'Email is required.'
    if (!formData.password) nextErrors.password = 'Password is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate(location.state?.from || '/', { replace: true })
      } else {
        setErrors({ general: result.error })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="section-shell pt-8">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr,1.08fr] lg:px-8">
        <div className="space-y-6">
          <span className="section-label">Welcome back</span>
          <h1 className="page-title text-balance">Step back into the kitchen with your saved tastes and recipes intact.</h1>
          <p className="text-base leading-8 text-[color:var(--text-secondary)]">
            Sign in to keep your favorites, preferences, and recommendation history in one beautiful place.
          </p>
          <div className="feature-card">
            <p className="eyebrow mb-4">Why sign in</p>
            <ul className="space-y-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              <li>Keep favorite recipes close for repeat cooking.</li>
              <li>Get more personal recommendations over time.</li>
              <li>Bring your chat, pantry inspiration, and saved cooking preferences together.</li>
            </ul>
          </div>
        </div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8">
          <div className="mb-8">
            <p className="eyebrow mb-3">CookAI account</p>
            <h2 className="font-display text-4xl">Sign in</h2>
          </div>

          <div className="grid gap-5">
            {errors.general ? (
              <div className="rounded-[20px] border border-[rgba(157,75,90,0.18)] bg-[rgba(157,75,90,0.08)] px-5 py-4 text-sm text-[color:var(--text-secondary)]">
                {errors.general}
              </div>
            ) : null}

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[color:var(--text-primary)]">Email address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email ? <p className="text-xs text-[color:var(--berry)]">{errors.email}</p> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[color:var(--text-primary)]">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                  className="input-field pl-11 pr-12"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? <p className="text-xs text-[color:var(--berry)]">{errors.password}</p> : null}
            </label>

            <div className="flex items-center justify-between text-sm text-[color:var(--text-secondary)]">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-[color:var(--border-soft)]" />
                Remember me
              </label>
              <span>Secure session</span>
            </div>

            <AnimatedButton type="submit" loading={isLoading} className="w-full justify-center">
              Sign in
            </AnimatedButton>
          </div>

          <p className="mt-8 text-sm text-[color:var(--text-secondary)]">
            New to CookAI?{' '}
            <Link to="/signup" className="font-semibold text-[color:var(--brand-deep)]">
              Create your account
            </Link>
          </p>
        </motion.form>
      </div>
    </section>
  )
}

export default Login
