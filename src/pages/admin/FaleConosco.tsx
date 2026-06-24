import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'
import { CONTATO_INFO_DEFAULTS, contatoInfoService, setContatoInfoCache, type ContatoInfoPayload } from '../../services/contatoInfo.service'

export interface ContatoFooterConfig {
  email: string
  email_adicional: string
  endereco: string
  link_maps: string
  telefone_1: string
  telefone_2: string
  whatsapp: string
  link_instagram: string
  link_facebook: string
  link_linkedin: string
}

type ContatoFormErrors = Partial<Record<keyof ContatoFooterConfig, string>>

export const CONTATO_FOOTER_DEFAULTS: ContatoFooterConfig = {
  ...CONTATO_INFO_DEFAULTS,
  link_linkedin: '#',
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

export default function FaleConosco() {
  const [form, setForm] = useState<ContatoFooterConfig>(CONTATO_FOOTER_DEFAULTS)
  const [errors, setErrors] = useState<ContatoFormErrors>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContato = async () => {
      try {
        setLoading(true)
        const data = await contatoInfoService.getPublic()
        if (data) {
          const { id: _id, ...payload } = data
          void _id
          setForm({
            ...CONTATO_FOOTER_DEFAULTS,
            ...payload,
          })
        }
      } catch (error) {
        console.error('Erro ao carregar contato:', error)
        console.warn('Nao foi possivel carregar os dados de contato da API')
      } finally {
        setLoading(false)
      }
    }

    loadContato()
  }, [])

  const updateField = (field: keyof ContatoFooterConfig, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const isValidUrl = (value: string): boolean => /^https?:\/\/.+\/.+/i.test(value)

  const isValidSocialLink = (value: string): boolean => !value.trim() || value.trim() === '#' || isValidUrl(value.trim())

  const validateForm = (): boolean => {
    const nextErrors: ContatoFormErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = 'E-mail \u00e9 obrigat\u00f3rio.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Informe um e-mail v\u00e1lido.'
    }

    if (form.email_adicional.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_adicional.trim())) {
      nextErrors.email_adicional = 'Informe um e-mail valido ou deixe em branco.'
    }

    if (!form.endereco.trim()) {
      nextErrors.endereco = 'Endere\u00e7o \u00e9 obrigat\u00f3rio.'
    }

    if (!isValidSocialLink(form.link_instagram)) {
      nextErrors.link_instagram = 'Informe uma URL v\u00e1lida ou deixe como #.'
    }

    if (!isValidSocialLink(form.link_facebook)) {
      nextErrors.link_facebook = 'Informe uma URL v\u00e1lida ou deixe como #.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      console.warn('Preencha corretamente os campos obrigat\u00f3rios.')
      return
    }

    const saveContato = async () => {
      try {
        setSaving(true)
        const payload: ContatoInfoPayload = {
          email: form.email,
          email_adicional: form.email_adicional,
          endereco: form.endereco,
          link_maps: form.link_maps,
          telefone_1: form.telefone_1,
          telefone_2: form.telefone_2,
          whatsapp: form.whatsapp,
          link_instagram: form.link_instagram,
          link_facebook: form.link_facebook,
          link_linkedin: form.link_linkedin, // mantido na API mas não editável
        }
        const data = await contatoInfoService.update(payload)
        setContatoInfoCache(data)
        const { id: _id, ...savedPayload } = data
        void _id
        setForm({
          ...CONTATO_FOOTER_DEFAULTS,
          ...savedPayload,
        })
        toast.success('Informa\u00e7\u00f5es de contato salvas com sucesso!')
      } catch (error) {
        console.error('Erro ao salvar contato:', error)
        console.warn('Erro ao salvar as informa\u00e7\u00f5es de contato')
      } finally {
        setSaving(false)
      }
    }

    saveContato()
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#eb001a]/30 focus:border-[#eb001a] transition-colors'
  const errorInputClass = 'border-red-400 focus:ring-red-200 focus:border-red-400'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contato</h1>
        <p className="text-sm text-gray-500 mt-0.5">{'Edite as informa\u00e7\u00f5es exibidas no bloco de contato do rodap\u00e9 via API'}</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {loading && (
            <p className="text-sm text-gray-500 mb-4">Carregando dados de contato...</p>
          )}
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`${inputClass} ${errors.email ? errorInputClass : ''}`}
                placeholder="Ex: contato@empresa.com"
                required
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className={labelClass}>E-mail adicional (opcional)</label>
              <input
                type="email"
                value={form.email_adicional}
                onChange={(e) => updateField('email_adicional', e.target.value)}
                className={`${inputClass} ${errors.email_adicional ? errorInputClass : ''}`}
                placeholder="Ex: atendimento@empresa.com"
              />
              {errors.email_adicional && <p className="text-xs text-red-500 mt-1">{errors.email_adicional}</p>}
            </div>

            <div>
              <label className={labelClass}>{'Endere\u00e7o'}</label>
              <AutoResizeInput
                
                value={form.endereco}
                onChange={(e) => updateField('endereco', e.target.value)}
                className={`${inputClass} ${errors.endereco ? errorInputClass : ''}`}
                placeholder="Ex: Rua Exemplo, 123, Cidade/UF"
                required
              />
              {errors.endereco && <p className="text-xs text-red-500 mt-1">{errors.endereco}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Telefone 1</label>
                <AutoResizeInput
                  
                  value={form.telefone_1}
                  onChange={(e) => updateField('telefone_1', formatPhone(e.target.value))}
                  className={`${inputClass} ${errors.telefone_1 ? errorInputClass : ''}`}
                  placeholder="Ex: (11) 99999-9999"
                  maxLength={15}

                />
                {errors.telefone_1 && <p className="text-xs text-red-500 mt-1">{errors.telefone_1}</p>}
              </div>
              <div>
                <label className={labelClass}>Telefone 2</label>
                <AutoResizeInput
                  
                  value={form.telefone_2}
                  onChange={(e) => updateField('telefone_2', formatPhone(e.target.value))}
                  className={inputClass}
                  placeholder="Ex: (11) 3333-3333"
                  maxLength={15}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>WhatsApp</label>
              <AutoResizeInput
                value={form.whatsapp}
                onChange={(e) => updateField('whatsapp', formatPhone(e.target.value))}
                className={inputClass}
                placeholder="Ex: (11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-3">Redes sociais</p>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="text"
                    value={form.link_instagram}
                    onChange={(e) => updateField('link_instagram', e.target.value)}
                    className={`${inputClass} ${errors.link_instagram ? errorInputClass : ''}`}
                    placeholder="Ex: https://instagram.com/suaempresa ou #"
                  />
                  {errors.link_instagram && <p className="text-xs text-red-500 mt-1">{errors.link_instagram}</p>}
                </div>
                <div>
                  <label className={labelClass}>Facebook</label>
                  <input
                    type="text"
                    value={form.link_facebook}
                    onChange={(e) => updateField('link_facebook', e.target.value)}
                    className={`${inputClass} ${errors.link_facebook ? errorInputClass : ''}`}
                    placeholder="Ex: https://facebook.com/suaempresa ou #"
                  />
                  {errors.link_facebook && <p className="text-xs text-red-500 mt-1">{errors.link_facebook}</p>}
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="text"
                    value={form.link_linkedin}
                    onChange={(e) => updateField('link_linkedin', e.target.value)}
                    className={`${inputClass} ${errors.link_linkedin ? errorInputClass : ''}`}
                    placeholder="Ex: https://linkedin.com/company/suaempresa ou #"
                  />
                  {errors.link_linkedin && <p className="text-xs text-red-500 mt-1">{errors.link_linkedin}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#eb001a] hover:bg-[#c90015] text-white text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {saving ? 'Salvando...' : 'Salvar Altera\u00e7\u00f5es'}
            </button>
          </form>
        </div>


      </div>
    </div>
  )
}



