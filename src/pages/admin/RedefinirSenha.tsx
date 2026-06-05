import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Eye, EyeOff, Lock, KeyRound, AlertCircle, CheckCircle } from 'lucide-react'
import { usuarioService } from '../../services/usuario.service'
import { authService } from '../../services/auth.service'
import { toast } from 'sonner'

const siteLogoUrl = '/Logo - Agência Evidence.png'

export default function RedefinirSenha({ onComplete }: { onComplete?: () => void } = {}) {
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const usuario = authService.getUsuario()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (novaSenha.length < 8) {
      console.warn('A senha deve ter pelo menos 8 caracteres')
      return
    }

    if (novaSenha !== confirmarSenha) {
      console.warn('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      await usuarioService.updateMe({ senha: novaSenha })

      const stored = authService.getUsuario()
      if (stored) {
        localStorage.setItem('admin_usuario', JSON.stringify({ ...stored, first_login: false }))
      }

      toast.success('Senha definida com sucesso! Bem-vindo(a)!')
      if (onComplete) {
        onComplete()
      } else {
        navigate('/admin', { replace: true })
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      console.warn(e.response?.data?.error ?? 'Erro ao salvar a nova senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full pl-10 pr-10 py-2.5 border border-[#eb001a]/25 rounded-xl text-sm bg-[#f7f8fa] dark:bg-[#1A1A1A] text-[#111111] dark:text-[#f1f2f4] focus:outline-none focus:ring-2 focus:ring-[#eb001a]/30 focus:border-[#eb001a] transition'

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-[#07090c] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] border border-[#eb001a]/15 rounded-2xl shadow-xl shadow-black/8 dark:shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="bg-[#f1f2f4] dark:bg-[#07090c] border-b border-[#eb001a]/15 px-6 py-8 flex flex-col items-center">
          <div className="mb-3">
            <img src={siteLogoUrl} alt="Logo" className="h-12 object-contain" />
          </div>
          <p className="text-[#5f6672] dark:text-[#eb001a]/60 text-xs tracking-widest uppercase mt-1">
            Painel Administrativo
          </p>
        </div>

        {/* Banner de aviso */}
        <div className="bg-[#eb001a]/8 border-b border-[#eb001a]/20 px-6 py-4 flex items-start gap-3">
          <AlertCircle size={17} className="text-[#eb001a] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#5f6672] dark:text-[#eb001a]">
              Redefinição de senha obrigatória
            </p>
            <p className="text-xs text-[#5f6672]/80 dark:text-[#eb001a]/60 mt-0.5">
              {usuario?.nome ? `Olá, ${usuario.nome}! ` : ''}
              Por segurança, defina uma nova senha antes de continuar.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#eb001a]/10 border border-[#eb001a]/20 rounded-xl flex items-center justify-center shrink-0">
              <KeyRound size={18} className="text-[#eb001a]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111] dark:text-[#f1f2f4]">Criar nova senha</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Mínimo de 8 caracteres</p>
            </div>
          </div>

          {/* Nova Senha */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Nova senha
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#eb001a]/60" />
              <input
                type={showNovaSenha ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                autoFocus
                autoComplete="new-password"
                placeholder="Digite sua nova senha"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowNovaSenha((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eb001a] transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showNovaSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {novaSenha.length > 0 && novaSenha.length < 8 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> Mínimo de 8 caracteres
              </p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
              Confirmar nova senha
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#eb001a]/60" />
              <input
                type={showConfirmarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Confirme sua nova senha"
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#eb001a] transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmarSenha.length > 0 && novaSenha !== confirmarSenha && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={11} /> As senhas não coincidem
              </p>
            )}
            {confirmarSenha.length > 0 && novaSenha === confirmarSenha && novaSenha.length >= 8 && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle size={11} /> Senhas coincidem
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || novaSenha.length < 8 || novaSenha !== confirmarSenha}
            className="w-full py-2.5 bg-[#eb001a] hover:bg-[#c90015] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Salvando...
              </>
            ) : (
              'Salvar nova senha e entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
