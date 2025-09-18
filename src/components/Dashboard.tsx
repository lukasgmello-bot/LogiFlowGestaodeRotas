import React from 'react';
import { LogOut, User, Map, BarChart3, Settings } from 'lucide-react';
import type { AuthUser } from '../types/auth';

interface DashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onRedirectToMap: () => void;
  onRedirectToReports?: () => void;
  onRedirectToSettings?: () => void;
}

export default function Dashboard({
  user,
  onLogout,
  onRedirectToMap,
  onRedirectToReports,
  onRedirectToSettings,
}: DashboardProps) {
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      onLogout();
    }
  };

  const modules = [
    {
      title: 'Mapa de Rotas',
      description: 'Gerencie suas entregas em tempo real',
      icon: <Map className="w-6 h-6 text-blue-700" />,
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      action: onRedirectToMap,
    },
    {
      title: 'Relatórios',
      description: 'Veja estatísticas e indicadores',
      icon: <BarChart3 className="w-6 h-6 text-purple-700" />,
      bg: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      action: onRedirectToReports,
    },
    {
      title: 'Configurações',
      description: 'Gerencie sua conta e preferências',
      icon: <Settings className="w-6 h-6 text-green-700" />,
      bg: 'from-green-50 to-green-100',
      border: 'border-green-200',
      action: onRedirectToSettings,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LogiFlow</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Bem-vindo, <span className="font-medium text-gray-700">{user.nome}</span>
              </span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao LogiFlow!</h1>
            <p className="text-gray-600">Selecione abaixo para acessar os módulos do sistema</p>
          </div>

          {/* Grid de módulos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((mod, index) => (
              <div
                key={index}
                onClick={mod.action}
                className={`cursor-pointer p-6 bg-gradient-to-r ${mod.bg} border ${mod.border} rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition transform`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{mod.title}</h3>
                    <p className="text-sm text-gray-600">{mod.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Informações do usuário */}
          <div className="mt-10 max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Informações do Usuário</h2>
            <div className="space-y-4">
              <UserInfo label="Nome" value={user.nome} iconColor="blue" />
              <UserInfo label="Email" value={user.email} iconColor="purple" />
            </div>
          </div>

          {/* Botão Logout */}
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
  );
}

// Componente auxiliar para infos do usuário
interface UserInfoProps {
  label: string;
  value: string;
  iconColor: 'blue' | 'purple';
}

const UserInfo: React.FC<UserInfoProps> = ({ label, value, iconColor }) => (
  <div className="flex items-center space-x-3">
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full ${
        iconColor === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
      }`}
    >
      <User className={`w-5 h-5 ${iconColor === 'blue' ? 'text-blue-600' : 'text-purple-600'}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);
