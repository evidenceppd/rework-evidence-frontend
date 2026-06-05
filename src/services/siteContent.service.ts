import { api } from './api'

export interface SiteContentRecord<T = Record<string, unknown>> {
  id: string
  pageId: string
  route?: string | null
  content: T
  createdAt: string
  updatedAt: string
}

export const siteContentService = {
  list: () => api.get<SiteContentRecord[]>('/site-content'),
  get: <T = Record<string, unknown>>(pageId: string) => api.get<SiteContentRecord<T>>(`/site-content/${pageId}`),
  update: <T = Record<string, unknown>>(pageId: string, content: T, route?: string) =>
    api.put<SiteContentRecord<T>>(`/site-content/${pageId}`, { route, content }),
}
