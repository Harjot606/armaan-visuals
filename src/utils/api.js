import { upload } from '@vercel/blob/client'
import { getToken, setToken } from './auth'

async function request(path, options = {}) {
  const headers = { ...options.headers }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`/api${path}`, { ...options, headers })

  const contentType = res.headers.get('content-type')
  let data = null
  let rawText = null

  if (contentType?.includes('application/json')) {
    data = await res.json()
  } else {
    rawText = await res.text()
  }

  if (!res.ok) {
    throw new Error(data?.error || rawText || 'Something went wrong.')
  }

  return data
}

export async function login(username, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(data.token)
  return { success: true }
}

export async function fetchPortfolio() {
  return request('/portfolio')
}

async function getStorageMode() {
  const res = await fetch('/api/health')
  const data = await res.json()
  return data.storage
}

export async function uploadPortfolio({ title, category, description, file }) {
  const storage = await getStorageMode()

  if (storage === 'blob') {
    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
    const pathname = `uploads/${crypto.randomUUID()}${ext}`

    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/portfolio/upload',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

    return request('/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        title,
        category,
        description,
        mediaUrl: blob.url,
        filename: blob.pathname,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      }),
    })
  }

  const formData = new FormData()
  formData.append('title', title)
  formData.append('category', category)
  formData.append('description', description)
  formData.append('media', file)

  return request('/portfolio', {
    method: 'POST',
    body: formData,
  })
}

export async function deletePortfolio(id) {
  return request(`/portfolio/${id}`, { method: 'DELETE' })
}

export async function seedPortfolio() {
  return request('/portfolio/seed', { method: 'POST' })
}
