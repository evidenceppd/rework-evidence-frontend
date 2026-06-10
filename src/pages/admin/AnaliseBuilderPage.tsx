import { useEffect, useMemo, useState, type ComponentType, type DragEvent, type ReactElement } from 'react'
import { BarChart3, Briefcase, Building2, ChevronDown, Database, Factory, Globe2, GripVertical, Heart, Lightbulb, Megaphone, Monitor, Package, Plus, Rocket, Save, Settings, ShieldCheck, ShoppingCart, Stethoscope, Store, Target, Trash2, Users, Wrench, X } from 'lucide-react'
import { toast } from 'sonner'
import { diagnosisService, normalizeForm, normalizeQuestion, normalizeSection, type DiagnosisFieldType, type DiagnosisForm, type DiagnosisQuestion, type DiagnosisSection } from '../../services/diagnosis.service'

type IconOption = { value: string; label: string; Icon: ComponentType<{ className?: string }> }
type EditorForm = DiagnosisForm & { originalSlug?: string; isNew?: boolean }
type SelectOption = { value: string; label: string }

const iconOptions: IconOption[] = [
  { value: 'briefcase', label: 'Maleta', Icon: Briefcase },
  { value: 'factory', label: 'Indústria', Icon: Factory },
  { value: 'building', label: 'Empresa', Icon: Building2 },
  { value: 'rocket', label: 'Crescimento', Icon: Rocket },
  { value: 'users', label: 'Serviços', Icon: Users },
  { value: 'heart', label: 'Saúde', Icon: Heart },
  { value: 'stethoscope', label: 'Clínica', Icon: Stethoscope },
  { value: 'cart', label: 'Comércio', Icon: ShoppingCart },
  { value: 'store', label: 'Loja', Icon: Store },
  { value: 'megaphone', label: 'Marketing', Icon: Megaphone },
  { value: 'monitor', label: 'Tecnologia', Icon: Monitor },
  { value: 'database', label: 'Dados', Icon: Database },
  { value: 'globe', label: 'Mercado', Icon: Globe2 },
  { value: 'target', label: 'Objetivos', Icon: Target },
  { value: 'settings', label: 'Operações', Icon: Settings },
  { value: 'wrench', label: 'Processos', Icon: Wrench },
  { value: 'package', label: 'Produto', Icon: Package },
  { value: 'lightbulb', label: 'Ideias', Icon: Lightbulb },
  { value: 'shield', label: 'Segurança', Icon: ShieldCheck },
  { value: 'chart', label: 'Resultados', Icon: BarChart3 },
]

const fieldTypes: Array<{ value: DiagnosisFieldType; label: string }> = [
  { value: 'single', label: 'Escolha única' },
  { value: 'radio', label: 'Múltipla escolha' },
  { value: 'select', label: 'Select (dropdown)' },
  { value: 'textarea', label: 'Texto longo' },
]

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function slugify(value: string): string {
  return String(value || 'formulario')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'formulario'
}

function getIcon(icon = 'briefcase'): IconOption {
  return iconOptions.find(item => item.value === icon) ?? iconOptions[0]
}

function createQuestion(): Required<DiagnosisQuestion> {
  const id = makeId('field')
  return normalizeQuestion({
    id,
    key: id,
    label: 'Nova pergunta',
    type: 'single',
    required: false,
    placeholder: '',
    description: '',
    options: ['Opção 1'],
    score: 0,
  })
}

function createSection(): Required<DiagnosisSection> {
  const id = makeId('section')
  return normalizeSection({
    id,
    key: id,
    title: 'Nova etapa',
    icon: 'briefcase',
    fields: [createQuestion()],
  })
}

function createForm(): EditorForm {
  return normalizeForm({
    slug: `novo-segmento-${Date.now()}`,
    title: 'Novo segmento',
    description: 'Descrição do segmento',
    isActive: true,
    icon: 'briefcase',
    sections: [createSection()],
  }) as EditorForm
}

