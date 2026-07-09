import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { put, del, list } from '@vercel/blob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORTFOLIO_BLOB_PATH = 'portfolio.json'

function isVercelRuntime() {
  return process.env.VERCEL === '1'
}

export function getDataDir() {
  if (isVercelRuntime()) {
    return '/tmp/armaan-data'
  }
  return path.join(__dirname, 'data')
}

export function getUploadsDir() {
  if (isVercelRuntime()) {
    return '/tmp/armaan-uploads'
  }
  return path.join(__dirname, 'uploads')
}

function getDataFile() {
  return path.join(getDataDir(), 'portfolio.json')
}

export const DEFAULT_PORTFOLIO = [
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

export function usesBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function ensureLocalDirs() {
  const dataDir = getDataDir()
  const uploadsDir = getUploadsDir()

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

async function readPortfolioFromBlob() {
  const { blobs } = await list({ prefix: PORTFOLIO_BLOB_PATH, limit: 1 })
  const match = blobs.find((blob) => blob.pathname === PORTFOLIO_BLOB_PATH)

  if (!match) {
    await writePortfolioToBlob(DEFAULT_PORTFOLIO)
    return DEFAULT_PORTFOLIO
  }

  const res = await fetch(match.url)
  if (!res.ok) {
    throw new Error('Failed to read portfolio data.')
  }

  return res.json()
}

async function writePortfolioToBlob(items) {
  await put(PORTFOLIO_BLOB_PATH, JSON.stringify(items, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

function readPortfolioFromDisk() {
  ensureLocalDirs()
  const dataFile = getDataFile()
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(DEFAULT_PORTFOLIO, null, 2))
  }
  return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
}

function writePortfolioToDisk(items) {
  ensureLocalDirs()
  fs.writeFileSync(getDataFile(), JSON.stringify(items, null, 2))
}

export async function readPortfolio() {
  if (usesBlobStorage()) {
    return readPortfolioFromBlob()
  }
  return readPortfolioFromDisk()
}

export async function writePortfolio(items) {
  if (usesBlobStorage()) {
    await writePortfolioToBlob(items)
    return
  }
  writePortfolioToDisk(items)
}

export async function uploadMedia(file) {
  if (usesBlobStorage()) {
    const blob = await put(file.filename, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
    })
    return { mediaUrl: blob.url, filename: blob.pathname }
  }

  ensureLocalDirs()
  const filePath = path.join(getUploadsDir(), file.filename)
  fs.writeFileSync(filePath, file.buffer)
  return { mediaUrl: `/uploads/${file.filename}`, filename: file.filename }
}

export async function deleteMedia(item) {
  if (!item.filename) return

  if (usesBlobStorage()) {
    if (item.mediaUrl) {
      await del(item.mediaUrl)
    }
    return
  }

  const filePath = path.join(getUploadsDir(), item.filename)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}
