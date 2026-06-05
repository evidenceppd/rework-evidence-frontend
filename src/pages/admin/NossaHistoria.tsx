import { useState, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, ArrowLeft, ImageIcon, GripVertical, X, CheckCircle, Users, Home, Heart, Package, DollarSign, Star, Shield, Truck, Award, ThumbsUp, Smile, Save, type LucideIcon } from 'lucide-react'
import { nossaHistoriaService, type NossaHistoria as NossaHistoriaAPI } from '../../services/nossaHistoria.service'
import { nossoValorService } from '../../services/nossoValor.service'
import { nossaEquipeService, type NossaEquipe } from '../../services/nossaEquipe.service'
import { uploadService } from '../../services/upload.service'
import { resolveImageUrl, BACKEND_URL } from '../../services/api'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface HistoriaBloco {
  id: string
  titulo: string
  texto: string
  imageUrl: string
  ordem: number
  cor: string
}

interface NossoValorData {
  id: string
  titulo: string
  descricao: string
  cor: string
  icone: string
  posicao: number
}

const ICON_MAP: Record<string, LucideIcon> = {
  CheckCircle, Users, Home, Heart, Package, DollarSign,
  Star, Shield, Truck, Award, ThumbsUp, Smile,
}

const AVAILABLE_ICONS = [
  { name: 'CheckCircle', label: 'Check' },
  { name: 'Users', label: 'Pessoas' },
  { name: 'Home', label: 'Casa' },
  { name: 'Heart', label: 'CoraÃ§Ã£o' },
  { name: 'Package', label: 'Produto' },
  { name: 'DollarSign', label: 'PreÃ§o' },
  { name: 'Star', label: 'Qualidade' },
  { name: 'Shield', label: 'SeguranÃ§a' },
  { name: 'Truck', label: 'Entrega' },
  { name: 'Award', label: 'PrÃªmio' },
  { name: 'ThumbsUp', label: 'AprovaÃ§Ã£o' },
  { name: 'Smile', label: 'SatisfaÃ§Ã£o' },
]

// â”€â”€ FormulÃ¡rio (pÃ¡gina interna) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface BlocoFormProps {
  bloco: HistoriaBloco | null
  onBack: () => void
  onSave: () => void
  ordemAtual: number
}

