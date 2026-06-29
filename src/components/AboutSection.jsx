import { Link } from 'react-router-dom'
import { ArrowIcon } from './Icons'
import WhatsAppButton from './WhatsAppButton'

export default function AboutSection({ compact = false }) {
  if (compact) {
    return (
      <section className="bg-mint py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-mint-dark/50 p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal">
                Hi, I&apos;m Arya
              </span>
              <h2 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
                A designer who keeps things simple, warm and creative.
              </h2>
              <p className="mt-4 text-muted">
                I work with creators, small businesses and personal brands to craft visuals that actually feel like them.
              </p>
            </div>
            <Link
              to="/about"
              className="mt-6 inline-flex shrink-0 items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 lg:mt-0"
            >
              More about me
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] bg-mint">
          <img
            src="/arya.png"
            alt="Arya — Graphic Designer"
            className="aspect-[3/4] w-full object-cover object-top"
          />
        </div>

        <div>
          <span className="mb-4 inline-block rounded-full bg-mint px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal">
            About Arya
          </span>
          <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Hi, I&apos;m Arya — the designer behind ARMAAN.
          </h2>
          <p className="mt-5 leading-relaxed text-muted">
            I&apos;m a graphic designer who creates simple, attractive and creative designs for creators, businesses
            and personal brands. Whether you need a logo, a poster, a YouTube thumbnail or a full social media set,
            I focus on making work that feels fresh, friendly and true to you.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            No complicated jargon — just good design, clear communication and a smooth process from idea to final
            file. Let&apos;s make something you&apos;re proud to share.
          </p>
          <div className="mt-8">
            <WhatsAppButton serviceName="a design project" label="Work with me →" variant="dark" />
          </div>
        </div>
      </div>
    </section>
  )
}
