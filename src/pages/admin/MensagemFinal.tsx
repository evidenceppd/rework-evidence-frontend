import { useEffect, useState } from 'react'
import { Save, ImageIcon, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'
import { mensagemFinalService } from '../../services/mensagemFinal.service'
import { uploadService } from '../../services/upload.service'
import { resolveImageUrl } from '../../services/api'
import bannerImg from '../../../assets/5 - BANNER.png'

export interface MensagemFinalConfig {
  titulo: string
  tituloDestaque: string
  descricao: string
  imagemUrl: string
}

export const MENSAGEM_FINAL_DEFAULTS: MensagemFinalConfig = {
  titulo: 'Conforto e exclusividade em',
  tituloDestaque: 'cada ambiente',
  descricao: 'Conte com a BarÃ£o e eleve o nÃ­vel de sofisticaÃ§Ã£o do seu espaÃ§o!',
  imagemUrl: '',
}

export default function MensagemFinal() {
  const [titulo, setTitulo] = useState(MENSAGEM_FINAL_DEFAULTS.titulo)
  const [tituloDestaque, setTituloDestaque] = useState(MENSAGEM_FINAL_DEFAULTS.tituloDestaque)
  const [descricao, setDescricao] = useState(MENSAGEM_FINAL_DEFAULTS.descricao)
  const [imagemUrl, setImagemUrl] = useState(MENSAGEM_FINAL_DEFAULTS.imagemUrl)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadMensagemFinal = async () => {
      try {
        setLoading(true)
        const data = await mensagemFinalService.getPublic()
        if (!data) return
        setTitulo(data.titulo_1 ?? MENSAGEM_FINAL_DEFAULTS.titulo)
        setTituloDestaque(data.titulo_2 ?? MENSAGEM_FINAL_DEFAULTS.tituloDestaque)
        setDescricao(data.description ?? MENSAGEM_FINAL_DEFAULTS.descricao)
        setImagemUrl(data.imagem_capa ?? MENSAGEM_FINAL_DEFAULTS.imagemUrl)
      } catch (error) {
        console.error('Erro ao carregar mensagem final:', error)
        console.warn('Nao foi possivel carregar o conteudo da API')
      } finally {
        setLoading(false)
      }
    }

    loadMensagemFinal()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (titulo.trim().length < 3) {
      console.warn('Titulo principal deve ter no minimo 3 caracteres.')
      return
    }
    if (tituloDestaque.trim().length < 3) {
      console.warn('Palavra em destaque deve ter no minimo 3 caracteres.')
      return
    }
    if (descricao.trim().length < 10) {
      console.warn('Descricao deve ter no minimo 10 caracteres.')
      return
    }

    try {
      setSaving(true)
      let finalImageUrl = imagemUrl

      if (imageFile) {
        setUploading(true)
        const result = await uploadService.uploadImage(imageFile, 'mensagem-final')
        finalImageUrl = result.url
      }

      const data = await mensagemFinalService.update({
        titulo_1: titulo.trim(),
        titulo_2: tituloDestaque.trim(),
        description: descricao.trim(),
        imagem_capa: finalImageUrl || null,
      })

      setTitulo(data.titulo_1)
      setTituloDestaque(data.titulo_2)
      setDescricao(data.description)
      setImagemUrl(data.imagem_capa ?? '')
      setImageFile(null)
      toast.success('Mensagem Final salva com sucesso!')
    } catch (error: unknown) {
      console.error('Erro ao salvar:', error)
      console.warn('Erro ao salvar as configuraÃ§Ãµes')
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      console.warn('Tipo de imagem nÃ£o permitido. Use JPEG, PNG, WebP ou GIF.')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagemUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-[#235937] focus:border-transparent'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensagem Final</h1>
        <p className="text-sm text-gray-500 mt-0.5">Edite o texto do banner da seÃ§Ã£o final via API</p>
        {loading && <p className="text-xs text-gray-400 mt-2">Carregando dados da API...</p>}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* FormulÃ¡rio */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSave} className="space-y-5">

            <div>
              <label className={labelCls}>TÃ­tulo principal</label>
              <AutoResizeInput
                
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className={inputCls}
                placeholder="Ex: Conforto e exclusividade em"
              />
              <p className="text-xs text-gray-400 mt-1">Texto antes da palavra em destaque.</p>
            </div>

            <div>
              <label className={labelCls}>Palavra em destaque</label>
              <AutoResizeInput
                
                value={tituloDestaque}
                onChange={(e) => setTituloDestaque(e.target.value)}
                required
                className={inputCls}
                placeholder="Ex: cada ambiente"
              />
              <p className="text-xs text-gray-400 mt-1">Aparece em vermelho no tÃ­tulo, seguida de "!".</p>
            </div>

            <div>
              <label className={labelCls}>DescriÃ§Ã£o</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                rows={3}
                className={inputCls + ' resize-none'}
                placeholder="Ex: Conte com a BarÃ£o e eleve o nÃ­vel de sofisticaÃ§Ã£o do seu espaÃ§o!"
              />
            </div>

            <div>
              <label className={labelCls}>Imagem de fundo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="mensagem-final-image"
              />
              {imagemUrl ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50" style={{ height: '180px' }}>
                  <img src={resolveImageUrl(imagemUrl)} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <label
                      htmlFor="mensagem-final-image"
                      className="px-3 py-1.5 bg-white/90 hover:bg-white rounded-lg text-xs font-medium text-gray-700 cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload size={13} />
                      Trocar imagem
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setImagemUrl(''); setImageFile(null) }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                    title="Remover imagem"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="mensagem-final-image"
                  className="w-full h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#235937] bg-gray-50 hover:bg-[#235937]/5 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group"
                >
                  <div className="p-2.5 rounded-full bg-gray-100 group-hover:bg-[#235937]/10">
                    <ImageIcon size={20} className="text-gray-400 group-hover:text-[#235937] transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 group-hover:text-[#235937] transition-colors">Clique para enviar uma imagem</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG ou WEBP Ã© recomendado: 1920x400</p>
                  </div>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving || uploading ? 'Salvando...' : 'Salvar alteraÃ§Ãµes'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-3">PrÃ©-visualizaÃ§Ã£o</p>
          <div className="admin-preview-surface relative rounded-3xl overflow-hidden shadow-xl" style={{ width: '100%', height: '300px' }}>
            <img src={imagemUrl ? resolveImageUrl(imagemUrl) : bannerImg} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45 flex items-center justify-start px-8 md:px-16">
              <div className="text-left">
                <h2 className="text-white text-3xl md:text-4xl font-regular leading-tight mb-4 max-w-sm">
                  {titulo || ''}{' '}
                  <span className="hidden md:inline"><br /></span>
                  <span className="text-[#d5c296] font-semibold">{tituloDestaque || ''}</span>!
                </h2>
                <div className="max-w-[400px]">
                  <div className="h-[2px] bg-[#d5c296] w-full mb-4" />
                  <p className="text-white/90 text-lg md:text-xl whitespace-pre-line break-words">{descricao || ''}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">A prÃ©-visualizaÃ§Ã£o Ã© uma aproximaÃ§Ã£o do banner real no site.</p>
        </div>
      </div>
    </div>
  )
}



