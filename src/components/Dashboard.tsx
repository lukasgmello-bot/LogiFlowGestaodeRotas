// Dashboard.tsx
import React, { useState } from 'react';
import { Caminhao, Pedido, Rota, ConfiguracaoRota, TelaAtiva } from '../types';
import { Truck, Package, Route, MapPin, FileText, Plus } from 'lucide-react';
import MapaReal from './MapaReal';
import CadastroCaminhoes from './CadastroCaminhoes';

interface DashboardProps {
  caminhoes?: Caminhao[];
  setCaminhoes: (caminhoes: Caminhao[]) => void;
  pedidos?: Pedido[];
  rotas?: Rota[];
  configuracoes?: ConfiguracaoRota[];
  pontoPartidaSelecionado?: string;
  setTelaAtiva: (tela: TelaAtiva) => void;
}

export default function Dashboard({
  caminhoes = [],
  setCaminhoes,
  pedidos = [],
  rotas = [],
  configuracoes = [],
  pontoPartidaSelecionado,
  setTelaAtiva,
}: DashboardProps) {
  const [mostrarCadastroCaminhoes, setMostrarCadastroCaminhoes] = useState(false);

  // Filtrar pedidos pendentes e rotas ativas
  const pedidosPendentes = pedidos.filter(p => p.status === 'Pendente');
  const rotasAtivas = rotas.filter(r => r.status === 'Em Andamento');

  // Configuração padrão e ponto de partida
  const configuracaoPadrao = configuracoes.find(c => c.padrao);
  const pontoPartidaAtual = pontoPartidaSelecionado
    ? configuracoes.find(c => c.id === pontoPartidaSelecionado)?.endereco
    : configuracaoPadrao?.endereco;

  if (mostrarCadastroCaminhoes) {
    // Renderiza a aba de cadastro de caminhões
    return <CadastroCaminhoes caminhoes={caminhoes} setCaminhoes={setCaminhoes} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          icon={
            <div className="flex items-center space-x-1">
              <Truck className="w-8 h-8 text-blue-600" />
              <Plus
                className="w-4 h-4 text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => setMostrarCadastroCaminhoes(true)}
                title="Cadastrar Caminhão"
              />
            </div>
          }
          label="Caminhões"
          value={caminhoes.length}
        />
        <Card icon={<Package className="w-8 h-8 text-green-600" />} label="Pedidos Pendentes" value={pedidosPendentes.length} />
        <Card icon={<Route className="w-8 h-8 text-purple-600" />} label="Rotas Ativas" value={rotasAtivas.length} />
        <Card icon={<FileText className="w-8 h-8 text-yellow-600" />} label="Relatórios" value="Acessar" />
      </div>

      {/* Mapa principal */}
      {pedidosPendentes.length > 0 && pontoPartidaAtual && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Mapa de Pedidos
          </h2>
          <MapaReal pedidos={pedidosPendentes} pontoPartida={pontoPartidaAtual} rotaOtimizada={false} />
        </div>
      )}

      {/* Listagem resumida */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumoCard
          title="Pedidos Pendentes"
          items={pedidosPendentes.map((p, i) => ({
            key: p.id,
            label: `${i + 1}. ${p.endereco}`,
            value: `${p.volume} m³`,
          }))}
          emptyText="Nenhum pedido pendente."
        />
        <ResumoCard
          title="Rotas em Andamento"
          items={rotasAtivas.map((r, i) => ({
            key: r.id,
            label: `${i + 1}. Caminhão: ${caminhoes.find(c => c.id === r.caminhaoId)?.placa || 'N/A'}`,
            value: `${r.pedidos.length} pedidos`,
          }))}
          emptyText="Nenhuma rota ativa."
        />
      </div>
    </div>
  );
}

// Componente Card principal
interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

const Card: React.FC<CardProps> = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-center space-x-4">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

// Componente de resumo (pedidos ou rotas)
interface ResumoCardProps {
  title: string;
  items: { key: string; label: string; value: string }[];
  emptyText: string;
}

const ResumoCard: React.FC<ResumoCardProps> = ({ title, items, emptyText }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {items.length === 0 ? (
      <p className="text-gray-500">{emptyText}</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {items.map(item => (
          <li key={item.key} className="py-2 flex justify-between items-center">
            <span>{item.label}</span>
            <span className="text-sm text-gray-500">{item.value}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
