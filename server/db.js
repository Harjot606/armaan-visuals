import {
  DEFAULT_PORTFOLIO,
  deleteMedia,
  readPortfolio,
  uploadMedia,
  writePortfolio,
} from './storage.js'

export { DEFAULT_PORTFOLIO }

export async function getAllItems() {
  return readPortfolio()
}

export async function addItem(item) {
  const items = await readPortfolio()
  items.unshift(item)
  await writePortfolio(items)
  return item
}

export async function removeItem(id) {
  const items = await readPortfolio()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null

  const [removed] = items.splice(index, 1)
  await writePortfolio(items)
  await deleteMedia(removed)
  return removed
}

export async function resetToSamples() {
  const items = await readPortfolio()
  for (const item of items) {
    await deleteMedia(item)
  }
  await writePortfolio(DEFAULT_PORTFOLIO)
  return DEFAULT_PORTFOLIO
}

export { uploadMedia }
