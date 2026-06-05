import { useState, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, Clock, Users, ChefHat, AlertTriangle, ArrowLeft, BookOpen, ImageIcon, Upload, X } from 'lucide-react'
import { receitasService, type Receita as ReceitaAPI, type Dificuldade } from '../../services/receitas.service'
import { uploadService } from '../../services/upload.service'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface Receita {
  id: string
  title: string
  description: string
  ingredients: string
  preparation: string
  prepTime: string
  servings: number
  difficulty: 'FÃ¡cil' | 'MÃ©dio' | 'DifÃ­cil'
  tips: string
  imageUrl: string
}

const difficultyColors: Record<Receita['difficulty'], string> = {
  'FÃ¡cil': 'bg-green-100 text-green-700',
  'MÃ©dio': 'bg-yellow-100 text-yellow-700',
  'DifÃ­cil': 'bg-red-100 text-red-700',
}

// Mapear entre frontend e backend
const difficultyMap: Record<Receita['difficulty'], Dificuldade> = {
  'FÃ¡cil': 'facil',
  'MÃ©dio': 'medio',
  'DifÃ­cil': 'dificil',
}

const difficultyMapReverse: Record<Dificuldade, Receita['difficulty']> = {
  'facil': 'FÃ¡cil',
  'medio': 'MÃ©dio',
  'dificil': 'DifÃ­cil',
}

// â”€â”€ FormulÃ¡rio (pÃ¡gina interna) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ReceitaFormProps {
  receita: Receita | null
  onBack: () => void
  onSave: (data: Omit<Receita, 'id'>) => void
}

