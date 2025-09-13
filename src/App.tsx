import React, { useState } from 'react';
import { Truck, MapPin, BarChart3, Settings, Plus } from 'lucide-react';
import Dashboard from './components/Dashboard';
import NovaEntrega from './components/NovaEntrega';
import OtimizacaoRotas from './components/OtimizacaoRotas';
import Relatorios from './components/Relatorios';
import CadastroCaminhoes from './components/CadastroCaminhoes';
import ConfiguracaoRotas from './components/ConfiguracaoRotas';
import { Caminhao, Pedido, Rota, PontoPartida } from './types';

function App() {
  const [telaAtiva, setTelaAtiva] = useState('dashboard');
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([
    { id: '1', placa: 'ABC-1234', capacidade: 15, status: 'livre' },
    { id: '2', placa: 'DEF-5678', capacidade: 20, status: 'livre' },
    { id: '3', placa: 'GHI-9012', capacidade: 25, status: 'livre' }
  ]);
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [pontosPartida, setPontosPartida] = useState<PontoPartida[]>([
    {
      id: '1',
      nome: 'Centro de Distribuição Minami',
      endereco: '75 - Estr. do Minami, sem número - Hiroy, Biritiba Mirim - SP, 08940-000',
      padrao: true
    }
  ]);
  const [pontoPartidaSelecionado, setPontoPartidaSelecionado] = useState<string>('1');

  const adicionarCaminhao = (caminhao: Omit<Caminhao, 'id'>) => {
    const novoCaminhao = {
      ...caminhao,
      id: Date.now().toString()
    };
    setCaminhoes([...caminhoes, novoCaminhao]);
  };

  const adicionarPedido = (pedido: Omit<Pedido, 'id'>) => {
    const novoPedido = {
      ...pedido,
      id: Date.now().toString()
    };
    setPedidos([...pedidos, novoPedido]);
  };

  const confirmarRota = (rota: Omit<Rota, 'id'>) => {
    const novaRota = {
      ...rota,
      id: Date.now().toString()
    };
    
    setRotas([...rotas, novaRota]);
    
    setCaminhoes(caminhoes.map(caminhao => 
      caminhao.id === rota.caminhaoId 
        ? { ...caminhao, status: 'alocado' }
        : caminhao
    ));
    
    setPedidos([]);
    setTelaAtiva('dashboard');
  };

  const adicionarPontoPartida = (ponto: Omit<PontoPartida, 'id'>) => {
    const novoPonto = {
      ...ponto,
      id: Date.now().toString()
    };
    setPontosPartida([...pontosPartida, novoPonto]);
  };

  const definirPontoPadrao = (id: string) => {
    setPontosPartida(pontosPartida.map(ponto => ({
      ...ponto,
      padrao: ponto.id === id
    })));
    setPontoPartidaSelecionado(id);
  };

  const removerPontoPartida = (id: string) => {
    const ponto = pontosPartida.find(p => p.id === id);
    if (ponto?.padrao) return; // Não permite remover o ponto padrão
    
    setPontosPartida(pontosPartida.filter(p => p.id !== id));
    if (pontoPartidaSelecionado === id) {
      const pontoPadrao = pontosPartida.find(p => p.padrao);
      setPontoPartidaSelecionado(pontoPadrao?.id || pontosPartida[0]?.id || '');
    }
  };

  const pontoAtual = pontosPartida.find(p => p.id === pontoPartidaSelecionado) || pontosPartida[0];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'nova-entrega', label: 'Nova Carga', icon: Plus },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'caminhoes', label: 'Caminhões', icon: Truck },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const renderTela = () => {
    switch (telaAtiva) {
      case 'dashboard':
        return <Dashboard caminhoes={caminhoes} rotas={rotas} pontoPartida={pontoAtual} />;
      case 'nova-entrega':
        return (
          <NovaEntrega 
            pedidos={pedidos} 
            onAdicionarPedido={adicionarPedido}
            onIrParaOtimizacao={() => setTelaAtiva('otimizacao')}
            pontosPartida={pontosPartida}
            pontoSelecionado={pontoPartidaSelecionado}
            onSelecionarPonto={setPontoPartidaSelecionado}
            onIrParaConfiguracoes={() => setTelaAtiva('configuracoes')}
          />
        );
      case 'otimizacao':
        return (
          <OtimizacaoRotas 
            pedidos={pedidos}
            caminhoes={caminhoes}
            onConfirmarRota={confirmarRota}
            onVoltar={() => setTelaAtiva('nova-entrega')}
            pontoPartida={pontoAtual}
          />
        );
      case 'relatorios':
        return <Relatorios caminhoes={caminhoes} rotas={rotas} />;
      case 'caminhoes':
        return <CadastroCaminhoes caminhoes={caminhoes} onAdicionarCaminhao={adicionarCaminhao} />;
      case 'configuracoes':
        return (
          <ConfiguracaoRotas
            pontosPartida={pontosPartida}
            onAdicionarPonto={adicionarPontoPartida}
            onDefinirPadrao={definirPontoPadrao}
            onRemoverPonto={removerPontoPartida}
          />
        );
      default:
        return <Dashboard caminhoes={caminhoes} rotas={rotas} pontoPartida={pontoAtual} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">LogiFlow</h1>
            </div>
            <div className="text-sm text-gray-500">
              Sistema de Gestão de Entregas
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setTelaAtiva(item.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                        telaAtiva === item.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderTela()}
        </main>
      </div>
    </div>
  );
}

export default App;