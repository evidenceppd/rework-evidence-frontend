import { useState, useEffect } from 'react'
import { Users, Trash2, Search, Edit, X, Eye, EyeOff, Shield, Key, Mail, CheckCircle } from 'lucide-react'
import { usuarioService, type Usuario } from '../../services/usuario.service'
import { toast } from 'sonner'
import { authService } from '../../services/auth.service'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  
  const currentUser = authService.getUsuario()
  
  // Form states
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [role, setRole] = useState<'master' | 'admin' | 'editor'>('editor')
  const [ativo, setAtivo] = useState(true)
  const [firstLogin, setFirstLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [savingUsuario, setSavingUsuario] = useState(false)
  const [formError, setFormError] = useState('')

  // Email confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmingUsuario, setConfirmingUsuario] = useState<{ id: string; emailMasked: string } | null>(null)
  const [confirmCode, setConfirmCode] = useState('')
  const [confirmingCode, setConfirmingCode] = useState(false)
  const [resendingCode, setResendingCode] = useState(false)

  useEffect(() => {
    loadUsuarios()
  }, [])

  const showFormError = (message: string) => {
    setFormError(message)
    toast.error(message)
  }

  const getApiErrorMessage = (error: any, fallback: string) => {
    const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback
    const translations: Record<string, string> = {
      'email, nomeCompleto and password are required': 'Email, nome e senha sao obrigatorios',
      'password must be at least 8 characters': 'Senha deve ter pelo menos 8 caracteres',
      'Email already in use': 'Email ja esta em uso',
      'Insufficient permissions': 'Permissoes insuficientes',
      'Admins can only assign editor role': 'Administradores so podem criar usuarios editores',
      'Cannot assign master role via API': 'Nao e possivel atribuir perfil master',
      'Confirmation code expired or not found': 'Codigo de confirmacao expirado ou nao encontrado',
      'Invalid confirmation code': 'Codigo de confirmacao invalido',
    }
    return translations[message] || message
  }

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      const data = await usuarioService.getAll()
      setUsuarios(data)
    } catch (error) {
      console.error('Erro ao carregar usuarios:', error)
      toast.error('Erro ao carregar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario)
    setNome(usuario.nome)
    setEmail(usuario.email)
    setSenha('')
    setRole(usuario.role)
    setAtivo(usuario.ativo)
    setFirstLogin(false)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingUsuario(null)
    setNome('')
    setEmail('')
    setSenha('')
    setConfirmarSenha('')
    setRole('editor')
    setAtivo(true)
    setFirstLogin(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setFormError('')
  }

  const handleSave = async () => {
    setFormError('')

    if (!nome.trim()) {
      showFormError('Nome e obrigatorio')
      return
    }

    if (!email.trim()) {
      showFormError('Email e obrigatorio')
      return
    }

    if (!editingUsuario && !senha) {
      showFormError('Senha e obrigatoria para novos usuarios')
      return
    }

    if (senha && senha.length < 8) {
      showFormError('Senha deve ter pelo menos 8 caracteres')
      return
    }

    if (senha && senha !== confirmarSenha) {
      showFormError('As senhas nao coincidem')
      return
    }

    setSavingUsuario(true)
    try {
      if (role.toLowerCase() === 'master' && currentUser?.role?.toLowerCase() !== 'master') {
        showFormError('Apenas usuarios MASTER podem atribuir o perfil MASTER')
        setSavingUsuario(false)
        return
      }
      const isAwaitingConfirmation = editingUsuario && !editingUsuario.ativo
      const data: any = isAwaitingConfirmation
        ? { nome, email, first_login: firstLogin }
        : editingUsuario
          ? { nome, email, role, ativo, first_login: firstLogin }
          : { nome, email, role, ativo: false, first_login: firstLogin }

      if (senha) {
        data.senha = senha
      }

      if (editingUsuario) {
        await usuarioService.update(editingUsuario.id, data)
        toast.success('Usuario atualizado com sucesso!')
      } else {
        const created = await usuarioService.create(data)
        handleCloseModal()
        setConfirmingUsuario({ id: created.id, emailMasked: created.emailMasked || created.email })
        setConfirmCode('')
        setConfirmModalOpen(true)
        toast.info('Usuario criado! Confirme o e-mail para ativar a conta.')
      }

      await loadUsuarios()
      handleCloseModal()
    } catch (error: any) {
      console.error('Erro ao salvar usuario:', error)
      const errorMessage = getApiErrorMessage(error, 'Erro ao salvar usuario')
      showFormError(errorMessage)
    } finally {
      setSavingUsuario(false)
    }
  }

  const handleConfirmEmail = async () => {
    if (!confirmingUsuario) return
    if (confirmCode.trim().length !== 6) {
      toast.error('Digite o codigo de 6 digitos')
      return
    }
    setConfirmingCode(true)
    try {
      await usuarioService.confirmEmail(confirmingUsuario.id, confirmCode.trim())
      toast.success('E-mail confirmado! Usuario ativado com sucesso.')
      setConfirmModalOpen(false)
      setConfirmingUsuario(null)
      setConfirmCode('')
      await loadUsuarios()
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Codigo invalido ou expirado'))
    } finally {
      setConfirmingCode(false)
    }
  }

  const handleSendConfirmation = async (userId: string) => {
    setResendingCode(true)
    try {
      const result = await usuarioService.sendConfirmation(userId)
      setConfirmingUsuario({ id: userId, emailMasked: result.emailMasked })
      setConfirmCode('')
      setConfirmModalOpen(true)
      toast.info('Codigo enviado ao e-mail do usuario')
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Erro ao enviar codigo de confirmacao'))
    } finally {
      setResendingCode(false)
    }
  }

  const handleResendCode = async () => {
    if (!confirmingUsuario) return
    setResendingCode(true)
    try {
      const result = await usuarioService.sendConfirmation(confirmingUsuario.id)
      setConfirmingUsuario(prev => prev ? { ...prev, emailMasked: result.emailMasked } : null)
      setConfirmCode('')
      toast.info('Novo codigo enviado!')
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Erro ao reenviar codigo'))
    } finally {
      setResendingCode(false)
    }
  }


  const handleDelete = async (id: string, nome: string) => {
    if (String(id) === String(currentUser?.id)) {
      toast.error('Voce nao pode excluir seu proprio usuario')
      return
    }

    if (window.confirm(`Deseja realmente remover o usuário "${nome}"?`)) {
      try {
        await usuarioService.delete(id)
        setUsuarios(usuarios.filter(u => u.id !== id))
        toast.success('Usuário removido com sucesso!')
      } catch (error) {
        console.error('Erro ao remover usuário:', error)
        toast.error('Erro ao remover usuario')
      }
    }
  }

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    const r = role?.toLowerCase()
    if (r === 'master') return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 inline-flex items-center gap-1">
        <Shield size={11} />
        Master
      </span>
    )
    return r === 'admin' ? (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        Admin
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
        Editor
      </span>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#eb001a]/10 rounded-xl flex items-center justify-center shrink-0">
            <Users className="text-[#eb001a]" size={22} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Usuários</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie os usuários do sistema</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-5 sm:mb-8">
        {[
          { label: 'Total de Usuários', value: usuarios.length, icon: <Users size={20} />, bg: 'bg-[#eb001a]/10', color: 'text-[#eb001a]' },
          { label: 'Master', value: usuarios.filter(u => u.role?.toLowerCase() === 'master').length, icon: <Shield size={20} />, bg: 'bg-purple-50 dark:bg-purple-500/10', color: 'text-purple-500' },
          { label: 'Administradores', value: usuarios.filter(u => u.role?.toLowerCase() === 'admin').length, icon: <Shield size={20} />, bg: 'bg-red-50 dark:bg-red-500/10', color: 'text-red-500' },
          { label: 'Editores', value: usuarios.filter(u => u.role?.toLowerCase() === 'editor').length, icon: <Edit size={20} />, bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-700/50 px-4 py-3 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-0 sm:justify-between">
              <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center shrink-0 sm:order-last`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Add */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-700/50 p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <AutoResizeInput
              
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#eb001a] focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#eb001a] text-white rounded-xl hover:bg-[#c90015] transition-colors whitespace-nowrap text-sm font-medium cursor-pointer"
          >
            <Users size={20} />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Carregando usuários...
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            {searchTerm ? 'Nenhum usuário encontrado com este filtro' : 'Nenhum usuário cadastrado'}
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {usuariosFiltrados.map((usuario) => (
                <div key={usuario.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-[#eb001a]/10 rounded-full flex items-center justify-center text-[#eb001a] font-semibold shrink-0">
                        {usuario.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{usuario.nome}</p>
                        <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getRoleBadge(usuario.role)}
                      {usuario.ativo ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Ativo</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Pendente</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {!usuario.ativo && (
                      <button
                        onClick={() => handleSendConfirmation(usuario.id)}
                        disabled={resendingCode}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-xs disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <Mail size={13} />
                        Confirmar E-mail
                      </button>
                    )}
                    {String(usuario.id) !== String(currentUser?.id) && usuario.role?.toLowerCase() !== 'master' && (
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#eb001a]/10 text-[#eb001a] rounded-lg hover:bg-[#eb001a]/20 transition-colors text-xs cursor-pointer"
                      >
                        <Edit size={13} />
                        Editar
                      </button>
                    )}
                    {String(usuario.id) !== String(currentUser?.id) && usuario.role?.toLowerCase() !== 'master' && (
                      <button
                        onClick={() => handleDelete(usuario.id, usuario.nome)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-xs cursor-pointer"
                      >
                        <Trash2 size={13} />
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#eb001a]/8 border-y border-[#eb001a]/20">
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-[#eb001a] uppercase tracking-widest">Usuário</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-[#eb001a] uppercase tracking-widest">Email</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-[#eb001a] uppercase tracking-widest">Perfil</th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold text-[#eb001a] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3.5 text-right text-[11px] font-bold text-[#eb001a] uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-gray-100 last:border-b-0 hover:bg-[#eb001a]/5 dark:border-gray-800 dark:hover:bg-[#eb001a]/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#eb001a]/10 rounded-full flex items-center justify-center text-[#eb001a] font-semibold">
                            {usuario.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-3 text-gray-800 font-medium">{usuario.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(usuario.role)}</td>
                      <td className="px-6 py-4">
                        {usuario.ativo ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Ativo</span>
                        ) : usuario.emailPendente ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Aguardando confirmação</span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Inativo</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {usuario.emailPendente && (
                            <button
                              onClick={() => handleSendConfirmation(usuario.id)}
                              disabled={resendingCode}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Mail size={15} />
                              Confirmar E-mail
                            </button>
                          )}
                          {String(usuario.id) !== String(currentUser?.id) && usuario.role?.toLowerCase() !== 'master' && (
                            <button
                              onClick={() => handleEdit(usuario)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-[#eb001a]/10 text-[#eb001a] rounded-lg hover:bg-[#eb001a]/20 transition-colors cursor-pointer"
                            >
                              <Edit size={16} />
                              Editar
                            </button>
                          )}
                          {String(usuario.id) !== String(currentUser?.id) && usuario.role?.toLowerCase() !== 'master' && (
                            <button
                              onClick={() => handleDelete(usuario.id, usuario.nome)}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                              Remover
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal de Edição */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-4" onClick={handleCloseModal}>
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Botão Fechar */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Título */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>

            {/* Aviso conta aguardando confirmação */}
            {editingUsuario && editingUsuario.emailPendente && (
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm mb-4">
                <Mail size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                <span className="text-yellow-800">
                  Esta conta aguarda confirmação de e-mail. Apenas <strong>e-mail</strong>, <strong>senha</strong> e <strong>redefinição de senha</strong> podem ser alterados. Para ativar a conta, use o botão <strong>Confirmar E-mail</strong>.
                </span>
              </div>
            )}

            {/* Aviso conta inativa */}
            {editingUsuario && !editingUsuario.ativo && !editingUsuario.emailPendente && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg text-sm mb-4">
                <span className="text-red-800">
                  Esta conta está <strong>inativa</strong>. O usuário não consegue fazer login.
                </span>
              </div>
            )}

            {/* Formulário */}
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome *
                </label>
                <AutoResizeInput
                  
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o nome do usuário"
                  disabled={savingUsuario}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o email do usuário"
                  disabled={savingUsuario}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Senha {!editingUsuario && '*'}
                  {editingUsuario && <span className="text-gray-400 text-xs ml-2">(deixe em branco para não alterar)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value)
                      setFormError('')
                    }}
                    placeholder="Digite a senha (mínimo 8 caracteres)"
                    disabled={savingUsuario}
                    className="w-full px-3 py-2 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Senha {!editingUsuario && '*'}
                  {editingUsuario && <span className="text-gray-400 text-xs ml-2">(deixe em branco para não alterar)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => {
                      setConfirmarSenha(e.target.value)
                      setFormError('')
                    }}
                    placeholder="Confirme a senha"
                    disabled={savingUsuario}
                    className="w-full px-3 py-2 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                  {formError}
                </div>
              )}

              {/* Perfil - hidden while awaiting email confirmation */}
              {(!editingUsuario || editingUsuario.ativo) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Perfil *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'master' | 'admin' | 'editor')}
                    disabled={savingUsuario}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent disabled:opacity-50"
                  >
                    <option value="editor">Editor</option>
                    {currentUser?.role?.toLowerCase() === 'master' && (
                      <option value="admin">Administrador</option>
                    )}
                  </select>
                </div>
              )}

              {!editingUsuario && (
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <Mail size={18} className="mt-0.5 shrink-0 text-blue-600" />
                  <span>Novos usuarios ficam pendentes ate confirmar o codigo enviado por e-mail. Depois da confirmacao, a conta sera ativada para login.</span>
                </div>
              )}

              {/* Status Ativo - hidden while awaiting email confirmation */}
              {editingUsuario && editingUsuario.ativo && (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                    disabled={savingUsuario}
                    className="w-5 h-5 text-[#eb001a] border-gray-300 rounded focus:ring-[#eb001a]"
                  />
                  <label htmlFor="ativo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usuario ativo (pode fazer login no sistema)
                  </label>
                </div>
              )}

              {/* Forçar redefinição de senha */}
              <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-lg">
                <input
                  type="checkbox"
                  id="first_login"
                  checked={firstLogin}
                  onChange={(e) => setFirstLogin(e.target.checked)}
                  disabled={savingUsuario}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="first_login" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Key size={18} className="text-orange-600" />
                  Forçar redefinição de senha no próximo login
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                disabled={savingUsuario}
                className="px-6 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50 text-sm font-medium cursor-pointer disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={savingUsuario}
                className="px-6 py-2.5 bg-[#eb001a] text-white rounded-xl hover:bg-[#c90015] transition-colors disabled:opacity-50 flex items-center gap-2 text-sm font-medium cursor-pointer disabled:cursor-not-allowed"
              >
                {savingUsuario ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de E-mail */}
      {confirmModalOpen && confirmingUsuario && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-4">
          <div className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-700/50 p-8 max-w-md w-full shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-yellow-600" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirmar E-mail</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Um código de 6 dígitos foi enviado para<br />
                <strong className="text-gray-700 dark:text-gray-200">{confirmingUsuario.emailMasked}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                Digite o código de confirmação
              </label>
              <AutoResizeInput
                
                inputMode="numeric"
                maxLength={6}
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                disabled={confirmingCode}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#eb001a] focus:border-transparent text-center text-2xl tracking-[0.5em] font-mono disabled:opacity-50"
              />
            </div>

            <button
              onClick={handleConfirmEmail}
              disabled={confirmingCode || confirmCode.length !== 6}
              className="w-full py-3 bg-[#eb001a] text-white rounded-xl hover:bg-[#c90015] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              {confirmingCode ? 'Verificando...' : 'Confirmar E-mail'}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={handleResendCode}
                disabled={resendingCode || confirmingCode}
                className="text-sm text-gray-500 hover:text-[#eb001a] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {resendingCode ? 'Enviando...' : 'Não recebeu? Reenviar código'}
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
              Você pode fechar e confirmar depois pela ação Confirmar E-mail na tabela.
            </p>

            <button
              onClick={() => { setConfirmModalOpen(false); loadUsuarios(); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



