import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import {
  Calendar,
  ChevronDown,
  FileText,
  GripVertical,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Plus,
  Quote,
  Save,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { noticiasService, type Noticia, type NoticiaInput } from '../../services/noticias.service'
import { resolveImageUrl } from '../../services/api'
import { uploadService } from '../../services/upload.service'
import { getBlogBlockTocItems, parseBlogBlocks, serializeBlogBlocks } from '../../utils/blogBlocks'
import { BlogBlocksContent } from '../../utils/blogBlocks.jsx'

type BlogBlockType = 'text' | 'quote' | 'topics' | 'list'
type TextVariant = 'paragraph' | 'title' | 'subtitle'
type TextAlign = 'left' | 'center' | 'right'

type ActiveEditorState = {
  title: boolean
  bold: boolean
  italic: boolean
  list: boolean
  align: TextAlign
  fontSize: string
  fontWeight: string
  letterSpacing: string
  lineHeight: string
}

type BlogContentBlock = {
  id: string
  type: BlogBlockType
  text: string
  author?: string
  heading?: string
  subtitle?: string
  image?: string
  imageAlt?: string
  items?: Array<{ title?: string; text: string }>
  style: {
    variant: TextVariant
    fontSize: string
    color: string
    fontWeight: string
    italic: boolean
    lineHeight: string
    letterSpacing: string
    align: TextAlign
  }
}

type BlogDraft = {
  id: string
  title: string
  subtitle: string
  slug: string
  category: string
  date: string
  readTimeMinutes: string
  author: string
  coverImage: string
  bannerImage: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  relatedTitle: string
  ctaTitle: string
  ctaText: string
  ctaButton: string
  ctaHref: string
  blocks: BlogContentBlock[]
}

const draftKey = 'evidence_admin_blog_creation_draft'
const legacyPreselectedTags = ['Marketing', 'Vendas', 'Smarketing', 'B2B']
const categories = ['Geração de demanda', 'Marketing', 'Vendas e Comercial', 'Posicionamento', 'Indústria', 'Saúde', 'Agro']

const defaultBlockStyle: BlogContentBlock['style'] = {
  variant: 'paragraph',
  fontSize: '17px',
  color: '#52525b',
  fontWeight: '400',
  italic: false,
  lineHeight: '1.75',
  letterSpacing: '0px',
  align: 'left',
}

const defaultActiveEditorState: ActiveEditorState = {
  title: false,
  bold: false,
  italic: false,
  list: false,
  align: 'left',
  fontSize: '17px',
  fontWeight: '400',
  letterSpacing: '0px',
  lineHeight: '1.75',
}

const makeId = () => `blog-${Date.now()}-${Math.random().toString(16).slice(2)}`
const toReadTimeLabel = (minutes: string) => `${Number(minutes || 0) || 1} min de leitura`

const initialDraft: BlogDraft = {
  id: makeId(),
  title: 'Como alinhar marketing e vendas para gerar mais resultado',
  subtitle: 'Entenda como o alinhamento entre marketing e time comercial pode aumentar seus resultados e reduzir o ciclo de vendas.',
  slug: 'como-alinhar-marketing-e-vendas',
  category: 'Marketing',
  date: '2024-05-15',
  readTimeMinutes: '6',
  author: 'Agência Evidence',
  coverImage: '',
  bannerImage: '',
  tags: [],
  seoTitle: 'Como alinhar marketing e vendas para gerar mais resultado',
  seoDescription: 'Guia prático para alinhar marketing e vendas, reduzir CAC e aumentar conversões.',
  relatedTitle: '5 ações para aumentar a qualidade dos leads',
  ctaTitle: 'Quer resultados como esses na sua empresa?',
  ctaText: 'Fale com um especialista da Evidence e descubra como alinhar marketing e vendas no seu negócio.',
  ctaButton: 'Falar com especialista',
  ctaHref: 'https://wa.me/5500000000000',
  blocks: [
    {
      id: 'block-1',
      type: 'text',
      text: 'A falta de alinhamento entre marketing e vendas é um dos principais motivos pelos quais empresas deixam dinheiro na mesa. Quando os dois times trabalham em silos, leads qualificados se perdem, o ciclo de venda se alonga e o CAC sobe sem controle.',
      style: { ...defaultBlockStyle, fontSize: '18px' },
    },
  ],
}

function normalizeDraft(value: Partial<BlogDraft> & Record<string, unknown>): BlogDraft {
  const legacyTags = value.tags
  let tags = Array.isArray(legacyTags)
    ? legacyTags.map(String)
    : typeof legacyTags === 'string'
      ? legacyTags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : initialDraft.tags
  if (tags.length === legacyPreselectedTags.length && tags.every((tag, index) => tag === legacyPreselectedTags[index])) {
    tags = []
  }
  const coverImage = value.coverImage === '/peoples/men1.jpg' ? '' : String(value.coverImage ?? initialDraft.coverImage)
  const bannerImage = value.bannerImage === '/mesa.webp' ? '' : String(value.bannerImage ?? initialDraft.bannerImage)
  const readTime = String(value.readTimeMinutes ?? value.readTime ?? initialDraft.readTimeMinutes).replace(/[^0-9]/g, '') || initialDraft.readTimeMinutes
  const date = typeof value.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) ? value.date : initialDraft.date
  const supportedBlocks = Array.isArray(value.blocks)
    ? (value.blocks as BlogContentBlock[])
      .filter((block) => ['text', 'quote', 'topics', 'list'].includes(block.type))
      .map((block) => (block.type === 'list' && !block.heading && !block.subtitle ? { ...block, type: 'topics' as BlogBlockType } : block))
    : []

  return {
    ...initialDraft,
    ...value,
    id: String(value.id ?? makeId()),
    subtitle: String(value.subtitle ?? value.excerpt ?? initialDraft.subtitle),
    category: categories.includes(String(value.category)) ? String(value.category) : initialDraft.category,
    date,
    readTimeMinutes: readTime,
    coverImage,
    bannerImage,
    tags,
    blocks: supportedBlocks.length ? supportedBlocks : initialDraft.blocks,
  }
}

function draftToNoticiaInput(draft: BlogDraft): NoticiaInput {
  return {
    slug: draft.slug,
    categoria: draft.category,
    titulo: draft.title,
    descricao: draft.subtitle,
    materia: serializeBlogBlocks(draft.blocks),
    publicado: true,
    imagemCapa: draft.coverImage,
    imagemBanner: draft.bannerImage || draft.coverImage,
    imagemBannerMobile: draft.bannerImage || draft.coverImage,
    tempoLeitura: toReadTimeLabel(draft.readTimeMinutes),
  }
}

