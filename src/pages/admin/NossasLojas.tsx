import { useState, useRef, useEffect } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Pencil,
  Trash2,
  ArrowLeft,
  ImageIcon,
  MapPin,
  Clock,
  Phone,
  Navigation,
  GripVertical,
  X,
  Store,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react'
import { nossasLojasService } from '../../services/nossasLojas.service'
import { uploadService } from '../../services/upload.service'
import { resolveImageUrl, BACKEND_URL } from '../../services/api'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface Departamento {
  id: number
  nome: string
  fotos: string[]
}

const DEPARTAMENTOS_PADRAO = [
  'Alimentos',
  'HortiFruti',
  'Padaria',
  'AÃ§ougue',
  'Pet',
  'Papelaria',
]

interface Loja {
  id: string
  nome: string
  imageUrl: string
  rua: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  horarioSemana: string
  horarioDomingo: string
  telefone: string
  whatsapp: string
  linkMaps: string
  cor: string
  departamentos: Departamento[]
}

// -- Drag-and-drop de Departamentos -----------------------------------------

const DEPT_DRAG_TYPE = 'DEPT'
const FOTO_DRAG_TYPE = 'FOTO'

// -- Draggable foto item ----------------------------------------------------

interface DraggableFotoItemProps {
  deptId: number
  foto: string
  idx: number
  onRemove: () => void
  onMove: (dragIdx: number, hoverIdx: number) => void
}

