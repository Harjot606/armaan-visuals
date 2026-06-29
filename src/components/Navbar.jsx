import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../constants'
import WhatsAppButton from './WhatsAppButton'

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-serif text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
          ARMAAN<span className="text-teal">.</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`text-sm font-medium transition-colors hover:text-teal ${
                  location.pathname === path ? 'text-teal' : 'text-muted'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <WhatsAppButton serviceName="a design project" label="WhatsApp Order" className="px-4 py-2 text-sm" />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-charcoal md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-cream px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    location.pathname === path ? 'bg-mint text-teal' : 'text-muted'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <WhatsAppButton serviceName="a design project" label="WhatsApp Order" className="w-full" />
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
