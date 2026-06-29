import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { randomUUID } from 'crypto'
import { requireAuth } from '../auth.js'
import { addItem, getAllItems, removeItem, resetToSamples } from '../db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${randomUUID()}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^(image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|webm|quicktime|x-msvideo))$/
    if (allowed.test(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) are allowed.'))
    }
  },
})

const router = Router()

router.get('/', (_req, res) => {
  res.json(getAllItems())
})

router.post('/', requireAuth, upload.single('media'), (req, res) => {
  try {
    const { title, category, description } = req.body

    if (!title?.trim() || !category) {
      return res.status(400).json({ error: 'Title and category are required.' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Image or video file is required.' })
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image'
    const item = addItem({
      id: randomUUID(),
      title: title.trim(),
      category,
      description: description?.trim() || '',
      mediaType,
      mediaUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      createdAt: new Date().toISOString(),
    })

    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Upload failed.' })
  }
})

router.delete('/:id', requireAuth, (req, res) => {
  const removed = removeItem(req.params.id)
  if (!removed) {
    return res.status(404).json({ error: 'Project not found.' })
  }

  if (removed.filename) {
    const filePath = path.join(UPLOADS_DIR, removed.filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  res.json({ success: true })
})

router.post('/seed', requireAuth, (_req, res) => {
  const items = getAllItems()
  for (const item of items) {
    if (item.filename) {
      const filePath = path.join(UPLOADS_DIR, item.filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  }
  res.json(resetToSamples())
})

router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File must be under 100 MB.' })
    }
    return res.status(400).json({ error: err.message })
  }
  if (err) return res.status(400).json({ error: err.message })
  next()
})

export default router
