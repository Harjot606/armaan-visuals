import { useState } from 'react'
import { CONTACT } from '../constants'
import { getWhatsAppUrl, openWhatsApp } from '../utils/whatsapp'
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from './Icons'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-mint px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal">
            Contact
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Let&apos;s create something together
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            The fastest way to reach me is WhatsApp — or drop a note using the form below.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
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
              className="flex items-center gap-4 rounded-3xl bg-whatsapp p-6 text-white transition hover:bg-[#20bd5a]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Chat on WhatsApp</p>
                <p className="text-sm text-white/80">{CONTACT.phone}</p>
              </div>
            </a>

            <ContactCard icon={<PhoneIcon />} label="Phone" value={CONTACT.phone} />
            <ContactCard
              icon={<MailIcon />}
              label="Email"
              value={CONTACT.email}
              href={`mailto:${CONTACT.email}`}
            />
            <ContactCard
              icon={<InstagramIcon />}
              label="Instagram"
              value={CONTACT.instagram}
              href={CONTACT.instagramUrl}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8"
          >
            {submitted && (
              <div className="mb-6 rounded-2xl bg-mint px-4 py-3 text-sm text-teal">
                Thanks for your message! Arya will get back to you soon.
              </div>
            )}

            <div className="space-y-5">
              <Field label="Your name">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="input-field"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </Field>
              <Field label="Tell me about your project">
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="I'd love a fresh logo for my bakery..."
                  className="input-field resize-none"
                />
              </Field>
              <button
                type="submit"
                className="w-full rounded-full bg-charcoal py-3 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Send message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function ContactCard({ icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-6 transition hover:shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-charcoal">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-charcoal">{label}</p>
        <p className="text-sm text-muted">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {content}
      </a>
    )
  }
  return content
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-charcoal">{label}</span>
      {children}
    </label>
  )
}
