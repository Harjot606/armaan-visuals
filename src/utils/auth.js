const AUTH_KEY = 'armaan_admin_token'

export function getToken() {
  return sessionStorage.getItem(AUTH_KEY)
}

export function setToken(token) {
  sessionStorage.setItem(AUTH_KEY, token)
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}