function noticiaToDraft(noticia: Noticia): BlogDraft {
  const blocks = parseBlogBlocks(noticia.materia || noticia.descricao)
  return normalizeDraft({
    id: noticia.id,
    title: noticia.titulo,
    subtitle: noticia.descricao,
    slug: noticia.slug || noticia.id,
    category: noticia.categoria,
    date: noticia.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    readTimeMinutes: noticia.tempoLeitura?.replace(/[^0-9]/g, '') || initialDraft.readTimeMinutes,
    coverImage: noticia.imagemCapa,
    bannerImage: noticia.imagemBanner || noticia.imagemCapa,
    blocks: blocks.length ? blocks : [{ ...createBlock('text'), id: `${noticia.id}-content`, text: noticia.descricao }],
  })
}

function isPersistedDraft(draft: BlogDraft) {
  return !draft.id.startsWith('blog-')
}

function createBlock(type: BlogBlockType): BlogContentBlock {
  if (type === 'quote') return { id: makeId(), type, text: '', author: '', style: { ...defaultBlockStyle, fontSize: '18px', color: '#18181b', fontWeight: '600' } }
  if (type === 'topics') return { id: makeId(), type, text: '', heading: '', subtitle: '', items: [{ title: '', text: '' }], style: { ...defaultBlockStyle } }
  if (type === 'list') return { id: makeId(), type, text: '', heading: '', subtitle: '', items: [{ text: '' }], style: { ...defaultBlockStyle } }
  return { id: makeId(), type, text: '', style: { ...defaultBlockStyle } }
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] leading-relaxed text-[#6b7280]">{hint}</span>}
    </label>
  )
}

function ImagePreview({ src, label, recommendedSize }: { src: string; label: string; recommendedSize: string }) {
  if (src) {
    return <img src={resolveImageUrl(src)} alt={label} className="h-[210px] w-full object-cover" />
  }

  return (
    <div className="grid h-[210px] place-items-center bg-[#f8fafc] px-6 text-center text-[#6b7280]">
      <div>
        <ImageIcon className="mx-auto h-8 w-8 text-[#c8d2df]" />
        <p className="mt-3 text-[13px] font-bold text-[#111318]">Nenhuma imagem selecionada</p>
        <p className="mt-1 text-[12px]">Tamanho recomendado: {recommendedSize}</p>
      </div>
    </div>
  )
}

function CustomDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} className="admin-input flex items-center justify-between text-left">
        <span>{value}</span><ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[#dfe3ea] bg-white p-1 shadow-xl">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => { onChange(category); setOpen(false) }} className={`block w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition-colors ${value === category ? 'bg-[#fff1f3] text-[#eb001a]' : 'text-[#2f3540] hover:bg-[#f5f6f8]'}`}>
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function WeightDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const options = [
    { value: '400', label: 'Normal' },
    { value: '500', label: 'Médio' },
    { value: '600', label: 'Semibold' },
    { value: '700', label: 'Bold' },
  ]

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} className="inline-flex h-8 min-w-[104px] cursor-pointer items-center justify-between gap-2 rounded-lg border border-[#dce6f2] bg-white px-2.5 text-[12px] font-bold text-[#1f2a3d] transition hover:border-[#eb001a] hover:text-[#eb001a]">
        {options.find((option) => option.value === value)?.label ?? value}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[140px] overflow-hidden rounded-xl border border-[#dfe3ea] bg-white p-1 shadow-xl">
          {options.map((option) => (
            <button key={option.value} type="button" onClick={() => { onChange(option.value); setOpen(false) }} className={`block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-[12px] font-bold transition ${option.value === value ? 'bg-[#fff1f3] text-[#eb001a]' : 'text-[#2f3540] hover:bg-[#f5f6f8]'}`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('')
  const addTags = (raw: string) => {
    const next = raw.split(',').map((tag) => tag.trim()).filter(Boolean)
    if (!next.length) return
    onChange(Array.from(new Set([...value, ...next])))
    setInput('')
  }

  return (
    <div className="min-h-11 rounded-lg border border-[#dfe3ea] bg-white px-2 py-2 focus-within:border-[#eb001a] focus-within:shadow-[0_0_0_2px_rgba(235,0,26,0.1)]">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#fff1f3] px-3 py-1 text-[12px] font-bold text-[#eb001a]">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((current) => current !== tag))} className="text-[#eb001a]/70 hover:text-[#eb001a]">×</button>
          </span>
        ))}
        <input
          className="min-w-[180px] flex-1 border-0 bg-transparent px-1 py-1 text-[14px] outline-none"
          value={input}
          onChange={(event) => {
            const next = event.target.value
            next.includes(',') ? addTags(next) : setInput(next)
          }}
          onBlur={() => addTags(input)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              addTags(input)
            }
          }}
          placeholder="Digite uma tag e use vírgula"
        />
      </div>
    </div>
  )
}

const blockMeta: Record<BlogBlockType, { label: string; description: string; icon: React.ReactNode; tone: string }> = {
  text: { label: 'Texto', description: 'Parágrafo de conteúdo com editor avançado', icon: <FileText className="h-5 w-5" />, tone: 'text-slate-700 bg-slate-100' },
  quote: { label: 'Citação', description: 'Destaque de frase e fonte no padrão do site', icon: <Quote className="h-5 w-5" />, tone: 'text-red-700 bg-red-50' },
  topics: { label: 'Tópicos', description: 'Bloco com título, subtítulo e itens numerados', icon: <ListOrdered className="h-5 w-5" />, tone: 'text-red-700 bg-red-50' },
  list: { label: 'Lista', description: 'Lista simples com título, subtítulo e marcadores', icon: <List className="h-5 w-5" />, tone: 'text-red-700 bg-red-50' },
}

