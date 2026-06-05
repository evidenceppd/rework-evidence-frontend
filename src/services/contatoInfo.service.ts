import { useState, useEffect } from 'react'
import { api } from './api'

export interface ContatoInfo {
  id: number
  email: string
  endereco: string
  link_maps: string
  telefone_1: string
  telefone_2: string
  whatsapp: string
  link_instagram: string
  link_facebook: string
  link_linkedin: string
}

export type ContatoInfoPayload = Omit<ContatoInfo, 'id'>

interface SiteConfig {
  id?: number
  description?: string
  cnpj?: string
  socialMedia?: {
    instagram?: string
    facebook?: string
    linkedin?: string
    whatsapp?: string
  }
  contactUs?: {
    telefone?: string
    telefone_1?: string
    telefone_2?: string
    email?: string
    location?: string
    endereco?: string
    link_maps?: string
    where_we_are?: string
  }
}

export const CONTATO_INFO_DEFAULTS: ContatoInfoPayload = {
  email: 'contato@agenciaevidence.com.br',
  endereco: 'Osvaldo Cruz - SP',
  link_maps: '',
  telefone_1: '',
  telefone_2: '',
  whatsapp: '',
  link_instagram: '#',
  link_facebook: '#',
  link_linkedin: '#',
}

function isHttpError(error: unknown): error is { response?: { status?: number } } {
  return Boolean(error && typeof error === 'object' && 'response' in error)
}

function mapConfigToContato(config: SiteConfig | null): ContatoInfo | null {
  if (!config) return null
  const contact = config.contactUs || {}
  const social = config.socialMedia || {}

  return {
    id: Number(config.id || 1),
    email: contact.email || CONTATO_INFO_DEFAULTS.email,
    endereco: contact.location || contact.endereco || contact.where_we_are || CONTATO_INFO_DEFAULTS.endereco,
    link_maps: contact.link_maps || CONTATO_INFO_DEFAULTS.link_maps,
    telefone_1: contact.telefone_1 || contact.telefone || CONTATO_INFO_DEFAULTS.telefone_1,
    telefone_2: contact.telefone_2 || CONTATO_INFO_DEFAULTS.telefone_2,
    whatsapp: social.whatsapp || CONTATO_INFO_DEFAULTS.whatsapp,
    link_instagram: social.instagram || CONTATO_INFO_DEFAULTS.link_instagram,
    link_facebook: social.facebook || CONTATO_INFO_DEFAULTS.link_facebook,
    link_linkedin: social.linkedin || CONTATO_INFO_DEFAULTS.link_linkedin,
  }
}

function mapContatoToConfig(payload: ContatoInfoPayload, current?: SiteConfig | null): SiteConfig {
  return {
    description: current?.description || 'Ag?ncia Evidence',
    cnpj: current?.cnpj || '00.000.000/0001-00',
    socialMedia: {
      ...(current?.socialMedia || {}),
      instagram: payload.link_instagram,
      facebook: payload.link_facebook,
      linkedin: payload.link_linkedin,
      whatsapp: payload.whatsapp,
    },
    contactUs: {
      ...(current?.contactUs || {}),
      telefone: payload.whatsapp || payload.telefone_1,
      telefone_1: payload.telefone_1,
      telefone_2: payload.telefone_2,
      email: payload.email,
      location: payload.endereco,
      endereco: payload.endereco,
      link_maps: payload.link_maps,
      where_we_are: payload.endereco,
    },
  }
}

async function getConfig(): Promise<SiteConfig | null> {
  try {
    return await api.get<SiteConfig>('/config')
  } catch (error) {
    if (isHttpError(error) && error.response?.status === 404) return null
    throw error
  }
}

export const contatoInfoService = {
  async getPublic(): Promise<ContatoInfo | null> {
    return mapConfigToContato(await getConfig())
  },

  async update(payload: ContatoInfoPayload): Promise<ContatoInfo> {
    const current = await getConfig()
    const saved = await api.put<SiteConfig>('/config', mapContatoToConfig(payload, current))
    return mapConfigToContato(saved) || { id: 1, ...payload }
  },
}

export function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return '#'
  const withCC = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCC}`
}

let _cache: ContatoInfo | null = null
let _promise: Promise<ContatoInfo | null> | null = null

export function setContatoInfoCache(data: ContatoInfo | null) {
  _cache = data
  _promise = data ? Promise.resolve(data) : null
}

export function useContatoInfo(): ContatoInfo | null {
  const [data, setData] = useState<ContatoInfo | null>(_cache)

  useEffect(() => {
    if (_cache) { setData(_cache); return }
    if (!_promise) _promise = contatoInfoService.getPublic()
    _promise
      .then((d) => { _cache = d; setData(d) })
      .catch(() => {})
  }, [])

  return data
}
