import { Router } from 'express'
import { authenticateUser } from '../auth.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  const result = authenticateUser(username, password)
  if (!result.success) {
    return res.status(401).json({ error: result.error })
  }

  res.json({ token: result.token })
})

export default router
