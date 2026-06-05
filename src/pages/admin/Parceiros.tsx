import { useState, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, ImageIcon, Link, X, GripVertical, ExternalLink, Search } from 'lucide-react'
import { parceirosService } from '../../services/parceiros.service'
import { uploadService } from '../../services/upload.service'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface Parceiro {
  id: string
  logo: string
  link?: string | null
  nome: string
  posicao: number
}

// â”€â”€ Modal Adicionar / Editar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ParceiroModalProps {
  parceiro: Parceiro | null
  onClose: () => void
  onSave: (data: { nome: string; link: string; imageFile: File | null; imageUrl: string }) => void
}

function ParceiroModal({ parceiro, onClose, onSave }: ParceiroModalProps) {
  const [nome, setNome] = useState(parceiro?.nome ?? '')
  const [link, setLink] = useState(parceiro?.link ?? '')
  const [imageUrl, setImageUrl] = useState(parceiro?.logo ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ nome?: string; link?: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = parceiro !== null

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (!nome.trim())
      newErrors.nome = 'Nome Ã© obrigatÃ³rio'
    else if (nome.trim().length < 2)
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    if (link && link.trim()) {
      try { new URL(link.trim()) }
      catch { newErrors.link = 'Informe uma URL vÃ¡lida (ex: https://www.empresa.com.br)' }
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    onSave({ nome, link, imageFile, imageUrl })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Editar Parceiro' : 'Novo Parceiro'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Upload de logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo do Parceiro
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageUrl ? (
              <div className="relative group border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center h-36">
                <img
                  src={imageUrl}
                  alt={nome}
                  className="max-h-28 max-w-full object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Trocar
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-[#235937] hover:bg-[#f7f3ea] transition-colors cursor-pointer"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#235937] hover:bg-[#235937]/5 transition-colors"
              >
                <ImageIcon size={28} className="text-gray-300" />
                <span className="text-sm text-gray-400 font-medium">
                  Clique para enviar o logo
                </span>
                <span className="text-xs text-gray-300">PNG, JPG, SVG, WEBP</span>
              </button>
            )}
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome do Parceiro <span className="text-red-500">*</span>
            </label>
            <AutoResizeInput
              
              value={nome}
              onChange={(e) => { setNome(e.target.value); setErrors((p) => ({ ...p, nome: undefined })) }}
              placeholder="Ex: Empresa XYZ"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 transition-colors ${
                errors.nome
                  ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                  : 'border-gray-200 focus:ring-[#235937]/30 focus:border-[#235937]'
              }`}
            />
            {errors.nome && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>âš </span> {errors.nome}
              </p>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Link (opcional)
            </label>
            <div className="relative">
              <Link size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <AutoResizeInput
                
                value={link}
                onChange={(e) => { setLink(e.target.value); setErrors((p) => ({ ...p, link: undefined })) }}
                placeholder="https://www.exemplo.com.br"
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm text-gray-800 focus:outline-none focus:ring-2 transition-colors ${
                  errors.link
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                    : 'border-gray-200 focus:ring-[#235937]/30 focus:border-[#235937]'
                }`}
              />
            </div>
            {errors.link && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>âš </span> {errors.link}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              {isEdit ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// â”€â”€ Modal de ExclusÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DeleteModalProps {
  nome: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ nome, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir parceiro</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir o parceiro{' '}
            <span className="font-medium text-gray-700">"{nome}"</span>?
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

// â”€â”€ Card de Parceiro â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ParceiroCardProps {
  parceiro: Parceiro
  isDragging: boolean
  onEdit: () => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnter: () => void
  onDragEnd: () => void
  onTouchMove: (x: number, y: number) => void
}

function ParceiroCard({ parceiro, isDragging, onEdit, onDelete, onDragStart, onDragEnter, onDragEnd, onTouchMove }: ParceiroCardProps) {
  return (
    <div
      data-parceiro-id={parceiro.id}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-all duration-150 ${
        isDragging ? 'opacity-40 scale-95 shadow-lg' : 'opacity-100 scale-100'
      }`}
    >
      {/* Drag handle + logo */}
      <div className="relative bg-gray-50 h-36 flex items-center justify-center p-4 border-b border-gray-100">
        <div
          className="absolute top-2 left-2 text-gray-300 cursor-grab active:cursor-grabbing touch-none p-1"
          onTouchStart={(e) => { e.preventDefault(); onDragStart() }}
          onTouchMove={(e) => { e.preventDefault(); const t = e.touches[0]; onTouchMove(t.clientX, t.clientY) }}
          onTouchEnd={(e) => { e.preventDefault(); onDragEnd() }}
        >
          <GripVertical size={16} />
        </div>
        {parceiro.logo ? (
          <img
            src={parceiro.logo}
            alt={parceiro.nome}
            className="max-h-28 max-w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-300">
            <ImageIcon size={32} />
            <span className="text-xs">Logo</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex-1">
        <p className="text-sm font-medium text-gray-700 truncate">{parceiro.nome}</p>
        {parceiro.link ? (
          <a
            href={parceiro.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#235937] hover:underline mt-0.5 truncate max-w-full"
          >
            <ExternalLink size={11} />
            {parceiro.link.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className="text-xs text-gray-300 mt-0.5 block">Sem link</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-0.5 px-3 py-2 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-gray-400 hover:text-[#235937] hover:bg-[#235937]/10 transition-colors cursor-pointer"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-[#235937] hover:text-[#1b462b] hover:bg-[#f7f3ea] transition-colors cursor-pointer"
          title="Excluir"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// â”€â”€ PÃ¡gina Principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Parceiros() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingParceiro, setEditingParceiro] = useState<Parceiro | null>(null)
  const [deletingParceiro, setDeletingParceiro] = useState<Parceiro | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const parceirosFiltrados = searchTerm.trim()
    ? parceiros.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.link ?? '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : parceiros

  useEffect(() => {
    loadParceiros()
  }, [])

  const loadParceiros = async () => {
    try {
      setLoading(true)
      const data = await parceirosService.getAll()
      setParceiros(data.sort((a: Parceiro, b: Parceiro) => a.posicao - b.posicao))
    } catch (error) {
      console.warn('Erro ao carregar parceiros')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const saveOrder = async () => {
    try {
      await parceirosService.reorder(
        parceiros.map((p, i) => ({ id: p.id, posicao: i }))
      )
    } catch (error) {
      console.error('Erro ao salvar ordem:', error)
    }
  }

  const reorder = (list: Parceiro[]) =>
    list.map((p, i) => ({ ...p, posicao: i }))

  const handleNew = () => {
    setEditingParceiro(null)
    setModalOpen(true)
  }

  const handleEdit = (parceiro: Parceiro) => {
    setEditingParceiro(parceiro)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingParceiro(null)
  }

  const handleSave = async (data: { nome: string; link: string; imageFile: File | null; imageUrl: string }) => {
    try {
      setLoading(true)
      let logoUrl = data.imageUrl

      // Upload da imagem se houver um novo arquivo
      if (data.imageFile) {
        try {
          const uploadResult = await uploadService.uploadImage(data.imageFile, 'parceiros')
          logoUrl = uploadResult.url
        } catch (uploadErr: any) {
          const res = uploadErr?.response?.data
          console.warn(`Upload: ${res?.error || 'NÃ£o foi possÃ­vel enviar a imagem'}`)
          return
        }
      }

      const link = data.link.trim() || null

      if (editingParceiro) {
        // Editar
        await parceirosService.update(editingParceiro.id, {
          nome: data.nome,
          link,
          logo: logoUrl,
          posicao: editingParceiro.posicao,
        })
        toast.success('Parceiro atualizado com sucesso!')
      } else {
        // Criar
        await parceirosService.create({
          nome: data.nome,
          link,
          logo: logoUrl,
          posicao: parceiros.length,
        })
        toast.success('Parceiro adicionado com sucesso!')
      }

      await loadParceiros()
      handleCloseModal()
    } catch (error: any) {
      const res = error?.response?.data
      if (res?.issues?.length > 0) {
        const labels: Record<string, string> = { nome: 'Nome', logo: 'Logo', link: 'Link', posicao: 'PosiÃ§Ã£o' }
        res.issues.forEach((issue: { path: string; message: string }) => {
          const label = labels[issue.path] || issue.path
          console.warn(`Campo "${label}": ${issue.message}`)
        })
      } else {
        console.warn(res?.error || res?.message || 'Erro ao salvar parceiro')
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingParceiro) return
    try {
      setLoading(true)
      await parceirosService.delete(deletingParceiro.id)
      toast.success('Parceiro excluÃ­do com sucesso!')
      await loadParceiros()
      setDeletingParceiro(null)
    } catch (error: any) {
      console.warn(error?.response?.data?.message || 'Erro ao excluir parceiro')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Move ao vivo: chamado tanto no dragEnter quanto no touchMove
  const moveTo = (targetId: string) => {
    if (draggingId === null || draggingId === targetId) return
    setParceiros((prev) => {
      const next = [...prev]
      const fromIdx = next.findIndex((p) => p.id === draggingId)
      const toIdx = next.findIndex((p) => p.id === targetId)
      if (fromIdx === -1 || toIdx === -1) return prev
      const [moved] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, moved)
      return reorder(next)
    })
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    saveOrder()
  }

  const handleTouchMove = (x: number, y: number) => {
    const els = document.querySelectorAll<HTMLElement>('[data-parceiro-id]')
    for (const el of els) {
      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const id = el.getAttribute('data-parceiro-id')
        if (id) moveTo(id)
        break
      }
    }
  }

  return (
    <div>
      {/* CabeÃ§alho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nossos Parceiros</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie os logos e links exibidos na seÃ§Ã£o de parceiros do site
          </p>
        </div>
        <button
          onClick={handleNew}
          className="self-end sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Novo Parceiro
        </button>
      </div>

      {/* Busca */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <AutoResizeInput
          
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou link..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#235937]/30 focus:border-[#235937] transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Grid de cards */}
      {parceiros.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhum parceiro cadastrado</p>
          <p className="text-sm text-gray-400">
            Clique em "Novo Parceiro" para adicionar logos ao site.
          </p>
          <button
            onClick={handleNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Novo Parceiro
          </button>
        </div>
      ) : parceirosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Search size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhum parceiro encontrado</p>
          <p className="text-sm text-gray-400">
            Nenhum resultado para <span className="font-medium text-gray-600">"{searchTerm}"</span>.
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <X size={15} />
            Limpar busca
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          onDragOver={(e) => e.preventDefault()}
        >
          {parceirosFiltrados.map((parceiro) => (
            <ParceiroCard
              key={parceiro.id}
              parceiro={parceiro}
              isDragging={draggingId === parceiro.id}
              onEdit={() => handleEdit(parceiro)}
              onDelete={() => setDeletingParceiro(parceiro)}
              onDragStart={() => setDraggingId(parceiro.id)}
              onDragEnter={() => moveTo(parceiro.id)}
              onDragEnd={handleDragEnd}
              onTouchMove={handleTouchMove}
            />
          ))}

          {/* Card de adicionar */}
          <button
            onClick={handleNew}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 h-full min-h-44 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#235937] hover:border-[#235937] hover:bg-[#235937]/5 transition-colors cursor-pointer"
          >
            <Plus size={24} />
            <span className="text-xs font-medium">Adicionar</span>
          </button>
        </div>
      )}

      {/* Modal adicionar/editar */}
      {modalOpen && (
        <ParceiroModal
          parceiro={editingParceiro}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

      {/* Modal de exclusÃ£o */}
      {deletingParceiro && (
        <DeleteModal
          nome={deletingParceiro.nome}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingParceiro(null)}
        />
      )}
    </div>
  )
}



