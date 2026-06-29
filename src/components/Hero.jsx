import { Link } from 'react-router-dom'
import { ArrowIcon, SparkleIcon } from './Icons'
import WhatsAppButton from './WhatsAppButton'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-mint/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-peach/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-mint px-4 py-1.5 text-xs font-medium text-teal">
            <SparkleIcon className="w-3 h-3 text-teal" />
            Available for new projects
          </span>

          <h1 className="font-serif text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-[3.25rem]">
            Fresh &amp; Creative{' '}
            <span className="text-teal">Graphic Design</span>
            <br />
            by Arya
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Logos, posters, thumbnails, social media posts and custom designs made with creativity.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98]"
            >
              View Work
              <ArrowIcon />
            </Link>
            <WhatsAppButton serviceName="a design project" />
          </div>
        </div>

        <div className="relative animate-fade-up-delay">
          <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-gradient-to-br from-peach to-amber-100" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-lg">
            <img
              src="/arya.png"
              alt="Arya — Graphic Designer"
              className="aspect-[3/4] w-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6">
              <p className="font-serif text-lg font-bold text-white">Arya</p>
              <p className="text-sm text-white/80">Founder &amp; Designer</p>
            </div>
            <div className="absolute bottom-6 right-6 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-teal shadow">
              ♥ ARMAAN
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 text-sm shadow-lg">
            👋 Hi, I&apos;m Arya
          </div>
        </div>
      </div>
    </section>
  )
}
