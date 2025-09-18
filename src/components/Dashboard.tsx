import React, { useState, useMemo, useEffect } from "react";
import { LogOut, User, Mail, Map, Bell } from "lucide-react";
import { authService } from "../services/authService";
import MapaReal from "../components/MapaReal";
import type { AuthUser } from "../types/auth";
import type { Pedido } from "../types";

interface DashboardProps {
  user: AuthUser;
  pedidos: Pedido[];
  onLogout: () => void;
  onRedirectToMap: () => void;
}

export default function Dashboard({
  user,
  pedidos,
  onLogout,
  onRedirectToMap,
}: DashboardProps) {
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "pendente" | "concluido">("todos");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 5;

  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      onLogout();
    }
  };

  const pedidosFiltrados = useMemo(() => {
    return filtroStatus === "todos"
      ? pedidos
      : pedidos.filter((p) => p.status.toLowerCase() === filtroStatus);
  }, [pedidos, filtroStatus]);

  const totalPedidos = pedidos.length;
  const pedidosPendentes = pedidos.filter((p) => p.status.toLowerCase() === "pendente").length;
  const pedidosConcluidos = pedidos.filter((p) => p.status.toLowerCase() === "concluido").length;

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const pedidosPaginaAtual = pedidosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  // Gráfico circular SVG
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const pendentePercent = (pedidosPendentes / totalPedidos) * 100 || 0;
  const concluidoPercent = (pedidosConcluidos / totalPedidos) * 100 || 0;

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

        {/* Cards de status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <p className="text-sm text-gray-500">Pedidos Totais</p>
            <p className="text-2xl font-bold text-gray-900">{totalPedidos}</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div className="bg-blue-600 h-2 rounded" style={{ width: "100%" }} />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <p className="text-sm text-gray-500">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{pedidosPendentes}</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-yellow-400 h-2 rounded transition-all duration-500"
                style={{ width: `${pendentePercent}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <p className="text-sm text-gray-500">Concluídos</p>
            <p className="text-2xl font-bold text-green-600">{pedidosConcluidos}</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-2">
              <div
                className="bg-green-500 h-2 rounded transition-all duration-500"
                style={{ width: `${concluidoPercent}%` }}
              />
            </div>
          </div>
          <div
            onClick={onRedirectToMap}
            className="bg-white rounded-xl shadow p-5 flex flex-col items-center cursor-pointer hover:scale-105 transition transform"
          >
            <Map className="w-6 h-6 text-blue-700 mb-2" />
            <p className="text-sm font-medium text-gray-900">Abrir Mapa</p>
          </div>
        </div>

        {/* Gráfico circular SVG */}
        <div className="bg-white rounded-2xl shadow-xl p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Status dos Pedidos</h2>
          <svg width="120" height="120" className="transform -rotate-90">
            <circle
              r={radius}
              cx="60"
              cy="60"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth={15}
            />
            <circle
              r={radius}
              cx="60"
              cy="60"
              fill="transparent"
              stroke="#facc15"
              strokeWidth={15}
              strokeDasharray={`${(pendentePercent / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
            />
            <circle
              r={radius}
              cx="60"
              cy="60"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth={15}
              strokeDasharray={`${(concluidoPercent / 100) * circumference} ${circumference}`}
              strokeLinecap="round"
              strokeDashoffset={-(pendentePercent / 100) * circumference}
            />
            <text
              x="60"
              y="65"
              textAnchor="middle"
              className="text-gray-700 font-bold"
              fontSize="14"
            >
              {totalPedidos} pedidos
            </text>
          </svg>
        </div>

        {/* Filtro de pedidos */}
        <div className="flex justify-center space-x-4">
          {["todos", "pendente", "concluido"].map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtroStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 shadow hover:bg-gray-100"
              }`}
            >
              {status === "todos"
                ? "Todos"
                : status === "pendente"
                ? "Pendentes"
                : "Concluídos"}
            </button>
          ))}
        </div>

        {/* Tabela de pedidos e paginação */}
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
                {pedidosPaginaAtual.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2 text-sm text-gray-700">{p.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{p.cliente}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{p.endereco}</td>
                    <td
                      className={`px-4 py-2 text-sm font-medium ${
                        p.status.toLowerCase() === "pendente" ? "text-yellow-600" : "text-green-600"
                      }`}
                    >
                      {p.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setPagina((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              &lt;
            </button>
            <span className="px-3 py-1">
              {pagina} / {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(p + 1, totalPaginas))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Mini mapa */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <h2 className="text-lg font-bold mb-4">Mapa Resumido</h2>
          <MapaReal pedidos={pedidos} />
        </div>
      </main>
    </div>
  );
}
