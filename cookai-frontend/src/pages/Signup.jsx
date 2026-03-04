import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AnimatedButton from '../components/AnimatedButton'
import { isValidEmail, validatePassword } from '../utils/helpers'

const Signup = () => {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const passwordStrength = validatePassword(formData.password)

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Tell us your name.'
    if (!isValidEmail(formData.email)) nextErrors.email = 'Enter a valid email address.'
    if (!passwordStrength.isValid) nextErrors.password = `Password needs: ${passwordStrength.feedback.join(', ')}`
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        navigate('/', { replace: true })
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
          <span className="section-label">Join CookAI</span>
          <h1 className="page-title text-balance">Create a cooking profile that gets more personal every time you use it.</h1>
          <p className="text-base leading-8 text-[color:var(--text-secondary)]">
            Register once and CookAI can remember what you like, what you save, and how you want dinner to feel.
          </p>
          <div className="feature-card">
            <p className="eyebrow mb-4">What you unlock</p>
            <ul className="space-y-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              <li>Favorite recipes, saved preferences, and more relevant recommendations.</li>
              <li>Personalized cooking guidance tied to your tastes and prep-time boundaries.</li>
              <li>A cleaner handoff between the recommendation engine and the AI assistant.</li>
            </ul>
          </div>
        </div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8">
          <div className="mb-8">
            <p className="eyebrow mb-3">Create your account</p>
            <h2 className="font-display text-4xl">Start cooking smarter</h2>
          </div>

          <div className="grid gap-5">
            {errors.general ? (
              <div className="rounded-[20px] border border-[rgba(157,75,90,0.18)] bg-[rgba(157,75,90,0.08)] px-5 py-4 text-sm text-[color:var(--text-secondary)]">
                {errors.general}
              </div>
            ) : null}

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[color:var(--text-primary)]">Full name</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-muted)]" />
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  className="input-field pl-11"
                  placeholder="Your name"
                />
              </div>
              {errors.name ? <p className="text-xs text-[color:var(--berry)]">{errors.name}</p> : null}
            </label>

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
                  placeholder="Create a strong password"
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--text-muted)]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full ${
                        index < passwordStrength.score
                          ? passwordStrength.score >= 4
                            ? 'bg-[color:var(--herb)]'
                            : 'bg-[color:var(--highlight)]'
                          : 'bg-[rgba(112,71,33,0.12)]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[color:var(--text-muted)]">
                  Strength: <span className="capitalize text-[color:var(--text-secondary)]">{passwordStrength.strength}</span>
                </p>
              </div>
              {errors.password ? <p className="text-xs text-[color:var(--berry)]">{errors.password}</p> : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[color:var(--text-primary)]">Confirm password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                className="input-field"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword ? <p className="text-xs text-[color:var(--berry)]">{errors.confirmPassword}</p> : null}
            </label>

            <AnimatedButton type="submit" loading={isLoading} className="mt-2 w-full justify-center">
              Create account
            </AnimatedButton>
          </div>

          <p className="mt-8 text-sm text-[color:var(--text-secondary)]">
            Already cooking with us?{' '}
            <Link to="/login" className="font-semibold text-[color:var(--brand-deep)]">
              Sign in instead
            </Link>
          </p>
        </motion.form>
      </div>
    </section>
  )
}

export default Signup
