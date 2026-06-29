import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import ServicesSection from '../components/ServicesSection'
import PortfolioSection from '../components/PortfolioSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection compact />
      <ServicesSection limit={4} />
      <PortfolioSection showFilters={false} limit={3} />
    </>
  )
}
