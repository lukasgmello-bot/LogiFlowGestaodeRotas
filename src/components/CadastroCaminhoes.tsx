import React, { useState } from 'react';
import { Plus, Truck, Trash2, Scale } from 'lucide-react';
import { Caminhao } from '../types';
import { calcularRodizio, verificarRodizioHoje } from '../utils/rodizio';

interface CadastroCaminhoesProps {
  caminhoes: Caminhao[];
  setCaminhoes: (caminhoes: Caminhao[]) => void;
}

export default function CadastroCaminhoes({ caminhoes, setCaminhoes }: CadastroCaminhoesProps) {
  const [placa, setPlaca] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [comprimento, setComprimento] = useState('');
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');
  const [pesoMaximo, setPesoMaximo] = useState('');

  const calcularCubagem = () => {
    const c = parseFloat(comprimento) || 0;
    const l = parseFloat(largura) || 0;
    const a = parseFloat(altura) || 0;
    return c * l * a;
  };

  const adicionarCaminhao = () => {
    if (!placa) return;

    const placaFormatada = placa.toUpperCase().trim();
    const rodizio = calcularRodizio(placaFormatada);

    // Se o usuário digitou capacidade manual, usa ela, senão calcula pela cubagem
    const capacidadeFinal = parseFloat(capacidade) || calcularCubagem();

    const novoCaminhao: Caminhao = {
      id: Date.now().toString(),
      placa: placaFormatada,
      capacidade: capacidadeFinal || 0,
      status: 'Livre',
      rodizio,
      pedidosAlocados: [],
      volumeOcupado: 0,
      pesoMaximo: parseFloat(pesoMaximo) || 0,
    };

    setCaminhoes([...caminhoes, novoCaminhao]);

    // Resetar formulário
    setPlaca('');
    setCapacidade('');
    setComprimento('');
    setLargura('');
    setAltura('');
    setPesoMaximo('');
  };

  const removerCaminhao = (id: string) => {
    setCaminhoes(caminhoes.filter((c) => c.id !== id));
  };

  const formatarPlaca = (valor: string) => {
    const apenasAlfanumericos = valor.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    return apenasAlfanumericos.slice(0, 7);
  };

  const formatarVolume = (valor?: number) => {
    return typeof valor === 'number' ? valor.toFixed(1) : '0.0';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Formulário de cadastro */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Truck className="w-6 h-6 mr-2 text-blue-600" />
          Cadastro de Caminhões
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="placa" className="block text-sm font-medium text-gray-700 mb-2">
              Placa
            </label>
            <input
              type="text"
              id="placa"
              value={placa}
              onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
              placeholder="ABC1234"
              maxLength={7}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
            />
          </div>

          <div>
            <label htmlFor="capacidade" className="block text-sm font-medium text-gray-700 mb-2">
              Capacidade (m³)
            </label>
            <input
              type="number"
              id="capacidade"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
              placeholder="0.0"
              step="0.1"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Preencha manualmente ou use as dimensões abaixo.</p>
          </div>

          <div>
            <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
              Peso Máximo (kg)
            </label>
            <input
              type="number"
              id="peso"
              value={pesoMaximo}
              onChange={(e) => setPesoMaximo(e.target.value)}
              placeholder="Ex: 12000"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dimensões para calcular cubagem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comprimento (m)</label>
            <input
              type="number"
              value={comprimento}
              onChange={(e) => setComprimento(e.target.value)}
              placeholder="Ex: 5.5"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Largura (m)</label>
            <input
              type="number"
              value={largura}
              onChange={(e) => setLargura(e.target.value)}
              placeholder="Ex: 2.2"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altura (m)</label>
            <input
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder="Ex: 2.5"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {comprimento && largura && altura && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Cubagem calculada:</span> {calcularCubagem().toFixed(2)} m³
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={adicionarCaminhao}
            disabled={!placa}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Caminhão
          </button>
        </div>

        {placa && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Rodízio:</span> {calcularRodizio(placa)}
              {verificarRodizioHoje(calcularRodizio(placa)) && (
                <span className="ml-2 text-red-600 font-medium">(Em rodízio hoje)</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Tabela de caminhões */}
      {caminhoes.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Caminhões Cadastrados ({caminhoes.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Máx.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rodízio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ocupação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {caminhoes.map((caminhao) => {
                  const capacidadeVal = caminhao.capacidade || 0;
                  const volumeOcupadoVal = caminhao.volumeOcupado || 0;
                  const ocupacaoPercent = capacidadeVal ? (volumeOcupadoVal / capacidadeVal) * 100 : 0;

                  return (
                    <tr key={caminhao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {caminhao.placa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {capacidadeVal.toFixed(1)} m³
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {caminhao.pesoMaximo ? `${caminhao.pesoMaximo} kg` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {caminhao.rodizio}
                          {verificarRodizioHoje(caminhao.rodizio) && (
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Hoje
                            </span>
                          )}
                        </div>
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
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${ocupacaoPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {formatarVolume(volumeOcupadoVal)}/{capacidadeVal.toFixed(1)} m³
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => removerCaminhao(caminhao.id)}
                          disabled={caminhao.status === 'Alocado'}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
