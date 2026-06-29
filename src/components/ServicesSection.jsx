import { Link } from 'react-router-dom'
import { SERVICES } from '../constants'
import WhatsAppButton from './WhatsAppButton'

export default function ServicesSection({ showAll = false, limit = 4 }) {
  const items = showAll ? SERVICES : SERVICES.slice(0, limit)

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-mint px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal">
            Services
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Pick what you need — order in one tap
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Every service comes with a quick WhatsApp chat so we can talk through ideas, timeline and price.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${service.color}`}>
                {service.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-charcoal">{service.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.description}</p>
              <div className="mt-5">
                <WhatsAppButton
                  serviceName={service.name}
                  label="Order on WhatsApp"
                  variant="dark"
                  className="w-full text-xs sm:text-sm"
                />
              </div>
            </article>
          ))}
        </div>

        {!showAll && (
          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-charcoal px-6 py-2.5 text-sm font-medium text-charcoal transition hover:bg-charcoal hover:text-white"
            >
              View all services
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
