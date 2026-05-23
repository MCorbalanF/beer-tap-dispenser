const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

function getAuthHeader() {
  const token = localStorage.getItem('tapfest_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw Object.assign(new Error(error.detail || 'Request failed'), {
      status: res.status,
      data: error,
    })
  }

  if (res.status === 204) return null
  return res.json()
}

// ── Auth ──────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}

// ── Dispensers ────────────────────────────────────
export const dispensersApi = {
  list: () =>
    request('/dispensers/'),

  get: (id) =>
    request(`/dispensers/${id}/`),

  toggle: (id) =>
    request(`/dispensers/${id}/toggle/`, { method: 'POST' }),

  create: (data) =>
    request('/dispensers/admin/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/dispensers/admin/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}

// ── Drinks ────────────────────────────────────────
export const drinksApi = {
  list: () =>
    request('/drinks/'),

  get: (id) =>
    request(`/drinks/${id}/`),

  create: (data) =>
    request('/drinks/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/drinks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/drinks/${id}/`, { method: 'DELETE' }),
}
