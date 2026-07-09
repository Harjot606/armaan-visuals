import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { randomUUID } from 'crypto'
import { requireAuth } from '../auth.js'
import { addItem, getAllItems, removeItem, resetToSamples, uploadMedia } from '../db.js'
import { getUploadsDir, usesBlobStorage } from '../storage.js'

const storage = usesBlobStorage()
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, getUploadsDir()),
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

async function createPortfolioItem(req, res) {
  const { title, category, description, mediaUrl, filename, mediaType: bodyMediaType } = req.body

  if (!title?.trim() || !category) {
    return res.status(400).json({ error: 'Title and category are required.' })
  }

  // Metadata-only create after a client-side Blob upload
  if (mediaUrl && filename) {
    const item = await addItem({
      id: randomUUID(),
      title: title.trim(),
      category,
      description: description?.trim() || '',
      mediaType: bodyMediaType || 'image',
      mediaUrl,
      filename,
      createdAt: new Date().toISOString(),
    })
    return res.status(201).json(item)
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Image or video file is required.' })
  }

  const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image'
  let savedMediaUrl
  let savedFilename

  if (usesBlobStorage()) {
    const blobFilename = `uploads/${randomUUID()}${path.extname(req.file.originalname).toLowerCase()}`
    const uploaded = await uploadMedia({
      filename: blobFilename,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
    })
    savedMediaUrl = uploaded.mediaUrl
    savedFilename = uploaded.filename
  } else {
    savedMediaUrl = `/uploads/${req.file.filename}`
    savedFilename = req.file.filename
  }

  const item = await addItem({
    id: randomUUID(),
    title: title.trim(),
    category,
    description: description?.trim() || '',
    mediaType,
    mediaUrl: savedMediaUrl,
    filename: savedFilename,
    createdAt: new Date().toISOString(),
  })

  res.status(201).json(item)
}

router.get('/', async (_req, res) => {
  try {
    res.json(await getAllItems())
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load portfolio.' })
  }
})

router.post('/', requireAuth, (req, res, next) => {
  const contentType = req.headers['content-type'] || ''
  if (contentType.includes('application/json')) {
    return createPortfolioItem(req, res).catch((err) => {
      res.status(500).json({ error: err.message || 'Upload failed.' })
    })
  }

  upload.single('media')(req, res, (err) => {
    if (err) return next(err)
    createPortfolioItem(req, res).catch((error) => {
      res.status(500).json({ error: error.message || 'Upload failed.' })
    })
  })
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await removeItem(req.params.id)
    if (!removed) {
      return res.status(404).json({ error: 'Project not found.' })
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Delete failed.' })
  }
})

router.post('/seed', requireAuth, async (_req, res) => {
  try {
    res.json(await resetToSamples())
  } catch (err) {
    res.status(500).json({ error: err.message || 'Reset failed.' })
  }
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
