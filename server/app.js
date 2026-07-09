import express from 'express'
import cors from 'cors'
import fs from 'fs'
import authRoutes from './routes/auth.js'
import portfolioRoutes from './routes/portfolio.js'
import { getUploadsDir, usesBlobStorage } from './storage.js'

const app = express()

if (!usesBlobStorage()) {
  fs.mkdirSync(getUploadsDir(), { recursive: true })
}

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(getUploadsDir()))
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
