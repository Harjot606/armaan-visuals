import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CATEGORY_LABELS, PORTFOLIO_CATEGORIES } from '../constants'
import { fetchPortfolio } from '../utils/api'

export default function PortfolioSection({ showFilters = true, limit }) {
  const location = useLocation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchPortfolio()
        if (!cancelled) setItems(data)
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [location.pathname, location.key])

  const filtered = useMemo(() => {
    const list = activeFilter === 'all' ? items : items.filter((item) => item.category === activeFilter)
    return limit ? list.slice(0, limit) : list
  }, [items, activeFilter, limit])

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full bg-mint px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal">
            Portfolio
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">A peek at recent work</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Browse by category — every piece is original and made for the brand it represents.
          </p>
        </div>

        {showFilters && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {PORTFOLIO_CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === id
                    ? 'bg-charcoal text-white shadow'
                    : 'bg-white text-muted hover:bg-mint hover:text-teal'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-center text-muted">Loading portfolio…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted">No projects in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export function PortfolioCard({ item }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        {item.mediaType === 'video' ? (
          <video
            src={item.mediaUrl}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause()
              e.target.currentTime = 0
            }}
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-teal">
          {CATEGORY_LABELS[item.category] || item.category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-charcoal">{item.title}</h3>
        {item.description && (
          <p className="mt-1 text-sm text-muted line-clamp-2">{item.description}</p>
        )}
      </div>
    </article>
  )
}
