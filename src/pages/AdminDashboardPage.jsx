import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PortfolioCard } from '../components/PortfolioSection'
import { PORTFOLIO_CATEGORIES } from '../constants'
import { deletePortfolio, fetchPortfolio, seedPortfolio, uploadPortfolio } from '../utils/api'
import { logout } from '../utils/auth'

const UPLOAD_CATEGORIES = PORTFOLIO_CATEGORIES.filter((c) => c.id !== 'all')

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'logos',
    description: '',
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [mediaType, setMediaType] = useState('image')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    setLoading(true)
    try {
      const data = await fetchPortfolio()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return

    const isVideo = selected.type.startsWith('video/')
    const isImage = selected.type.startsWith('image/')

    if (!isVideo && !isImage) {
      setError('Please upload an image or video file.')
      return
    }

    if (selected.size > 100 * 1024 * 1024) {
      setError('File must be under 100 MB.')
      return
    }

    setError('')
    setFile(selected)
    setMediaType(isVideo ? 'video' : 'image')
    setPreview(URL.createObjectURL(selected))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setError('Please upload an image or video.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const newItem = await uploadPortfolio({
        title: form.title,
        category: form.category,
        description: form.description,
        file,
      })

      setItems((prev) => [newItem, ...prev])
      setForm({ title: '', category: 'logos', description: '' })
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      setStatus('Project uploaded successfully!')
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return

    try {
      await deletePortfolio(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      setStatus('Project deleted.')
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleReset() {
    if (!window.confirm('Reset portfolio to sample placeholders? This removes all uploaded files.')) return

    try {
      const data = await seedPortfolio()
      setItems(data)
      setStatus('Portfolio reset to samples.')
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Upload and manage portfolio work</p>
        </div>
        <div className="flex gap-3">
          <Link to="/portfolio" className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-mint">
            View site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-charcoal px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 font-serif text-xl font-bold">Upload new project</h2>

          {status && <div className="mb-4 rounded-2xl bg-mint px-4 py-3 text-sm text-teal">{status}</div>}
          {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Project title</span>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Geometric Brand Mark"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                {UPLOAD_CATEGORIES.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Upload image / video</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-mint file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal hover:file:bg-mint-dark"
              />
              <p className="mt-1 text-xs text-muted">Images or videos up to 100 MB</p>
              {preview && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-black/5">
                  {mediaType === 'video' ? (
                    <video src={preview} controls className="max-h-48 w-full object-cover" />
                  ) : (
                    <img src={preview} alt="Preview" className="max-h-48 w-full object-cover" />
                  )}
                </div>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Description</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
                placeholder="Short description of the project..."
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-teal py-3 text-sm font-medium text-white transition hover:bg-teal-dark disabled:opacity-60"
            >
              {submitting ? 'Uploading…' : 'Submit'}
            </button>
          </div>
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Your portfolio ({items.length})</h2>
            <button type="button" onClick={handleReset} className="text-xs text-muted hover:text-teal">
              Reset to samples
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : (
            <div className="max-h-[600px] space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="relative">
                  <PortfolioCard item={item} />
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
