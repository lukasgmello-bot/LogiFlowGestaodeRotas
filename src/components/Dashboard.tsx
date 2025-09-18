import React, { useState, useMemo } from 'react';
import { LogOut, User, Mail, Map, BarChart3, Settings, Bell } from 'lucide-react';
import { authService } from '../services/authService';
import MapaReal from '../components/MapaReal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { AuthUser } from '../types/auth';
import type { Pedido } from '../types';

interface DashboardProps {
  user: AuthUser;
  pedidos: Pedido[];
  onLogout: () => void;
  onRedirectToMap: () => void;
  onRedirectToReports?: () => void;
  onRedirectToSettings?: () => void;
}

const COLORS = ['#FFBB28', '#00C49F', '#FF8042'];

export default function Dashboard({
  user,
  pedidos,
  onLogout,
  onRedirectToMap,
  onRedirectToReports,
  onRedirectToSettings,
}: DashboardProps) {
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'concluido'>('todos');
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 5;

  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      onLogout();
    }
  };

  // Filtra pedidos conforme status
  const pedidosFiltrados = useMemo(() => {
    return filtroStatus === 'todos'
      ? pedidos
      : pedidos.filter((p) => p.status.toLowerCase() === filtroStatus);
  }, [pedidos, filtroStatus]);

  const totalPedidos = pedidos.length;
  const pedidosPendentes = pedidos.filter((p) => p.status.toLowerCase() === 'pendente').length;
  const pedidosConcluidos = pedidos.filter((p) => p.status.toLowerCase() === 'concluido').length;

  const pieData = [
    { name: 'Pendentes', value: pedidosPendentes },
    { name: 'Concluídos', value: pedidosConcluidos },
  ];

  // Paginação
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const pedidosPaginaAtual = pedidosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

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
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-500" />
                {pedidosPendentes > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {pedidosPendentes}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">{user.nome}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Boas-vindas */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao LogiFlow!</h1>
          <p className="text-gray-600">Visualize suas rotas e pedidos de forma rápida e prática</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <p className="text-sm text-gray-500">Pedidos Totais</p>
            <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{pedidosPendentes}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <p className="text-sm text-gray-500">Concluídos</p>
            <p className="text-2xl font-bold text-green-600">{pedidosConcluidos}</p>
          </div>
          <div
            onClick={onRedirectToMap}
            className="bg-white rounded-xl shadow p-5 flex flex-col items-center cursor-pointer hover:scale-105 transition transform"
          >
            <Map className="w-6 h-6 text-blue-700 mb-2" />
            <p className="text-sm font-medium text-gray-900">Abrir Mapa</p>
          </div>
        </div>

        {/* Gráfico de status dos pedidos */}
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Status dos Pedidos</h2>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filtro de pedidos */}
        <div className="flex justify-center space-x-4">
          {['todos', 'pendente', 'concluido'].map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 shadow hover:bg-gray-100'
              }`}
            >
              {status === 'todos'
                ? 'Todos'
                : status === 'pendente'
                ? 'Pendentes'
                : 'Concluídos'}
            </button>
          ))}
        </div>

        {/* Tabela de pedidos */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <h2 className="text-lg font-bold mb-4">Pedidos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pedidosPaginaAtual.map((pedido, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm text-gray-700">{pedido.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pedido.cliente}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pedido.endereco}</td>
                    <td className={`px-4 py-2 text-sm font-medium ${
                      pedido.status.toLowerCase() === 'pendente' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {pedido.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between mt-4 items-center">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={pagina === 1}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {pagina} de {totalPaginas || 1}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={pagina === totalPaginas}
            >
              Próximo
            </button>
          </div>
        </div>

        {/* Mapa resumido */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <h2 className="text-lg font-bold mb-4">Visão Geral do Mapa</h2>
          <MapaReal pedidos={pedidos} pontoPartida="" altura="h-80" />
        </div>
      </main>
    </div>
  );
}
