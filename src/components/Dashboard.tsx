import React, { useEffect } from 'react'
import { LogOut, User, Mail } from 'lucide-react'
import { authService } from '../services/authService'
import type { AuthUser } from '../types/auth'

interface DashboardProps {
  user: AuthUser
  onLogout: () => void
  onRedirectToMap: () => void
}

export default function Dashboard({ user, onLogout, onRedirectToMap }: DashboardProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRedirectToMap();
    }, 2000); // 2 segundos

    return () => clearTimeout(timer);
  }, [onRedirectToMap]);
  const handleLogout = async () => {
    try {
      await authService.signOut()
      onLogout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, executar logout local
      onLogout()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao LogiFlow!
            </h1>
            <p className="text-gray-600">
              Sistema de gestão logística e rotas de entrega
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <span className="text-sm">✅ Login realizado com sucesso!</span>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
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