export default function BlogCreatorPage() {
  const [draft, setDraft] = useState<BlogDraft>(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      return saved ? normalizeDraft(JSON.parse(saved)) : initialDraft
    } catch {
      return initialDraft
    }
  })
  const [articles, setArticles] = useState<BlogDraft[]>([])
  const [mode, setMode] = useState<'home' | 'editor'>('home')
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null)
  const [activeEditorState, setActiveEditorState] = useState<Record<string, ActiveEditorState>>({})
  const [fontInputValues, setFontInputValues] = useState<Record<string, string>>({})
  const [articleToDelete, setArticleToDelete] = useState<BlogDraft | null>(null)
  const [loadingArticles, setLoadingArticles] = useState(false)
  const [savingArticle, setSavingArticle] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const editorRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const editorSelections = useRef<Record<string, Range | null>>({})

  useEffect(() => {
    let cancelled = false
    setLoadingArticles(true)
    noticiasService.getAll()
      .then((items) => {
        if (cancelled) return
        const apiArticles = items.map(noticiaToDraft)
        setArticles(apiArticles)
        setStatusMessage('')
      })
      .catch(() => {
        if (!cancelled) setStatusMessage('Não foi possível carregar os blogs da API agora.')
      })
      .finally(() => {
        if (!cancelled) setLoadingArticles(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateDraft = <K extends keyof BlogDraft>(field: K, value: BlogDraft[K]) => setDraft((current) => ({ ...current, [field]: value }))
  const updateBlock = (blockId: string, updater: (block: BlogContentBlock) => BlogContentBlock) => setDraft((current) => ({ ...current, blocks: current.blocks.map((block) => (block.id === blockId ? updater(block) : block)) }))

  const saveArticle = async () => {
    const nextDraft = { ...draft, subtitle: draft.subtitle.trim(), readTimeMinutes: String(Number(draft.readTimeMinutes) || 1) }
    const persistedDraft = isPersistedDraft(nextDraft)
    setSavingArticle(true)
    setStatusMessage('')
    try {
      const saved = persistedDraft
        ? await noticiasService.update(nextDraft.id, draftToNoticiaInput(nextDraft))
        : await noticiasService.create(draftToNoticiaInput(nextDraft))
      const savedDraft = noticiaToDraft(saved)
      const nextArticles = [savedDraft, ...articles.filter((article) => article.id !== savedDraft.id && article.id !== nextDraft.id)]
      setDraft(savedDraft)
      setArticles(nextArticles)
      localStorage.setItem(draftKey, JSON.stringify(savedDraft))
      toast.success(persistedDraft ? 'Artigo atualizado com sucesso!' : 'Artigo criado com sucesso!')
      setMode('home')
    } catch {
      setStatusMessage('Não foi possível salvar o artigo na API.')
    } finally {
      setSavingArticle(false)
    }
  }

  const deleteArticle = async (article: BlogDraft) => {
    setStatusMessage('')
    try {
      if (isPersistedDraft(article)) await noticiasService.delete(article.id)
      const nextArticles = articles.filter((current) => current.id !== article.id)
      setArticles(nextArticles)
      setArticleToDelete(null)
      toast.success('Artigo removido com sucesso!')

      if (draft.id === article.id) {
        const nextDraft = nextArticles[0] ?? { ...initialDraft, id: makeId(), title: '', subtitle: '', slug: '', date: new Date().toISOString().slice(0, 10), blocks: [createBlock('text')] }
        setDraft(nextDraft)
        localStorage.setItem(draftKey, JSON.stringify(nextDraft))
      }
    } catch {
      setStatusMessage('Não foi possível remover o artigo na API.')
    }
  }

  const startNewArticle = () => {
    const next = { ...initialDraft, id: makeId(), title: '', subtitle: '', slug: '', date: new Date().toISOString().slice(0, 10), blocks: [createBlock('text')] }
    setDraft(next)
    setMode('editor')
  }

  const imageUpload = (field: 'coverImage' | 'bannerImage') => async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setStatusMessage('')
    try {
      const uploaded = await uploadService.uploadImage(file, 'blogs')
      updateDraft(field, uploaded.url)
    } catch {
      setStatusMessage('Não foi possível enviar a imagem para a API.')
    } finally {
      event.target.value = ''
    }
  }

  const addBlock = (type: BlogBlockType) => setDraft((current) => ({ ...current, blocks: [...current.blocks, createBlock(type)] }))
  const removeBlock = (blockId: string) => setDraft((current) => {
    const nextBlocks = current.blocks.filter((block) => block.id !== blockId)
    return { ...current, blocks: nextBlocks.length ? nextBlocks : [createBlock('text')] }
  })
  const removeBlockItem = (blockId: string, itemIndex: number, fallback: { title?: string; text: string }) => updateBlock(blockId, (current) => {
    const nextItems = (current.items ?? []).filter((_, entryIndex) => entryIndex !== itemIndex)
    return { ...current, items: nextItems.length ? nextItems : [fallback] }
  })

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= draft.blocks.length) return
    setDraft((current) => {
      const next = [...current.blocks]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return { ...current, blocks: next }
    })
  }

  const onBlockDrop = (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault()
    const sourceId = event.dataTransfer.getData('text/plain') || draggingBlockId
    const sourceIndex = draft.blocks.findIndex((block) => block.id === sourceId)
    if (sourceIndex >= 0) moveBlock(sourceIndex, targetIndex)
    setDraggingBlockId(null)
  }

  const getSelectionElement = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    const selection = window.getSelection()
    if (!editor || !selection?.rangeCount) return null
    const range = selection.getRangeAt(0)
    const node = range.commonAncestorContainer === editor ? range.startContainer : range.commonAncestorContainer
    const element = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement
    if (!element || !editor.contains(element)) return null
    return element === editor ? null : element
  }

  const getStyleTarget = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    const selectionElement = getSelectionElement(blockId)
    if (!editor) return null
    return selectionElement?.closest('h2, h3, p, div, span, li, strong, b, em, i') as HTMLElement | null
  }

  const getCurrentLineTarget = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    const selectionElement = getSelectionElement(blockId)
    if (!editor) return null
    const blockTarget = selectionElement?.closest('h2, h3, p, div, li') as HTMLElement | null
    if (blockTarget && blockTarget !== editor && editor.contains(blockTarget)) return blockTarget
    return selectionElement as HTMLElement | null
  }

  const readActiveEditorState = (blockId: string): ActiveEditorState => {
    const target = getStyleTarget(blockId)
    if (!target) return defaultActiveEditorState
    const computed = window.getComputedStyle(target)
    const tag = target.tagName.toLowerCase()
    const boldWeight = Number.parseInt(computed.fontWeight, 10)
    const align = (computed.textAlign === 'center' || computed.textAlign === 'right' ? computed.textAlign : 'left') as TextAlign
    const titleTarget = target.closest('h2')
    const fontSizeTarget = target.closest('[style*="font-size"]') as HTMLElement | null
    const fontWeightTarget = target.closest('[style*="font-weight"]') as HTMLElement | null
    const letterTarget = target.closest('[style*="letter-spacing"]') as HTMLElement | null
    const lineTarget = target.closest('[style*="line-height"]') as HTMLElement | null
    return {
      title: Boolean(titleTarget),
      bold: !titleTarget && (tag === 'strong' || tag === 'b' || Number.isFinite(boldWeight) && boldWeight >= 600),
      italic: tag === 'em' || tag === 'i' || computed.fontStyle === 'italic',
      list: Boolean(target.closest('ul, ol, li')),
      align,
      fontSize: fontSizeTarget?.style.fontSize || target.style.fontSize || computed.fontSize || defaultBlockStyle.fontSize,
      fontWeight: fontWeightTarget?.style.fontWeight || target.style.fontWeight || (Number.isFinite(boldWeight) ? String(boldWeight) : defaultBlockStyle.fontWeight),
      letterSpacing: letterTarget?.style.letterSpacing || target.style.letterSpacing || (computed.letterSpacing === 'normal' ? '0px' : computed.letterSpacing),
      lineHeight: lineTarget?.style.lineHeight || target.style.lineHeight || defaultBlockStyle.lineHeight,
    }
  }

  const refreshActiveEditorState = (blockId: string) => {
    setActiveEditorState((current) => ({ ...current, [blockId]: readActiveEditorState(blockId) }))
  }

  const toolbarButtonClass = (active?: boolean) => `cursor-pointer rounded-md px-2 py-1 transition hover:bg-white hover:text-[#eb001a] ${active ? 'bg-white text-[#eb001a] shadow-sm ring-1 ring-[#ffd0d6]' : ''}`
  const numericCssValue = (value: string, fallback: number) => {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const normalizePxValue = (value: string, fallback = defaultBlockStyle.fontSize) => {
    const trimmed = value.trim()
    if (!trimmed) return fallback
    return /^-?\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed
  }

  const commitFontSize = (blockId: string, rawValue: string) => {
    const value = normalizePxValue(rawValue)
    setFontInputValues((current) => {
      const next = { ...current }
      delete next[blockId]
      return next
    })
    updateBlock(blockId, (current) => ({ ...current, style: { ...current.style, fontSize: value } }))
    applySelectionStyle(blockId, { fontSize: value }, '', 'span', true)
  }

  const placeCaretAtEnd = (element: HTMLElement) => {
    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  const toggleCurrentLineTitle = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    if (!editor) return
    editor.focus()
    restoreEditorSelection(blockId)
    const target = getCurrentLineTarget(blockId)
    if (!target) return

    const currentTitle = target.closest('h2') as HTMLElement | null
    const source = currentTitle ?? target
    const nextTag = currentTitle ? 'div' : 'h2'
    const replacement = document.createElement(nextTag)
    replacement.innerHTML = source.innerHTML || '<br>'

    if (currentTitle) {
      replacement.className = ''
      replacement.removeAttribute('style')
    } else {
      replacement.className = 'font-bold text-zinc-900'
      replacement.style.fontSize = '26px'
      replacement.style.fontWeight = '700'
      replacement.style.color = '#18181b'
      replacement.style.lineHeight = '1.25'
    }

    source.replaceWith(replacement)
    placeCaretAtEnd(replacement)
    editorSelections.current[blockId] = window.getSelection()?.rangeCount ? window.getSelection()!.getRangeAt(0).cloneRange() : null
    syncEditorHtml(blockId)
    refreshActiveEditorState(blockId)
  }

  const formatText = (blockId: string, command: string) => {
    const editor = editorRefs.current[blockId]
    if (!editor) return
    editor.focus()
    restoreEditorSelection(blockId)
    document.execCommand(command)
    const html = editor.innerHTML
    editor.dataset.empty = html.trim() ? 'false' : 'true'
    updateBlock(blockId, (block) => ({ ...block, text: html }))
    saveEditorSelection(blockId)
    refreshActiveEditorState(blockId)
  }

  const toggleCurrentLineList = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    if (!editor) return
    editor.focus()
    restoreEditorSelection(blockId)
    const target = getCurrentLineTarget(blockId)
    if (!target) return

    const currentItem = target.closest('li') as HTMLLIElement | null
    if (currentItem && editor.contains(currentItem)) {
      const list = currentItem.closest('ul, ol') as HTMLElement | null
      const replacement = document.createElement('div')
      replacement.innerHTML = currentItem.innerHTML || '<br>'
      if (list && list.children.length === 1) {
        list.replaceWith(replacement)
      } else {
        currentItem.replaceWith(replacement)
      }
      placeCaretAtEnd(replacement)
    } else {
      const source = target.closest('h2, h3, p, div') as HTMLElement | null
      const sourceNode = source && source !== editor ? source : target
      const list = document.createElement('ul')
      const item = document.createElement('li')
      item.innerHTML = sourceNode.innerHTML || '<br>'
      list.appendChild(item)
      sourceNode.replaceWith(list)
      placeCaretAtEnd(item)
    }

    editorSelections.current[blockId] = window.getSelection()?.rangeCount ? window.getSelection()!.getRangeAt(0).cloneRange() : null
    syncEditorHtml(blockId)
    refreshActiveEditorState(blockId)
  }

  const saveEditorSelection = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    const selection = window.getSelection()
    if (!editor || !selection?.rangeCount) return
    const range = selection.getRangeAt(0)
    if (editor.contains(range.commonAncestorContainer)) {
      editorSelections.current[blockId] = range.cloneRange()
      refreshActiveEditorState(blockId)
    }
  }

  const restoreEditorSelection = (blockId: string) => {
    const range = editorSelections.current[blockId]
    if (!range) return false
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    return true
  }

  const syncEditorHtml = (blockId: string) => {
    const editor = editorRefs.current[blockId]
    if (!editor) return
    editor.dataset.empty = editor.innerHTML.trim() ? 'false' : 'true'
    updateBlock(blockId, (current) => ({ ...current, text: editor.innerHTML }))
    saveEditorSelection(blockId)
    refreshActiveEditorState(blockId)
  }

  const applySelectionStyle = (blockId: string, style: Partial<CSSStyleDeclaration>, className = '', tagName = 'span', preferCurrentTarget = false) => {
    const editor = editorRefs.current[blockId]
    if (!editor) return
    editor.focus()
    restoreEditorSelection(blockId)
    const selection = window.getSelection()
    if (!selection?.rangeCount) return
    const range = selection.getRangeAt(0)
    if (!editor.contains(range.commonAncestorContainer)) return
    const currentTarget = getStyleTarget(blockId)
    const hasSelectedText = !range.collapsed && selection.toString().trim().length > 0
    if (range.collapsed || (preferCurrentTarget && currentTarget && !hasSelectedText)) {
      const target = currentTarget
      if (!target) return
      Object.entries(style).forEach(([key, value]) => {
        if (value) (target.style as unknown as Record<string, string>)[key] = String(value)
      })
      if (className) target.classList.add(...className.split(' ').filter(Boolean))
      editorSelections.current[blockId] = selection.rangeCount ? selection.getRangeAt(0).cloneRange() : editorSelections.current[blockId]
      syncEditorHtml(blockId)
      return
    }

    const wrapper = document.createElement(tagName)
    if (className) wrapper.className = className
    Object.entries(style).forEach(([key, value]) => {
      if (value) (wrapper.style as unknown as Record<string, string>)[key] = String(value)
    })
    wrapper.appendChild(range.extractContents())
    range.insertNode(wrapper)

    const nextRange = document.createRange()
    nextRange.selectNodeContents(wrapper)
    selection.removeAllRanges()
    selection.addRange(nextRange)
    editorSelections.current[blockId] = nextRange.cloneRange()
    syncEditorHtml(blockId)
    refreshActiveEditorState(blockId)
  }

  const homeCards = useMemo(() => articles, [articles])
  const tocItems = getBlogBlockTocItems(draft.blocks).map((title, titleIndex) => ({ id: `toc-${titleIndex}`, title }))

  if (mode === 'home') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#eb001a]">Conteúdos</p>
            <h1 className="mt-2 text-[28px] font-bold text-[#111318]">Blog</h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#5f6672]">Gerencie os artigos criados e inicie novos conteúdos para a home do blog.</p>
          </div>
          <button type="button" onClick={startNewArticle} className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-5 text-[13px] font-bold text-white transition-colors hover:bg-[#c90015]"><Plus className="h-4 w-4" /> Criar artigo</button>
        </div>

        {(loadingArticles || statusMessage) && (
          <div className="rounded-xl border border-[#ffd0d6] bg-[#fff7f8] px-4 py-3 text-[13px] font-bold text-[#eb001a]">
            {loadingArticles ? 'Carregando blogs da API...' : statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {homeCards.map((article) => (
            <article key={article.id} className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="overflow-hidden bg-white">
                <ImagePreview src={article.coverImage} label={`Imagem do artigo ${article.title}`} recommendedSize="800 x 450 px" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-[12px] font-bold uppercase tracking-widest text-red-600">{article.category}</span><span className="flex items-center gap-1 text-[12px] text-zinc-400"><Calendar className="h-3 w-3" />{article.date}</span></div>
                <h2 className="font-poppins text-[21px] font-bold leading-snug text-zinc-900">{article.title || 'Artigo sem título'}</h2>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-zinc-500">{article.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">{article.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-500">{tag}</span>)}</div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <button type="button" onClick={() => { setDraft(article); setMode('editor') }} className="w-full rounded-lg border border-[#dfe3ea] px-4 py-2.5 text-[13px] font-bold text-[#111318] transition hover:border-[#eb001a] hover:text-[#eb001a]">Editar artigo</button>
                  <button type="button" onClick={() => setArticleToDelete(article)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#ffd0d6] bg-[#fff1f3] px-4 py-2.5 text-[13px] font-bold text-[#eb001a] transition hover:border-[#eb001a] hover:bg-[#ffe1e6]"><Trash2 className="h-4 w-4" /> Apagar artigo</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loadingArticles && homeCards.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#dfe3ea] bg-white p-8 text-center">
            <p className="text-[15px] font-bold text-[#111318]">Nenhum artigo encontrado na API.</p>
            <p className="mt-2 text-[13px] text-[#5f6672]">Clique em “Criar artigo” para publicar o primeiro blog.</p>
          </div>
        )}

        {articleToDelete && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/45 px-4">
            <div className="w-full max-w-md rounded-2xl border border-[#ffd0d6] bg-white p-6 shadow-2xl">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1f3] text-[#eb001a]">
                <Trash2 className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-black text-[#111318]">Apagar artigo?</h2>
              <p className="mt-2 text-sm leading-6 text-[#5f6672]">
                Deseja realmente apagar o artigo "{articleToDelete.title || 'sem título'}"?
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setArticleToDelete(null)} className="h-11 rounded-lg border border-[#dfe3ea] px-4 text-sm font-bold text-[#111318] transition hover:border-[#aab3c2]">Cancelar</button>
                <button type="button" onClick={() => deleteArticle(articleToDelete)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-4 text-sm font-bold text-white transition hover:bg-[#c90015]"><Trash2 className="h-4 w-4" /> Apagar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#eb001a]">Conteúdos / Blog</p>
          <h1 className="mt-2 text-[28px] font-bold text-[#111318]">Criar artigo</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#5f6672]">Construa o artigo por blocos, reordene com drag and drop e confira o preview completo abaixo.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode('home')} className="h-11 rounded-lg border border-[#dfe3ea] px-5 text-[13px] font-bold text-[#111318] hover:border-[#eb001a] hover:text-[#eb001a]">Voltar</button>
          <button type="button" onClick={saveArticle} disabled={savingArticle} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#eb001a] px-5 text-[13px] font-bold text-white hover:bg-[#c90015] disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-4 w-4" /> {savingArticle ? 'Salvando...' : 'Salvar artigo'}</button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-xl border border-[#ffd0d6] bg-[#fff7f8] px-4 py-3 text-[13px] font-bold text-[#eb001a]">
          {statusMessage}
        </div>
      )}

      <section className="rounded-2xl border border-[#e7e9ee] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2"><FileText className="h-5 w-5 text-[#eb001a]" /><h2 className="text-[18px] font-bold text-[#111318]">Dados do artigo</h2></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="Título do artigo"><input className="admin-input" value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} /></Field>
          <Field label="Slug da URL"><input className="admin-input" value={draft.slug} onChange={(e) => updateDraft('slug', e.target.value)} /></Field>
          <Field label="Subtítulo"><textarea className="admin-textarea" value={draft.subtitle} onChange={(e) => updateDraft('subtitle', e.target.value)} /></Field>
          <Field label="Categoria exibida"><CustomDropdown value={draft.category} onChange={(value) => updateDraft('category', value)} /></Field>
          <Field label="Data"><input type="date" className="admin-input" value={draft.date} onChange={(e) => updateDraft('date', e.target.value)} /></Field>
          <Field label="Tempo de leitura"><div className="flex overflow-hidden rounded-lg border border-[#dfe3ea] bg-white focus-within:border-[#eb001a]"><input type="number" min="1" className="h-11 min-w-0 flex-1 border-0 px-3 text-[14px] outline-none" value={draft.readTimeMinutes} onChange={(e) => updateDraft('readTimeMinutes', e.target.value.replace(/[^0-9]/g, ''))} /><span className="flex items-center bg-[#f7f8fa] px-3 text-[13px] font-bold text-[#6b7280]">min de leitura</span></div></Field>
          <Field label="Autor"><input className="admin-input" value={draft.author} onChange={(e) => updateDraft('author', e.target.value)} /></Field>
          <Field label="Tags (Separado por vírgula)"><TagsInput value={draft.tags} onChange={(tags) => updateDraft('tags', tags)} /></Field>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e9ee] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2"><ImageIcon className="h-5 w-5 text-[#eb001a]" /><h2 className="text-[18px] font-bold text-[#111318]">Imagens do blog</h2></div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#dfe3ea] bg-[#fbfcfe] p-4">
            <div className="overflow-hidden rounded-xl border border-[#e7e9ee] bg-white">
              <ImagePreview src={draft.coverImage} label="Preview da imagem do card" recommendedSize="800 x 450 px" />
            </div>
            <div className="mt-4">
              <p className="text-[13px] font-bold text-[#111318]">Imagem do card / capa</p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#6b7280]">Usada nos cards da listagem do blog e na home. Recomendado: 800 x 450 px.</p>
              <label className="mt-3 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#111318] px-4 text-[12px] font-bold text-white transition hover:bg-black">
                Enviar imagem do card
                <input type="file" accept="image/*" className="hidden" onChange={imageUpload('coverImage')} />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe3ea] bg-[#fbfcfe] p-4">
            <div className="overflow-hidden rounded-xl border border-[#e7e9ee] bg-white">
              <ImagePreview src={draft.bannerImage} label="Preview da imagem de banner" recommendedSize="1600 x 700 px" />
            </div>
            <div className="mt-4">
              <p className="text-[13px] font-bold text-[#111318]">Imagem de banner</p>
              <p className="mt-1 text-[12px] leading-relaxed text-[#6b7280]">Usada no topo da página interna do artigo. Recomendado: 1600 x 700 px.</p>
              <label className="mt-3 inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#eb001a] px-4 text-[12px] font-bold text-white transition hover:bg-[#c90015]">
                Enviar imagem do banner
                <input type="file" accept="image/*" className="hidden" onChange={imageUpload('bannerImage')} />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#dce6f2] bg-white p-5 shadow-sm">
        <div className="rounded-2xl border border-[#dce6f2] bg-[#f8fbff] p-4">
          <h2 className="text-[16px] font-bold text-[#111318]">Construtor do artigo</h2>
          <p className="mt-1 text-[13px] text-[#48617f]">Adicione blocos e organize a ordem em que eles aparecem na página.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {(Object.keys(blockMeta) as BlogBlockType[]).map((type) => (
              <button key={type} type="button" onClick={() => addBlock(type)} className="flex min-h-[78px] items-center gap-3 rounded-lg border border-[#d9e2ee] bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-[#eb001a] hover:shadow-sm">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${blockMeta[type].tone}`}>{blockMeta[type].icon}</span>
                <span><strong className="block text-[14px] text-[#111318]">{blockMeta[type].label}</strong><small className="mt-1 block text-[12px] leading-snug text-[#526987]">{blockMeta[type].description}</small></span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-[15px] font-bold text-[#111318]">Blocos do artigo</h3>
          <p className="text-[13px] text-[#526987]">{draft.blocks.length} bloco(s) no artigo. Arraste pelo ícone lateral para reordenar.</p>
          <div className="mt-3 space-y-3">
            {draft.blocks.map((block, index) => (
              <div key={block.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => onBlockDrop(event, index)} className={`rounded-xl border bg-white p-3 shadow-sm transition ${draggingBlockId === block.id ? 'scale-[0.99] border-[#eb001a] opacity-70 shadow-lg' : 'border-[#dce6f2]'}`}>
                <div className="mb-3 flex items-center gap-3">
                  <button type="button" draggable onDragStart={(event) => { setDraggingBlockId(block.id); event.dataTransfer.setData('text/plain', block.id); event.dataTransfer.effectAllowed = 'move' }} onDragEnd={() => setDraggingBlockId(null)} className="grid h-8 w-8 cursor-grab place-items-center rounded-lg text-[#c8d2df] transition hover:bg-[#f3f6fa] hover:text-[#526987] active:cursor-grabbing" title="Arrastar bloco" aria-label="Arrastar bloco"><GripVertical className="h-5 w-5" /></button>
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${blockMeta[block.type].tone}`}>{blockMeta[block.type].icon}</span>
                  <div className="min-w-0 flex-1"><strong className="text-[13px] uppercase text-[#111318]">{index + 1}. {blockMeta[block.type].label}</strong><p className="truncate text-[12px] text-[#526987]">{blockMeta[block.type].description}</p></div>
                  <button type="button" onClick={() => moveBlock(index, index - 1)} disabled={index === 0} className="h-9 w-9 cursor-pointer rounded-lg border border-[#dce6f2] text-[#526987] transition hover:border-[#eb001a] hover:text-[#eb001a] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#dce6f2] disabled:hover:text-[#526987]">↑</button>
                  <button type="button" onClick={() => moveBlock(index, index + 1)} disabled={index === draft.blocks.length - 1} className="h-9 w-9 cursor-pointer rounded-lg border border-[#dce6f2] text-[#526987] transition hover:border-[#eb001a] hover:text-[#eb001a] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[#dce6f2] disabled:hover:text-[#526987]">↓</button>
                  <button type="button" onClick={() => removeBlock(block.id)} className="h-9 w-9 cursor-pointer rounded-lg bg-[#fff1f3] text-[#eb001a] transition hover:bg-[#ffe1e6] hover:shadow-sm">×</button>
                </div>


                {block.type === 'text' && (
                  <>
                    <div className="mt-3 overflow-visible rounded-lg border border-[#dce6f2] bg-white">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#edf1f6] bg-[#f8fafc] px-4 py-3 text-[13px] font-bold text-[#2f4054]">
                        <button type="button" className={toolbarButtonClass(activeEditorState[block.id]?.title)} onMouseDown={(event) => event.preventDefault()} onClick={() => toggleCurrentLineTitle(block.id)}>H2 Título</button>
                        <button type="button" className={toolbarButtonClass(activeEditorState[block.id]?.bold)} onMouseDown={(event) => event.preventDefault()} onClick={() => formatText(block.id, 'bold')}>B Negrito</button>
                        <button type="button" className={toolbarButtonClass(activeEditorState[block.id]?.italic)} onMouseDown={(event) => event.preventDefault()} onClick={() => formatText(block.id, 'italic')}><Italic className="inline h-4 w-4" /> Itálico</button>
                        <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-3">
                          <label className="flex items-center gap-2 text-[12px]">Fonte <input type="number" min="10" max="80" className="h-8 w-[70px] rounded-lg border border-[#dce6f2] bg-white px-2" value={fontInputValues[block.id] ?? String(numericCssValue(activeEditorState[block.id]?.fontSize ?? block.style.fontSize, 17))} onFocus={(event) => { const value = event.currentTarget.value; setFontInputValues((current) => ({ ...current, [block.id]: value })) }} onChange={(event) => { const value = event.currentTarget.value; setFontInputValues((current) => ({ ...current, [block.id]: value })) }} onBlur={(event) => { const value = event.currentTarget.value; commitFontSize(block.id, value) }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); const value = event.currentTarget.value; commitFontSize(block.id, value) } }} /></label>
                          <label className="flex items-center gap-2 text-[12px]">Peso <WeightDropdown value={activeEditorState[block.id]?.fontWeight ?? block.style.fontWeight} onChange={(value) => { updateBlock(block.id, (current) => ({ ...current, style: { ...current.style, fontWeight: value } })); applySelectionStyle(block.id, { fontWeight: value }, '', 'span', true) }} /></label>
                          <label className="flex min-w-[210px] items-center gap-3 text-[12px]"><span className="whitespace-nowrap">Letras</span><input type="range" min="-2" max="10" step="0.5" className="admin-range" value={numericCssValue(activeEditorState[block.id]?.letterSpacing ?? block.style.letterSpacing, 0)} onChange={(e) => { const value = `${e.target.value}px`; updateBlock(block.id, (current) => ({ ...current, style: { ...current.style, letterSpacing: value } })); applySelectionStyle(block.id, { letterSpacing: value }, '', 'span', true) }} /><strong className="w-10 text-right text-[#111318]">{activeEditorState[block.id]?.letterSpacing ?? block.style.letterSpacing}</strong></label>
                          <label className="flex min-w-[210px] items-center gap-3 text-[12px]"><span className="whitespace-nowrap">Linhas</span><input type="range" min="1" max="3" step="0.05" className="admin-range" value={numericCssValue(activeEditorState[block.id]?.lineHeight ?? block.style.lineHeight, 1.75)} onChange={(e) => { updateBlock(block.id, (current) => ({ ...current, style: { ...current.style, lineHeight: e.target.value } })); applySelectionStyle(block.id, { lineHeight: e.target.value }, '', 'span', true) }} /><strong className="w-10 text-right text-[#111318]">{activeEditorState[block.id]?.lineHeight ?? block.style.lineHeight}</strong></label>
                        </div>
                      </div>
                      <div
                        ref={(element) => {
                          editorRefs.current[block.id] = element
                          if (element && element.dataset.loadedFor !== block.id) {
                            element.innerHTML = block.text
                            element.dataset.loadedFor = block.id
                            element.dataset.empty = block.text ? 'false' : 'true'
                          }
                        }}
                        contentEditable
                        suppressContentEditableWarning
                        data-placeholder="Escreva o texto do bloco. Use a barra acima para formatar."
                        data-empty={block.text ? 'false' : 'true'}
                        onInput={(event) => {
                          const html = event.currentTarget.innerHTML
                          event.currentTarget.dataset.empty = html.trim() ? 'false' : 'true'
                          updateBlock(block.id, (current) => ({ ...current, text: html }))
                          saveEditorSelection(block.id)
                        }}
                        onMouseUp={() => saveEditorSelection(block.id)}
                        onKeyUp={() => saveEditorSelection(block.id)}
                        onBlur={() => saveEditorSelection(block.id)}
                        className="blog-rich-editor min-h-[170px] px-4 py-4 text-[15px] leading-7 text-[#516078] outline-none"
                      />
                    </div>
                  </>
                )}

                {block.type === 'quote' && (
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Field label="Texto da citação">
                      <textarea className="admin-textarea" value={block.text} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, text: e.target.value }))} />
                    </Field>
                    <Field label="Fonte/autor">
                      <input className="admin-input" placeholder="Fonte da citação" value={block.author ?? ''} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, author: e.target.value }))} />
                    </Field>
                  </div>
                )}

                {block.type === 'topics' && (
                  <div className="mt-3 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Título dos tópicos"><input className="admin-input" placeholder="Ex.: Os 3 pilares do alinhamento" value={block.heading ?? ''} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, heading: e.target.value }))} /></Field>
                      <Field label="Subtítulo dos tópicos"><textarea className="admin-textarea" placeholder="Texto introdutório exibido antes dos tópicos" value={block.subtitle ?? ''} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, subtitle: e.target.value }))} /></Field>
                    </div>
                    <div className="space-y-3">
                      {block.items?.map((item, itemIndex) => <div key={itemIndex} className="grid gap-2 rounded-lg border border-[#e7e9ee] bg-[#fbfcfe] p-3 md:grid-cols-[220px_minmax(0,1fr)_44px]"><input className="admin-input" placeholder="Título do tópico" value={item.title ?? ''} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, items: current.items?.map((entry, entryIndex) => entryIndex === itemIndex ? { ...entry, title: e.target.value } : entry) }))} /><textarea className="admin-textarea" placeholder="Descrição do tópico" value={item.text} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, items: current.items?.map((entry, entryIndex) => entryIndex === itemIndex ? { ...entry, text: e.target.value } : entry) }))} /><button type="button" onClick={() => removeBlockItem(block.id, itemIndex, { title: '', text: '' })} className="h-11 w-11 cursor-pointer rounded-lg bg-[#fff1f3] text-[#eb001a] transition hover:bg-[#ffe1e6]" title="Excluir tópico">×</button></div>)}
                    </div>
                    <button type="button" onClick={() => updateBlock(block.id, (current) => ({ ...current, items: [...(current.items ?? []), { title: '', text: '' }] }))} className="admin-action"><Plus className="h-4 w-4" /> Adicionar tópico</button>
                  </div>
                )}

                {block.type === 'list' && (
                  <div className="mt-3 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Título da lista"><input className="admin-input" placeholder="Ex.: Ferramentas que facilitam a integração" value={block.heading ?? ''} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, heading: e.target.value }))} /></Field>
                      <Field label="Subtítulo da lista"><textarea className="admin-textarea" placeholder="Texto introdutório exibido antes dos itens" value={block.subtitle ?? ''} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, subtitle: e.target.value }))} /></Field>
                    </div>
                    <div className="space-y-2">
                      {block.items?.map((item, itemIndex) => <div key={itemIndex} className="grid gap-2 rounded-lg border border-[#e7e9ee] bg-[#fbfcfe] p-3 md:grid-cols-[minmax(0,1fr)_44px]"><textarea className="admin-textarea" placeholder="Item da lista" value={item.text} onChange={(e) => updateBlock(block.id, (current) => ({ ...current, items: current.items?.map((entry, entryIndex) => entryIndex === itemIndex ? { ...entry, text: e.target.value } : entry) }))} /><button type="button" onClick={() => removeBlockItem(block.id, itemIndex, { text: '' })} className="h-11 w-11 cursor-pointer rounded-lg bg-[#fff1f3] text-[#eb001a] transition hover:bg-[#ffe1e6]" title="Excluir item">×</button></div>)}
                    </div>
                    <button type="button" onClick={() => updateBlock(block.id, (current) => ({ ...current, items: [...(current.items ?? []), { text: '' }] }))} className="admin-action"><Plus className="h-4 w-4" /> Adicionar item</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e7e9ee] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[18px] font-bold text-[#111318]">SEO e CTA do artigo</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Field label="SEO title"><input className="admin-input" value={draft.seoTitle} onChange={(e) => updateDraft('seoTitle', e.target.value)} /></Field>
          <Field label="Meta description"><textarea className="admin-textarea" value={draft.seoDescription} onChange={(e) => updateDraft('seoDescription', e.target.value)} /></Field>
          <Field label="Título do CTA"><input className="admin-input" value={draft.ctaTitle} onChange={(e) => updateDraft('ctaTitle', e.target.value)} /></Field>
          <Field label="Texto do CTA"><textarea className="admin-textarea" value={draft.ctaText} onChange={(e) => updateDraft('ctaText', e.target.value)} /></Field>
          <Field label="Botão CTA"><input className="admin-input" value={draft.ctaButton} onChange={(e) => updateDraft('ctaButton', e.target.value)} /></Field>
          <Field label="Link CTA"><input className="admin-input" value={draft.ctaHref} onChange={(e) => updateDraft('ctaHref', e.target.value)} /></Field>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm">
        <div className="border-b border-[#eef0f3] px-6 py-4"><h2 className="text-[18px] font-bold text-[#111318]">Preview do artigo</h2><p className="text-[13px] text-[#6b7280]">Mesmo HTML estrutural da página pública, limitado ao container do admin.</p></div>
        <div className="bg-white">
          <section className="border-b border-zinc-100 bg-white" style={{ paddingTop: '40px' }}>
            <div className="mx-auto max-w-368 px-4 sm:px-6 lg:px-8">
              <nav className="mb-8 flex items-center gap-2 text-[13px]"><span className="text-zinc-400">Home</span><span className="text-zinc-300">/</span><span className="text-zinc-400">Blog</span><span className="text-zinc-300">/</span><span className="truncate text-zinc-600">{draft.category}</span></nav>
              <span className="mb-4 inline-block rounded bg-red-50 px-2.5 py-1 text-[12px] font-bold uppercase tracking-widest text-red-600">{draft.category}</span>
              <h1 className="font-poppins max-w-[860px] text-zinc-900" style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', lineHeight: '1.15', fontWeight: 700, marginBottom: '20px' }}>{draft.title || 'Título do artigo'}</h1>
              <p className="max-w-[760px] text-zinc-500" style={{ fontSize: '18px', lineHeight: '1.65', marginBottom: '32px' }}>{draft.subtitle || 'Subtítulo do artigo e resumo usado no card.'}</p>
              <div className="flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 text-[13px] text-zinc-400 sm:flex-row sm:items-center"><div className="flex items-center gap-4"><span>{draft.date}</span><span className="hidden h-1 w-1 rounded-full bg-zinc-300 sm:block" /><span>{toReadTimeLabel(draft.readTimeMinutes)}</span></div></div>
            </div>
          </section>
          <div className="mx-auto max-w-368 px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px' }}>
            <div className="overflow-hidden rounded-xl border border-[#e7e9ee] bg-white">
              {draft.bannerImage || draft.coverImage ? (
                <img src={resolveImageUrl(draft.bannerImage || draft.coverImage)} alt={draft.title} className="w-full object-cover" style={{ height: 'clamp(220px, 40vw, 480px)', display: 'block' }} />
              ) : (
                <div className="grid place-items-center bg-[#f8fafc] px-6 text-center text-[#6b7280]" style={{ height: 'clamp(220px, 40vw, 480px)' }}>
                  <div>
                    <ImageIcon className="mx-auto h-10 w-10 text-[#c8d2df]" />
                    <p className="mt-3 text-[14px] font-bold text-[#111318]">Nenhuma imagem de banner selecionada</p>
                    <p className="mt-1 text-[12px]">Tamanho recomendado: 1600 x 700 px.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mx-auto max-w-368 px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
              <article className="blog-preview-content min-w-0 flex-1">
                <BlogBlocksContent blocks={draft.blocks} fallback={draft.subtitle} />
                <div className="mt-10 flex flex-wrap gap-2 border-t border-zinc-100 pt-8">{draft.tags.map((tag) => <span key={tag} className="cursor-pointer rounded border border-zinc-200 px-3 py-1.5 text-[13px] text-zinc-500 transition-colors hover:border-zinc-400">{tag}</span>)}</div>
              </article>
              <aside className="hidden w-[300px] shrink-0 lg:block"><div className="sticky top-4"><div className="mb-7 rounded-[10px] border border-black/5 bg-[#f9f9f9] p-6"><p className="font-poppins mb-4 text-[14px] font-bold uppercase tracking-wide text-zinc-800">Neste artigo</p>{tocItems.length ? <ul className="space-y-2 text-[14px] text-zinc-500">{tocItems.map((item) => <li key={item.id} className="border-b border-black/5 pb-2 last:border-0"><span className="mr-2 text-red-600">▸</span>{item.title}</li>)}</ul> : <p className="text-[13px] leading-relaxed text-zinc-400">Adicione títulos nos blocos para montar o índice.</p>}</div><div className="rounded-[10px] bg-[#dc2626] p-6"><p className="font-poppins text-[16px] font-bold leading-[1.4] text-white">{draft.ctaTitle || 'Título do CTA'}</p><p className="mt-3 text-[13px] leading-[1.6] text-white/85">{draft.ctaText || 'Texto do CTA'}</p><a href={draft.ctaHref || '#'} target="_blank" rel="noopener noreferrer" className="mt-5 block rounded-[5px] bg-white px-5 py-3 text-center text-[14px] font-semibold text-red-600 transition hover:bg-zinc-100">{draft.ctaButton || 'Botão CTA'}</a></div></div></aside>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
