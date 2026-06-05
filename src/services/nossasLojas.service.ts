import { api } from './api'

export interface Loja {
  id: string
  nome: string
  endereco: string
  telefone: string
  horario: string
  imageUrl: string
  latitude?: number
  longitude?: number
  ordem: number
  departamentos?: { id: number; nome: string; fotos: string[] }[]
}

export interface NossasLojasPayload {
  nomeLoja: string
  cor: string
  fotoLoja: string
  rua: string
  bairro: string
  cidade: string
  cep: string
  estado: string
  linkMaps: string | null
  segundaSabado: string
  domingo: string
  telefone: string
  whatsapp: string
  fotosAlimentos: string[]
  fotosHortifruti: string[]
  fotosPadaria: string[]
  fotosAcougue: string[]
  fotosPet: string[]
  fotosPapelaria: string[]
  departamentos: { nome: string; fotos: string[] }[]
}

export const nossasLojasService = {
  getAll: () => api.get<Loja[]>('/nossas-lojas'),
  create: (data: NossasLojasPayload) => api.post<Loja>('/nossas-lojas', data),
  update: (id: string, data: NossasLojasPayload) => api.put<Loja>(`/nossas-lojas/${id}`, data),
  delete: (id: string) => api.delete(`/nossas-lojas/${id}`),
  reorder: (ids: string[]) => api.patch('/nossas-lojas/reorder', { ids }),
}
