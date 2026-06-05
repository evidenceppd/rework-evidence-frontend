import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { AlertCircle, ArrowUpRight, CalendarDays, CheckCircle2, ChevronDown, FileDown, Flame, Mail, MapPin, Phone, RefreshCw, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { diagnosisService, type DiagnosisForm, type DiagnosisLead, type DiagnosisLeadStatus, type DiagnosisLeadSummary } from '../../services/diagnosis.service'

const statusOptions: Array<{ value: DiagnosisLeadStatus | 'all'; label: string; tone: string; dot: string }> = [
  { value: 'all', label: 'Todos', tone: 'bg-slate-100 text-slate-700', dot: 'bg-slate-300' },
  { value: 'new', label: 'Novo', tone: 'bg-blue-50 text-blue-700 ring-blue-100', dot: 'bg-blue-500' },
  { value: 'contacted', label: 'Contatado', tone: 'bg-cyan-50 text-cyan-700 ring-cyan-100', dot: 'bg-cyan-500' },
  { value: 'proposal', label: 'Proposta', tone: 'bg-amber-50 text-amber-700 ring-amber-100', dot: 'bg-[#eb001a]' },
  { value: 'client', label: 'Cliente', tone: 'bg-[#eb001a]/10 text-[#eb001a] ring-[#eb001a]/15', dot: 'bg-[#eb001a]' },
  { value: 'lost', label: 'Perdido', tone: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
]

const temperatureLabels: Record<string, { label: string; className: string }> = {
  hot: { label: 'Quente', className: 'bg-[#eb001a]/10 text-[#eb001a] ring-[#eb001a]/15' },
  warm: { label: 'Morno', className: 'bg-amber-50 text-amber-700 ring-amber-100' },
  cold: { label: 'Frio', className: 'bg-sky-50 text-sky-700 ring-sky-100' },
}

type SelectOption<T extends string> = { value: T; label: string; tone?: string; dot?: string }

function statusMeta(status?: string) {
  return statusOptions.find(item => item.value === status) || statusOptions[1]
}

function temperatureMeta(value?: string | null) {
  return temperatureLabels[String(value || '').toLowerCase()] || { label: value || 'Sem score', className: 'bg-slate-100 text-slate-600 ring-slate-200' }
}

function formatDate(value?: string) {
  if (!value) return '--'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '--'
  return parsed.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function initials(name?: string) {
  return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || '?'
}

function buildQuestionLabels(forms: DiagnosisForm[]): Record<string, string> {
  return forms.reduce<Record<string, string>>((acc, form) => {
    form.sections.forEach(section => {
      const fields = section.fields || section.questions || []
      fields.forEach(field => {
        const key = field.key || field.id
        if (key) acc[key] = field.label
      })
    })
    return acc
  }, {})
}

function flattenDiagnosis(value: unknown, labels: Record<string, string>, prefix = ''): Array<{ label: string; value: string }> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.entries(value as Record<string, unknown>).flatMap(([key, item]) => {
    const readableKey = labels[key] || key.replace(/_/g, ' ')
    const label = prefix ? `${prefix} / ${readableKey}` : readableKey
    if (item && typeof item === 'object' && !Array.isArray(item)) return flattenDiagnosis(item, labels, label)
    const rendered = Array.isArray(item) ? item.join(', ') : String(item ?? '')
    return rendered.trim() ? [{ label, value: rendered }] : []
  })
}

function formatPdfText(value?: string | number | null) {
  return String(value ?? '--').trim() || '--'
}

function exportLeadPdf({ lead, formTitle, status, temperature, answers }: { lead: DiagnosisLead; formTitle: string; status: string; temperature: string; answers: Array<{ label: string; value: string }> }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 40
  const gap = 12
  const contentWidth = pageWidth - margin * 2

  const ensureSpace = (currentY: number, neededHeight: number): number => {
    if (currentY + neededHeight <= pageHeight - margin) return currentY
    doc.addPage()
    return margin
  }

  const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const lines = doc.splitTextToSize(formatPdfText(text), maxWidth)
    doc.text(lines, x, y)
    return y + lines.length * lineHeight
  }

  doc.setFillColor(7, 9, 12)
  doc.roundedRect(margin, margin, contentWidth, 110, 14, 14, 'F')
  doc.setTextColor(255, 83, 100)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('RELATORIO DO LEAD', margin + 20, margin + 30)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.text(formatPdfText(lead.companyName || 'Empresa nao informada'), margin + 20, margin + 62, { maxWidth: contentWidth - 40 })
  doc.setTextColor(205, 210, 218)
  doc.setFontSize(11)
  doc.text(`${formatPdfText(lead.name)} / ${formatPdfText(formTitle)}`, margin + 20, margin + 86, { maxWidth: contentWidth - 40 })

  const metaCards: Array<[string, string | number | null | undefined]> = [
    ['Telefone', lead.phone],
    ['E-mail', lead.email],
    ['Status', status],
    ['Temperatura', temperature],
    ['Cidade', `${formatPdfText(lead.city)} / ${formatPdfText(lead.state)}`],
    ['Entrada', formatDate(lead.createdAt)],
    ['Score', lead.score ?? 0],
    ['Segmento', lead.segment],
  ]

  let cursorY = margin + 132
  const cardWidth = (contentWidth - gap * 3) / 4
  const cardHeight = 54
  metaCards.forEach(([label, value], index) => {
    const row = Math.floor(index / 4)
    const col = index % 4
    const x = margin + col * (cardWidth + gap)
    const y = cursorY + row * (cardHeight + gap)
    doc.setDrawColor(223, 227, 234)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(x, y, cardWidth, cardHeight, 8, 8, 'FD')
    doc.setTextColor(138, 147, 163)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text(formatPdfText(label).toUpperCase(), x + 10, y + 17, { maxWidth: cardWidth - 20 })
    doc.setTextColor(17, 19, 24)
    doc.setFontSize(10)
    doc.text(formatPdfText(value), x + 10, y + 36, { maxWidth: cardWidth - 20 })
  })

  cursorY += cardHeight * 2 + gap + 34
  doc.setTextColor(17, 19, 24)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Respostas do diagnostico', margin, cursorY)
  cursorY += 22

  if (!answers.length) {
    doc.setTextColor(107, 114, 128)
    doc.setFontSize(11)
    doc.text('Nenhuma resposta detalhada registrada.', margin, cursorY)
  } else {
    const answerWidth = (contentWidth - gap) / 2
    const minCardHeight = 58
    for (let index = 0; index < answers.length; index += 2) {
      const rowItems = answers.slice(index, index + 2).map(answer => {
        const labelLines = doc.splitTextToSize(formatPdfText(answer.label).toUpperCase(), answerWidth - 20)
        const valueLines = doc.splitTextToSize(formatPdfText(answer.value), answerWidth - 20)
        const height = Math.max(minCardHeight, 26 + labelLines.length * 10 + valueLines.length * 12)
        return { labelLines, valueLines, height }
      })
      const rowHeight = Math.max(...rowItems.map(item => item.height))
      cursorY = ensureSpace(cursorY, rowHeight + gap)
      rowItems.forEach((item, column) => {
        const x = margin + column * (answerWidth + gap)
        doc.setDrawColor(223, 227, 234)
        doc.setFillColor(255, 255, 255)
        doc.roundedRect(x, cursorY, answerWidth, rowHeight, 8, 8, 'FD')
        doc.setTextColor(138, 147, 163)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'bold')
        doc.text(item.labelLines, x + 10, cursorY + 18)
        doc.setTextColor(17, 19, 24)
        doc.setFontSize(10)
        doc.text(item.valueLines, x + 10, cursorY + 24 + item.labelLines.length * 10)
      })
      cursorY += rowHeight + gap
    }
  }

  cursorY = ensureSpace(cursorY + 18, 24)
  doc.setTextColor(138, 147, 163)
  doc.setFontSize(9)
  drawWrappedText(`Documento gerado pelo admin da Agencia Evidence em ${formatDate(new Date().toISOString())}.`, margin, cursorY, contentWidth, 11)

  const reportUrl = URL.createObjectURL(doc.output('blob'))
  const previewWindow = window.open(reportUrl, '_blank', 'noopener,noreferrer')
  if (!previewWindow) URL.revokeObjectURL(reportUrl)
  window.setTimeout(() => URL.revokeObjectURL(reportUrl), 60_000)
}

