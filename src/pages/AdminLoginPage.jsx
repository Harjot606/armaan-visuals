import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../utils/api'
import { isAuthenticated } from '../utils/auth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiLogin(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl font-bold text-charcoal">
            ARMAAN<span className="text-teal">.</span>
          </p>
          <p className="mt-2 text-sm text-muted">Admin sign in — upload portfolio work</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Username</span>
            <input
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="arya"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-teal py-3 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <Link to="/" className="hover:text-teal">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
