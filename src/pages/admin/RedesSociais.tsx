import { useState, useEffect } from 'react'
import { Save, Facebook, Instagram } from 'lucide-react'
import { redesSociaisService, type RedeSocial as RedeSocialAPI } from '../../services/redesSociais.service'
import { toast } from 'sonner'

interface RedeSocial {
  id: string
  nome: string
  tipo: 'facebook' | 'instagram'
  link: string
  ativo: boolean
}

export default function RedesSociais() {
  const [redes, setRedes] = useState<RedeSocial[]>([])
  const [whatsappData, setWhatsappData] = useState<{ link: string; ativo: boolean }>({ link: '', ativo: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadRedes()
  }, [])

  const loadRedes = async () => {
    try {
      setLoading(true)
      const data = await redesSociaisService.get()
      // Transformar os dados da API para o formato local
      setWhatsappData({ link: data.linkWhatsapp || '', ativo: data.ativoWhatsapp ?? true })
      setRedes([
        {
          id: '2',
          nome: 'Instagram',
          tipo: 'instagram',
          link: data.linkInstagram || '',
          ativo: data.ativoInstagram ?? true,
        },
        {
          id: '3',
          nome: 'Facebook',
          tipo: 'facebook',
          link: data.linkFacebook || '',
          ativo: data.ativoFacebook ?? true,
        },
      ])
    } catch (error) {
      console.error('Erro ao carregar redes sociais:', error)
      console.warn('Erro ao carregar redes sociais')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkChange = (id: string, value: string) => {
    setRedes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, link: value } : r))
    )
    setHasChanges(true)
  }

  const handleAtivoChange = (id: string, value: boolean) => {
    setRedes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ativo: value } : r))
    )
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const facebook = redes.find(r => r.tipo === 'facebook')
      const instagram = redes.find(r => r.tipo === 'instagram')
      
      const apiData: RedeSocialAPI = {
        linkWhatsapp: whatsappData.link,
        linkFacebook: facebook?.link || '',
        linkInstagram: instagram?.link || '',
        ativoWhatsapp: whatsappData.ativo,
        ativoFacebook: facebook?.ativo ?? true,
        ativoInstagram: instagram?.ativo ?? true,
      }
      
      console.log('Enviando dados:', apiData)
      await redesSociaisService.update(apiData)
      setHasChanges(false)
      toast.success('Redes sociais salvas com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar redes sociais:', error)
      console.error('Detalhes:', error?.response?.data)
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao salvar redes sociais'
      console.warn(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const getIcone = (tipo: RedeSocial['tipo']) => {
    const iconProps = { size: 32, className: 'text-white' }
    switch (tipo) {
      case 'instagram':
        return <Instagram {...iconProps} />
      case 'facebook':
        return <Facebook {...iconProps} />
      default:
        return null
    }
  }

  const getCorFundo = (tipo: RedeSocial['tipo']) => {
    switch (tipo) {
      case 'instagram':
        return 'bg-gradient-to-br from-[#405DE6] via-[#E1306C] to-[#FD1D1D]'
      case 'facebook':
        return 'bg-[#1877F2]'
      default:
        return 'bg-gray-500'
    }
  }

  const getPlaceholder = (tipo: RedeSocial['tipo']) => {
    switch (tipo) {
      case 'instagram':
        return 'Ex: https://instagram.com/agenciaevidence'
      case 'facebook':
        return 'Ex: https://facebook.com/agenciaevidence'
      default:
        return ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#235937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando redes sociais...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Redes Sociais</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gerencie os links das redes sociais exibidos no site
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#235937] hover:bg-[#1b462b] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      {/* Lista de Redes Sociais */}
      <div className="space-y-4">
        {redes.map((rede) => (
          <div
            key={rede.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Ícone */}
                <div className={`w-16 h-16 rounded-2xl ${getCorFundo(rede.tipo)} flex items-center justify-center shrink-0`}>
                  {getIcone(rede.tipo)}
                </div>

                {/* Formulário */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">{rede.nome}</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-600">Ativo</span>
                      <input
                        type="checkbox"
                        checked={rede.ativo}
                        onChange={(e) => handleAtivoChange(rede.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#235937] focus:ring-[#235937] cursor-pointer"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Link / URL
                    </label>
                    <input
                      type="url"
                      value={rede.link}
                      onChange={(e) => handleLinkChange(rede.id, e.target.value)}
                      placeholder={getPlaceholder(rede.tipo)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#235937]/30 focus:border-[#235937] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


