import React from 'react';
import { BarChart3, Clock, TrendingUp, Truck } from 'lucide-react';
import { Caminhao, Rota } from '../types';

interface RelatoriosProps {
  caminhoes: Caminhao[];
  rotas: Rota[];
}

export default function Relatorios({ caminhoes, rotas }: RelatoriosProps) {
  const ocupacaoMedia =
    caminhoes.length > 0
      ? caminhoes.reduce((acc, c) => acc + (c.volumeOcupado / c.capacidade), 0) /
        caminhoes.length
      : 0;

  const tempoMedioPorEntrega = 45; // Simulado em minutos
  const rotasConcluidas =
    rotas?.filter((r) => r.status === 'Concluída').length ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <BarChart3 className="w-7 h-7 mr-3 text-blue-600" />
        Relatórios de Performance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Ocupação Média da Frota
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {(ocupacaoMedia * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Tempo Médio por Entrega
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {tempoMedioPorEntrega} min
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Rotas Concluídas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {rotasConcluidas}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Status Detalhado da Frota
          </h3>
        </div>
        <div className="overflow-x-auto">
          {caminhoes.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">
              Nenhum caminhão cadastrado.
            </p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ocupação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rodízio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rotas Alocadas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caminhoes.map((caminhao) => (
                  <tr key={caminhao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caminhao.placa}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          caminhao.status === 'Livre'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {caminhao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caminhao.capacidade} m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (caminhao.volumeOcupado /
                                  caminhao.capacidade) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs">
                          {(
                            (caminhao.volumeOcupado / caminhao.capacidade) *
                            100
                          ).toFixed(0)}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {caminhao.rodizio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(caminhao.pedidosAlocados?.length ?? 0) > 0 ? (
                        <div className="max-w-xs">
                          {caminhao.pedidosAlocados?.slice(0, 2).map(
                            (pedido, index) => (
                              <div key={index} className="text-xs mb-1">
                                {pedido.endereco.split(',')[0]} ({pedido.volume}
                                m³)
                              </div>
                            )
                          )}
                          {(caminhao.pedidosAlocados?.length ?? 0) > 2 && (
                            <div className="text-xs text-gray-400">
                              +
                              {(caminhao.pedidosAlocados?.length ?? 0) - 2} mais
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Nenhuma rota</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {rotas.length === 0 && (
        <p className="text-gray-500 text-sm italic">
          Nenhuma rota cadastrada até o momento.
        </p>
      )}
    </div>
  );
}
