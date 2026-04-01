import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <section className="section-shell">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="glass-panel p-12">
            <div className="cooking-loader" />
            <h1 className="mt-6 font-display text-4xl">Opening your kitchen profile</h1>
            <p className="mt-3 text-base leading-8 text-[color:var(--text-secondary)]">
              Checking your session and bringing your saved preferences with you.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
  }

  return children
}

export default PrivateRoute