function getFields(section?: DiagnosisSection): Required<DiagnosisQuestion>[] {
  return (section?.fields || section?.questions || []).map(normalizeQuestion)
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return items
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, movedItem)
  return nextItems
}

function getReorderedActiveIndex(currentIndex: number, fromIndex: number, toIndex: number): number {
  if (currentIndex === fromIndex) return toIndex
  if (fromIndex < currentIndex && toIndex >= currentIndex) return currentIndex - 1
  if (fromIndex > currentIndex && toIndex <= currentIndex) return currentIndex + 1
  return currentIndex
}

function setCardDragPreview(event: DragEvent<HTMLElement>): void {
  const dragCard = event.currentTarget.closest('[data-drag-card]')
  if (!(dragCard instanceof HTMLElement)) return
  const rect = dragCard.getBoundingClientRect()
  event.dataTransfer.setDragImage(dragCard, event.clientX - rect.left, event.clientY - rect.top)
}

function ScrollbarStyles(): ReactElement {
  return (
    <style>{`
      .maker-scrollbar{scrollbar-width:thin;scrollbar-color:#b8bec8 transparent}
      .maker-scrollbar::-webkit-scrollbar{width:8px;height:8px}
      .maker-scrollbar::-webkit-scrollbar-track{background:transparent}
      .maker-scrollbar::-webkit-scrollbar-thumb{background:#b8bec8;border-radius:999px;border:2px solid transparent;background-clip:content-box}
      .maker-scrollbar::-webkit-scrollbar-thumb:hover{background:#929aa8;background-clip:content-box}
      .stage-scrollbar{scrollbar-color:#d8dee7 transparent;scrollbar-width:thin}
      .stage-scrollbar::-webkit-scrollbar{height:14px}
      .stage-scrollbar::-webkit-scrollbar-track{background:linear-gradient(#0000 4px,#f6f8fb 4px,#f6f8fb 10px,#0000 10px);border-radius:999px}
      .stage-scrollbar::-webkit-scrollbar-thumb{background:#d8dee7;border:4px solid #fbfcfe;border-radius:999px;min-width:96px}
      .stage-scrollbar::-webkit-scrollbar-thumb:hover{background:#c5ccd6}
      .stage-scrollbar::-webkit-scrollbar-button,
      .stage-scrollbar::-webkit-scrollbar-button:single-button,
      .stage-scrollbar::-webkit-scrollbar-button:start,
      .stage-scrollbar::-webkit-scrollbar-button:end{background:transparent;border:0;display:block;width:0;height:0}
      .stage-scrollbar::-webkit-scrollbar-corner{background:transparent}
    `}</style>
  )
}

