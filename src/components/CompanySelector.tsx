import React, { useState, useEffect } from 'react'
import { companyService, type Company } from '../services/companyService'
import { Building2, Plus, LogOut } from 'lucide-react'

interface CompanySelectorProps {
  userId: string
  onSelectCompany: (company: Company) => void
  onLogout: () => void
}

export default function CompanySelector({ userId, onSelectCompany, onLogout }: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCompanyName, setNewCompanyName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const userCompanies = await companyService.getUserCompanies(userId)
        setCompanies(userCompanies)
      } catch (err: any) {
        console.error('Erro ao buscar empresas:', err)
        setError('Erro ao carregar empresas')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [userId])

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCompanyName.trim()) {
      setError('Nome da empresa é obrigatório')
      return
    }

    try {
      const newCompany = await companyService.createCompany(newCompanyName, userId)
      if (newCompany) {
        setCompanies([...companies, newCompany])
        setNewCompanyName('')
        setShowCreateForm(false)
        setError(null)
      }
    } catch (err: any) {
      console.error('Erro ao criar empresa:', err)
      setError('Erro ao criar empresa')
    }
  }

  const handleSelectCompany = (company: Company) => {
    onSelectCompany(company)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando empresas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Selecione uma Empresa</h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {companies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Você não tem nenhuma empresa ainda.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Empresa
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-sm text-gray-500">
                        Criada em {new Date(company.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full mb-4 inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Nova Empresa
            </button>
          </>
        )}

        {showCreateForm && (
          <form onSubmit={handleCreateCompany} className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa
            </label>
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Digite o nome da empresa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Criar
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <button
          onClick={onLogout}
          className="w-full mt-6 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </button>
      </div>
    </div>
  )
}

