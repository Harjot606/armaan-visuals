import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'armaan-dev-secret-change-me'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'arya'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'armaan2024'

export function authenticateUser(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: '7d' })
    return { success: true, token }
  }
  return { success: false, error: 'Invalid username or password.' }
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  const token = header.slice(7)
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' })
  }
}
