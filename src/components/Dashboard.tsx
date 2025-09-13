import React from 'react';
import { Truck, Package, Route, MapPin, TrendingUp } from 'lucide-react';
import { Caminhao, Rota, ConfiguracaoRota } from '../types';
import MapaReal from './MapaReal';

interface DashboardProps {
  caminhoes: Caminhao[];
  rotas: Rota[];
  configuracoes: ConfiguracaoRota[];
  configuracoes: ConfiguracaoRota[];
}

export default function Dashboard({ caminhoes, rotas, configuracoes }: DashboardProps) {
  const caminhaoLivre = caminhoes.filter(c => c.status === 'Livre').length;
  const entregasHoje = rotas.filter(r => r.status === 'Em Andamento').reduce((acc, r) => acc + r.pedidos.length, 0);
  const kmPrevistos = rotas.filter(r => r.status === 'Em Andamento').reduce((acc, r) => acc + r.distanciaTotal, 0);
  
  const pedidosParaMapa = rotas
    .filter(r => r.status === 'Em Andamento')
    .flatMap(r => r.pedidos)
    .slice(0, 6);

  const configuracaoPadrao = configuracoes.find(c => c.padrao);
  const rotaAtiva = rotas.find(r => r.status === 'Em Andamento');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Entregas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{entregasHoje}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Caminhões Livres</p>
              <p className="text-2xl font-bold text-gray-900">{caminhaoLivre}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">KM Previstos</p>
              <p className="text-2xl font-bold text-gray-900">{kmPrevistos.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Route className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Rotas Ativas
          </h3>
          <MapaReal 
            pedidos={pedidosParaMapa} 
            pontoPartida={rotaAtiva?.pontoPartida || configuracaoPadrao?.endereco}
            rotaOtimizada={true} 
          />
            pedidos={pedidosParaMapa} 
            pontoPartida={rotaAtiva?.pontoPartida || configuracaoPadrao?.endereco}
            rotaOtimizada={true} 
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Status da Frota
          </h3>
          <div className="space-y-4">
            {caminhoes.slice(0, 5).map((caminhao) => (
              <div key={caminhao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{caminhao.placa}</p>
                  <p className="text-sm text-gray-500">{caminhao.capacidade}m³</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    caminhao.status === 'Livre' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {caminhao.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {caminhao.volumeOcupado.toFixed(1)}/{caminhao.capacidade}m³
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}