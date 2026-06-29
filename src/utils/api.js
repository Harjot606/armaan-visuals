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

  let data
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    data = await res.json()
  } else {
    data = null
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Something went wrong.')
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

export async function uploadPortfolio({ title, category, description, file }) {
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
