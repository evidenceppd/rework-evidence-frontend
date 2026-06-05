import { api } from './api'

export interface Noticia {
  id: string
  slug?: string
  categoria: string
  titulo: string
  descricao: string
  materia: string
  imagemCapa: string
  imagemBanner: string
  imagemBannerMobile: string
  tempoLeitura: string
  publicado: boolean
  createdAt: string
}

// Campos retornados pela API em snake_case
interface BlogApiItem {
  id: number | string
  slug?: string | null
  categoria: string
  titulo: string
  descricao: string
  materia: string
  imagem_capa?: string | null
  imagem_banner?: string | null
  imagem_banner_mobile?: string | null
  tempo_leitura?: string | null
  publicado?: boolean
  data_publicacao?: string | null
  createdAt?: string
  created_at?: string
  updatedAt?: string
}

function mapBlog(item: BlogApiItem): Noticia {
  return {
    id: String(item.id),
    slug: item.slug ?? undefined,
    categoria: item.categoria ?? '',
    titulo: item.titulo ?? '',
    descricao: item.descricao ?? '',
    materia: item.materia ?? '',
    imagemCapa: item.imagem_capa ?? '',
    imagemBanner: item.imagem_banner ?? '',
    imagemBannerMobile: item.imagem_banner_mobile ?? '',
    tempoLeitura: item.tempo_leitura ?? '',
    publicado: item.publicado ?? true,
    createdAt: item.createdAt ?? item.created_at ?? item.data_publicacao ?? new Date().toISOString(),
  }
}

export interface NoticiaInput {
  slug?: string
  categoria: string
  titulo: string
  descricao: string
  materia: string
  publicado: boolean
  imagemCapa?: string
  imagemBanner?: string
  imagemBannerMobile?: string
  tempoLeitura?: string
}

function toApiPayload(data: Partial<NoticiaInput>) {
  const payload: Record<string, unknown> = {}

  if (data.categoria !== undefined) payload.categoria = data.categoria
  if (data.slug !== undefined && data.slug.trim()) payload.slug = data.slug.trim()
  if (data.titulo !== undefined) payload.titulo = data.titulo.trim()
  if (data.descricao !== undefined) payload.descricao = data.descricao.trim()
  if (data.materia !== undefined) payload.materia = data.materia.trim()
  if (data.publicado !== undefined) payload.publicado = data.publicado
  if (data.imagemCapa !== undefined) payload.imagem_capa = data.imagemCapa
  if (data.imagemBanner !== undefined) payload.imagem_banner = data.imagemBanner
  if (data.imagemBannerMobile !== undefined) payload.imagem_banner_mobile = data.imagemBannerMobile
  if (data.tempoLeitura !== undefined) payload.tempo_leitura = data.tempoLeitura
  return payload
}

export const noticiasService = {
  // Endpoint protegido (admin)
  async getAll(): Promise<Noticia[]> {
    const raw = await api.get<BlogApiItem[]>('/blogs')
    return (Array.isArray(raw) ? raw : []).map(mapBlog)
  },
  // Endpoint publico (site)
  async getPublished(): Promise<Noticia[]> {
    const raw = await api.get<BlogApiItem[]>('/blogs/published?perPage=100')
    return (Array.isArray(raw) ? raw : []).map(mapBlog)
  },
  async getById(id: string): Promise<Noticia> {
    const raw = await api.get<BlogApiItem>(`/blogs/${id}`)
    return mapBlog(raw)
  },
  async create(data: NoticiaInput): Promise<Noticia> {
    const raw = await api.post<BlogApiItem>('/blogs', toApiPayload(data))
    return mapBlog(raw)
  },
  async update(id: string, data: Partial<NoticiaInput>): Promise<Noticia> {
    const raw = await api.put<BlogApiItem>(`/blogs/${id}`, toApiPayload(data))
    return mapBlog(raw)
  },
  delete: (id: string) => api.delete(`/blogs/${id}`),
}
