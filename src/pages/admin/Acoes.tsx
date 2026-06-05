import { useState, useRef, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  ImageIcon,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { acoesService, type Acao as AcaoAPI } from '../../services/acoes.service'
import { uploadService } from '../../services/upload.service'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface Acao {
  id: string
  categoria: string
  titulo: string
  descricao: string
  imageUrl: string
  cor: string
  ordem?: number
}

const categorias = [
  'Meio ambiente',
  'Animais',
  'Social',
  'SaÃºde',
  'EducaÃ§Ã£o',
  'Institucional',
]

// â”€â”€ FormulÃ¡rio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface AcaoFormProps {
  acao: Acao | null
  onBack: () => void
  onSave: (data: Omit<Acao, 'id'>) => void
  nextOrdem: number
}

function AcaoForm({ acao, onBack, onSave, nextOrdem }: AcaoFormProps) {
  const [categoria, setCategoria] = useState(acao?.categoria ?? categorias[0])
  const [titulo, setTitulo] = useState(acao?.titulo ?? '')
  const [descricao, setDescricao] = useState(acao?.descricao ?? '')
  const [imageUrl, setImageUrl] = useState(acao?.imageUrl ?? '')
  const cor = '#004582'
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = acao !== null

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const result = await uploadService.uploadImage(file, 'nossaHistoria')
      setImageUrl(result.url)
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      console.warn('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data: Omit<AcaoAPI, 'id'> = {
        categoria,
        titulo,
        descricao,
        imagem: imageUrl,
        cor,
      }
      
      if (isEdit && acao?.id) {
        await acoesService.update(acao.id, data)
      } else {
        await acoesService.create(data)
      }
      
      onSave(data)
      toast.success(isEdit ? 'AÃ§Ã£o atualizada com sucesso!' : 'AÃ§Ã£o criada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar aÃ§Ã£o:', error)
      console.warn('Erro ao salvar aÃ§Ã£o')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/40 focus:border-[#235937] transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionClass =
    'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5'

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Editar AÃ§Ã£o' : 'Nova AÃ§Ã£o'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">AÃ§Ãµes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* InformaÃ§Ãµes */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
            InformaÃ§Ãµes da AÃ§Ã£o
          </h2>

          <div>
            <label className={labelClass}>
              Categoria <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                    categoria === cat
                      ? 'bg-[#235937] text-white border-[#235937]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#235937] hover:text-[#235937]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>



          <div>
            <label className={labelClass}>
              TÃ­tulo <span className="text-red-500">*</span>
            </label>
            <AutoResizeInput
              
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Ponto de recolhimento de pilhas e baterias usadas"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              DescriÃ§Ã£o <span className="text-red-500">*</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a aÃ§Ã£o social do supermercado..."
              required
              rows={5}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Imagem */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <ImageIcon size={16} className="text-[#235937]" />
            Imagem
          </h2>

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#235937] transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
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
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Clique para alterar
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-gray-400">
                <ImageIcon size={32} />
                <span className="text-sm">Clique para enviar uma imagem</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Preview */}
        {(titulo || imageUrl) && (
          <div className={`${sectionClass} admin-preview-surface`}>
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
              PrÃ©-visualizaÃ§Ã£o
            </h2>
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                (acao?.ordem ?? nextOrdem) % 2 === 0 ? '' : ''
              }`}
            >
              {/* Imagem */}
              <div className={(acao?.ordem ?? nextOrdem) % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={titulo}
                    className="w-full h-64 object-cover rounded-2xl shadow-md border-4"
                    style={{ borderColor: cor }}
                  />
                ) : (
                  <div className="w-full h-64 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center gap-1 text-gray-300" style={{ borderColor: cor }}>
                    <ImageIcon size={32} />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                )}
              </div>
              {/* Texto */}
              <div className={`${(acao?.ordem ?? nextOrdem) % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} max-w-[550px] mx-auto lg:mx-0 break-words`}>
                {categoria && (
                  <span
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                    style={{ backgroundColor: cor + '22', color: cor }}
                  >
                    {categoria}
                  </span>
                )}
                {titulo && (
                  <h3 className="text-2xl font-bold mb-3 leading-tight" style={{ color: cor }}>
                    {titulo}
                  </h3>
                )}
                {descricao && (
                  <p className="text-gray-600 text-sm leading-relaxed">{descricao}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-5 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Salvando...' : isEdit ? 'Salvar AlteraÃ§Ãµes' : 'Adicionar AÃ§Ã£o'}
          </button>
        </div>
      </form>
    </div>
  )
}

// â”€â”€ Modal de exclusÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DeleteModalProps {
  titulo: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ titulo, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir aÃ§Ã£o</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{titulo}"</span>? Esta
            aÃ§Ã£o nÃ£o pode ser desfeita.
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

// â”€â”€ Card da AÃ§Ã£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface AcaoCardProps {
  acao: Acao
  onEdit: (acao: Acao) => void
  onDelete: (acao: Acao) => void
}

function AcaoCard({ acao, onEdit, onDelete }: AcaoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">#{acao.ordem}</span>
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#00458222', color: '#004582' }}
          >
            {acao.categoria}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(acao)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#235937] transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(acao)}
            className="p-2 rounded-lg hover:bg-[#f7f3ea] text-[#235937] hover:text-[#1b462b] transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Imagem */}
        <div className={acao.ordem % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
          {acao.imageUrl ? (
            <img
              src={acao.imageUrl}
              alt={acao.titulo}
              className="w-full h-52 object-cover rounded-2xl shadow-md border-4"
              style={{ borderColor: '#004582' }}
            />
          ) : (
            <div className="w-full h-52 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center gap-1 text-gray-300" style={{ borderColor: '#004582' }}>
              <ImageIcon size={28} />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className={`${acao.ordem % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} overflow-hidden break-words min-w-0`}>
          <h3 className="text-lg font-bold mb-2 leading-snug" style={{ color: '#004582' }}>
            {acao.titulo}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">
            {acao.descricao}
          </p>
        </div>
      </div>
    </div>
  )
}

// â”€â”€ PÃ¡gina Principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Acoes() {
  const [acoes, setAcoes] = useState<Acao[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingAcao, setEditingAcao] = useState<Acao | null>(null)
  const [deletingAcao, setDeletingAcao] = useState<Acao | null>(null)

  useEffect(() => {
    loadAcoes()
  }, [])

  const loadAcoes = async () => {
    try {
      setLoading(true)
      const data = await acoesService.getAll()
      setAcoes(data.map((acao: AcaoAPI, index: number) => ({
        id: acao.id!,
        categoria: acao.categoria,
        titulo: acao.titulo,
        descricao: acao.descricao,
        imageUrl: acao.imagem,
        cor: '#004582',
        ordem: index + 1,
      })))
    } catch (error) {
      console.error('Erro ao carregar aÃ§Ãµes:', error)
      console.warn('Erro ao carregar aÃ§Ãµes')
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingAcao(null)
    setView('form')
    window.scrollTo(0, 0)
  }

  const handleEdit = (acao: Acao) => {
    setEditingAcao(acao)
    setView('form')
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setView('list')
    setEditingAcao(null)
    loadAcoes() // Recarrega a lista apÃ³s salvar
  }

  const handleSave = async (data: Omit<AcaoAPI, 'id'>) => {
    // O salvamento jÃ¡ foi feito no form, apenas precisamos voltar
    handleBack()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingAcao) return
    try {
      await acoesService.delete(deletingAcao.id)
      setDeletingAcao(null)
      loadAcoes()
      toast.success('AÃ§Ã£o excluÃ­da com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir aÃ§Ã£o:', error)
      console.warn('Erro ao excluir aÃ§Ã£o')
    }
  }

  if (view === 'form') {
    return (
      <AcaoForm
        acao={editingAcao}
        onBack={handleBack}
        onSave={handleSave}
        nextOrdem={acoes.length + 1}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#235937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando aÃ§Ãµes...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AÃ§Ãµes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie as aÃ§Ãµes sociais exibidas no site
          </p>
        </div>
        <button
          onClick={handleNew}
          className="self-end sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Nova AÃ§Ã£o
        </button>
      </div>

      {acoes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Zap size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhuma aÃ§Ã£o cadastrada</p>
          <p className="text-sm text-gray-400">
            Clique em "Nova AÃ§Ã£o" para adicionar aÃ§Ãµes sociais do supermercado.
          </p>
          <button
            onClick={handleNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Nova AÃ§Ã£o
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {acoes.map((acao) => (
            <AcaoCard
              key={acao.id}
              acao={acao}
              onEdit={handleEdit}
              onDelete={setDeletingAcao}
            />
          ))}

          <button
            onClick={handleNew}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium text-gray-400 hover:text-[#235937] hover:border-[#235937] hover:bg-[#235937]/5 transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Adicionar nova aÃ§Ã£o
          </button>
        </div>
      )}

      {deletingAcao && (
        <DeleteModal
          titulo={deletingAcao.titulo}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingAcao(null)}
        />
      )}
    </div>
  )
}



