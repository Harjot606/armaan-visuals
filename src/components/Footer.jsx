import { Link } from 'react-router-dom'
import { CONTACT, NAV_LINKS } from '../constants'
import { getWhatsAppUrl, openWhatsApp } from '../utils/whatsapp'
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-yellow-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-bold text-charcoal">
            ARMAAN<span className="text-teal">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Fresh and creative graphic design by Arya — made for creators, small businesses and personal brands.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-charcoal">Quick Links</h3>
          <ul className="space-y-2">
            {NAV_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link to={path} className="text-sm text-muted transition-colors hover:text-teal">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-charcoal">Get in touch</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 shrink-0" />
              {CONTACT.phone}
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 shrink-0" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-teal">
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-teal">
                {CONTACT.instagram}
              </a>
            </li>
            <li>
              <a
                href={getWhatsAppUrl('a design project') || '#'}
                onClick={(e) => {
                  if (!getWhatsAppUrl('a design project')) {
                    e.preventDefault()
                    openWhatsApp('a design project')
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-medium text-white transition hover:bg-[#20bd5a]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} ARMAAN. All rights reserved.
      </div>
    </footer>
  )
}
