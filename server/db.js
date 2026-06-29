import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json')

const DEFAULT_PORTFOLIO = [
  {
    id: 'sample-1',
    title: 'Geometric Brand Mark',
    category: 'logos',
    description: 'A colorful geometric logo for a creative studio.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=450&fit=crop',
    filename: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Minimal Cafe Logo',
    category: 'logos',
    description: 'Soft, minimal logo for a neighborhood café.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265d786?w=600&h=450&fit=crop',
    filename: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Gaming Thumbnail',
    category: 'thumbnails',
    description: 'Bold YouTube thumbnail with high contrast.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e939e113?w=600&h=450&fit=crop',
    filename: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-4',
    title: 'Summer Event Poster',
    category: 'posters',
    description: 'Bright poster design for a community festival.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=450&fit=crop',
    filename: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-5',
    title: 'Instagram Carousel',
    category: 'social',
    description: 'Cohesive social media post set for a skincare brand.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3037c7bb?w=600&h=450&fit=crop',
    filename: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-6',
    title: 'Brand Story Reel',
    category: 'videos',
    description: 'Short motion graphic showcasing brand identity.',
    mediaType: 'video',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    filename: null,
    createdAt: new Date().toISOString(),
  },
]

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_PORTFOLIO, null, 2))
  }
}

function readPortfolio() {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writePortfolio(items) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2))
}

export function getAllItems() {
  return readPortfolio()
}

export function addItem(item) {
  const items = readPortfolio()
  items.unshift(item)
  writePortfolio(items)
  return item
}

export function removeItem(id) {
  const items = readPortfolio()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null

  const [removed] = items.splice(index, 1)
  writePortfolio(items)
  return removed
}

export function resetToSamples() {
  writePortfolio(DEFAULT_PORTFOLIO)
  return DEFAULT_PORTFOLIO
}

export { DEFAULT_PORTFOLIO }
