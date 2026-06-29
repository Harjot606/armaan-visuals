import { WHATSAPP_NUMBER } from '../constants'

export function isWhatsAppConfigured() {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')
  return digits.length >= 10 && !/[Xx]/.test(WHATSAPP_NUMBER)
}

export function getWhatsAppUrl(serviceName = 'a design project') {
  if (!isWhatsAppConfigured()) return null
  const message = `Hi Arya, I want to order ${serviceName}. Please share details.`
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function openWhatsApp(serviceName) {
  const url = getWhatsAppUrl(serviceName)
  if (!url) {
    window.alert(
      'WhatsApp number is not set yet. Ask Arya to add her real number in src/constants.js (WHATSAPP_NUMBER).',
    )
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
