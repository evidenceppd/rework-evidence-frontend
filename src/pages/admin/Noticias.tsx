import { useState, useRef, useEffect } from 'react'
import {
  Plus, Pencil, Trash2, AlertTriangle, ArrowLeft, ImageIcon, Upload,
  X, Newspaper, Tag, Calendar, Clock, LayoutGrid, FileText,
} from 'lucide-react'
import { noticiasService, NoticiaInput } from '../../services/noticias.service'
import { uploadService } from '../../services/upload.service'
import { resolveImageUrl } from '../../services/api'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface Noticia {
  id: string
  categoria: string
  titulo: string
  descricao: string
  materia: string
  imagemCapa: string
  imagemBanner: string
  imagemBannerMobile: string
  publicado: boolean
  createdAt: string
}

// -- Image Upload Widget ------------------------------------------------------

interface ImageUploadProps {
  label: string
  hint: string
  value: string
  fileRef: React.RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  aspectClass?: string
}

function ImageUpload({ label, hint, value, fileRef, onChange, onClear, aspectClass = 'aspect-[4/3]' }: ImageUploadProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input ref={fileRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
      {value ? (
        <div className={`relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 ${aspectClass}`}>
          <img src={resolveImageUrl(value)} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-xs font-medium text-gray-700 cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Upload size={13} />
              Trocar
            </button>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition-colors"
            title="Remover imagem"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#eb001a] bg-gray-50 dark:bg-gray-800/50 hover:bg-[#eb001a]/5 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group"
        >
          <div className="p-3 rounded-full bg-gray-100 group-hover:bg-[#eb001a]/10 transition-colors">
            <ImageIcon size={22} className="text-gray-400 group-hover:text-[#eb001a] transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 group-hover:text-[#eb001a] transition-colors">Clique para enviar uma imagem</p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG ou WEBP</p>
          </div>
        </button>
      )}
      <p className="text-xs text-gray-400 mt-2">{hint}</p>
    </div>
  )
}

// -- Card Preview --------------------------------------------------------------

interface CardPreviewProps {
  titulo: string
  descricao: string
  imagemCapa: string
  createdAt: string
}

function CardPreview({ titulo, descricao, imagemCapa, createdAt }: CardPreviewProps) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <div className="max-w-[260px] mx-auto">
      <div className="rounded-[2rem] overflow-hidden shadow-md bg-white h-full">
        <div className="overflow-hidden">
          {imagemCapa ? (
            <img
              src={resolveImageUrl(imagemCapa)}
              alt={titulo || ''}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
              <Newspaper size={40} className="text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-[#eb001a] text-sm mb-1">{formatDate(createdAt) || 'Data de publicação'}</p>
          <h2 className="text-[#3B2F1E] font-bold text-lg leading-snug break-words">
            {titulo || 'Título do post'}
          </h2>
          <p className="text-[#555] text-sm mt-1 leading-relaxed break-words line-clamp-3">
            {descricao || 'Resumo do artigo...'}
          </p>
          <span className="inline-block mt-4 text-[#eb001a] text-sm font-semibold">Leia mais ?</span>
        </div>
      </div>
    </div>
  )
}

// -- Header Preview ------------------------------------------------------------

interface HeaderPreviewProps {
  titulo: string
  descricao: string
  imagemBanner: string
  imagemBannerMobile: string
  createdAt: string
  tempoLeitura: string
  categoria: string
}