function MetricCard({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: ReactElement }) {
  return (
    <div className="rounded-3xl border border-[#e3e7ee] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8a93a3]">{label}</p>
          <strong className="mt-2 block text-[30px] font-black tracking-tight text-[#111318]">{value}</strong>
          <span className="mt-2 block text-[12px] font-medium text-[#6b7280]">{detail}</span>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff1f3] text-[#eb001a]">{icon}</div>
      </div>
    </div>
  )
}

function SmartSelect<T extends string>({ label, value, options, onChange, className = '' }: { label: string; value: T; options: Array<SelectOption<T>>; onChange: (value: T) => void; className?: string }) {
  const [open, setOpen] = useState(false)
  const selected = options.find(option => option.value === value) || options[0]

  return (
    <div className={`relative ${className}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        className="flex h-11 w-full min-w-[148px] items-center justify-between gap-3 rounded-2xl border border-[#dfe3ea] bg-white px-3 text-left text-sm font-bold text-[#111318] outline-none transition hover:border-[#eb001a]/45 focus:border-[#eb001a] focus:ring-4 focus:ring-[#eb001a]/10"
      >
        <span className="min-w-0 truncate">{selected?.label || label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#8a93a3] transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div role="listbox" aria-label={label} className="absolute right-0 z-30 mt-2 max-h-72 min-w-full overflow-auto rounded-2xl border border-[#e3e7ee] bg-white p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onMouseDown={event => event.preventDefault()}
              onClick={() => { onChange(option.value); setOpen(false) }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${option.value === value ? 'bg-[#fff1f3] text-[#eb001a]' : 'text-[#111318] hover:bg-[#f8fafc]'}`}
            >
              <span className="truncate">{option.label}</span>
              {option.tone && <span className={`h-2 w-2 rounded-full ${option.dot || 'bg-slate-300'}`} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LeadRow({ lead, active, formTitle, onSelect }: { lead: DiagnosisLeadSummary; active: boolean; formTitle: string; onSelect: (lead: DiagnosisLeadSummary) => void }) {
  const status = statusMeta(lead.status)
  const temperature = temperatureMeta(lead.leadTemperature)
  return (
    <button type="button" onClick={() => onSelect(lead)} className={`w-full rounded-2xl border p-4 text-left transition ${active ? 'border-[#eb001a] bg-[#fff7f8] shadow-sm ring-4 ring-[#eb001a]/5' : 'border-[#e3e7ee] bg-white hover:border-[#eb001a]/35 hover:bg-[#fffafb]'}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#111318] text-[13px] font-black text-white">{initials(lead.companyName || lead.name)}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <strong className="truncate text-[15px] font-black text-[#111318]">{lead.companyName || 'Empresa não informada'}</strong>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${status.tone}`}>{status.label}</span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${temperature.className}`}>{temperature.label}</span>
          </div>
          <p className="mt-1 text-[13px] font-medium text-[#5f6672]">{lead.name} / {formTitle}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-[#6b7280]">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.city || '--'} / {lead.state || '--'}</span>
            <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDate(lead.createdAt)}</span>
            <span className="inline-flex items-center gap-1"><Flame className="h-3.5 w-3.5" />Score {lead.score ?? 0}</span>
          </div>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[#a3adba]" />
      </div>
    </button>
  )
}

function LeadDetailsModal({ lead, loading, open, formTitle, questionLabels, onClose, onStatusChange }: { lead: DiagnosisLead | null; loading: boolean; open: boolean; formTitle: string; questionLabels: Record<string, string>; onClose: () => void; onStatusChange: (status: DiagnosisLeadStatus) => void }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, open])

  if (!open) return null

  const answers = lead ? flattenDiagnosis(lead.diagnosis, questionLabels) : []
  const status = statusMeta(lead?.status)
  const temperature = temperatureMeta(lead?.leadTemperature)
  const handleExport = () => {
    if (!lead) return
    exportLeadPdf({ lead, formTitle, status: status.label, temperature: temperature.label, answers })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#020617]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Detalhes do lead selecionado" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/15 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-5 border-b border-[#edf0f4] bg-[#07090c] p-6 text-white">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#ff5364]">Lead selecionado</p>
            <h2 className="mt-2 text-[clamp(24px,3vw,34px)] font-black leading-tight">{lead?.companyName || (loading ? 'Carregando lead...' : 'Lead')}</h2>
            <p className="mt-1 text-sm font-semibold text-white/65">{lead ? `${lead.name} / ${formTitle}` : 'Buscando informações completas do formulário'}</p>
          </div>
          <div className="flex items-center gap-3">
            {lead && <span className={`rounded-full px-3 py-1.5 text-[12px] font-bold ring-1 ${temperature.className}`}>{temperature.label}</span>}
            <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/5 text-white transition hover:bg-white/10" aria-label="Fechar modal"><X className="h-5 w-5" /></button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm font-bold text-[#6b7280]">Carregando detalhes do lead...</div>
        ) : lead ? (
          <div className="grid max-h-[calc(92vh-112px)] gap-0 overflow-auto xl:grid-cols-[360px_minmax(0,1fr)]">
            <aside className="border-b border-[#edf0f4] bg-[#f8fafc] p-6 xl:border-b-0 xl:border-r">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <a className="rounded-2xl border border-[#e3e7ee] bg-white p-4 text-sm font-bold text-[#111318] hover:border-[#eb001a]/40" href={`tel:${lead.phone}`}><Phone className="mb-2 h-4 w-4 text-[#eb001a]" />{lead.phone}</a>
                <a className="min-w-0 rounded-2xl border border-[#e3e7ee] bg-white p-4 text-sm font-bold text-[#111318] hover:border-[#eb001a]/40" href={`mailto:${lead.email}`}><Mail className="mb-2 h-4 w-4 text-[#eb001a]" /><span className="block truncate">{lead.email}</span></a>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e3e7ee] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-full px-3 py-1.5 text-[12px] font-bold ring-1 ${status.tone}`}>{status.label}</span>
                  <SmartSelect<DiagnosisLeadStatus>
                    label="Status do lead"
                    value={lead.status}
                    options={statusOptions.filter((item): item is SelectOption<DiagnosisLeadStatus> => item.value !== 'all')}
                    onChange={onStatusChange}
                    className="w-[154px]"
                  />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 text-[12px] text-[#5f6672]">
                  <p><strong className="block text-[#111318]">Cidade</strong>{lead.city || '--'} / {lead.state || '--'}</p>
                  <p><strong className="block text-[#111318]">Entrada</strong>{formatDate(lead.createdAt)}</p>
                  <p><strong className="block text-[#111318]">Score</strong>{lead.score ?? 0}</p>
                  <p><strong className="block text-[#111318]">Segmento</strong>{lead.segment || '--'}</p>
                </div>
              </div>
              <button type="button" onClick={handleExport} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#e3e7ee] bg-white px-4 text-[13px] font-black text-[#111318] shadow-sm transition hover:border-[#eb001a]/40 hover:bg-[#fff1f3]">
                <FileDown className="h-4 w-4 text-[#eb001a]" />Exportar
              </button>
            </aside>

            <section className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-[#111318]">Respostas do diagnóstico</h3>
                  <p className="mt-1 text-sm text-[#6b7280]">Informações enviadas pelo formulário publicado em /analise.</p>
                </div>
                <span className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-[12px] font-bold text-[#5f6672]">{answers.length} respostas</span>
              </div>

              {answers.length === 0 ? <p className="mt-5 rounded-2xl bg-[#f8fafc] p-4 text-sm text-[#6b7280]">Nenhuma resposta detalhada registrada.</p> : (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {answers.map(answer => <div key={`${answer.label}-${answer.value}`} className="rounded-2xl border border-[#e3e7ee] p-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a93a3]">{answer.label}</p><p className="mt-1 text-[14px] font-semibold text-[#111318]">{answer.value}</p></div>)}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="p-8 text-center text-sm font-bold text-[#6b7280]">Não foi possível carregar este lead.</div>
        )}
      </div>
    </div>
  )
}

export default function AnaliseLeadsPage(): ReactElement {
  const [leads, setLeads] = useState<DiagnosisLeadSummary[]>([])
  const [forms, setForms] = useState<DiagnosisForm[]>([])
  const [selected, setSelected] = useState<DiagnosisLead | null>(null)
  const [selectedId, setSelectedId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<DiagnosisLeadStatus | 'all'>('all')
  const [formType, setFormType] = useState('all')

  const selectLead = async (lead: DiagnosisLeadSummary) => {
    setSelectedId(lead.id)
    setModalOpen(true)
    setDetailLoading(true)
    setSelected(null)
    try {
      setSelected(await diagnosisService.getLead(lead.id))
    } catch (err) {
      console.warn(err)
      setError('Não foi possível carregar os detalhes deste lead.')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const [data, formData] = await Promise.all([
        diagnosisService.listLeads(),
        diagnosisService.listFormsWithDetails(false),
      ])
      setForms(formData)
      setLeads(data)
    } catch (err) {
      console.warn(err)
      setError('Não foi possível carregar as chegadas de formulários.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadLeads() }, [])

  const formTitleBySlug = useMemo(() => new Map(forms.map(form => [form.slug, form.title])), [forms])
  const questionLabels = useMemo(() => buildQuestionLabels(forms), [forms])
  const formTypes = useMemo(() => Array.from(new Set(leads.map(lead => lead.formType).filter(Boolean))).sort(), [leads])
  const formOptions = useMemo<Array<SelectOption<string>>>(() => [
    { value: 'all', label: 'Todos os formulários' },
    ...formTypes.map(item => ({ value: item, label: formTitleBySlug.get(item) || item })),
  ], [formTitleBySlug, formTypes])
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return leads.filter(lead => {
      if (status !== 'all' && lead.status !== status) return false
      if (formType !== 'all' && lead.formType !== formType) return false
      if (!normalizedQuery) return true
      return [lead.companyName, lead.name, lead.phone, lead.email, lead.city, lead.state, lead.segment, lead.formType, formTitleBySlug.get(lead.formType)].some(value => String(value || '').toLowerCase().includes(normalizedQuery))
    })
  }, [leads, query, status, formType, formTitleBySlug])

  const todayCount = useMemo(() => {
    const today = new Date().toDateString()
    return leads.filter(lead => new Date(lead.createdAt).toDateString() === today).length
  }, [leads])
  const hotCount = leads.filter(lead => String(lead.leadTemperature || '').toLowerCase() === 'hot').length
  const newCount = leads.filter(lead => lead.status === 'new').length
  const conversionReady = leads.filter(lead => ['proposal', 'client'].includes(String(lead.status))).length

  const handleStatusChange = async (nextStatus: DiagnosisLeadStatus) => {
    if (!selected) return
    try {
      const updated = await diagnosisService.updateLeadStatus(selected.id, nextStatus)
      setSelected({ ...selected, status: updated.status })
      setLeads(current => current.map(lead => lead.id === selected.id ? { ...lead, status: updated.status } : lead))
    } catch (err) {
      console.warn(err)
      setError('Não foi possível atualizar o status deste lead.')
    }
  }

  return (
    <div className="min-h-[calc(100vh-96px)] rounded-[28px] border border-[#e3e7ee] bg-[#f8fafc] p-5 text-[#111318] shadow-sm sm:p-6">
      <header className="overflow-hidden rounded-[26px] border border-[#16181d] bg-[#07090c] p-6 text-white shadow-[0_24px_70px_rgba(7,9,12,0.22)]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eb001a]/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff5364]"><Sparkles className="h-3.5 w-3.5" /> Central de Diagnósticos</p>
            <h1 className="mt-4 text-[clamp(28px,4vw,44px)] font-black leading-tight">Chegadas dos formulários de /analise</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/70">Acompanhe em tempo real quem respondeu, priorize leads quentes e abra o diagnóstico completo sem sair do admin.</p>
          </div>
          <button type="button" onClick={loadLeads} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 text-[13px] font-bold text-white hover:bg-white/10"><RefreshCw className="h-4 w-4" />Atualizar</button>
        </div>
      </header>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total recebido" value={leads.length} detail="Leads enviados pela rota /analise" icon={<ClipboardIcon />} />
        <MetricCard label="Hoje" value={todayCount} detail="Novas chegadas nas últimas horas" icon={<CalendarDays className="h-5 w-5" />} />
        <MetricCard label="Quentes" value={hotCount} detail="Prioridade comercial alta" icon={<Flame className="h-5 w-5" />} />
        <MetricCard label="Em avanço" value={conversionReady} detail={`${newCount} ainda como novos`} icon={<CheckCircle2 className="h-5 w-5" />} />
      </section>

      <section className="mt-5 rounded-3xl border border-[#e3e7ee] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f5] pb-4">
          <div>
            <h2 className="text-xl font-black text-[#111318]">Inbox de respostas</h2>
            <p className="mt-1 text-sm text-[#6b7280]">{filtered.length} de {leads.length} registros visíveis</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a93a3]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar lead..." className="h-11 w-[220px] rounded-2xl border border-[#dfe3ea] bg-[#f8fafc] pl-9 pr-3 text-sm font-semibold outline-none focus:border-[#eb001a]" /></label>
            <SmartSelect<DiagnosisLeadStatus | 'all'> label="Filtrar status" value={status} options={statusOptions} onChange={setStatus} className="w-[150px]" />
            <SmartSelect<string> label="Filtrar formulário" value={formType} options={formOptions} onChange={setFormType} className="w-[190px]" />
          </div>
        </div>

        {error && <div className="mt-4 flex items-center gap-2 rounded-2xl border border-[#eb001a]/20 bg-[#fff1f3] p-4 text-sm font-bold text-[#eb001a]"><AlertCircle className="h-4 w-4" />{error}</div>}
        {loading ? <div className="mt-4 rounded-2xl bg-[#f8fafc] p-8 text-center text-sm font-bold text-[#6b7280]">Carregando chegadas...</div> : filtered.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-[#cfd6e1] bg-[#fbfcfe] p-10 text-center"><SlidersHorizontal className="mx-auto h-9 w-9 text-[#eb001a]" /><h3 className="mt-3 font-black">Nenhuma chegada encontrada</h3><p className="mt-1 text-sm text-[#6b7280]">Ajuste filtros ou aguarde novos envios de /analise.</p></div> : (
          <div className="mt-4 space-y-3">
            {filtered.map(lead => <LeadRow key={lead.id} lead={lead} formTitle={formTitleBySlug.get(lead.formType) || lead.formType} active={lead.id === selectedId} onSelect={selectLead} />)}
          </div>
        )}
      </section>

      <LeadDetailsModal lead={selected} loading={detailLoading} open={modalOpen} formTitle={selected ? formTitleBySlug.get(selected.formType) || selected.formType : ''} questionLabels={questionLabels} onClose={() => setModalOpen(false)} onStatusChange={handleStatusChange} />
    </div>
  )
}

function ClipboardIcon() {
  return <CheckCircle2 className="h-5 w-5" />
}
