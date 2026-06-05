import { useState, useEffect } from 'react'
import { Briefcase, Download, Trash2, Search, Calendar, Mail, Phone, FileText, Eye } from 'lucide-react'
import { trabalheConoscoService, type TrabalheConosco } from '../../services/trabalheConosco.service'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

export default function TrabalheConosco() {
  const [curriculos, setCurriculos] = useState<TrabalheConosco[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [curriculoSelecionado, setCurriculoSelecionado] = useState<TrabalheConosco | null>(null)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)
  const [curriculoParaDeletar, setCurriculoParaDeletar] = useState<string | null>(null)

  useEffect(() => {
    loadCurriculos()
  }, [])

  const loadCurriculos = async () => {
    try {
      setLoading(true)
      const data = await trabalheConoscoService.getAll()
      setCurriculos(data)
    } catch (error) {
      console.error('Erro ao carregar currÃ­culos:', error)
      console.warn('Erro ao carregar currÃ­culos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setCurriculoParaDeletar(id)
    setModalConfirmacaoAberto(true)
  }

  const confirmarDelecao = async () => {
    if (curriculoParaDeletar !== null) {
      try {
        await trabalheConoscoService.delete(curriculoParaDeletar)
        setCurriculos(curriculos.filter(c => c.id !== curriculoParaDeletar))
        setCurriculoParaDeletar(null)
        setModalDetalhesAberto(false)
        toast.success('CurrÃ­culo removido com sucesso!')
      } catch (error) {
        console.error('Erro ao remover currÃ­culo:', error)
        console.warn('Erro ao remover currÃ­culo')
      }
    }
    setModalConfirmacaoAberto(false)
  }

  const handleDownloadCurriculo = (curriculo: TrabalheConosco) => {
    // Se o currÃ­culo Ã© uma URL, abrir em nova aba
    if (curriculo.curriculo.startsWith('http')) {
      window.open(curriculo.curriculo, '_blank')
    } else {
      // Caso contrÃ¡rio, fazer download do arquivo
      const link = document.createElement('a')
      link.href = curriculo.curriculo
      link.download = `curriculo_${curriculo.nome.replace(/\s+/g, '_')}.pdf`
      link.click()
    }
  }

  const handleVerDetalhes = (curriculo: TrabalheConosco) => {
    setCurriculoSelecionado(curriculo)
    setModalDetalhesAberto(true)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Telefone', 'Cargo', 'Mensagem', 'Data de Envio'],
      ...curriculosFiltrados.map(c => [
        c.nome,
        c.email,
        c.telefone,
        c.cargo,
        c.mensagem || '',
        new Date(c.createdAt).toLocaleString('pt-BR')
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `curriculos_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const curriculosFiltrados = curriculos.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-[#235937] rounded-lg flex items-center justify-center">
            <Briefcase className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trabalhe Conosco</h1>
            <p className="text-gray-600">Gerencie os currÃ­culos recebidos</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de CurrÃ­culos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{curriculos.length}</p>
            </div>
            <div className="w-12 h-12 bg-[#235937]/10 rounded-lg flex items-center justify-center">
              <Briefcase className="text-[#235937]" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Novos Hoje</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {curriculos.filter(c => {
                  const today = new Date().toDateString()
                  return new Date(c.createdAt).toDateString() === today
                }).length}
              </p>
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
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {curriculos.filter(c => {
                  const date = new Date(c.createdAt)
                  const today = new Date()
                  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                  return date >= weekAgo
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <AutoResizeInput
              
              placeholder="Buscar por nome, email ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235937] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Curriculos Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Carregando currÃ­culos...
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  AÃ§Ãµes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {curriculosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'Nenhum currÃ­culo encontrado com este filtro' : 'Nenhum currÃ­culo recebido ainda'}
                  </td>
                </tr>
              ) : (
                curriculosFiltrados.map((curriculo) => (
                  <tr key={curriculo.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#235937]/20 rounded-full flex items-center justify-center text-[#1b462b] font-semibold">
                          {curriculo.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-3 text-gray-800 font-medium">{curriculo.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {curriculo.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          {curriculo.telefone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {curriculo.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(curriculo.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerDetalhes(curriculo)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownloadCurriculo(curriculo)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                          title="Baixar currÃ­culo"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(curriculo.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f7f3ea] text-[#235937] rounded-lg hover:bg-[#ebe3d3] transition-colors cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Mostrando {curriculosFiltrados.length} de {curriculos.length} currÃ­culos
      </div>

      {/* Modal Detalhes */}
      {modalDetalhesAberto && curriculoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-[#235937] text-white p-6 rounded-t-xl flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {curriculoSelecionado.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{curriculoSelecionado.nome}</h2>
                    <p className="text-white/80">Candidato(a) para {curriculoSelecionado.cargo}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalDetalhesAberto(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
              {/* InformaÃ§Ãµes de Contato */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mail size={20} className="text-[#235937]" />
                  InformaÃ§Ãµes de Contato
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">E-mail</p>
                      <p className="text-gray-800 font-medium">{curriculoSelecionado.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Telefone</p>
                      <p className="text-gray-800 font-medium">{curriculoSelecionado.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Data de Envio</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(curriculoSelecionado.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo de Interesse */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase size={20} className="text-[#235937]" />
                  Cargo de Interesse
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-medium text-lg">{curriculoSelecionado.cargo}</p>
                </div>
              </div>

              {/* Mensagem */}
              {curriculoSelecionado.mensagem && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-[#235937]" />
                    Mensagem
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{curriculoSelecionado.mensagem}</p>
                  </div>
                </div>
              )}

              {/* CurrÃ­culo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Download size={20} className="text-[#235937]" />
                  CurrÃ­culo
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-red-600" size={20} />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{curriculoSelecionado.curriculo}</p>
                      <p className="text-xs text-gray-500">Documento PDF/DOC</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCurriculo(curriculoSelecionado)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#235937] text-white rounded-lg hover:bg-[#1b462b] transition-colors cursor-pointer"
                  >
                    <Download size={18} />
                    Baixar
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setModalDetalhesAberto(false)
                  handleDelete(curriculoSelecionado.id)
                }}
                className="px-4 py-2 bg-[#235937] text-white rounded-lg hover:bg-[#1b462b] transition-colors cursor-pointer"
              >
                Remover CurrÃ­culo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ConfirmaÃ§Ã£o de ExclusÃ£o */}
      {modalConfirmacaoAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <p className="text-lg font-semibold text-gray-800 text-center">
                Deseja realmente remover este currÃ­culo?
              </p>
            </div>
            <div className="border-t border-gray-200 p-4 flex gap-3 justify-center">
              <button
                onClick={confirmarDelecao}
                className="px-6 py-2 bg-[#235937] text-white rounded-lg hover:bg-[#1b462b] transition-colors cursor-pointer font-medium"
              >
                Ok
              </button>
              <button
                onClick={() => {
                  setModalConfirmacaoAberto(false)
                  setCurriculoParaDeletar(null)
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



