import React, { useState } from 'react';
import { Plus, MapPin, Trash2, Star, Settings } from 'lucide-react';
import { ConfiguracaoRota } from '../types';

interface ConfiguracaoRotasProps {
  configuracoes: ConfiguracaoRota[];
  setConfiguracoes: (configuracoes: ConfiguracaoRota[]) => void;
}

export default function ConfiguracaoRotas({ configuracoes, setConfiguracoes }: ConfiguracaoRotasProps) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');

  const adicionarConfiguracao = () => {
    if (!nome || !endereco) return;

    const novaConfiguracao: ConfiguracaoRota = {
      id: Date.now().toString(),
      nome: nome.trim(),
      endereco: endereco.trim(),
      padrao: false
    };

    setConfiguracoes([...configuracoes, novaConfiguracao]);
    setNome('');
    setEndereco('');
  };

  const removerConfiguracao = (id: string) => {
    const configuracao = configuracoes.find(c => c.id === id);
    if (configuracao?.padrao) return; // Não permite remover a configuração padrão
    
    setConfiguracoes(configuracoes.filter(c => c.id !== id));
  };

  const definirComoPadrao = (id: string) => {
    setConfiguracoes(configuracoes.map(c => ({
      ...c,
      padrao: c.id === id
    })));
  };

  const configuracaoPadrao = configuracoes.find(c => c.padrao);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-blue-600" />
          Configuração de Pontos de Partida
        </h2>

        {configuracaoPadrao && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Star className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Ponto de Partida Atual</span>
            </div>
            <p className="text-sm text-blue-800">
              <span className="font-medium">{configuracaoPadrao.nome}:</span> {configuracaoPadrao.endereco}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Local
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Centro de Distribuição SP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo
            </label>
            <input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, cidade - estado"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={adicionarConfiguracao}
              disabled={!nome || !endereco}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {configuracoes.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pontos de Partida Configurados ({configuracoes.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {configuracoes.map((configuracao) => (
              <div key={configuracao.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">{configuracao.nome}</h4>
                      {configuracao.padrao && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          <Star className="w-3 h-3 mr-1" />
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {configuracao.endereco}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!configuracao.padrao && (
                      <button
                        onClick={() => definirComoPadrao(configuracao.id)}
                        className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Definir como Padrão
                      </button>
                    )}
                    
                    {!configuracao.padrao && (
                      <button
                        onClick={() => removerConfiguracao(configuracao.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">Dica</h4>
            <p className="text-sm text-yellow-700">
              O ponto de partida padrão será usado automaticamente para todas as novas rotas. 
              Você pode alternar entre diferentes pontos conforme necessário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}