import { useState, useEffect } from 'react'
import { User, Eye, EyeOff, Save, ArrowLeft, Shield } from 'lucide-react'
import { usuarioService } from '../../services/usuario.service'
import { authService, type LoginResponse } from '../../services/auth.service'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

interface EditarPerfilProps {
  onBack?: () => void
}

export default function EditarPerfil({ onBack }: EditarPerfilProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)

  const currentUser = authService.getUsuario()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      const userData = await usuarioService.getMe()
      setNome(userData.nome)
      setEmail(userData.email)
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      console.warn('Erro ao carregar seus dados')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!nome.trim()) { console.warn('Nome é obrigatório'); return }
    if (!email.trim()) { console.warn('Email é obrigatório'); return }

    if (novaSenha || confirmarSenha) {
      if (novaSenha !== confirmarSenha) { console.warn('As senhas não coincidem'); return }
      if (novaSenha.length < 8) { console.warn('A nova senha deve ter pelo menos 8 caracteres'); return }
    }

    setSaving(true)
    try {
      const updateData: { nome: string; email: string; senha?: string } = { nome, email }
      if (novaSenha) updateData.senha = novaSenha

      const updatedUser = await usuarioService.updateMe(updateData)

      const storedData = authService.getUsuario()
      if (storedData) {
        const newUserData: LoginResponse['usuario'] = {
          ...storedData,
          nome: updatedUser.nome,
          email: updatedUser.email,
        }
        localStorage.setItem('usuario', JSON.stringify(newUserData))
      }

      toast.success('Perfil atualizado com sucesso!')
      setNovaSenha('')
      setConfirmarSenha('')
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      console.warn(error?.response?.data?.error || 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  const inputCls =
    'w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent disabled:opacity-50'
  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando seus dados...</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-[#eb001a]/10 flex items-center justify-center">
          <User size={20} className="text-[#eb001a]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Atualize suas informações pessoais</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Informações Pessoais */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">
            Informações Pessoais
          </h2>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nome *</label>
              <AutoResizeInput
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                disabled={saving}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                disabled={saving}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Perfil</label>
              <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                {currentUser?.role === 'ADMIN' ?(
                  <>
                    <Shield size={15} className="text-[#eb001a]" />
                    Administrador
                  </>
                ) : (
                  <>
                    <User size={15} className="text-[#eb001a]" />
                    Editor
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Seu perfil não pode ser alterado. Entre em contato com um administrador.
              </p>
            </div>
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
            Alterar Senha
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Deixe os campos em branco se não deseja alterar sua senha
          </p>

          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nova Senha</label>
              <div className="relative">
                <input
                  type={showNovaSenha ?'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha (mínimo 8 caracteres)"
                  disabled={saving}
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eb001a] transition-colors"
                >
                  {showNovaSenha ?<EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className={labelCls}>Confirmar Nova Senha</label>
              <div className="relative">
                <input
                  type={showConfirmarSenha ?'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  disabled={saving}
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eb001a] transition-colors"
                >
                  {showConfirmarSenha ?<EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="bg-[#eb001a]/5 dark:bg-[#eb001a]/10 rounded-2xl border border-[#eb001a]/20 p-4 flex items-start gap-3">
          <Shield size={18} className="text-[#eb001a] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Autenticação de dois fatores (2FA)</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Obrigatória para todos os logins. Um código será enviado ao seu e-mail em cada acesso.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-1">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className="px-5 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:border-[#eb001a]/30 hover:bg-[#eb001a]/5 hover:text-[#eb001a] dark:hover:bg-[#eb001a]/10 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#eb001a] hover:bg-[#c90015] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            {saving ?'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}
