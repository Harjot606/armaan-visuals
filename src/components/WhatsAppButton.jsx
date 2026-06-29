import { getWhatsAppUrl, openWhatsApp } from '../utils/whatsapp'
import { WhatsAppIcon } from './Icons'

export default function WhatsAppButton({
  serviceName = 'a design project',
  label = 'Order on WhatsApp',
  variant = 'green',
  className = '',
  showIcon = true,
}) {
  const url = getWhatsAppUrl(serviceName)
  const variants = {
    green: 'bg-whatsapp text-white hover:bg-[#20bd5a]',
    dark: 'bg-charcoal text-white hover:bg-gray-800',
    outline: 'border-2 border-whatsapp text-teal hover:bg-mint',
  }

  function handleClick(e) {
    if (!url) {
      e.preventDefault()
      openWhatsApp(serviceName)
    }
  }

  return (
    <a
      href={url || '#'}
      onClick={handleClick}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${variants[variant]} ${className}`}
    >
      {showIcon && <WhatsAppIcon />}
      {label}
    </a>
  )
}
