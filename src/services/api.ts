const configuredApiUrl = import.meta.env.VITE_API_URL
const configuredBackendOrigin = import.meta.env.VITE_BACKEND_ORIGIN
const currentHostname = globalThis.location?.hostname
const isLocalFrontend = currentHostname === 'localhost' || currentHostname === '127.0.0.1' || currentHostname === '::1'
const defaultBackendOrigin = isLocalFrontend ? 'http://localhost:3000' : configuredBackendOrigin || 'http://localhost:3000'
const isAbsoluteApiUrl = /^https?:\/\//i.test(configuredApiUrl || '')

export const BACKEND_ORIGIN = (
  configuredApiUrl && isAbsoluteApiUrl
    ? new URL(configuredApiUrl).origin
    : defaultBackendOrigin
).replace(/\/$/, '')

export const BACKEND_URL = (configuredApiUrl || `${BACKEND_ORIGIN}/api`).replace(/\/$/, '')

type ApiEnvelope<T> = { status?: string; data?: T; message?: string; error?: string }

function authToken() {
  return localStorage.getItem('admin_token') || localStorage.getItem('admin_mfa_token') || ''
}

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {}
  const token = authToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const init: RequestInit = { method, headers, credentials: 'include' }
  if (body instanceof FormData) {
    init.body = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  const response = await fetch(`${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, init)
  const text = await response.text()
  const parsed = text ? JSON.parse(text) as ApiEnvelope<T> | T : undefined

  if (!response.ok) {
    const envelope = parsed as ApiEnvelope<T> | undefined
    if (response.status === 401) {
      localStorage.removeItem('admin_token')
      window.dispatchEvent(new Event('auth:expired'))
    }
    throw { response: { status: response.status, data: envelope }, message: envelope?.message || envelope?.error || response.statusText }
  }

  if (response.status === 204) return undefined as T
  const envelope = parsed as ApiEnvelope<T>
  return (envelope && typeof envelope === 'object' && 'data' in envelope ? envelope.data : parsed) as T
}

export function resolveImageUrl(path: string): string {
  if (!path) return ''
  if (/^(https?:|blob:|data:)/.test(path)) return path
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export const api = {
  get: <T>(ep: string): Promise<T> => request<T>('GET', ep),
  post: <T>(ep: string, body: unknown): Promise<T> => request<T>('POST', ep, body),
  put: <T>(ep: string, body: unknown): Promise<T> => request<T>('PUT', ep, body),
  patch: <T>(ep: string, body?: unknown): Promise<T> => request<T>('PATCH', ep, body),
  delete: <T = void>(ep: string): Promise<T> => request<T>('DELETE', ep),
}
