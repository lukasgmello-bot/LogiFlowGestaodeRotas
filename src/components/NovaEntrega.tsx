import React, { useState } from 'react';
import { Plus, Package, MapPin, Route, Settings } from 'lucide-react';
import { Pedido, TelaAtiva, ConfiguracaoRota } from '../types';
import MapaReal from './MapaReal';

interface NovaEntregaProps {
  pedidos: Pedido[];
  setPedidos: (pedidos: Pedido[]) => void;
  configuracoes: ConfiguracaoRota[];
  configuracoes: ConfiguracaoRota[];
  setTelaAtiva: (tela: TelaAtiva) => void;
}

export default function NovaEntrega({ pedidos, setPedidos, configuracoes, setTelaAtiva }: NovaEntregaProps) {
  const [endereco, setEndereco] = useState('');
  const [volume, setVolume] = useState('');
  const [pontoPartidaSelecionado, setPontoPartidaSelecionado] = useState('');
  const [pontoPartidaSelecionado, setPontoPartidaSelecionado] = useState('');

  const adicionarPedido = () => {
    if (!endereco || !volume) return;

    const novoPedido: Pedido = {
      id: Date.now().toString(),
      endereco: endereco.trim(),
      volume: parseFloat(volume),
      status: 'Pendente'
    };

    setPedidos([...pedidos, novoPedido]);
    setEndereco('');
    setVolume('');
  };

  const removerPedido = (id: string) => {
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  const volumeTotal = pedidos.reduce((acc, p) => acc + p.volume, 0);
  const configuracaoPadrao = configuracoes.find(c => c.padrao);
  const pontoPartidaAtual = pontoPartidaSelecionado 
    ? configuracoes.find(c => c.id === pontoPartidaSelecionado)?.endereco
    : configuracaoPadrao?.endereco;
  const configuracaoPadrao = configuracoes.find(c => c.padrao);
  const pontoPartidaAtual = pontoPartidaSelecionado 
    ? configuracoes.find(c => c.id === pontoPartidaSelecionado)?.endereco
    : configuracaoPadrao?.endereco;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Package className="w-6 h-6 mr-2 text-blue-600" />
          Nova Carga de Entregas
        </h2>

        {/* Seleção do Ponto de Partida */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Ponto de Partida
            </h4>
            <button
              onClick={() => setTelaAtiva('configuracao-rotas')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Settings className="w-4 h-4 mr-1" />
              Configurar
            </button>
          </div>
          
          <select
            value={pontoPartidaSelecionado}
            onChange={(e) => setPontoPartidaSelecionado(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Usar padrão</option>
            {configuracoes.map((config) => (
              <option key={config.id} value={config.id}>
                {config.nome} {config.padrao ? '(Padrão)' : ''}
              </option>
            ))}
          </select>
          
          {pontoPartidaAtual && (
            <p className="text-sm text-blue-700 mt-2">
              <span className="font-medium">Endereço:</span> {pontoPartidaAtual}
            </p>
          )}
        </div>

        {/* Seleção do Ponto de Partida */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Ponto de Partida
            </h4>
            <button
              onClick={() => setTelaAtiva('configuracao-rotas')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Settings className="w-4 h-4 mr-1" />
              Configurar
            </button>
          </div>
          
          <select
            value={pontoPartidaSelecionado}
            onChange={(e) => setPontoPartidaSelecionado(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Usar padrão</option>
            {configuracoes.map((config) => (
              <option key={config.id} value={config.id}>
                {config.nome} {config.padrao ? '(Padrão)' : ''}
              </option>
            ))}
          </select>
          
          {pontoPartidaAtual && (
            <p className="text-sm text-blue-700 mt-2">
              <span className="font-medium">Endereço:</span> {pontoPartidaAtual}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço de Entrega
            </label>
            <input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Ex: Rua das Flores, 123, Centro, São Paulo - SP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
              Volume (m³)
            </label>
            <input
              type="number"
              id="volume"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="0.0"
              step="0.1"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={adicionarPedido}
          disabled={!endereco || !volume}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pedido
        </button>
      </div>

      {pedidos.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Pedidos Adicionados ({pedidos.length})
            </h3>
            <div className="text-sm text-gray-600">
              Volume Total: <span className="font-semibold text-blue-600">{volumeTotal.toFixed(1)} m³</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {pedidos.map((pedido, index) => (
              <div key={pedido.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pedido.endereco}</p>
                    <p className="text-sm text-gray-500">{pedido.volume} m³</p>
                  </div>
                </div>
                <button
                  onClick={() => removerPedido(pedido.id)}
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setTelaAtiva('otimizacao')}
            className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            data-ponto-partida={pontoPartidaAtual}
            data-ponto-partida={pontoPartidaAtual}
          >
            <Route className="w-5 h-5 mr-2" />
            Simular Otimização de Rota
          </button>
        </div>
      )}

      {pedidos.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Visualização dos Endereços
          </h3>
          <MapaReal pedidos={pedidos} pontoPartida={pontoPartidaAtual} rotaOtimizada={false} />
        </div>
      )}
    </div>
  );
}