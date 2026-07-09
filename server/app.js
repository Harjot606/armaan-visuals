import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import portfolioRoutes from './routes/portfolio.js'
import { usesBlobStorage } from './storage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

if (!usesBlobStorage()) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true })
}

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes)
app.use('/api/portfolio', portfolioRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
