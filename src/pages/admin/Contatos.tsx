import { useState, useEffect } from 'react'
import { MessageSquare, Trash2, Search, Calendar, Eye, Phone, Mail, X, Tag } from 'lucide-react'
import { contatoService, labelTipoAssunto, type Contato } from '../../services/contato.service'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [visualizando, setVisualizando] = useState<Contato | null>(null)

  useEffect(() => { loadContatos() }, [])

  const loadContatos = async () => {
    try {
      setLoading(true)
      const data = await contatoService.getAll()
      setContatos(data)
    } catch {
      console.warn('Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja realmente remover este contato?')) return
    try {
      await contatoService.delete(id)
      setContatos(prev => prev.filter(c => c.id !== id))
      if (visualizando?.id === id) setVisualizando(null)
      toast.success('Contato removido com sucesso!')
    } catch {
      console.warn('Erro ao remover contato')
    }
  }

  const filtrados = contatos.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone.includes(searchTerm) ||
    labelTipoAssunto(c.tipo_assunto).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hoje = contatos.filter(c => new Date(c.createdAt).toDateString() === new Date().toDateString()).length
  const semana = contatos.filter(c => new Date(c.createdAt) >= new Date(Date.now() - 7 * 86400000)).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-[#235937] rounded-lg flex items-center justify-center">
            <MessageSquare className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Contatos</h1>
            <p className="text-gray-600">Gerencie as mensagens recebidas pelo formulÃ¡rio de contato</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Contatos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{contatos.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="text-[#235937]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Novos Hoje</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{hoje}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Esta Semana</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{semana}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <AutoResizeInput
            
            placeholder="Buscar por nome, e-mail, telefone ou assunto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235937] focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">Carregando contatos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo de Assunto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">AÃ§Ãµes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'Nenhum contato encontrado com este filtro' : 'Nenhum contato recebido ainda'}
                    </td>
                  </tr>
                ) : filtrados.map(contato => (
                  <tr key={contato.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-[#235937] font-semibold shrink-0">
                          {contato.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 text-gray-800 font-medium">{contato.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400 shrink-0" />
                        <a href={`mailto:${contato.email}`} className="hover:underline hover:text-[#235937] transition-colors">{contato.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400 shrink-0" />
                        {contato.telefone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#235937]">
                        <Tag size={12} />
                        {labelTipoAssunto(contato.tipo_assunto)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(contato.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setVisualizando(contato)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        <button
                          onClick={() => handleDelete(contato.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#f7f3ea] text-[#235937] rounded-lg hover:bg-[#ebe3d3] transition-colors"
                        >
                          <Trash2 size={16} />
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {filtrados.length} de {contatos.length} contatos
      </div>

      {/* Modal de VisualizaÃ§Ã£o */}
      {visualizando && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setVisualizando(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-[#235937] font-bold text-lg">
                  {visualizando.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{visualizando.nome}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(visualizando.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVisualizando(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">E-mail</p>
                  <div className="flex items-center gap-2 text-gray-800">
                    <Mail size={15} className="text-gray-400" />
                    <a href={`mailto:${visualizando.email}`} className="text-sm break-all hover:underline hover:text-[#235937] transition-colors">{visualizando.email}</a>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Telefone</p>
                  <div className="flex items-center gap-2 text-gray-800">
                    <Phone size={15} className="text-gray-400" />
                    <span className="text-sm">{visualizando.telefone}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tipo de Assunto</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-50 text-[#235937]">
                  <Tag size={13} />
                  {labelTipoAssunto(visualizando.tipo_assunto)}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mensagem</p>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words border border-gray-100">
                  {visualizando.assunto}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => handleDelete(visualizando.id)}
                className="flex items-center gap-2 px-4 py-2 bg-[#f7f3ea] text-[#235937] rounded-lg hover:bg-[#ebe3d3] transition-colors font-medium"
              >
                <Trash2 size={16} />
                Remover
              </button>
              <button
                onClick={() => setVisualizando(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



