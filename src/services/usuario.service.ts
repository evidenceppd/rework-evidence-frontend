import { api } from './api'

export interface Usuario {
  id: string
  nome: string
  email: string
  role: 'admin' | 'master' | 'editor'
  ativo?: boolean
  first_login?: boolean
  emailPendente?: boolean
  emailMasked?: string
}

type ApiUsuario = Usuario & {
  nomeCompleto?: string
  active?: boolean
}

function fromApi(usuario: ApiUsuario): Usuario {
  return {
    ...usuario,
    nome: usuario.nome || usuario.nomeCompleto || '',
    role: String(usuario.role || 'editor').toLowerCase() as Usuario['role'],
    ativo: usuario.ativo ?? usuario.active ?? false,
  }
}

function toApi(data: Partial<Usuario> & { senha?: string; novaSenha?: string }) {
  const payload: Record<string, unknown> = { ...data }
  if ('nome' in payload) {
    payload.nomeCompleto = payload.nome
    delete payload.nome
  }
  if ('senha' in payload) {
    payload.password = payload.senha
    delete payload.senha
  }
  if ('novaSenha' in payload) {
    payload.password = payload.novaSenha
    delete payload.novaSenha
  }
  if ('ativo' in payload) {
    payload.active = payload.ativo
    delete payload.ativo
  }
  if (typeof payload.role === 'string') {
    payload.role = payload.role.toUpperCase()
  }
  return payload
}

export const usuarioService = {
  getAll: async () => (await api.get<ApiUsuario[]>('/users')).map(fromApi),
  getMe: async () => fromApi(await api.get<ApiUsuario>('/users/me')),
  create: async (data: Omit<Usuario, 'id'> & { senha: string }) => fromApi(await api.post<ApiUsuario>('/users', toApi(data))),
  update: async (id: string, data: Partial<Usuario> & { senha?: string; novaSenha?: string }) => fromApi(await api.put<ApiUsuario>(`/users/${id}`, toApi(data))),
  updateMe: async (data: { nome?: string; email?: string; senha?: string }) => fromApi(await api.put<ApiUsuario>('/users/me', toApi(data))),
  delete: (id: string) => api.delete(`/users/${id}`),
  sendConfirmation: (id: string) => api.post<{ emailMasked: string }>(`/users/${id}/send-confirmation`, {}),
  confirmEmail: (id: string, code: string) => api.post(`/users/${id}/confirm-email`, { code }),
}