function CustomSelect({ label, value, options, onChange }: { label?: string; value: string; options: SelectOption[]; onChange: (value: string) => void }): ReactElement {
  const [open, setOpen] = useState(false)
  const selected = options.find(option => option.value === value)
  return (
    <div className="relative">
      {label && <span className="mb-1 block text-[12px] font-bold text-[#111318]">{label}</span>}
      <button type="button" onClick={() => setOpen(current => !current)} className="flex h-11 w-full items-center justify-between rounded-xl border border-[#dfe3ea] bg-white px-3 text-left text-[13px] font-bold text-[#111318] shadow-sm hover:border-[#eb001a]/50 focus:border-[#eb001a] focus:outline-none focus:ring-2 focus:ring-[#eb001a]/10">
        <span>{selected?.label ?? 'Selecione'}</span>
        <ChevronDown className={`h-4 w-4 text-[#6b7280] transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="maker-scrollbar absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#dfe3ea] bg-white p-1 shadow-xl">
          {options.map(option => (
            <button key={option.value} type="button" onClick={() => { onChange(option.value); setOpen(false) }} className={`w-full rounded-lg px-3 py-2 text-left text-[13px] transition ${option.value === value ? 'bg-[#eb001a] font-bold text-white' : 'text-[#111318] hover:bg-[#fff1f3] hover:text-[#eb001a]'}`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function IconPickerDropdown({ selectedIcon, onSelect }: { selectedIcon: string; onSelect: (icon: string) => void }): ReactElement {
  return (
    <div className="maker-scrollbar absolute left-0 top-[calc(100%+10px)] z-50 grid max-h-[310px] w-[420px] max-w-[calc(100vw-48px)] grid-cols-3 gap-2 overflow-auto rounded-2xl border border-[#dfe3ea] bg-white p-3 shadow-2xl sm:grid-cols-4">
      {iconOptions.map(({ value, label, Icon }) => (
        <button key={value} type="button" onClick={() => onSelect(value)} className={`flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-xl border p-3 text-[12px] font-bold transition ${selectedIcon === value ? 'border-[#eb001a] bg-[#fff1f3] text-[#eb001a]' : 'border-[#e3e7ee] bg-white text-[#394150] hover:border-[#eb001a]/50 hover:text-[#eb001a]'}`}>
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  )
}

function Modal({ title, children, onClose, width = 'max-w-2xl' }: { title: string; children: ReactElement; onClose: () => void; width?: string }): ReactElement {
  return (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-[#07090c]/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl border border-[#e3e7ee] bg-white shadow-2xl ${width}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e3e7ee] bg-white px-6 py-4">
          <h2 className="text-[18px] font-bold text-[#111318]">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-[#f3f5f8] text-[#111318] hover:bg-[#fff1f3] hover:text-[#eb001a]"><X className="h-4 w-4" /></button>
        </div>
        <div className="maker-scrollbar min-h-0 overflow-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export default function AnaliseBuilderPage(): ReactElement {
  const [forms, setForms] = useState<EditorForm[]>([])
  const [formIndex, setFormIndex] = useState(0)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [iconPickerIndex, setIconPickerIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true)
    diagnosisService.listFormsWithDetails(false)
      .then(items => {
        if (!alive) return
        const nextForms = items.length ? items.map(item => ({ ...item, originalSlug: item.slug })) : [createForm()]
        setForms(nextForms)
        setFormIndex(0)
        setSectionIndex(0)
        setQuestionIndex(0)
      })
      .catch(err => {
        console.warn(err)
        if (alive) setError('Não foi possível carregar os formulários da API.')
      })
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  const selectedForm = forms[formIndex]
  const section = selectedForm?.sections?.[sectionIndex]
  const fields = useMemo(() => getFields(section), [section])
  const question = fields[questionIndex]
  const totalQuestions = useMemo(() => selectedForm?.sections?.reduce((sum, item) => sum + getFields(item).length, 0) ?? 0, [selectedForm])

  const setSelectedForm = (updater: (form: EditorForm) => EditorForm): void => {
    setForms(current => current.map((form, index) => index === formIndex ? updater(form) : form))
  }

  const updateSection = (updater: (section: Required<DiagnosisSection>) => Required<DiagnosisSection>): void => {
    setSelectedForm(form => ({
      ...form,
      sections: form.sections.map((item, index) => index === sectionIndex ? updater(normalizeSection(item)) : item),
    }))
  }

  const updateQuestion = (updater: (question: Required<DiagnosisQuestion>) => Required<DiagnosisQuestion>): void => {
    updateSection(currentSection => ({
      ...currentSection,
      fields: getFields(currentSection).map((item, index) => index === questionIndex ? updater(item) : item),
      questions: getFields(currentSection).map((item, index) => index === questionIndex ? updater(item) : item),
    }))
  }

  const reorderForms = (fromIndex: number, toIndex: number): void => {
    setForms(current => moveItem(current, fromIndex, toIndex))
    setFormIndex(current => getReorderedActiveIndex(current, fromIndex, toIndex))
    setIconPickerIndex(null)
  }

  const reorderSections = (fromIndex: number, toIndex: number): void => {
    setSelectedForm(form => ({ ...form, sections: moveItem(form.sections, fromIndex, toIndex) }))
    setSectionIndex(current => getReorderedActiveIndex(current, fromIndex, toIndex))
    setQuestionIndex(0)
  }

  const reorderQuestions = (fromIndex: number, toIndex: number): void => {
    updateSection(current => {
      const nextFields = moveItem(getFields(current), fromIndex, toIndex)
      return { ...current, fields: nextFields, questions: nextFields }
    })
    setQuestionIndex(current => getReorderedActiveIndex(current, fromIndex, toIndex))
  }

  const addForm = (): void => {
    const form = createForm()
    setForms(current => [...current, { ...form, isNew: true }])
    setFormIndex(forms.length)
    setSectionIndex(0)
    setQuestionIndex(0)
  }

  const deleteForm = async (targetIndex = formIndex): Promise<void> => {
    const target = forms[targetIndex]
    if (!target) return

    setSaving(true)
    setError('')
    try {
      if (!target.isNew && target.originalSlug) {
        await diagnosisService.deleteForm(target.originalSlug)
      }
      const nextForms = forms.filter((_, index) => index !== targetIndex)
      setForms(nextForms)
      setFormIndex(Math.min(targetIndex, Math.max(0, nextForms.length - 1)))
      setSectionIndex(0)
      setQuestionIndex(0)
      setIconPickerIndex(null)
      toast.success('Segmento excluído.')
    } catch (err) {
      console.warn(err)
      setError('Erro ao excluir o segmento na API.')
    } finally {
      setSaving(false)
    }
  }

  const addSection = (): void => {
    setSelectedForm(form => ({ ...form, sections: [...form.sections, createSection()] }))
    setSectionIndex(selectedForm.sections.length)
    setQuestionIndex(0)
  }

  const deleteSection = (targetIndex = sectionIndex): void => {
    if (!selectedForm?.sections[targetIndex]) return
    if (selectedForm.sections.length <= 1) {
      setError('Mantenha ao menos uma etapa no segmento.')
      return
    }

    setSelectedForm(form => ({
      ...form,
      sections: form.sections.filter((_, index) => index !== targetIndex),
    }))
    setSectionIndex(Math.min(targetIndex, selectedForm.sections.length - 2))
    setQuestionIndex(0)
    toast.success('Etapa excluída. Salve para publicar a alteração.')
  }

  const addQuestion = (): void => {
    const nextIndex = fields.length
    const nextQuestion = createQuestion()
    const nextFields = [...fields, nextQuestion]
    updateSection(current => ({ ...current, fields: nextFields, questions: nextFields }))
    setQuestionIndex(nextIndex)
    setQuestionModalOpen(true)
  }

  const deleteQuestion = (): void => {
    updateSection(current => {
      const nextFields = getFields(current).filter((_, index) => index !== questionIndex)
      return { ...current, fields: nextFields, questions: nextFields }
    })
    setQuestionIndex(Math.max(0, questionIndex - 1))
    setQuestionModalOpen(false)
  }

  const updateQuestionType = (type: DiagnosisFieldType): void => {
    updateQuestion(current => ({ ...current, type, options: type === 'textarea' ? [] : current.options.length ? current.options : ['Opção 1'] }))
  }

  const saveCurrentForm = async (): Promise<void> => {
    if (!selectedForm) return
    const normalized = normalizeForm({ ...selectedForm, slug: selectedForm.originalSlug || selectedForm.slug || slugify(selectedForm.title), displayOrder: formIndex })
    if (!normalized.title.trim()) { setError('Informe o título do segmento.'); return }
    if (!normalized.sections.length) { setError('Adicione ao menos uma etapa.'); return }
    setSaving(true)
    setError('')
    try {
      const formsToSave = forms.map((form, index) => normalizeForm({
        ...form,
        ...(index === formIndex ? normalized : {}),
        slug: form.originalSlug || form.slug || slugify(form.title),
        displayOrder: index,
      }))
      const savedForms = await Promise.all(formsToSave.map((form) => {
        const currentOriginal = forms.find(item => (item.originalSlug || item.slug) === form.slug)
        return currentOriginal?.originalSlug && !currentOriginal.isNew
          ? diagnosisService.updateForm(currentOriginal.originalSlug, form)
          : diagnosisService.createForm({ ...form, slug: slugify(form.title) })
      }))
      setForms(savedForms.map(saved => ({ ...saved, originalSlug: saved.slug })))
      toast.success('Formulário salvo na API. Recarregue /analise para ver a versão publicada.')
    } catch (err) {
      console.warn(err)
      setError('Erro ao salvar o formulário na API.')
    } finally {
      setSaving(false)
    }
  }

  const SelectedIcon = getIcon(selectedForm?.icon).Icon

  if (loading) {
    return <div className="rounded-2xl border border-[#e3e7ee] bg-white p-8 text-sm font-semibold text-[#5f6672]">Carregando formulários da API...</div>
  }

  if (!selectedForm) {
    return <div className="rounded-2xl border border-[#e3e7ee] bg-white p-8"><button onClick={addForm} className="rounded-xl bg-[#eb001a] px-4 py-2 text-sm font-bold text-white">Criar primeiro formulário</button></div>
  }

  return (
    <div className="min-h-[calc(100vh-96px)] overflow-hidden rounded-2xl border border-[#e3e7ee] bg-[#f8fafc] text-[#111318] shadow-sm">
      <ScrollbarStyles />
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e3e7ee] bg-white px-6 py-5">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Maker de Formulários</h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">Editor conectado à API de diagnóstico. Salvar publica no /analise.</p>
          {error && <p className="mt-2 text-[12px] font-bold text-[#eb001a]">{error}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={saveCurrentForm} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#eb001a] px-5 text-[13px] font-bold text-white shadow-[0_10px_24px_rgba(235,0,26,0.22)] disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </header>

      <div className="grid min-h-[760px] grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-[#e3e7ee] bg-white p-6">
          <h2 className="text-[16px] font-bold">Segmentos</h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5f6672]">Cada segmento é um formulário da API.</p>
          <div className="mt-5 space-y-3">
            {forms.map((form, index) => {
              const Icon = getIcon(form.icon).Icon
              return (
                <div
                  key={form.slug || index}
                  data-drag-card
                  onDragOver={event => {
                    if (!event.dataTransfer.types.includes('application/x-evidence-form-index')) return
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'move'
                  }}
                  onDrop={event => {
                    const fromIndex = Number(event.dataTransfer.getData('application/x-evidence-form-index'))
                    if (Number.isNaN(fromIndex)) return
                    event.preventDefault()
                    reorderForms(fromIndex, index)
                  }}
                  className={`rounded-2xl border p-3 transition ${index === formIndex ? 'border-[#eb001a] bg-[#fff5f6] shadow-sm' : 'border-[#e3e7ee] bg-white hover:border-[#eb001a]/50 hover:bg-[#fffafb]'}`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      draggable
                      onDragStart={event => {
                        event.dataTransfer.setData('application/x-evidence-form-index', String(index))
                        event.dataTransfer.effectAllowed = 'move'
                        setCardDragPreview(event)
                      }}
                      className="grid h-8 w-8 shrink-0 cursor-grab place-items-center text-[#a3adba] transition hover:text-[#eb001a] active:cursor-grabbing"
                      aria-label={`Reordenar segmento ${form.title}`}
                    >
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <div className="relative shrink-0">
                      <button type="button" onClick={() => { setFormIndex(index); setIconPickerIndex(current => current === index ? null : index) }} className={`grid h-11 w-11 place-items-center rounded-xl ${index === formIndex ? 'bg-[#eb001a] text-white' : 'bg-[#f3f5f8] text-[#eb001a]'}`}>
                        <Icon className="h-5 w-5" />
                      </button>
                      {iconPickerIndex === index && (
                        <IconPickerDropdown selectedIcon={form.icon || 'briefcase'} onSelect={icon => {
                          setFormIndex(index)
                          setForms(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, icon } : item))
                          setIconPickerIndex(null)
                        }} />
                      )}
                    </div>
                    <button type="button" onClick={() => { setFormIndex(index); setSectionIndex(0); setQuestionIndex(0); setIconPickerIndex(null) }} className="min-w-0 flex-1 text-left">
                      <strong className="block truncate text-[14px]">{form.title}</strong>
                      <small className="mt-1 block text-[12px] text-[#5f6672]">{form.sections.length} etapas</small>
                    </button>
                    <button type="button" onClick={() => void deleteForm(index)} disabled={saving} className="grid h-8 w-8 shrink-0 place-items-center text-[#a3adba] transition hover:text-[#eb001a] disabled:opacity-50" aria-label={`Excluir segmento ${form.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <button type="button" onClick={addForm} className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe3ea] bg-white text-[13px] font-bold text-[#111318] hover:border-[#eb001a] hover:text-[#eb001a]"><Plus className="h-4 w-4" /> Novo segmento</button>
        </aside>

        <main className="min-w-0 bg-[#fbfcfe] p-3 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIconPickerIndex(formIndex)} className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff1f3] text-[#eb001a]"><SelectedIcon className="h-5 w-5" /></button>
                <div>
                  <h2 className="text-[18px] font-bold">Fluxo do formulário: {selectedForm.title}</h2>
                  <p className="mt-1 text-[12px] text-[#5f6672]">{selectedForm.sections.length} etapas · {totalQuestions} perguntas · slug: {selectedForm.originalSlug || selectedForm.slug}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[240px_minmax(260px,1fr)]">
                <label className="block text-[12px] font-bold text-[#111318]">Título do segmento<input className="admin-input mt-1 font-bold" value={selectedForm.title} onChange={event => setSelectedForm(item => ({ ...item, title: event.target.value, slug: item.originalSlug || slugify(event.target.value) }))} /></label>
                <label className="block text-[12px] font-bold text-[#111318]">Descrição<input className="admin-input mt-1" value={selectedForm.description || ''} onChange={event => setSelectedForm(item => ({ ...item, description: event.target.value }))} /></label>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={addSection} className="h-10 rounded-xl border border-[#dfe3ea] bg-white px-4 text-[13px] font-bold text-[#111318] hover:border-[#eb001a]/50"><Plus className="mr-2 inline h-4 w-4" />Nova etapa</button>
            </div>
          </div>

          <div className="maker-scrollbar stage-scrollbar mt-6 flex items-center gap-3 overflow-x-auto pb-4">
            {selectedForm.sections.map((item, index) => (
              <div
                key={item.key || item.id || index}
                data-drag-card
                onDragOver={event => {
                  if (!event.dataTransfer.types.includes('application/x-evidence-section-index')) return
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                }}
                onDrop={event => {
                  const fromIndex = Number(event.dataTransfer.getData('application/x-evidence-section-index'))
                  if (Number.isNaN(fromIndex)) return
                  event.preventDefault()
                  reorderSections(fromIndex, index)
                }}
                className={`relative h-[124px] min-w-[170px] rounded-2xl border p-4 text-left transition ${index === sectionIndex ? 'border-[#eb001a] bg-[#fff5f6] shadow-sm ring-4 ring-[#eb001a]/5' : 'border-[#e3e7ee] bg-white hover:border-[#eb001a]/40'}`}
              >
                <button type="button" onClick={() => deleteSection(index)} className="absolute right-3 top-3 z-10 grid h-5 w-5 place-items-center text-[#a3adba] transition hover:text-[#eb001a]" aria-label={`Excluir etapa ${item.title}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 right-3 z-10">
                  <button
                    type="button"
                    draggable
                    onDragStart={event => {
                      event.dataTransfer.setData('application/x-evidence-section-index', String(index))
                      event.dataTransfer.effectAllowed = 'move'
                      setCardDragPreview(event)
                    }}
                    className="grid h-5 w-5 cursor-grab place-items-center text-[#a3adba] transition hover:text-[#eb001a] active:cursor-grabbing"
                    aria-label={`Reordenar etapa ${item.title}`}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                </div>
                <button type="button" onClick={() => { setSectionIndex(index); setQuestionIndex(0) }} className="flex h-full w-full flex-col text-left">
                  <span className={`grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold ${index === sectionIndex ? 'bg-[#eb001a] text-white' : 'bg-[#eef1f5] text-[#111318]'}`}>{index + 1}</span>
                  <strong className="mt-4 line-clamp-2 min-h-[36px] text-[14px] leading-[18px]">{item.title}</strong>
                  <small className="mt-auto block pr-7 text-[12px] text-[#5f6672]">{getFields(item).length} perguntas</small>
                </button>
              </div>
            ))}
          </div>

          <section className="mt-4 min-w-0 rounded-2xl border border-[#e3e7ee] bg-white p-3 shadow-sm sm:p-5">
            <div className="mb-5">
              <label className="block text-[12px] font-bold text-[#111318]">Título da etapa</label>
              <input className="admin-input mt-1 max-w-[520px] font-bold" value={section?.title ?? ''} onChange={event => updateSection(item => ({ ...item, title: event.target.value }))} />
            </div>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div
                  key={item.key || item.id || index}
                  data-drag-card
                  onDragOver={event => {
                    if (!event.dataTransfer.types.includes('application/x-evidence-question-index')) return
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'move'
                  }}
                  onDrop={event => {
                    const fromIndex = Number(event.dataTransfer.getData('application/x-evidence-question-index'))
                    if (Number.isNaN(fromIndex)) return
                    event.preventDefault()
                    reorderQuestions(fromIndex, index)
                  }}
                  className={`grid w-full min-w-0 grid-cols-[28px_minmax(0,1fr)_36px] items-start gap-2 rounded-xl border px-3 py-4 text-left transition sm:grid-cols-[32px_34px_minmax(0,1fr)_150px_40px] sm:items-center sm:gap-3 sm:px-4 ${index === questionIndex ? 'border-[#eb001a] bg-[#fff7f8] shadow-sm' : 'border-[#e3e7ee] bg-white hover:border-[#eb001a]/40'}`}
                >
                  <button
                    type="button"
                    draggable
                    onDragStart={event => {
                      event.dataTransfer.setData('application/x-evidence-question-index', String(index))
                      event.dataTransfer.effectAllowed = 'move'
                      setCardDragPreview(event)
                    }}
                    className="grid h-8 w-8 cursor-grab place-items-center text-[#a3adba] transition hover:text-[#eb001a] active:cursor-grabbing"
                    aria-label={`Reordenar pergunta ${item.label}`}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <span className="hidden font-bold sm:block">{index + 1}.</span>
                  <button type="button" onClick={() => { setQuestionIndex(index); setQuestionModalOpen(true) }} className="min-w-0 text-left">
                    <span className="mb-1 block text-[12px] font-bold text-[#111318] sm:hidden">{index + 1}.</span>
                    <strong className="block min-w-0 break-words text-[14px] leading-snug">{item.label}</strong>
                    <small className="mt-1 block text-[12px] text-[#6b7280]">{item.description || item.placeholder || (item.required ? 'Obrigatória' : 'Opcional')} {item.required && <em className="ml-2 rounded bg-[#fff1f3] px-1.5 py-0.5 not-italic text-[#eb001a]">Obrigatória</em>}</small>
                  </button>
                  <span className="col-span-3 rounded-lg bg-[#f3f5f8] px-3 py-2 text-center text-[12px] font-bold text-[#394150] sm:col-span-1">{fieldTypes.find(type => type.value === item.type)?.label ?? item.type}</span>
                  <button type="button" onClick={() => { setQuestionIndex(index); setQuestionModalOpen(true) }} className="text-center text-[#6b7280] hover:text-[#eb001a]">...</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addQuestion} className="mt-4 h-12 w-full rounded-xl border border-dashed border-[#cfd6e1] bg-[#fbfcfe] text-[13px] font-bold text-[#eb001a] hover:bg-[#fff5f6]"><Plus className="mr-2 inline h-4 w-4" />Adicionar pergunta</button>
          </section>
        </main>
      </div>

      {questionModalOpen && question && (
        <Modal title="Editar pergunta" onClose={() => setQuestionModalOpen(false)}>
          <div className="space-y-4">
            <CustomSelect label="Tipo de campo" value={question.type} options={fieldTypes} onChange={value => updateQuestionType(value as DiagnosisFieldType)} />
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#eae1ca] bg-[#f7f8fa] px-4 py-3 text-[15px] font-bold">Obrigatório<input type="checkbox" checked={question.required} onChange={event => updateQuestion(item => ({ ...item, required: event.target.checked }))} className="h-5 w-5 cursor-pointer accent-[#eb001a]" /></label>
            <label className="block text-[12px] font-bold">Título da pergunta<input className="admin-input mt-1" value={question.label} onChange={event => updateQuestion(item => ({ ...item, label: event.target.value }))} /></label>
            <label className="block text-[12px] font-bold">Descrição<input className="admin-input mt-1" value={question.description} onChange={event => updateQuestion(item => ({ ...item, description: event.target.value }))} /></label>
            {question.type === 'select' && <label className="block text-[12px] font-bold">Placeholder<input className="admin-input mt-1" value={question.placeholder} onChange={event => updateQuestion(item => ({ ...item, placeholder: event.target.value }))} /></label>}
            {question.type !== 'textarea' && (
              <div>
                <p className="text-[12px] font-bold">Opções</p>
                <div className="mt-2 space-y-2">
                  {question.options.map((option, index) => (
                    <div key={`${question.id}-${index}`} className="flex gap-2">
                      <input className="admin-input" value={option} onChange={event => updateQuestion(item => ({ ...item, options: item.options.map((current, itemIndex) => itemIndex === index ? event.target.value : current) }))} />
                      <button type="button" onClick={() => updateQuestion(item => ({ ...item, options: item.options.filter((_, itemIndex) => itemIndex !== index) }))} className="h-11 rounded-lg border border-[#e3e7ee] px-3 text-[#eb001a] disabled:opacity-35" disabled={question.options.length <= 1}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
                  <button type="button" onClick={() => updateQuestion(item => ({ ...item, options: [...item.options, `Opção ${item.options.length + 1}`] }))} className="text-[13px] font-bold text-[#eb001a]"><Plus className="mr-1 inline h-4 w-4" />Adicionar opção</button>
                  <button type="button" onClick={() => updateQuestion(item => item.options.some(option => option.trim().toLowerCase() === 'outro') ? item : ({ ...item, options: [...item.options, 'Outro'] }))} className="text-[13px] font-bold text-[#111318]"><Plus className="mr-1 inline h-4 w-4" />Adicionar Outro</button>
                </div>
              </div>
            )}
            <div className="flex justify-between border-t border-[#e3e7ee] pt-4">
              <button type="button" onClick={deleteQuestion} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#ffd5da] px-4 text-[13px] font-bold text-[#eb001a] hover:bg-[#fff1f3]"><Trash2 className="h-4 w-4" />Excluir pergunta</button>
              <button type="button" onClick={() => setQuestionModalOpen(false)} className="h-10 rounded-xl bg-[#111318] px-5 text-[13px] font-bold text-white">Concluir</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}
