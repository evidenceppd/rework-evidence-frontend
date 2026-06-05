import { useState, useEffect } from 'react'
import { Mail, Download, Trash2, Search, Calendar } from 'lucide-react'
import { newsletterService, type Newsletter as NewsletterType } from '../../services/newsletter.service'
import { toast } from 'sonner'
import { AutoResizeInput } from '../../components/admin/AutoResizeInput'

export default function Newsletter() {
  const [leads, setLeads] = useState<NewsletterType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const data = await newsletterService.getAll()
      setLeads(data)
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      console.warn('Erro ao carregar leads da newsletter')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Deseja realmente remover este lead?')) {
      try {
        await newsletterService.delete(id)
        setLeads(leads.filter(lead => lead.id !== id))
        toast.success('Lead removido com sucesso!')
      } catch (error) {
        console.error('Erro ao remover lead:', error)
        console.warn('Erro ao remover lead')
      }
    }
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Nome', 'Email', 'Data de InscriÃ§Ã£o'],
      ...leadsFiltrados.map(lead => [
        lead.nome,
        lead.email,
        new Date(lead.createdAt).toLocaleString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter_leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const leadsFiltrados = leads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Mail className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Newsletter</h1>
            <p className="text-gray-600">Gerencie os leads inscritos na newsletter</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de Inscritos</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{leads.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail className="text-blue-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Novos Hoje</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {leads.filter(l => {
                  const today = new Date().toDateString()
                  return new Date(l.createdAt).toDateString() === today
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
                {leads.filter(l => {
                  const date = new Date(l.createdAt)
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
              
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
          >
            <Download size={20} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Carregando leads...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Data de InscriÃ§Ã£o
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    AÃ§Ãµes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leadsFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm ? 'Nenhum lead encontrado com este filtro' : 'Nenhum lead inscrito ainda'}
                    </td>
                  </tr>
                ) : (
                  leadsFiltrados.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {lead.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-3 text-gray-800 font-medium">{lead.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {new Date(lead.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#f7f3ea] text-[#235937] rounded-lg hover:bg-[#ebe3d3] transition-colors"
                        >
                          <Trash2 size={16} />
                          Remover
                        </button>
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
        Mostrando {leadsFiltrados.length} de {leads.length} leads inscritos
      </div>
    </div>
  )
}