function HeaderPreview({ titulo, descricao, imagemBanner, imagemBannerMobile, createdAt, tempoLeitura, categoria }: HeaderPreviewProps) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      return ''
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-[#0d0d0d]"
      style={
        imagemBanner
          ? {
              backgroundImage: `url(${resolveImageUrl(imagemBanner)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : {}
      }
    >
      {imagemBanner && <div className="absolute inset-0 bg-black/70" />}
      {imagemBannerMobile && (
        <div className="absolute top-2 right-2 z-10 bg-black/60 text-[#eb001a] text-[10px] font-semibold px-2 py-1 rounded-md tracking-wide uppercase">
          Banner mobile definido
        </div>
      )}
      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      {/* Gold left border */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#eb001a]/60 to-transparent" />
      <div className="relative max-w-5xl mx-auto px-6 sm:px-12 pt-12 pb-14 sm:pt-16 sm:pb-20">
        <span className="inline-flex items-center gap-2 text-white/40 text-xs uppercase tracking-[0.15em] font-semibold mb-10">
          <ArrowLeft size={12} aria-hidden="true" />Blog
        </span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-6">
          {categoria && (
            <span className="flex items-center gap-1.5 text-[#eb001a] text-xs tracking-wide font-semibold uppercase">
              <Tag size={11} aria-hidden="true" />{categoria}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[#eb001a] text-xs tracking-wide">
            <Calendar size={11} aria-hidden="true" />{formatDate(createdAt) || 'Data de publicação'}
          </span>
          <span className="flex items-center gap-1.5 text-white/30 text-xs tracking-wide">
            <Clock size={11} aria-hidden="true" />{tempoLeitura || '5 min'} de leitura
          </span>
        </div>
        <h1
          className="text-white font-bold leading-[1.02] mb-5 break-words"
          style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)' }}
        >
          {titulo || 'Título do artigo'}
        </h1>
        <div className="w-16 h-[2px] bg-[#eb001a] mb-5" />
        <p className="text-white/55 text-base sm:text-[1.125rem] leading-relaxed break-words whitespace-pre-line max-w-2xl">
          {descricao || 'Resumo do artigo...'}
        </p>
      </div>
    </div>
  )
}

// -- Form ----------------------------------------------------------------------

interface NoticiaFormProps {
  noticia: Noticia | null
  onBack: () => void
  onSave: (data: NoticiaInput, capaFile: File | null, bannerFile: File | null, bannerMobileFile: File | null) => Promise<void>
}

function NoticiaForm({ noticia, onBack, onSave }: NoticiaFormProps) {
  const [categoria, setCategoria] = useState(noticia?.categoria ?? '')
  const [titulo, setTitulo] = useState(noticia?.titulo ?? '')
  const [descricao, setDescricao] = useState(noticia?.descricao ?? '')
  const [materia, setMateria] = useState(noticia?.materia ?? '')
  const [imagemCapa, setImagemCapa] = useState(noticia?.imagemCapa ?? '')
  const [imagemBanner, setImagemBanner] = useState(noticia?.imagemBanner ?? '')
  const [imagemBannerMobile, setImagemBannerMobile] = useState(noticia?.imagemBannerMobile ?? '')
  const [tempoLeitura, setTempoLeitura] = useState(noticia?.tempoLeitura ?? '')
  const [capaFile, setCapaFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerMobileFile, setBannerMobileFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewTab, setPreviewTab] = useState<'card' | 'header'>('card')
  const capaRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)
  const bannerMobileRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString()
  const isEdit = noticia !== null

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  const handleCapaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      console.warn('Tipo de imagem não permitido. Use JPEG, PNG, WebP ou GIF.')
      if (capaRef.current) capaRef.current.value = ''
      return
    }
    setCapaFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagemCapa(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      console.warn('Tipo de imagem não permitido. Use JPEG, PNG, WebP ou GIF.')
      if (bannerRef.current) bannerRef.current.value = ''
      return
    }
    setBannerFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagemBanner(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleBannerMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!allowedTypes.includes(file.type)) {
      console.warn('Tipo de imagem não permitido. Use JPEG, PNG, WebP ou GIF.')
      if (bannerMobileRef.current) bannerMobileRef.current.value = ''
      return
    }
    setBannerMobileFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagemBannerMobile(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (categoria.trim().length < 2) {
      console.warn('Categoria deve ter pelo menos 2 caracteres.')
      return
    }
    if (titulo.trim().length < 3) {
      console.warn('Título deve ter pelo menos 3 caracteres.')
      return
    }
    if (descricao.trim().length < 10) {
      console.warn(`Resumo deve ter pelo menos 10 caracteres.`)
      return
    }
    if (materia.trim().length < 20) {
      console.warn(`Conteúdo deve ter pelo menos 20 caracteres.`)
      return
    }
    if (!imagemCapa) {
      console.warn('Imagem de capa é obrigatória.')
      return
    }
    setUploading(true)
    try {
      await onSave({ categoria, titulo, descricao, materia, tempoLeitura, publicado: true }, capaFile, bannerFile, bannerMobileFile)
    } catch (error: unknown) {
      const apiMsg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error
      console.warn(apiMsg ?? 'Erro ao salvar post do blog')
    } finally {
      setUploading(false)
    }
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent resize-none'
  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar Post do Blog' : 'Novo Post do Blog'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Atualize as informações do post' : 'Preencha as informações do novo post'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Form card */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categoria */}
            <div>
              <label className={labelCls}>Categoria</label>
              <AutoResizeInput
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                list="blog-categorias"
                placeholder="Ex: Dicas, Tendências, Institucional..."
                className={inputCls}
              />
              <datalist id="blog-categorias">
                {['Tendências', 'Dicas', 'Técnicas', 'Resultados', 'Institucional'].map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <p className="text-xs text-gray-400 mt-1">Campo aberto: digite uma categoria nova ou escolha uma sugestão.</p>
            </div>

            {/* Título */}
            <div>
              <label className={labelCls}>Título</label>
              <AutoResizeInput
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                required
                minLength={3}
                maxLength={200}
                placeholder="Ex: Tendências em cirurgia plástica para 2026"
                className={inputCls}
              />
              <p className={`text-xs mt-1 ${titulo.trim().length > 0 && titulo.trim().length < 3 ? 'text-red-400' : 'text-gray-400'}`}>
                Mínimo 3 caracteres · {titulo.length}/200
              </p>
            </div>

            {/* Resumo */}
            <div>
              <label className={labelCls}>Resumo</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                minLength={10}
                rows={4}
                placeholder="Um breve resumo para aparecer no card e na listagem do blog..."
                className={`${inputCls} resize-none`}
              />
              <p className={`text-xs mt-1 ${descricao.trim().length > 0 && descricao.trim().length < 10 ? 'text-red-400' : 'text-gray-400'}`}>
                Mínimo 10 caracteres · {descricao.length}/160 recomendado
              </p>
            </div>

            {/* Conteúdo */}
            <div>
              <label className={labelCls}>Conteúdo do artigo</label>
              <textarea
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                required
                minLength={20}
                rows={12}
                placeholder="Escreva o conteúdo completo do artigo do blog aqui..."
                className={inputCls}
              />
              <p className={`text-xs mt-1 ${materia.trim().length > 0 && materia.trim().length < 20 ? 'text-red-400' : 'text-gray-400'}`}>
                Mínimo 20 caracteres · {materia.length} digitados
              </p>
            </div>

            {/* Tempo de leitura */}
            <div>
              <label className={labelCls}>Tempo de leitura</label>
              <div className="relative">
                <input
                  type="text"
                  value={tempoLeitura}
                  onChange={(e) => setTempoLeitura(e.target.value)}
                  onBlur={(e) => {
                    const v = e.target.value.trim()
                    if (v && !/min/i.test(v)) setTempoLeitura(v + ' min')
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                  placeholder="Ex: 5 min"
                  maxLength={20}
                  className={inputCls}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Exibido no cabeçalho da matéria. Deixe vazio para omitir.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUpload
                label="Imagem de capa"
                hint="Recomendado: 800 × 800 px (1:1) · JPG, PNG ou WebP · máx. 5 MB"
                value={imagemCapa}
                fileRef={capaRef}
                onChange={handleCapaChange}
                onClear={() => { setImagemCapa(''); setCapaFile(null); if (capaRef.current) capaRef.current.value = '' }}
                aspectClass="aspect-square"
              />
              <ImageUpload
                label="Banner do header"
                hint="Tamanho mínimo: 1920 × 380 px · JPG, PNG ou WebP · máx. 5 MB"
                value={imagemBanner}
                fileRef={bannerRef}
                onChange={handleBannerChange}
                onClear={() => { setImagemBanner(''); setBannerFile(null); if (bannerRef.current) bannerRef.current.value = '' }}
                aspectClass="aspect-[16/9]"
              />
              <ImageUpload
                label="Banner mobile (opcional)"
                hint="Recomendado: 640 × 480 px (4:3) · JPG, PNG ou WebP · máx. 5 MB · Carregado abaixo de 640 px"
                value={imagemBannerMobile}
                fileRef={bannerMobileRef}
                onChange={handleBannerMobileChange}
                onClear={() => { setImagemBannerMobile(''); setBannerMobileFile(null); if (bannerMobileRef.current) bannerMobileRef.current.value = '' }}
                aspectClass="aspect-[4/3]"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-6 py-2.5 rounded-xl bg-[#eb001a] hover:bg-[#c90015] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Publicar post'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview panel */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setPreviewTab('card')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors border-b-2 ${
                previewTab === 'card'
                  ? 'text-[#eb001a] border-[#eb001a]'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <LayoutGrid size={13} />
              Card
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('header')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors border-b-2 ${
                previewTab === 'header'
                  ? 'text-[#eb001a] border-[#eb001a]'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              <FileText size={13} />
              Header da matéria
            </button>
          </div>
          <div className="p-4 bg-[#f7f8fa] dark:bg-[#111]">
            {previewTab === 'card' ? (
              <CardPreview
                titulo={titulo}
                descricao={descricao}
                imagemCapa={imagemCapa}
                createdAt={noticia?.createdAt ?? today}
              />
            ) : (
              <HeaderPreview
                titulo={titulo}
                descricao={descricao}
                imagemBanner={imagemBanner}
                imagemBannerMobile={imagemBannerMobile}
                createdAt={noticia?.createdAt ?? today}
                tempoLeitura={tempoLeitura}
                categoria={categoria}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// -- Modal de Exclusão --------------------------------------------------------

interface DeleteModalProps {
  noticiaTitle: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ noticiaTitle, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-red-50">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Excluir post do blog</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Tem certeza que deseja excluir{' '}
          <span className="font-medium text-gray-700 dark:text-gray-300">"{noticiaTitle}"</span>? Essa ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

// -- Card ----------------------------------------------------------------------

interface NoticiaCardProps {
  noticia: Noticia
  onEdit: () => void
  onDelete: () => void
}

function NoticiaCard({ noticia, onEdit, onDelete }: NoticiaCardProps) {
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('pt-BR')
    } catch {
      return ''
    }
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {noticia.imagemCapa ? (
          <img
            src={resolveImageUrl(noticia.imagemCapa)}
            alt={noticia.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
            <Newspaper size={36} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
        {noticia.imagemBanner && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            + banner
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eb001a]/10 text-[#eb001a] flex items-center gap-1">
            <Tag size={10} />
            {noticia.categoria || 'Sem categoria'}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(noticia.createdAt)}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight line-clamp-2">
          {noticia.titulo}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">{noticia.descricao}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-auto">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#eb001a] hover:bg-[#eb001a]/10 transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// -- Main Component ------------------------------------------------------------

type View = 'list' | 'form'

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('list')
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadNoticias()
  }, [])

  const loadNoticias = async () => {
    try {
      setLoading(true)
      const data = await noticiasService.getAll()
      setNoticias(
        (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      )
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      console.warn('Erro ao carregar posts do blog')
    } finally {
      setLoading(false)
    }
  }

  const goToNew = () => { setEditingNoticia(null); setView('form'); window.scrollTo(0, 0) }
  const goToEdit = (n: Noticia) => { setEditingNoticia(n); setView('form'); window.scrollTo(0, 0) }
  const goToList = () => { setEditingNoticia(null); setView('list') }

  const handleSave = async (data: NoticiaInput, capaFile: File | null, bannerFile: File | null, bannerMobileFile: File | null) => {
    try {
      const [capaUrl, bannerUrl, bannerMobileUrl] = await Promise.all([
        capaFile ? uploadService.uploadImage(capaFile, 'blogs').then((r) => r.url) : Promise.resolve(undefined),
        bannerFile ? uploadService.uploadImage(bannerFile, 'blogs').then((r) => r.url) : Promise.resolve(undefined),
        bannerMobileFile ? uploadService.uploadImage(bannerMobileFile, 'blogs').then((r) => r.url) : Promise.resolve(undefined),
      ])

      const payload: NoticiaInput = {
        ...data,
        ...(capaUrl ? { imagemCapa: capaUrl } : {}),
        ...(bannerUrl ? { imagemBanner: bannerUrl } : {}),
        ...(bannerMobileUrl ? { imagemBannerMobile: bannerMobileUrl } : {}),
      }

      if (editingNoticia) {
        await noticiasService.update(editingNoticia.id, payload)
      } else {
        const created = await noticiasService.create(payload)
        const extras: Partial<NoticiaInput> = {}
        if (capaUrl) extras.imagemCapa = capaUrl
        if (bannerUrl) extras.imagemBanner = bannerUrl
        if (bannerMobileUrl) extras.imagemBannerMobile = bannerMobileUrl
        if (Object.keys(extras).length) await noticiasService.update(created.id, extras)
      }

      await loadNoticias()
      goToList()
      toast.success(editingNoticia ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!')
    } catch (error: unknown) {
      console.error('Erro ao salvar post:', error)
      const apiMsg = (error as { response?: { data?: { error?: string; message?: string } }; message?: string })?.response?.data?.error
        ?? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? (error as { message?: string })?.message
      toast.error(apiMsg ?? 'Não foi possível salvar o artigo na API.')
    }
  }

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await noticiasService.delete(deletingId)
        setNoticias((prev) => prev.filter((n) => n.id !== deletingId))
        setDeletingId(null)
        toast.success('Post excluído com sucesso!')
      } catch {
        console.warn('Erro ao excluir post')
      }
    }
  }

  if (view === 'form') {
    return (
      <NoticiaForm
        noticia={editingNoticia}
        onBack={goToList}
        onSave={handleSave}
      />
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {noticias.length} {noticias.length === 1 ? 'post publicado' : 'posts publicados'}
          </p>
        </div>
        <button
          onClick={goToNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#eb001a] hover:bg-[#c90015] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} />
          Novo Post
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Carregando posts...</div>
        </div>
      ) : noticias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Newspaper size={48} className="mb-3 opacity-30" />
          <p className="text-base font-medium">Nenhum post publicado</p>
          <p className="text-sm mt-1">Clique em "Novo Post" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {noticias.map((noticia) => (
            <NoticiaCard
              key={noticia.id}
              noticia={noticia}
              onEdit={() => goToEdit(noticia)}
              onDelete={() => setDeletingId(noticia.id)}
            />
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deletingId !== null && (
        <DeleteModal
          noticiaTitle={noticias.find((n) => n.id === deletingId)?.titulo ?? ''}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}
