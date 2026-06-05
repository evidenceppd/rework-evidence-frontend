export interface Usuario {
  id: string
  nome: string
  email: string
  role: 'ADMIN' | 'MASTER' | 'EDITOR'
  first_login?: boolean
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

export interface MfaRequiredError {
  code: 'MFA_REQUIRED'
  message: string
}

import { api } from './api'

function parseJwtPayload(token: string): { exp?: number } | null {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    return JSON.parse(decoded) as { exp?: number }
  } catch {
    return null
  }
}

function isTokenValid(token: string): boolean {
  const payload = parseJwtPayload(token)
  if (!payload?.exp) return false

  return payload.exp * 1000 > Date.now()
}

export const authService = {
  getUsuario(): Usuario | null {
    const data = localStorage.getItem('admin_usuario')
    if (!data) return null
    try { return JSON.parse(data) as Usuario } catch { return null }
  },
  getToken(): string | null {
    return localStorage.getItem('admin_token')
  },
  isAuthenticated(): boolean {
    const token = this.getToken()
    const usuario = this.getUsuario()

    if (!token || !usuario || !isTokenValid(token)) {
      this.logout()
      return false
    }

    return true
  },
  setSession(response: LoginResponse): void {
    localStorage.setItem('admin_token', response.token)
    localStorage.setItem('admin_usuario', JSON.stringify(response.usuario))
    localStorage.removeItem('admin_mfa_token')
  },
  async login(email: string, senha: string): Promise<LoginResponse> {
    const result = await api.post<{ mfaToken: string }>('/auth/login', { email, password: senha })
    localStorage.setItem('admin_mfa_token', result.mfaToken)
    throw { code: 'MFA_REQUIRED', message: 'Digite o codigo MFA enviado por e-mail.' } satisfies MfaRequiredError
  },
  async verifyMfa(code: string): Promise<LoginResponse> {
    const result = await api.post<{ accessToken: string }>('/auth/mfa', { code })

    // Store the access token before calling protected endpoints.
    // Otherwise api.get('/users/me') still sends the temporary MFA token and
    // leaves the admin session with an invalid/missing token, causing 401 on save.
    localStorage.setItem('admin_token', result.accessToken)
    localStorage.removeItem('admin_mfa_token')

    const usuario = await api.get<Usuario>('/users/me')
    const session: LoginResponse = { token: result.accessToken, usuario }
    authService.setSession(session)
    return session
  },
  logout(): void {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_usuario')
    localStorage.removeItem('admin_mfa_token')
  },
}