function BlocoForm({ bloco, onBack, onSave, ordemAtual }: BlocoFormProps) {
  const [titulo, setTitulo] = useState(bloco?.titulo ?? '')
  const [texto, setTexto] = useState(bloco?.texto ?? '')
  const [imageUrl, setImageUrl] = useState(bloco?.imageUrl ?? '')
  const cor = '#004582'
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = bloco !== null

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      console.warn('Tipo de imagem nÃ£o permitido. Use JPEG, PNG, WebP ou GIF.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setUploading(true)
    try {
      const result = await uploadService.uploadImage(file, 'nossaHistoria')
      setImageUrl(result.url)
    } catch (error: unknown) {
      console.error('Erro ao fazer upload da imagem:', error)
      const apiMsg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error
      console.warn(apiMsg ?? 'Erro ao fazer upload da imagem')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data: Omit<NossaHistoriaAPI, 'id' | 'createdAt' | 'updatedAt'> = {
        tituloBloco: titulo,
        cor,
        texto,
        imagemBloco: imageUrl.startsWith(BACKEND_URL) ? imageUrl.slice(BACKEND_URL.length) : imageUrl,
        posicao: bloco?.ordem ?? ordemAtual,
      }
      
      if (isEdit && bloco?.id) {
        await nossaHistoriaService.update(bloco.id, data)
      } else {
        await nossaHistoriaService.create(data)
      }
      
      onSave()
      toast.success(isEdit ? 'Bloco atualizado com sucesso!' : 'Bloco criado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar bloco:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao salvar bloco'
      console.warn(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar Bloco' : 'Novo Bloco'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Nossa HistÃ³ria</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          {/* TÃ­tulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              TÃ­tulo do Bloco <span className="text-red-500">*</span>
            </label>
            <AutoResizeInput
              
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Ex: Como Tudo ComeÃ§ou"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/30 focus:border-[#235937] transition-colors"
            />
          </div>



          {/* Texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Texto <span className="text-red-500">*</span>
            </label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              required
              rows={8}
              placeholder="Escreva o conteÃºdo deste bloco... Use linhas em branco para separar parÃ¡grafos."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/30 focus:border-[#235937] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Imagem */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Imagem do Bloco
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-gray-400">
              <ImageIcon size={32} className="animate-pulse" />
              <span className="text-sm">Fazendo upload...</span>
            </div>
          ) : imageUrl ? (
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-[#235937] hover:bg-[#f7f3ea] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 px-3 py-1.5 bg-white rounded-lg shadow text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Trocar imagem
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer hover:border-[#235937] hover:bg-[#235937]/5 transition-colors"
            >
              <ImageIcon size={36} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">
                Clique para enviar ou arraste a imagem
              </span>
              <span className="text-xs text-gray-400">PNG, JPG, WEBP atÃ© 5MB</span>
            </button>
          )}
        </div>

        {/* Preview */}
        {(titulo || texto || imageUrl) && (
          <div className="admin-preview-surface bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              PrÃ©-visualizaÃ§Ã£o
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
              {/* ConteÃºdo de texto */}
              <div className={ordemAtual % 2 === 0 ? 'md:order-2' : ''}>
                {titulo && (
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 break-words text-[#004582]">{titulo}</h2>
                )}
                {texto && (
                  <div className="space-y-4">
                    {texto.split('\n\n').filter(Boolean).map((p, i) => (
                      <p key={i} className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 break-words">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {/* Imagem */}
              <div className={ordemAtual % 2 === 0 ? 'md:order-1' : ''}>
                {imageUrl ? (
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#004582] aspect-[4/5] sm:aspect-[3/2]">
                    <img
                      src={imageUrl}
                      alt={titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                    <ImageIcon size={40} className="text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : isEdit ? 'Salvar alteraÃ§Ãµes' : 'Adicionar bloco'}
          </button>
        </div>
      </form>
    </div>
  )
}

// â”€â”€ Modal de ExclusÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DeleteModalProps {
  blocoTitulo: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ blocoTitulo, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir bloco</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{blocoTitulo}"</span>?
            Esta aÃ§Ã£o nÃ£o pode ser desfeita.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

// â”€â”€ Card de Bloco â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface BlocoCardProps {
  bloco: HistoriaBloco
  onEdit: (bloco: HistoriaBloco) => void
  onDelete: (bloco: HistoriaBloco) => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
  isDragging: boolean
}

function BlocoCard({ bloco, onEdit, onDelete, onDragStart, onDragOver, onDragEnd, isDragging }: BlocoCardProps) {
  const paragrafos = bloco.texto.split('\n\n').filter(Boolean)

  return (
    <div 
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
      } ${isDragging ? 'border-[#235937]' : 'border-gray-100'}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-400 cursor-move" title="Arraste para reordenar">
          <GripVertical size={16} />
          <span className="text-xs font-medium text-gray-500">Bloco #{bloco.ordem}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(bloco)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#235937] transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(bloco)}
            className="p-2 rounded-lg hover:bg-[#f7f3ea] text-[#235937] hover:text-[#1b462b] transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Preview layout 2 colunas */}
      <div className="admin-preview-surface p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-start min-w-0">
        {/* ConteÃºdo de texto */}
        <div className={bloco.ordem % 2 === 0 ? 'lg:order-2' : ''}>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 break-words text-[#004582]">{bloco.titulo}</h3>
          <div className="space-y-0">
            {paragrafos.map((p, i) => (
              <p key={i} className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 break-words">
                {p}
              </p>
            ))}
          </div>
        </div>
        {/* Imagem */}
        <div className={bloco.ordem % 2 === 0 ? 'lg:order-1' : ''}>
          {(() => {
            const FALLBACKS = [
              'https://images.unsplash.com/photo-1760463921642-eef64776c3bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwc3RvcmUlMjBpbnRlcmlvciUyMG1vZGVybnxlbnwxfHx8fDE3NzI3MjU3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
              'https://images.unsplash.com/photo-1753354868431-a5317771a3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcm1hcmtldCUyMGZhbWlseSUyMHNob3BwaW5nfGVufDF8fHx8MTc3MjgwMTA4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
            ]
            const src = bloco.imageUrl || FALLBACKS[(bloco.ordem - 1) % FALLBACKS.length]
            return (
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#004582] aspect-[4/5] sm:aspect-[3/2]">
                  <img
                    src={src}
                    alt={bloco.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!bloco.imageUrl && (
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">
                    PrÃ©-visualizaÃ§Ã£o
                  </span>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

// â”€â”€ FormulÃ¡rio de Valor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ValorFormProps {
  valor: NossoValorData | null
  onBack: () => void
  onSaved: () => void
  proximaPosicao: number
}

function ValorForm({ valor, onBack, onSaved, proximaPosicao }: ValorFormProps) {
  const [titulo, setTitulo] = useState(valor?.titulo ?? '')
  const [descricao, setDescricao] = useState(valor?.descricao ?? '')
  const cor = '#004582'
  const [icone, setIcone] = useState(valor?.icone ?? 'CheckCircle')
  const [saving, setSaving] = useState(false)

  const isEdit = valor !== null
  const IconComponent = ICON_MAP[icone] ?? CheckCircle

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { titulo, descricao, cor, icone, posicao: valor?.posicao ?? proximaPosicao }
      if (isEdit && valor?.id) {
        await nossoValorService.update(valor.id, data)
      } else {
        await nossoValorService.create(data)
      }
      onSaved()
    } catch (error) {
      console.error('Erro ao salvar valor:', error)
      console.warn('Erro ao salvar valor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar Valor' : 'Novo Valor'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Nossos Valores</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          {/* TÃ­tulo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              TÃ­tulo <span className="text-red-500">*</span>
            </label>
            <AutoResizeInput
              
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Ex: Qualidade Garantida"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/30 focus:border-[#235937] transition-colors"
            />
          </div>

          {/* DescriÃ§Ã£o */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              DescriÃ§Ã£o <span className="text-red-500">*</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
              placeholder="Descreva este valor..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/30 focus:border-[#235937] transition-colors resize-none"
            />
          </div>



          {/* Ãcone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ãcone <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-12 gap-2">
              {AVAILABLE_ICONS.map(({ name, label }) => {
                const Icon = ICON_MAP[name]
                const selected = icone === name
                return (
                  <button
                    key={name}
                    type="button"
                    title={label}
                    onClick={() => setIcone(name)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      selected
                        ? 'border-[#235937] bg-[#235937]/10'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} style={{ color: selected ? cor : '#6b7280' }} />
                    <span className="text-[10px] text-gray-500 leading-none">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Preview */}
        {titulo && (
          <div className="admin-preview-surface bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              PrÃ©-visualizaÃ§Ã£o
            </p>
            <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl max-w-sm">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cor}20`, border: `2px solid ${cor}30` }}
              >
                <IconComponent size={24} style={{ color: cor }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{titulo}</h3>
                {descricao && <p className="text-sm text-gray-500 leading-relaxed">{descricao}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : isEdit ? 'Salvar alteraÃ§Ãµes' : 'Adicionar valor'}
          </button>
        </div>
      </form>
    </div>
  )
}

// â”€â”€ Card de Valor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ValorCardProps {
  valor: NossoValorData
  onEdit: (v: NossoValorData) => void
  onDelete: (v: NossoValorData) => void
}

function ValorCard({ valor, onEdit, onDelete }: ValorCardProps) {
  const IconComponent = ICON_MAP[valor.icone] ?? CheckCircle

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 overflow-hidden" style={{ borderTopColor: '#004582' }}>
      <div className="flex justify-end gap-1 px-3 pt-3">
        <button
          onClick={() => onEdit(valor)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#235937] transition-colors cursor-pointer"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(valor)}
          className="p-1.5 rounded-lg hover:bg-[#f7f3ea] text-[#235937] hover:text-[#1b462b] transition-colors cursor-pointer"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="px-8 pb-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto"
          style={{ backgroundColor: '#004582' }}
        >
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">{valor.titulo}</h3>
        <p className="text-center text-gray-600 leading-relaxed">{valor.descricao}</p>
      </div>
    </div>
  )
}

// â”€â”€ Equipe Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const EQUIPE_FALLBACK = 'https://images.unsplash.com/photo-1530028877439-c742c97d1543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGVtcGxveWVlcyUyMHRlYW0lMjByZXRhaWx8ZW58MXx8fHwxNzcyODAxMDg0fDA&ixlib=rb-4.1.0&q=80&w=1080'

interface EquipeCardProps {
  equipe: NossaEquipe
  onEdit: () => void
}

function EquipeCard({ equipe, onEdit }: EquipeCardProps) {
  const paragrafos = [equipe.paragrafo1, equipe.paragrafo2, equipe.paragrafo3].filter(Boolean)
  const imageSrc = equipe.imagem || EQUIPE_FALLBACK

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">Fundadores</span>
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#235937] transition-colors cursor-pointer"
          title="Editar"
        >
          <Pencil size={15} />
        </button>
      </div>
      <div className="admin-preview-surface p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-start min-w-0">
        <div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-[#004582]">{equipe.titulo}</h3>
          <div className="space-y-0">
            {paragrafos.map((p, i) => (
              <p key={i} className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 break-words">{p}</p>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#004582] aspect-[4/5] sm:aspect-[3/2]">
            <img
              src={imageSrc}
              alt={equipe.titulo}
              className="w-full h-full object-cover"
            />
          </div>
          {!equipe.imagem && (
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">
              PrÃ©-visualizaÃ§Ã£o
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// â”€â”€ Equipe Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface EquipeFormProps {
  equipe: NossaEquipe | null
  onBack: () => void
  onSaved: () => void
}

function EquipeForm({ equipe, onBack, onSaved }: EquipeFormProps) {
  const textoInicial = [equipe?.paragrafo1, equipe?.paragrafo2, equipe?.paragrafo3]
    .filter(Boolean).join('\n\n')

  const [titulo, setTitulo] = useState(equipe?.titulo ?? 'Fundadores')
  const [texto, setTexto] = useState(textoInicial)
  const [imagem, setImagem] = useState(equipe?.imagem ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      console.warn('Tipo de imagem nÃ£o permitido. Use JPEG, PNG, WebP ou GIF.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setUploading(true)
    try {
      const result = await uploadService.uploadImage(file, 'nossaHistoria')
      setImagem(result.url)
    } catch (error: unknown) {
      console.error('Erro ao fazer upload da imagem:', error)
      const apiMsg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error
      console.warn(apiMsg ?? 'Erro ao fazer upload da imagem')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const paragrafos = texto.split('\n\n').filter(Boolean)
      const imagemRelativa = imagem.startsWith(BACKEND_URL) ? imagem.slice(BACKEND_URL.length) : imagem
      await nossaEquipeService.upsert({
        titulo,
        paragrafo1: paragrafos[0] ?? '',
        paragrafo2: paragrafos[1] ?? '',
        paragrafo3: paragrafos[2] ?? '',
        imagem: imagemRelativa,
        textoBotao: equipe?.textoBotao ?? 'Trabalhe Conosco',
        linkBotao: equipe?.linkBotao ?? '/trabalhe-conosco',
      })
      toast.success('Fundadores salvo com sucesso!')
      onSaved()
    } catch (error: unknown) {
      console.error('Erro ao salvar equipe:', error)
      const apiMsg = (error as { response?: { data?: { error?: string } } })?.response?.data?.error
      console.warn(apiMsg ?? 'Erro ao salvar seÃ§Ã£o')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Editar Fundadores</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-6 border border-gray-100">
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">TÃ­tulo</label>
              <AutoResizeInput
                
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#004582]/30 focus:border-[#004582] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Texto</label>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={10}
                required
                placeholder="Separe os parÃ¡grafos com uma linha em branco"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#004582]/30 focus:border-[#004582] transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Separe parÃ¡grafos com uma linha em branco</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
            {uploading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl">
                <ImageIcon size={32} className="animate-pulse" />
                <span className="text-sm">Fazendo upload...</span>
              </div>
            ) : imagem ? (
              <div className="relative group">
                <img
                  src={imagem}
                  alt="Fundadores"
                  className="w-full h-64 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setImagem('')}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-[#235937] hover:bg-[#f7f3ea] transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-white rounded-lg shadow text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Trocar imagem
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer hover:border-[#004582] hover:bg-[#004582]/5 transition-colors"
              >
                <ImageIcon size={36} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Clique para enviar imagem</span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP atÃ© 5MB</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#004582] hover:bg-[#003366] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar alteraÃ§Ãµes'}
          </button>
        </div>
      </form>
    </div>
  )
}

// â”€â”€ PÃ¡gina Principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function NossaHistoria() {
  // â”€â”€ Nossa HistÃ³ria state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [blocos, setBlocos] = useState<HistoriaBloco[]>([])
  const [loadingBlocos, setLoadingBlocos] = useState(true)
  const [historiaView, setHistoriaView] = useState<'list' | 'form'>('list')
  const [editingBloco, setEditingBloco] = useState<HistoriaBloco | null>(null)
  const [deletingBloco, setDeletingBloco] = useState<HistoriaBloco | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // â”€â”€ Nossos Valores state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [valores, setValores] = useState<NossoValorData[]>([])
  const [loadingValores, setLoadingValores] = useState(true)
  const [valoresView, setValoresView] = useState<'list' | 'form'>('list')
  const [editingValor, setEditingValor] = useState<NossoValorData | null>(null)
  const [deletingValor, setDeletingValor] = useState<NossoValorData | null>(null)

  // â”€â”€ Fundadores state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [equipe, setEquipe] = useState<NossaEquipe | null>(null)
  const [loadingEquipe, setLoadingEquipe] = useState(true)
  const [equipeView, setEquipeView] = useState<'card' | 'form'>('card')

  useEffect(() => {
    loadBlocos()
    loadValores()
    loadEquipe()
  }, [])

  // â”€â”€ Historia handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const loadBlocos = async () => {
    try {
      setLoadingBlocos(true)
      const data = await nossaHistoriaService.getAll()
      const blocosOrdenados = data
        .map((bloco: NossaHistoriaAPI): HistoriaBloco => ({
          id: bloco.id!,
          titulo: bloco.tituloBloco,
          texto: bloco.texto,
          imageUrl: bloco.imagemBloco ? resolveImageUrl(bloco.imagemBloco) : '',
          ordem: bloco.posicao,
          cor: '#004582',
        }))
        .sort((a: HistoriaBloco, b: HistoriaBloco) => a.ordem - b.ordem) // Ordenar por posiÃ§Ã£o
      setBlocos(blocosOrdenados)
    } catch (error) {
      console.error('Erro ao carregar blocos:', error)
      console.warn('Erro ao carregar blocos')
    } finally {
      setLoadingBlocos(false)
    }
  }

  const handleNewBloco = () => { setEditingBloco(null); setHistoriaView('form'); window.scrollTo(0, 0) }
  const handleEditBloco = (bloco: HistoriaBloco) => { setEditingBloco(bloco); setHistoriaView('form'); window.scrollTo(0, 0) }
  const handleBackBloco = () => { setHistoriaView('list'); setEditingBloco(null); loadBlocos() }



  const saveOrder = async () => {
    try {
      const sorted = [...blocos].sort((a, b) => a.ordem - b.ordem)
      await nossaHistoriaService.reorder(sorted.map((b) => ({ id: b.id, posicao: b.ordem })))
      toast.success('Ordem dos blocos salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar ordem:', error)
      console.warn('Erro ao salvar a ordem dos blocos')
      loadBlocos()
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const newBlocos = [...blocos]
    const draggedItem = newBlocos[draggedIndex]
    newBlocos.splice(draggedIndex, 1)
    newBlocos.splice(index, 0, draggedItem)
    
    // Atualiza as ordens
    newBlocos.forEach((bloco, idx) => {
      bloco.ordem = idx + 1
    })
    
    setBlocos(newBlocos)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    saveOrder()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingBloco) return
    try {
      await nossaHistoriaService.delete(deletingBloco.id)
      setDeletingBloco(null)
      loadBlocos()
      toast.success('Bloco excluÃ­do com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir bloco:', error)
      console.warn('Erro ao excluir bloco')
    }
  }

  // â”€â”€ Valores handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const loadValores = async () => {
    try {
      setLoadingValores(true)
      const data = await nossoValorService.getAll()
      setValores(data as NossoValorData[])
    } catch (error) {
      console.error('Erro ao carregar valores:', error)
    } finally {
      setLoadingValores(false)
    }
  }

  const handleNewValor = () => { setEditingValor(null); setValoresView('form'); window.scrollTo(0, 0) }
  const handleEditValor = (v: NossoValorData) => { setEditingValor(v); setValoresView('form'); window.scrollTo(0, 0) }
  const handleBackValor = () => { setValoresView('list'); setEditingValor(null); loadValores() }

  const handleDeleteValorConfirm = async () => {
    if (!deletingValor) return
    try {
      await nossoValorService.delete(deletingValor.id)
      setDeletingValor(null)
      loadValores()
    } catch (error) {
      console.error('Erro ao excluir valor:', error)
      console.warn('Erro ao excluir valor')
    }
  }

  // â”€â”€ Equipe handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const loadEquipe = async () => {
    try {
      setLoadingEquipe(true)
      const data = await nossaEquipeService.get()
      if (data) {
        setEquipe({ ...data, imagem: data.imagem ? resolveImageUrl(data.imagem) : '' })
      } else {
        setEquipe(null)
      }
    } catch (error) {
      console.error('Erro ao carregar equipe:', error)
    } finally {
      setLoadingEquipe(false)
    }
  }

  // â”€â”€ Render: form views â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (historiaView === 'form') {
    return (
      <BlocoForm
        bloco={editingBloco}
        onBack={handleBackBloco}
        onSave={handleBackBloco}
        ordemAtual={editingBloco?.ordem ?? blocos.length + 1}
      />
    )
  }

  if (valoresView === 'form') {
    return (
      <ValorForm
        valor={editingValor}
        onBack={handleBackValor}
        onSaved={handleBackValor}
        proximaPosicao={valores.length + 1}
      />
    )
  }

  if (equipeView === 'form') {
    return (
      <EquipeForm
        equipe={equipe}
        onBack={() => setEquipeView('card')}
        onSaved={() => { loadEquipe(); setEquipeView('card') }}
      />
    )
  }

  // â”€â”€ Render: main view (3 seÃ§Ãµes verticais) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="space-y-8">
      {/* CabeÃ§alho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Nossa HistÃ³ria</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Gerencie os conteÃºdos da seÃ§Ã£o "Nossa HistÃ³ria", "Nossos Valores" e "Fundadores"
        </p>
      </div>

      {/* â•â•â• SEÃ‡ÃƒO 1: NOSSA HISTÃ“RIA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Nossa HistÃ³ria</h2>
          <button
            onClick={handleNewBloco}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Novo Bloco
          </button>
        </div>

        {loadingBlocos ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#235937] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blocos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-3 text-center">
            <ImageIcon size={32} className="text-gray-300" />
            <p className="font-medium text-gray-600">Nenhum bloco cadastrado</p>
            <button
              onClick={handleNewBloco}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Novo Bloco
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {blocos.map((bloco) => (
              <BlocoCard
                key={bloco.id}
                bloco={bloco}
                onEdit={handleEditBloco}
                onDelete={setDeletingBloco}
                onDragStart={() => handleDragStart(blocos.indexOf(bloco))}
                onDragOver={(e) => handleDragOver(e, blocos.indexOf(bloco))}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === blocos.indexOf(bloco)}
              />
            ))}
            <button
              onClick={handleNewBloco}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#235937] hover:border-[#235937] hover:bg-[#235937]/5 transition-colors cursor-pointer"
            >
              <Plus size={18} />
              Adicionar novo bloco
            </button>
          </div>
        )}
      </section>

      {/* â•â•â• SEÃ‡ÃƒO 2: NOSSOS VALORES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Nossos Valores</h2>
          <button
            onClick={handleNewValor}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Novo Valor
          </button>
        </div>

        {loadingValores ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#235937] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : valores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center gap-3 text-center">
            <Star size={32} className="text-gray-300" />
            <p className="font-medium text-gray-600">Nenhum valor cadastrado</p>
            <button
              onClick={handleNewValor}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Novo Valor
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {valores.map((v) => (
              <ValorCard key={v.id} valor={v} onEdit={handleEditValor} onDelete={setDeletingValor} />
            ))}
            <button
              onClick={handleNewValor}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#235937] hover:border-[#235937] hover:bg-[#235937]/5 transition-colors cursor-pointer"
            >
              <Plus size={18} />
              Adicionar novo valor
            </button>
          </div>
        )}
      </section>

      {/* â•â•â• SEÃ‡ÃƒO 3: FUNDADORES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Fundadores</h2>

        {loadingEquipe ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#235937] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : equipe ? (
          <EquipeCard equipe={equipe} onEdit={() => { setEquipeView('form'); window.scrollTo(0, 0) }} />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 flex flex-col items-center gap-3 text-gray-400">
            <ImageIcon size={32} />
            <p className="text-sm">Nenhum conteÃºdo cadastrado</p>
            <button
              onClick={() => { setEquipeView('form'); window.scrollTo(0, 0) }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#004582] text-white text-sm font-medium hover:bg-[#003366] transition-colors cursor-pointer"
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
        )}
      </section>

      {/* Modais de exclusÃ£o */}
      {deletingBloco && (
        <DeleteModal
          blocoTitulo={deletingBloco.titulo}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingBloco(null)}
        />
      )}
      {deletingValor && (
        <DeleteModal
          blocoTitulo={deletingValor.titulo}
          onConfirm={handleDeleteValorConfirm}
          onCancel={() => setDeletingValor(null)}
        />
      )}
    </div>
  )
}



