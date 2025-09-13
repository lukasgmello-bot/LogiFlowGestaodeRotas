import React, { useState } from 'react';
import { Check, AlertTriangle, Truck, Package, Route, ArrowLeft } from 'lucide-react';
import { Pedido, Caminhao, Rota, TelaAtiva, ConfiguracaoRota } from '../types';
import { verificarRodizioHoje } from '../utils/rodizio';
import MapaReal from './MapaReal';

interface OtimizacaoRotasProps {
  pedidos: Pedido[];
  setPedidos: (pedidos: Pedido[]) => void;
  caminhoes: Caminhao[];
  setCaminhoes: (caminhoes: Caminhao[]) => void;
  rotas: Rota[];
  setRotas: (rotas: Rota[]) => void;
  configuracoes: ConfiguracaoRota[];
  pontoPartidaSelecionado?: string;
  configuracoes: ConfiguracaoRota[];
  pontoPartidaSelecionado?: string;
  setTelaAtiva: (tela: TelaAtiva) => void;
}

export default function OtimizacaoRotas({ 
  pedidos, 
  setPedidos, 
  caminhoes, 
  setCaminhoes, 
  rotas, 
  setRotas, 
  configuracoes,
  pontoPartidaSelecionado,
  configuracoes,
  pontoPartidaSelecionado,
  setTelaAtiva 
}: OtimizacaoRotasProps) {
  const [caminhaoSelecionado, setCaminhaoSelecionado] = useState<string>('');

  const volumeTotal = pedidos.reduce((acc, p) => acc + p.volume, 0);
  const configuracaoPadrao = configuracoes.find(c => c.padrao);
  const pontoPartidaAtual = pontoPartidaSelecionado 
    ? configuracoes.find(c => c.id === pontoPartidaSelecionado)?.endereco
    : configuracaoPadrao?.endereco;
  const configuracaoPadrao = configuracoes.find(c => c.padrao);
  const pontoPartidaAtual = pontoPartidaSelecionado 
    ? configuracoes.find(c => c.id === pontoPartidaSelecionado)?.endereco
    : configuracaoPadrao?.endereco;
  
  // Encontrar caminhão mais adequado
  const caminhaoSugerido = caminhoes
    .filter(c => c.status === 'Livre' && c.capacidade >= volumeTotal)
    .sort((a, b) => a.capacidade - b.capacidade)[0];

  const caminhaoAtual = caminhaoSelecionado 
    ? caminhoes.find(c => c.id === caminhaoSelecionado)
    : caminhaoSugerido;

  const emRodizio = caminhaoAtual ? verificarRodizioHoje(caminhaoAtual.rodizio) : false;
  const capacidadeExcedida = caminhaoAtual ? volumeTotal > caminhaoAtual.capacidade : false;

  const confirmarRota = () => {
    if (!caminhaoAtual) return;

    const novaRota: Rota = {
      id: Date.now().toString(),
      caminhaoId: caminhaoAtual.id,
      pontoPartida: pontoPartidaAtual || 'Não definido',
      pontoPartida: pontoPartidaAtual || 'Não definido',
      pedidos: pedidos.map((p, index) => ({ ...p, status: 'Alocado' as const, ordem: index + 1 })),
      volumeTotal,
      distanciaTotal: Math.random() * 50 + 20, // Simulação de distância
      status: 'Em Andamento',
      data: new Date().toISOString().split('T')[0]
    };

    // Atualizar caminhão
    const caminhaoAtualizado = {
      ...caminhaoAtual,
      status: 'Alocado' as const,
      pedidosAlocados: pedidos,
      volumeOcupado: volumeTotal
    };

    setCaminhoes(caminhoes.map(c => c.id === caminhaoAtual.id ? caminhaoAtualizado : c));
    setRotas([...rotas, novaRota]);
    setPedidos([]);
    setTelaAtiva('dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setTelaAtiva('nova-carga')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Pedidos
        </button>
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Route className="w-6 h-6 mr-2 text-blue-600" />
          Otimização de Rota
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rota Otimizada</h3>
          <MapaReal pedidos={pedidos} pontoPartida={pontoPartidaAtual} rotaOtimizada={true} />
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-green-600" />
              Resumo da Carga
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Pedidos:</span>
                <span className="font-semibold">{pedidos.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume Total:</span>
                <span className="font-semibold">{volumeTotal.toFixed(1)} m³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Distância Estimada:</span>
                <span className="font-semibold">{(Math.random() * 50 + 20).toFixed(1)} km</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              Seleção de Caminhão
            </h3>

            {caminhaoSugerido && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2">Caminhão Sugerido</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-green-900">{caminhaoSugerido.placa}</p>
                    <p className="text-sm text-green-700">Capacidade: {caminhaoSugerido.capacidade} m³</p>
                  </div>
                  <button
                    onClick={() => setCaminhaoSelecionado(caminhaoSugerido.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      caminhaoSelecionado === caminhaoSugerido.id || !caminhaoSelecionado
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {caminhaoSelecionado === caminhaoSugerido.id || !caminhaoSelecionado ? 'Selecionado' : 'Selecionar'}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ou selecione outro caminhão:
              </label>
              <select
                value={caminhaoSelecionado}
                onChange={(e) => setCaminhaoSelecionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Usar sugerido</option>
                {caminhoes.map((caminhao) => (
                  <option key={caminhao.id} value={caminhao.id}>
                    {caminhao.placa} - {caminhao.capacidade}m³ ({caminhao.status})
                  </option>
                ))}
              </select>
            </div>

            {caminhaoAtual && (
              <div className="mt-4 space-y-3">
                {emRodizio && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Atenção:</span> Este caminhão está em rodízio hoje ({caminhaoAtual.rodizio})
                    </p>
                  </div>
                )}

                {capacidadeExcedida && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Capacidade excedida:</span> Volume {volumeTotal.toFixed(1)}m³ {' > '} {caminhaoAtual.capacidade}m³
                    </p>
                  </div>
                )}

                {caminhaoAtual.pedidosAlocados.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Pedidos já alocados:</p>
                    <div className="space-y-1">
                      {caminhaoAtual.pedidosAlocados.slice(0, 3).map((pedido) => (
                        <p key={pedido.id} className="text-xs text-yellow-700">
                          • {pedido.endereco.split(',')[0]} - {pedido.volume}m³
                        </p>
                      ))}
                      {caminhaoAtual.pedidosAlocados.length > 3 && (
                        <p className="text-xs text-yellow-700">
                          ... e mais {caminhaoAtual.pedidosAlocados.length - 3} pedidos
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={confirmarRota}
            disabled={!caminhaoAtual || capacidadeExcedida}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5 mr-2" />
            Confirmar Rota
          </button>
        </div>
      </div>
    </div>
  );
}