// src/components/MapaReal.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Pedido } from '../types';

interface MapaRealProps {
  pedidos: Pedido[];
  pontoPartida?: string;
  rotaOtimizada?: boolean;
  altura?: string;
  user?: { nome: string };
  onLogout?: () => void;
}

const CENTRO_DISTRIBUICAO_PADRAO =
  '75 - Estr. do Minami, sem número - Hiroy, Biritiba Mirim - SP, 08940-000';

// Ajuste dos ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapaReal({
  pedidos,
  pontoPartida,
  rotaOtimizada = false,
  altura = 'h-96',
  user,
  onLogout,
}: MapaRealProps) {
  const centroDistribuicao = pontoPartida || CENTRO_DISTRIBUICAO_PADRAO;
  const defaultPosition: [number, number] = [-23.5505, -46.6333]; // Exemplo: São Paulo

  const MapSection = () => (
    <MapContainer
      center={defaultPosition}
      zoom={10}
      scrollWheelZoom={!!user}
      className={`${altura} rounded-lg border border-gray-200 ${user ? 'shadow-md' : ''}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={defaultPosition}>
        <Popup>
          Centro de Distribuição <br /> LogiFlow
        </Popup>
      </Marker>
    </MapContainer>
  );

  // Renderiza mensagem de erro (caso necessário)
  if (!defaultPosition) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">Erro ao carregar o mapa</p>
        </div>
      </div>
    );
  }

  // Renderização principal com dashboard
  if (user && onLogout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">LogiFlow</h1>
                <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Mapa de Rotas
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-700">{user.nome}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-4">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sistema de Rotas LogiFlow
              </h1>
              <p className="text-gray-600">Visualização interativa de rotas de entrega</p>
            </div>

            <div className="relative">
              <MapSection />

              {/* Ponto de partida */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Ponto de Partida</span>
                </div>
                <p className="text-xs text-gray-600 leading-tight">{centroDistribuicao}</p>
              </div>

              {/* Informações de pedidos */}
              {pedidos.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Pontos de Entrega</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {pedidos.length} {pedidos.length === 1 ? 'endereço' : 'endereços'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                <span className="text-sm">✅ Mapa carregado com sucesso!</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Renderização apenas do mapa como componente
  return (
    <div className="relative">
      <MapSection />

      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Ponto de Partida</span>
        </div>
        <p className="text-xs text-gray-600 leading-tight">{centroDistribuicao}</p>
      </div>

      {rotaOtimizada && pedidos.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="font-medium">Rota Otimizada</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {pedidos.length} {pedidos.length === 1 ? 'parada' : 'paradas'}
          </p>
        </div>
      )}

      {!rotaOtimizada && pedidos.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Pontos de Entrega</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {pedidos.length} {pedidos.length === 1 ? 'endereço' : 'endereços'}
          </p>
        </div>
      )}
    </div>
  );
}
