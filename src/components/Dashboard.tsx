import React from 'react'
import { LogOut, User, Mail, Map, BarChart3, Settings } from 'lucide-react'
import { authService } from '../services/authService'
import type { AuthUser } from '../types/auth'

interface DashboardProps {
  user: AuthUser
  onLogout: () => void
  onRedirectToMap: () => void
  onRedirectToReports?: () => void
  onRedirectToSettings?: () => void
}

export default function Dashboard({
  user,
  onLogout,
  onRedirectToMap,
  onRedirectToReports,
  onRedirectToSettings
}: DashboardProps) {
  const handleLogout = async () => {
    try {
      await authService.signOut()
      onLogout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      onLogout()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">LogiFlow</h1>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Bem-vindo, <span className="font-medium text-gray-700">{user.nome}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Boas-vindas */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao LogiFlow!
            </h1>
            <p className="text-gray-600">
              Selecione abaixo para acessar os módulos do sistema
            </p>
          </div>

          {/* Grid de atalhos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Módulo Mapa */}
            <div
              onClick={onRedirectToMap}
              className="cursor-pointer p-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full">
                  <Map className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Mapa de Rotas</h3>
                  <p className="text-sm text-gray-600">Gerencie suas entregas em tempo real</p>
                </div>
              </div>
            </div>

            {/* Módulo Relatórios */}
            <div
              onClick={onRedirectToReports}
              className="cursor-pointer p-6 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-full">
                  <BarChart3 className="w-6 h-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
                  <p className="text-sm text-gray-600">Veja estatísticas e indicadores</p>
                </div>
              </div>
            </div>

            {/* Módulo Configurações */}
            <div
              onClick={onRedirectToSettings}
              className="cursor-pointer p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition transform"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-full">
                  <Settings className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Configurações</h3>
                  <p className="text-sm text-gray-600">Gerencie sua conta e preferências</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card do usuário */}
          <div className="mt-10 max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Informações do Usuário
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium text-gray-900">{user.nome}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botão logout (extra) */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Fazer Logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