function DraggableFotoItem({ deptId, foto, idx, onRemove, onMove }: DraggableFotoItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<{ deptId: number; idx: number }, void, Record<string, never>>({
    accept: FOTO_DRAG_TYPE,
    hover(item) {
      if (item.deptId !== deptId || item.idx === idx) return
      onMove(item.idx, idx)
      item.idx = idx
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: FOTO_DRAG_TYPE,
    item: { deptId, idx },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`relative group aspect-square rounded-xl overflow-hidden border border-gray-200 cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      <img src={foto} alt={`foto ${idx + 1}`} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-[#235937]"
      >
        <X size={12} />
      </button>
      <div className="absolute bottom-1.5 left-1.5 text-[10px] font-medium bg-black/50 text-white px-1.5 py-0.5 rounded-full">
        {idx + 1}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------

interface DraggableDeptItemProps {
  dept: Departamento
  index: number
  isExpanded: boolean
  onToggle: () => void
  onRemove: () => void
  onMove: (dragIndex: number, hoverIndex: number) => void
  onRename: (id: number, newName: string) => void
  deptFileRefs: React.MutableRefObject<Record<number, HTMLInputElement | null>>
  onDeptFotos: (id: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFoto: (deptId: number, fotoIdx: number) => void
  onMoveFoto: (deptId: number, dragIdx: number, hoverIdx: number) => void
}

function DraggableDeptItem({ dept, index, isExpanded, onToggle, onRemove, onMove, onRename, deptFileRefs, onDeptFotos, onRemoveFoto, onMoveFoto }: DraggableDeptItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(dept.nome)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<{ index: number }, void, Record<string, never>>({
    accept: DEPT_DRAG_TYPE,
    hover(item) {
      if (item.index === index) return
      onMove(item.index, index)
      item.index = index
    },
  })

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DEPT_DRAG_TYPE,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  dragPreview(drop(ref))
  drag(dragHandleRef)

  return (
    <div ref={ref} className={`border border-gray-200 rounded-xl overflow-hidden transition-opacity ${isDragging ? 'opacity-40' : 'opacity-100'}`}>
      {/* Header do departamento */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 select-none"
        onClick={() => { if (!editing) onToggle() }}
        style={{ cursor: editing ? 'default' : 'pointer' }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            ref={dragHandleRef}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 -ml-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={16} />
          </div>
          {editing ? (
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); onRename(dept.id, editName); setEditing(false) }
                if (e.key === 'Escape') { setEditName(dept.nome); setEditing(false) }
              }}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-gray-800 border border-gray-300 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-[#235937]/40 focus:border-[#235937] w-40"
            />
          ) : (
            <span className="text-sm font-medium text-gray-800 truncate">{dept.nome}</span>
          )}
          {dept.fotos.length > 0 && !editing && (
            <span className="text-xs bg-[#235937]/10 text-[#235937] font-semibold px-2 py-0.5 rounded-full shrink-0">
              {dept.fotos.length} foto{dept.fotos.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {editing ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRename(dept.id, editName); setEditing(false) }}
              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors cursor-pointer text-xs font-medium px-2"
              title="Confirmar nome"
            >
              OK
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setEditName(dept.nome); setEditing(true) }}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
              title="Renomear departamento"
            >
              <Pencil size={13} />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="p-1.5 rounded-lg hover:bg-[#f7f3ea] text-gray-400 hover:text-[#235937] transition-colors cursor-pointer"
            title="Remover departamento"
          >
            <Trash2 size={14} />
          </button>
          {!editing && (isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />)}
        </div>
      </div>

      {/* ConteÃºdo expandido */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {dept.fotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {dept.fotos.map((foto, idx) => (
                <DraggableFotoItem
                  key={`${dept.id}-${idx}-${foto}`}
                  deptId={dept.id}
                  foto={foto}
                  idx={idx}
                  onRemove={() => onRemoveFoto(dept.id, idx)}
                  onMove={(dragIdx, hoverIdx) => onMoveFoto(dept.id, dragIdx, hoverIdx)}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => deptFileRefs.current[dept.id]?.click()}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-[#235937] hover:text-[#235937] hover:bg-[#235937]/5 transition-colors cursor-pointer"
          >
            <ImageIcon size={20} />
            <span className="text-sm font-medium">Clique para adicionar fotos</span>
            <span className="text-xs">VocÃª pode selecionar vÃ¡rias fotos de uma vez</span>
          </button>
          <input
            ref={(el) => { deptFileRefs.current[dept.id] = el }}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onDeptFotos(dept.id, e)}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

// -- FormulÃ¡rio (pÃ¡gina interna) --------------------------------------------

interface LojaFormProps {
  loja: Loja | null
  onBack: () => void
  onSave: (data: { 
    nome: string
    imageFile: File | null
    imageUrl: string
    rua: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    horarioSemana: string
    horarioDomingo: string
    telefone: string
    whatsapp: string
    linkMaps: string
    cor: string
    departamentos: Departamento[]
    departamentosFiles: Record<number, File[]>
  }) => void
}

// -- FunÃ§Ãµes de mÃ¡scara -----------------------------------------------------

function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
}

function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
}

function LojaForm({ loja, onBack, onSave }: LojaFormProps) {
  const [nome, setNome] = useState(loja?.nome ?? '')
  const [imageUrl, setImageUrl] = useState(loja?.imageUrl ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [rua, setRua] = useState(loja?.rua ?? '')
  const [bairro, setBairro] = useState(loja?.bairro ?? '')
  const [cidade, setCidade] = useState(loja?.cidade ?? '')
  const [estado, setEstado] = useState(loja?.estado ?? '')
  const [cep, setCep] = useState(loja?.cep ? formatCEP(loja.cep) : '')
  const [horarioSemana, setHorarioSemana] = useState(loja?.horarioSemana ?? '')
  const [horarioDomingo, setHorarioDomingo] = useState(loja?.horarioDomingo ?? '')
  const [telefone, setTelefone] = useState(loja?.telefone ? formatPhone(loja.telefone) : '')
  const [whatsapp, setWhatsapp] = useState(loja?.whatsapp ? formatPhone(loja.whatsapp) : '')
  const [linkMaps, setLinkMaps] = useState(loja?.linkMaps ?? '')
  const cor = '#004582'
  const [departamentos, setDepartamentos] = useState<Departamento[]>(
    loja?.departamentos ?? DEPARTAMENTOS_PADRAO.map((n, i) => ({ id: i + 1, nome: n, fotos: [] }))
  )
  const [departamentosFiles, setDepartamentosFiles] = useState<Record<number, File[]>>({})
  const [expandedDept, setExpandedDept] = useState<number | null>(null)
  const [loadingCep, setLoadingCep] = useState(false)
  const [newDeptName, setNewDeptName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const deptFileRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const handleRemoveDept = (id: number) => {
    setDepartamentos((prev) => prev.filter((d) => d.id !== id))
  }

  const handleMoveDept = (dragIndex: number, hoverIndex: number) => {
    setDepartamentos((prev) => {
      const next = [...prev]
      const [removed] = next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, removed)
      return next
    })
  }

  const handleRenameDept = (id: number, newName: string) => {
    const name = newName.trim()
    if (!name) return
    setDepartamentos((prev) => prev.map(d => d.id === id ? { ...d, nome: name } : d))
  }

  const handleMoveFoto = (deptId: number, dragIdx: number, hoverIdx: number) => {
    setDepartamentos((prev) => prev.map(d => {
      if (d.id !== deptId) return d
      const fotos = [...d.fotos]
      const [removed] = fotos.splice(dragIdx, 1)
      fotos.splice(hoverIdx, 0, removed)
      return { ...d, fotos }
    }))
  }

  const handleAddDept = () => {
    const name = newDeptName.trim()
    if (!name) return
    const newId = Date.now()
    setDepartamentos((prev) => [...prev, { id: newId, nome: name, fotos: [] }])
    setNewDeptName('')
  }

  const handleDeptFotos = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    
    // Armazena os arquivos para upload posterior
    setDepartamentosFiles((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), ...files]
    }))
    
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((urls) => {
      setDepartamentos((prev) =>
        prev.map((d) => (d.id === id ? { ...d, fotos: [...d.fotos, ...urls] } : d))
      )
    })
    // reset input so same file can be re-added
    if (deptFileRefs.current[id]) deptFileRefs.current[id]!.value = ''
  }

  const handleRemoveFoto = (deptId: number, fotoIdx: number) => {
    setDepartamentos((prev) =>
      prev.map((d) =>
        d.id === deptId ? { ...d, fotos: d.fotos.filter((_, i) => i !== fotoIdx) } : d
      )
    )
  }

  const handleCepChange = async (value: string) => {
    const formatted = formatCEP(value)
    setCep(formatted)
    setLoadingCep(false)
  }

  const isEdit = loja !== null

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
    onSave({
      nome,
      imageFile,
      imageUrl,
      rua,
      bairro,
      cidade,
      estado,
      cep,
      horarioSemana,
      horarioDomingo,
      telefone,
      whatsapp,
      linkMaps,
      cor,
      departamentos,
      departamentosFiles,
    })
  }

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/40 focus:border-[#235937] transition-colors'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
  const sectionClass = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5'

  return (
    <DndProvider backend={HTML5Backend}>
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
            {isEdit ? 'Editar Loja' : 'Nova Loja'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Nossas Lojas</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
            InformaÃ§Ãµes Gerais
          </h2>

          <div>
            <label className={labelClass}>
              Nome da Loja <span className="text-red-500">*</span>
            </label>
            <AutoResizeInput
              
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Loja Centro"
              required
              className={inputClass}
            />
          </div>



          <div>
            <label className={labelClass}>Foto da Loja</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-[#235937] transition-colors"
            >
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="w-full h-56 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
                  <ImageIcon size={32} />
                  <span className="text-sm">Clique para enviar uma foto</span>
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
            <p className="mt-2 text-xs text-gray-400">DimensÃ£o recomendada: <span className="font-medium text-gray-500">1200 Ã— 800 px</span>. Tamanho mÃ¡ximo: <span className="font-medium text-gray-500">2 MB</span>.</p>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[#235937]" />
            EndereÃ§o
          </h2>

          <div>
            <label className={labelClass}>
              Rua / Logradouro <span className="text-red-500">*</span>
            </label>
            <AutoResizeInput
              
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              placeholder="Ex: Rua das Flores, 1234"
              required
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bairro</label>
              <AutoResizeInput
                
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Centro"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>CEP</label>
              <div className="relative">
                <AutoResizeInput
                  
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="Ex: 01234-567"
                  maxLength={9}
                  className={inputClass}
                />
                {loadingCep && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#235937] border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cidade</label>
              <AutoResizeInput
                
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Ex: SÃ£o Paulo"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Estado (UF)</label>
              <AutoResizeInput
                
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="Ex: SP"
                maxLength={2}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5">
                <Navigation size={14} className="text-[#235937]" />
                Link Google Maps ("Como Chegar")
              </span>
            </label>
            <input
              type="url"
              value={linkMaps}
              onChange={(e) => setLinkMaps(e.target.value)}
              placeholder="https://maps.google.com/..."
              className={inputClass}
            />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Clock size={16} className="text-[#235937]" />
            HorÃ¡rio de Funcionamento
          </h2>

          <div>
            <label className={labelClass}>Segunda a SÃ¡bado</label>
            <AutoResizeInput
              
              value={horarioSemana}
              onChange={(e) => setHorarioSemana(e.target.value)}
              placeholder="Ex: Segunda a SÃ¡bado: 7h Ã s 22h"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Domingo</label>
            <AutoResizeInput
              
              value={horarioDomingo}
              onChange={(e) => setHorarioDomingo(e.target.value)}
              placeholder="Ex: Domingo: 8h Ã s 20h"
              className={inputClass}
            />
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Phone size={16} className="text-[#235937]" />
            Contato
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Telefone</label>
              <AutoResizeInput
                
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="Ex: (11) 3456-7890"
                maxLength={15}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <AutoResizeInput
                
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                placeholder="Ex: (11) 98765-4321"
                maxLength={15}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Fotos dos Departamentos */}
        <div className={sectionClass}>
          <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Store size={16} className="text-[#235937]" />
            Fotos dos Departamentos
          </h2>

          <div className="space-y-3">
            {departamentos.map((dept, index) => (
              <DraggableDeptItem
                key={dept.id}
                dept={dept}
                index={index}
                isExpanded={expandedDept === dept.id}
                onToggle={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                onRemove={() => handleRemoveDept(dept.id)}
                onMove={handleMoveDept}
                onRename={handleRenameDept}
                deptFileRefs={deptFileRefs}
                onDeptFotos={handleDeptFotos}
                onRemoveFoto={handleRemoveFoto}
                onMoveFoto={handleMoveFoto}
              />
            ))}
          </div>

          {/* Adicionar novo departamento */}
          <div className="flex items-center gap-2 mt-3">
            <AutoResizeInput
              
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDept() } }}
              placeholder="Nome do novo departamento..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/40 focus:border-[#235937] transition-colors"
            />
            <button
              type="button"
              onClick={handleAddDept}
              disabled={!newDeptName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus size={15} />
              Adicionar
            </button>
          </div>
        </div>

        {/* PrÃ©-visualizaÃ§Ã£o */}
        {(nome || imageUrl) && (
          <div className={`${sectionClass} admin-preview-surface`}>
            <h2 className="text-base font-semibold text-gray-700 border-b border-gray-100 pb-3">
              PrÃ©-visualizaÃ§Ã£o
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Imagem */}
              <div className="lg:order-2">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={nome}
                    className="w-full h-auto object-cover rounded-3xl border-4 shadow-lg"
                    style={{ borderColor: cor }}
                  />
                ) : (
                  <div className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300">
                    <ImageIcon size={32} />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                )}
              </div>
              {/* ConteÃºdo */}
              <div className="lg:order-1">
                {nome && (
                  <h3 className="text-4xl font-bold mb-6" style={{ color: cor }}>{nome}</h3>
                )}
                <div className="space-y-4">
                  {(rua || bairro || cidade) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: cor }} />
                        <div className="space-y-1">
                          {rua && <p className="font-semibold text-gray-900 text-base">{rua}</p>}
                          {bairro && <p className="text-gray-600">{bairro}</p>}
                          {cidade && (
                            <p className="text-gray-600">{cidade}{estado ? ` - ${estado}` : ''}</p>
                          )}
                          {cep && <p className="text-gray-600">CEP: {cep}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {(horarioSemana || horarioDomingo) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <Clock size={20} className="mt-0.5 shrink-0" style={{ color: cor }} />
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 text-base">HorÃ¡rio de Funcionamento</p>
                          {horarioSemana && <p className="text-gray-600"><span className="font-medium">Seg. a SÃ¡b.:</span> {horarioSemana}</p>}
                          {horarioDomingo && <p className="text-gray-600"><span className="font-medium">Domingo:</span> {horarioDomingo}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {(telefone || whatsapp) && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start gap-3">
                        <Phone size={20} className="mt-0.5 shrink-0" style={{ color: cor }} />
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900 text-base">Contato</p>
                          {telefone && <p className="text-gray-600">Telefone: {telefone}</p>}
                          {whatsapp && <p className="text-gray-600">WhatsApp: {whatsapp}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {linkMaps && (
                    <a
                      href={linkMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: cor }}
                    >
                      <Navigation size={18} />
                      Como Chegar
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Departamentos preview */}
            {departamentos.some((d) => d.fotos.length > 0) && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Nossos Departamentos</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {departamentos.filter((d) => d.fotos.length > 0).map((dept) => (
                    <div key={dept.id} className="relative overflow-hidden shadow-lg w-full max-w-[370px] h-[220px] sm:h-[280px] rounded-2xl">
                      <img
                        src={dept.fotos[0]}
                        alt={dept.nome}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 py-4 px-3 flex items-center justify-center"
                        style={{ backgroundColor: '#235937' }}
                      >
                        <span className="text-white font-bold text-center leading-tight tracking-wide" style={{ fontSize: '24px' }}>{dept.nome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            {isEdit ? 'Salvar AlteraÃ§Ãµes' : 'Adicionar Loja'}
          </button>
        </div>
      </form>
    </div>
    </DndProvider>
  )
}

// -- Card da Loja --------------------------------------------------------------

interface LojaCardProps {
  loja: Loja
  onEdit: (loja: Loja) => void
}

function LojaCard({ loja, onEdit }: LojaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">{loja.nome}</span>
        <button
          onClick={() => onEdit(loja)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#235937] transition-colors cursor-pointer"
          title="Editar"
        >
          <Pencil size={15} />
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Imagem */}
        <div className="lg:order-2">
          {loja.imageUrl ? (
            <img
              src={loja.imageUrl}
              alt={loja.nome}
              className="w-full h-auto object-cover rounded-3xl border-4 shadow-lg"
              style={{ borderColor: '#004582' }}
            />
          ) : (
            <div className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-300">
              <ImageIcon size={32} />
              <span className="text-xs">Sem imagem</span>
            </div>
          )}
        </div>

        {/* ConteÃºdo */}
        <div className="lg:order-1">
          <h3 className="text-4xl font-bold mb-6" style={{ color: '#004582' }}>{loja.nome}</h3>
          <div className="space-y-4">
            {(loja.rua || loja.bairro || loja.cidade) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0" style={{ color: '#004582' }} />
                  <div className="space-y-1">
                    {loja.rua && <p className="font-semibold text-gray-900 text-base">{loja.rua}</p>}
                    {loja.bairro && <p className="text-gray-600">{loja.bairro}</p>}
                    {loja.cidade && (
                      <p className="text-gray-600">{loja.cidade}{loja.estado ? ` - ${loja.estado}` : ''}</p>
                    )}
                    {loja.cep && <p className="text-gray-600">CEP: {loja.cep}</p>}
                  </div>
                </div>
              </div>
            )}

            {(loja.horarioSemana || loja.horarioDomingo) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 shrink-0" style={{ color: '#004582' }} />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-base">HorÃ¡rio de Funcionamento</p>
                    {loja.horarioSemana && <p className="text-gray-600"><span className="font-medium">Seg. a SÃ¡b.:</span> {loja.horarioSemana}</p>}
                    {loja.horarioDomingo && <p className="text-gray-600"><span className="font-medium">Domingo:</span> {loja.horarioDomingo}</p>}
                  </div>
                </div>
              </div>
            )}

            {(loja.telefone || loja.whatsapp) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 shrink-0" style={{ color: '#004582' }} />
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-base">Contato</p>
                    {loja.telefone && <p className="text-gray-600">Telefone: {loja.telefone}</p>}
                    {loja.whatsapp && <p className="text-gray-600">WhatsApp: {loja.whatsapp}</p>}
                  </div>
                </div>
              </div>
            )}

            {loja.linkMaps && (
              <a
                href={loja.linkMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-base shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#004582' }}
              >
                <Navigation size={18} />
                Como Chegar
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Departamentos */}
      {loja.departamentos?.some((d) => d.fotos.length > 0) && (
        <div className="px-5 pb-5 pt-1">
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-base font-bold text-gray-800 mb-4">Nossos Departamentos</h4>
            <div className="flex flex-wrap gap-4">
              {loja.departamentos.filter((d) => d.fotos.length > 0).map((dept) => (
                <div
                  key={dept.id}
                  className="relative overflow-hidden shadow-lg shrink-0"
                  style={{ width: '370px', height: '280px', borderRadius: '16px' }}
                >
                  <img
                    src={dept.fotos[0]}
                    alt={dept.nome}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 py-4 px-3 flex items-center justify-center"
                    style={{ backgroundColor: '#235937' }}
                  >
                    <span
                      className="text-white font-bold text-center leading-tight tracking-wide"
                      style={{ fontSize: '24px' }}
                    >
                      {dept.nome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// -- PÃ¡gina Principal ----------------------------------------------------------

export default function NossasLojas() {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingLoja, setEditingLoja] = useState<Loja | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadLojas()
  }, [])

  // Mapeia departamentos do backend para frontend
  const mapBackendToFrontend = (data: any): Loja => {
    // Prefer dynamic departamentos array if present, fallback to legacy fixed fields
    let departamentos: Departamento[]
    if (Array.isArray(data.departamentos) && data.departamentos.length > 0) {
      departamentos = data.departamentos.map((d: any, i: number) => ({
        id: i + 1,
        nome: d.nome,
        fotos: (d.fotos as string[]).map((f: string) => resolveImageUrl(f)),
      }))
    } else {
      departamentos = [
        { id: 1, nome: 'Alimentos', fotos: (data.fotosAlimentos || []).map(resolveImageUrl) },
        { id: 2, nome: 'HortiFruti', fotos: (data.fotosHortifruti || []).map(resolveImageUrl) },
        { id: 3, nome: 'Padaria', fotos: (data.fotosPadaria || []).map(resolveImageUrl) },
        { id: 4, nome: 'AÃ§ougue', fotos: (data.fotosAcougue || []).map(resolveImageUrl) },
        { id: 5, nome: 'Pet', fotos: (data.fotosPet || []).map(resolveImageUrl) },
        { id: 6, nome: 'Papelaria', fotos: (data.fotosPapelaria || []).map(resolveImageUrl) },
      ]
    }

    return {
      id: data.id,
      nome: data.nomeLoja,
      imageUrl: resolveImageUrl(data.fotoLoja),
      rua: data.rua,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      horarioSemana: data.segundaSabado,
      horarioDomingo: data.domingo,
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      linkMaps: data.linkMaps || '',
      cor: data.cor,
      departamentos,
    }
  }

  const loadLojas = async () => {
    try {
      setLoading(true)
      const data = await nossasLojasService.getAll()
      setLojas(data.map(mapBackendToFrontend))
    } catch (error) {
      console.warn('Erro ao carregar lojas')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingLoja(null)
    setView('form')
    window.scrollTo(0, 0)
  }

  const handleEdit = (loja: Loja) => {
    setEditingLoja(loja)
    setView('form')
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setView('list')
    setEditingLoja(null)
  }

  const handleSave = async (data: {
    nome: string
    imageFile: File | null
    imageUrl: string
    rua: string
    bairro: string
    cidade: string
    estado: string
    cep: string
    horarioSemana: string
    horarioDomingo: string
    telefone: string
    whatsapp: string
    linkMaps: string
    cor: string
    departamentos: Departamento[]
    departamentosFiles: Record<number, File[]>
  }) => {
    try {
      setLoading(true)
      
      let fotoLojaUrl = data.imageUrl

      // Upload da foto principal se houver novo arquivo
      if (data.imageFile) {
        toast.info('Fazendo upload da foto principal...')
        const uploadResult = await uploadService.uploadImage(data.imageFile, 'nossasLojas')
        fotoLojaUrl = uploadResult.url
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // ValidaÃ§Ã£o: a foto Ã© obrigatÃ³ria e deve ser uma URL vÃ¡lida (nÃ£o data URL)
      if (!fotoLojaUrl || fotoLojaUrl.startsWith('data:')) {
        console.warn('Por favor, adicione uma foto da loja')
        setLoading(false)
        return
      }

      // Validar campos obrigatÃ³rios
      if (!data.nome || !data.rua || !data.bairro || !data.cidade || !data.estado || !data.cep) {
        console.warn('Preencha todos os campos obrigatÃ³rios')
        setLoading(false)
        return
      }

      if (!data.horarioSemana || !data.horarioDomingo) {
        console.warn('Preencha os horÃ¡rios de funcionamento')
        setLoading(false)
        return
      }

      if (!data.telefone || !data.whatsapp) {
        console.warn('Preencha os dados de contato')
        setLoading(false)
        return
      }

      // Validar CEP (deve ter 8 dÃ­gitos)
      const cepNumeros = data.cep.replace(/\D/g, '')
      if (cepNumeros.length !== 8) {
        console.warn('CEP deve conter 8 dÃ­gitos')
        setLoading(false)
        return
      }

      // Validar Estado (deve ter 2 caracteres)
      if (data.estado.length !== 2) {
        console.warn('Estado deve conter 2 caracteres (UF)')
        setLoading(false)
        return
      }

      // helper: strip backend URL prefix to get relative path
      const toRelUrl = (url: string) =>
        url.startsWith(BACKEND_URL) ? url.slice(BACKEND_URL.length) : url

      // Preparar arrays de fotos dos departamentos (manter URLs existentes)
      const fotosMap: Record<string, string[]> = {
        'Alimentos': [],
        'HortiFruti': [],
        'Padaria': [],
        'AÃ§ougue': [],
        'Pet': [],
        'Papelaria': [],
      }

      // Mapa dinÃ¢mico para departamentos genÃ©ricos
      const deptFotosMap: Record<number, string[]> = {}
      for (const dept of data.departamentos) {
        const fotosExistentes = dept.fotos
          .filter(f => !f.startsWith('data:'))
          .map(toRelUrl)
        deptFotosMap[dept.id] = fotosExistentes
      }

      // Upload de novos arquivos de departamentos (com delay para respeitar rate limit)
      let totalUploads = 0
      for (const files of Object.values(data.departamentosFiles)) {
        totalUploads += files?.length || 0
      }
      
      if (totalUploads > 0) {
        let uploadCount = 0
        
        for (const [deptId, files] of Object.entries(data.departamentosFiles)) {
          if (files && files.length > 0) {
            const dept = data.departamentos.find(d => d.id === Number(deptId))
            if (dept) {
              if (!deptFotosMap[dept.id]) deptFotosMap[dept.id] = []
              for (const file of files) {
                uploadCount++
                toast.info(`Fazendo upload: foto ${uploadCount} de ${totalUploads}...`, { duration: 1000 })
                const uploadResult = await uploadService.uploadImage(file, 'nossasLojas')
                deptFotosMap[dept.id].push(toRelUrl(uploadResult.url))
                // Delay de 1 segundo entre uploads para respeitar rate limit (30 req/min)
                if (uploadCount < totalUploads) {
                  await new Promise(resolve => setTimeout(resolve, 1000))
                }
              }
            }
          }
        }
      }

      // Sincroniza campos legados a partir do deptFotosMap (sem referÃªncia compartilhada)
      for (const dept of data.departamentos) {
        if (fotosMap[dept.nome] !== undefined) {
          fotosMap[dept.nome] = [...(deptFotosMap[dept.id] ?? [])]
        }
      }

      // Mantem uploads locais em um formato reutilizavel.
      const normalizedFotoLoja = fotoLojaUrl.startsWith(BACKEND_URL)
        ? fotoLojaUrl.slice(BACKEND_URL.length)
        : fotoLojaUrl

      const lojaData = {
        nomeLoja: data.nome,
        cor: data.cor,
        fotoLoja: normalizedFotoLoja,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        cep: data.cep.replace(/\D/g, ''),
        estado: data.estado.toUpperCase(),
        linkMaps: data.linkMaps && data.linkMaps.trim() !== '' ? data.linkMaps : null,
        segundaSabado: data.horarioSemana,
        domingo: data.horarioDomingo,
        telefone: data.telefone.replace(/\D/g, ''),
        whatsapp: data.whatsapp.replace(/\D/g, ''),
        fotosAlimentos: fotosMap['Alimentos'],
        fotosHortifruti: fotosMap['HortiFruti'],
        fotosPadaria: fotosMap['Padaria'],
        fotosAcougue: fotosMap['AÃ§ougue'],
        fotosPet: fotosMap['Pet'],
        fotosPapelaria: fotosMap['Papelaria'],
        departamentos: data.departamentos.map(dept => ({
          nome: dept.nome,
          fotos: deptFotosMap[dept.id] ?? [],
        })),
      }

      console.log('Dados enviados ao backend:', lojaData)

      if (editingLoja) {
        await nossasLojasService.update(editingLoja.id, lojaData)
        toast.success('Loja atualizada com sucesso!')
      } else {
        await nossasLojasService.create(lojaData)
        toast.success('Loja adicionada com sucesso!')
      }

      await loadLojas()
      handleBack()
    } catch (error: any) {
      console.error('Erro completo:', error)
      console.error('Resposta do backend:', error?.response?.data)
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao salvar loja'
      console.warn(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (view === 'form') {
    return (
      <LojaForm
        loja={editingLoja}
        onBack={handleBack}
        onSave={handleSave}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nossas Lojas</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie as informaÃ§Ãµes das lojas exibidas no site
          </p>
        </div>
        {lojas.length < 2 && (
          <button
            onClick={handleNew}
            className="self-end sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={18} />
            Nova Loja
          </button>
        )}
      </div>

      {loading && lojas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 border-4 border-[#235937] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Carregando lojas...</p>
        </div>
      ) : lojas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Store size={28} className="text-gray-400" />
          </div>
          <p className="font-medium text-gray-600">Nenhuma loja cadastrada</p>
          <p className="text-sm text-gray-400">
            Clique em "Nova Loja" para adicionar a primeira loja.
          </p>
          <button
            onClick={handleNew}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Nova Loja
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {lojas.map((loja) => (
            <LojaCard
              key={loja.id}
              loja={loja}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