function ReceitaForm({ receita, onBack, onSave }: ReceitaFormProps) {
  const [title, setTitle] = useState(receita?.title ?? '')
  const [description, setDescription] = useState(receita?.description ?? '')
  const [ingredients, setIngredients] = useState(receita?.ingredients ?? '')
  const [preparation, setPreparation] = useState(receita?.preparation ?? '')
  const [prepTime, setPrepTime] = useState(receita?.prepTime ?? '')
  const [servings, setServings] = useState(receita?.servings ?? 2)
  const [difficulty, setDifficulty] = useState<Receita['difficulty']>(receita?.difficulty ?? 'FÃ¡cil')
  const [tips, setTips] = useState(receita?.tips ?? '')
  const [imageUrl, setImageUrl] = useState(receita?.imageUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEdit = receita !== null

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const result = await uploadService.uploadImage(file, 'receitas')
      setImageUrl(result.url)
    } catch (error: any) {
      console.error('Erro ao fazer upload da imagem:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao fazer upload da imagem'
      console.warn(`Erro ao fazer upload: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ title, description, ingredients, preparation, prepTime, servings, difficulty, tips, imageUrl })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#235937] focus:border-transparent resize-none'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

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
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Receita' : 'Nova Receita'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isEdit ? 'Atualize as informaÃ§Ãµes da receita' : 'Preencha as informaÃ§Ãµes da nova receita'}
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TÃ­tulo */}
          <div>
            <label className={labelCls}>TÃ­tulo</label>
            <AutoResizeInput
              
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Frango Grelhado ao LimÃ£o"
              className={inputCls}
            />
          </div>

          {/* DescriÃ§Ã£o */}
          <div>
            <label className={labelCls}>DescriÃ§Ã£o</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Uma breve descriÃ§Ã£o da receita..."
              className={inputCls}
            />
          </div>

          {/* Tempo / PorÃ§Ãµes / Dificuldade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Tempo de preparo</label>
              <AutoResizeInput
                
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                required
                placeholder="Ex: 45 min"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>NÂº de porÃ§Ãµes</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Dificuldade</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Receita['difficulty'])}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="FÃ¡cil">FÃ¡cil</option>
                <option value="MÃ©dio">MÃ©dio</option>
                <option value="DifÃ­cil">DifÃ­cil</option>
              </select>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <label className={labelCls}>Ingredientes</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
              rows={6}
              placeholder={"500g de frango\n2 dentes de alho\nSal e pimenta a gosto"}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Um ingrediente por linha</p>
          </div>

          {/* Modo de Preparo */}
          <div>
            <label className={labelCls}>Modo de preparo</label>
            <textarea
              value={preparation}
              onChange={(e) => setPreparation(e.target.value)}
              required
              rows={7}
              placeholder={"1. PreaqueÃ§a o forno a 200Â°C.\n2. Tempere o frango com sal e pimenta.\n3. Asse por 40 minutos."}
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Numere cada passo para facilitar a leitura</p>
          </div>

          {/* Dicas */}
          <div>
            <label className={labelCls}>Dicas</label>
            <textarea
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              rows={3}
              placeholder="Dicas extras para deixar a receita ainda melhor..."
              className={inputCls}
            />
          </div>

          {/* Imagem */}
          <div>
            <label className={labelCls}>Imagem da receita</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="w-full h-36 rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-4 border-[#235937] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Fazendo upload...</span>
              </div>
            ) : imageUrl ? (
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ height: '220px' }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-xs font-medium text-gray-700 cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Upload size={13} />
                    Trocar imagem
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => { setImageUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition-colors"
                  title="Remover imagem"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#235937] bg-gray-50 hover:bg-[#235937]/5 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group"
              >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-[#235937]/10 transition-colors">
                  <ImageIcon size={22} className="text-gray-400 group-hover:text-[#235937] transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 group-hover:text-[#235937] transition-colors">Clique para enviar uma imagem</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, JPG ou WEBP</p>
                </div>
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
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
              disabled={saving || uploading || !imageUrl}
              className="px-6 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : isEdit ? 'Salvar alteraÃ§Ãµes' : 'Adicionar receita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// â”€â”€ Modal de ExclusÃ£o â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface DeleteModalProps {
  receitaTitle: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteModal({ receitaTitle, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Excluir receita</h3>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir{' '}
            <span className="font-medium text-gray-700">"{receitaTitle}"</span>?
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

// â”€â”€ Card de Receita â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ReceitaCardProps {
  receita: Receita
  onEdit: () => void
  onDelete: () => void
}

function ReceitaCard({ receita, onEdit, onDelete }: ReceitaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image area */}
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        {receita.imageUrl ? (
          <img src={receita.imageUrl} alt={receita.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-300">
            <BookOpen size={36} />
            <span className="text-xs">Sem imagem</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-tight">{receita.title}</h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColors[receita.difficulty]}`}>
            {receita.difficulty}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{receita.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-1">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {receita.prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} />
            {receita.servings} {receita.servings === 1 ? 'porÃ§Ã£o' : 'porÃ§Ãµes'}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat size={13} />
            {receita.difficulty}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-gray-400 hover:text-[#235937] hover:bg-[#235937]/10 transition-colors cursor-pointer"
            title="Editar"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-[#235937] hover:text-[#1b462b] hover:bg-[#f7f3ea] transition-colors cursor-pointer"
            title="Excluir"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// â”€â”€ PÃ¡gina Principal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type View = 'list' | 'form'

export default function Receitas() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>('list')
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadReceitas()
  }, [])

  const loadReceitas = async () => {
    try {
      setLoading(true)
      const data = await receitasService.getAll()
      setReceitas(data.map((rec: ReceitaAPI) => ({
        id: rec.id!,
        title: rec.titulo,
        description: rec.descricao,
        ingredients: rec.ingredientes.join('\n'),
        preparation: rec.modoPreparo,
        prepTime: rec.tempoPreparo,
        servings: rec.numeroPorcoes,
        difficulty: difficultyMapReverse[rec.dificuldade],
        tips: rec.dicas || '',
        imageUrl: rec.imagemReceita,
      })))
    } catch (error) {
      console.error('Erro ao carregar receitas:', error)
      console.warn('Erro ao carregar receitas')
    } finally {
      setLoading(false)
    }
  }

  const goToNew = () => {
    setEditingReceita(null)
    setView('form')
    window.scrollTo(0, 0)
  }

  const goToEdit = (receita: Receita) => {
    setEditingReceita(receita)
    setView('form')
    window.scrollTo(0, 0)
  }

  const goToList = () => {
    setView('list')
    setEditingReceita(null)
  }

  const handleSave = async (data: Omit<Receita, 'id'>) => {
    try {
      const apiData: Omit<ReceitaAPI, 'id' | 'createdAt' | 'updatedAt'> = {
        titulo: data.title,
        descricao: data.description,
        tempoPreparo: data.prepTime,
        numeroPorcoes: data.servings,
        dificuldade: difficultyMap[data.difficulty],
        ingredientes: data.ingredients.split('\n').map(i => i.trim()).filter(i => i),
        modoPreparo: data.preparation,
        dicas: data.tips || undefined,
        imagemReceita: data.imageUrl,
      }

      if (editingReceita) {
        await receitasService.update(editingReceita.id, apiData)
      } else {
        await receitasService.create(apiData)
      }
      
      goToList()
      loadReceitas()
      toast.success(editingReceita ? 'Receita atualizada com sucesso!' : 'Receita criada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar receita:', error)
      console.warn('Erro ao salvar receita')
      throw error
    }
  }

  const confirmDelete = async () => {
    if (deletingId !== null) {
      try {
        await receitasService.delete(deletingId)
        setDeletingId(null)
        loadReceitas()
        toast.success('Receita excluÃ­da com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir receita:', error)
        console.warn('Erro ao excluir receita')
      }
    }
  }

  // â”€â”€ FormulÃ¡rio (pÃ¡gina) â”€â”€
  if (view === 'form') {
    return <ReceitaForm receita={editingReceita} onBack={goToList} onSave={handleSave} />
  }

  // â”€â”€ Loading â”€â”€
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#235937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando receitas...</p>
        </div>
      </div>
    )
  }

  // â”€â”€ Lista â”€â”€
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie as receitas exibidas no site</p>
        </div>
        <button
          onClick={goToNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Adicionar Receita
        </button>
      </div>

      {receitas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <BookOpen size={48} strokeWidth={1} />
          <p className="text-sm">Nenhuma receita cadastrada ainda.</p>
          <button
            onClick={goToNew}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Adicionar primeira receita
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {receitas.map((receita) => (
            <ReceitaCard
              key={receita.id}
              receita={receita}
              onEdit={() => goToEdit(receita)}
              onDelete={() => setDeletingId(receita.id)}
            />
          ))}
        </div>
      )}

      {deletingId !== null && (
        <DeleteModal
          receitaTitle={receitas.find((r) => r.id === deletingId)?.title ?? ''}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  )
}



