import { api } from './api'

export type DiagnosisFieldType = 'single' | 'radio' | 'select' | 'textarea' | 'text'

export type DiagnosisQuestion = {
  id?: string
  key?: string
  label: string
  type: DiagnosisFieldType
  required?: boolean
  placeholder?: string
  description?: string
  options?: string[]
  score?: number
}

export type DiagnosisSection = {
  id?: string
  key?: string
  title: string
  icon?: string
  metadata?: { formIcon?: string; [key: string]: unknown }
  fields?: DiagnosisQuestion[]
  questions?: DiagnosisQuestion[]
}

export type DiagnosisFormSummary = {
  id?: string
  slug: string
  title: string
  description?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type DiagnosisForm = DiagnosisFormSummary & {
  icon?: string
  sections: DiagnosisSection[]
}


export type DiagnosisLeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'lost' | 'client'

export type DiagnosisLeadSummary = {
  id: string
  formType: string
  companyName: string
  name: string
  phone: string
  email?: string
  city?: string | null
  state?: string | null
  segment?: string | null
  mainChallenge?: string | null
  score?: number
  leadTemperature?: string | null
  status: DiagnosisLeadStatus | string
  createdAt: string
  updatedAt?: string
}

export type DiagnosisLead = DiagnosisLeadSummary & {
  email: string
  operationSize?: string | null
  marketTime?: string | null
  growthChallenge?: string | null
  diagnosis: Record<string, unknown>
  source?: string | null
  notes?: string | null
  assignedTo?: string | null
  lastContactAt?: string | null
  nextContactAt?: string | null
}

export type DiagnosisLeadFilters = Partial<{
  formType: string
  status: string
  leadTemperature: string
  segment: string
  state: string
  city: string
  operationSize: string
  marketTime: string
  mainChallenge: string
}>

export type LeadPayload = {
  formType: string
  name: string
  companyName: string
  phone: string
  email: string
  city: string
  state: string
  segment?: string
  operationSize?: string
  marketTime?: string
  mainChallenge?: string
  growthChallenge?: string
  diagnosis: Record<string, unknown>
}

function toSlug(value: string): string {
  return String(value || 'formulario')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'formulario'
}

function normalizeType(type: DiagnosisFieldType | string | undefined): DiagnosisFieldType {
  if (type === 'text') return 'textarea'
  if (type === 'radio') return 'radio'
  if (type === 'select') return 'select'
  if (type === 'textarea') return 'textarea'
  return 'single'
}

export function normalizeQuestion(question: DiagnosisQuestion, fallbackIndex = 0): Required<DiagnosisQuestion> {
  const key = question.key || question.id || `question_${fallbackIndex + 1}`
  const type = normalizeType(question.type)
  return {
    id: question.id || key,
    key,
    label: question.label || 'Nova pergunta',
    type,
    required: Boolean(question.required),
    placeholder: question.placeholder || '',
    description: question.description || '',
    options: type === 'textarea' ? [] : Array.isArray(question.options) && question.options.length ? question.options : ['Opção 1'],
    score: Number(question.score || 0),
  }
}

export function normalizeSection(section: DiagnosisSection, fallbackIndex = 0): Required<DiagnosisSection> {
  const key = section.key || section.id || `section_${fallbackIndex + 1}`
  const rawQuestions = Array.isArray(section.questions) ? section.questions : Array.isArray(section.fields) ? section.fields : []
  return {
    id: section.id || key,
    key,
    title: section.title || `Etapa ${fallbackIndex + 1}`,
    icon: section.icon || 'briefcase',
    metadata: section.metadata || {},
    fields: rawQuestions.map(normalizeQuestion),
    questions: rawQuestions.map(normalizeQuestion),
  }
}

export function getFormIcon(form: Pick<DiagnosisForm, 'sections'> & { icon?: string }): string {
  return form.icon || (form.sections?.[0]?.metadata?.formIcon as string | undefined) || form.sections?.[0]?.icon || 'briefcase'
}

export function normalizeForm(form: DiagnosisFormSummary | DiagnosisForm): DiagnosisForm {
  const sections = Array.isArray((form as DiagnosisForm).sections) ? (form as DiagnosisForm).sections.map(normalizeSection) : []
  return {
    ...form,
    slug: form.slug || toSlug(form.title),
    title: form.title || 'Novo segmento',
    description: form.description || '',
    isActive: form.isActive !== false,
    sections,
    icon: getFormIcon({ sections, icon: (form as DiagnosisForm).icon }),
  }
}

export function toApiSections(form: DiagnosisForm): DiagnosisSection[] {
  const icon = form.icon || 'briefcase'
  return form.sections.map((section, sectionIndex) => ({
    key: section.key || section.id || `section_${sectionIndex + 1}`,
    title: section.title,
    icon: section.icon || 'briefcase',
    metadata: { ...(section.metadata || {}), ...(sectionIndex === 0 ? { formIcon: icon } : {}) },
    questions: (section.fields || section.questions || []).map((question, questionIndex) => {
      const normalized = normalizeQuestion(question, questionIndex)
      return {
        key: normalized.key,
        label: normalized.label,
        type: normalized.type === 'textarea' ? 'text' : normalized.type,
        required: normalized.required,
        placeholder: normalized.placeholder,
        description: normalized.description,
        options: normalized.type === 'textarea' ? undefined : normalized.options,
        score: normalized.score,
      }
    }),
  }))
}

export const diagnosisService = {
  async listForms(activeOnly?: boolean): Promise<DiagnosisFormSummary[]> {
    const query = activeOnly === false ? '?activeOnly=false' : ''
    return api.get<DiagnosisFormSummary[]>(`/diagnosis/forms${query}`)
  },

  async getForm(slug: string): Promise<DiagnosisForm> {
    return normalizeForm(await api.get<DiagnosisForm>(`/diagnosis/forms/${slug}/questions`))
  },

  async listFormsWithDetails(activeOnly?: boolean): Promise<DiagnosisForm[]> {
    const summaries = await this.listForms(activeOnly)
    const details = await Promise.all(summaries.map(summary => this.getForm(summary.slug).then(detail => normalizeForm({ ...summary, ...detail }))))
    return details
  },

  async createForm(form: DiagnosisForm): Promise<DiagnosisForm> {
    return normalizeForm(await api.post<DiagnosisForm>('/diagnosis/forms', {
      slug: form.slug || toSlug(form.title),
      title: form.title,
      description: form.description || null,
      isActive: form.isActive !== false,
      sections: toApiSections(form),
    }))
  },

  async updateForm(slug: string, form: DiagnosisForm): Promise<DiagnosisForm> {
    return normalizeForm(await api.patch<DiagnosisForm>(`/diagnosis/forms/${slug}`, {
      title: form.title,
      description: form.description || null,
      isActive: form.isActive !== false,
      sections: toApiSections(form),
    }))
  },

  async deleteForm(slug: string): Promise<void> {
    return api.delete<void>(`/diagnosis/forms/${slug}`)
  },

  async listLeads(filters: DiagnosisLeadFilters = {}): Promise<DiagnosisLeadSummary[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    const query = params.toString()
    return api.get<DiagnosisLeadSummary[]>(`/diagnosis/leads${query ? `?${query}` : ''}`)
  },

  async getLead(id: string): Promise<DiagnosisLead> {
    return api.get<DiagnosisLead>(`/diagnosis/leads/${id}`)
  },

  async updateLeadStatus(id: string, status: DiagnosisLeadStatus): Promise<DiagnosisLeadSummary> {
    return api.patch<DiagnosisLeadSummary>(`/diagnosis/leads/${id}/status`, { status })
  },

  async submitLead(payload: LeadPayload): Promise<unknown> {
    return api.post('/diagnosis', payload)
  },
}
