import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Pedido } from '../types';

interface MapaRealProps {
  pedidos: Pedido[];
  pontoPartida?: string;
  rotaOtimizada?: boolean;
  altura?: string;
  user?: any;
  onLogout?: () => void;
}

const CENTRO_DISTRIBUICAO_PADRAO = "75 - Estr. do Minami, sem número - Hiroy, Biritiba Mirim - SP, 08940-000";

export default function MapaReal({ 
  pedidos, 
  pontoPartida, 
  rotaOtimizada = false, 
  altura = "h-96",
  user,
  onLogout 
}: MapaRealProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const centroDistribuicao = pontoPartida || CENTRO_DISTRIBUICAO_PADRAO;

  // Carregar Leaflet dinamicamente
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Importar CSS do Leaflet
        await import('leaflet/dist/leaflet.css');
        
        // Importar Leaflet
        const L = await import('leaflet');
        
        // Configurar ícones padrão
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        setMapLoaded(true);
      } catch (err) {
        console.error('Erro ao carregar Leaflet:', err);
        setError('Erro ao carregar o mapa');
      }
    };

    loadLeaflet();
  }, []);

  const defaultPosition: [number, number] = [-23.5505, -46.6333]; // São Paulo

  // Componente de mapa que será carregado dinamicamente
  const MapComponent = () => {
    const [MapContainer, setMapContainer] = useState<any>(null);
    const [TileLayer, setTileLayer] = useState<any>(null);
    const [Marker, setMarker] = useState<any>(null);
    const [Popup, setPopup] = useState<any>(null);

    useEffect(() => {
      const loadReactLeaflet = async () => {
        try {
          const reactLeaflet = await import('react-leaflet');
          setMapContainer(() => reactLeaflet.MapContainer);
          setTileLayer(() => reactLeaflet.TileLayer);
          setMarker(() => reactLeaflet.Marker);
          setPopup(() => reactLeaflet.Popup);
        } catch (err) {
          console.error('Erro ao carregar React Leaflet:', err);
          setError('Erro ao carregar componentes do mapa');
        }
      };

      if (mapLoaded) {
        loadReactLeaflet();
      }
    }, [mapLoaded]);

    if (!MapContainer || !TileLayer || !Marker || !Popup) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      );
    }

    return (
      <MapContainer 
        center={defaultPosition} 
        zoom={10} 
        scrollWheelZoom={user ? true : false} 
        className={`${altura} rounded-lg border border-gray-200 ${user ? 'shadow-md' : ''}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={defaultPosition}>
          <Popup>
            Centro de Distribuição <br /> LogiFlow
          </Popup>
        </Marker>
      </MapContainer>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Se for usado como componente principal (com user e onLogout), renderizar interface completa
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
              <p className="text-gray-600">
                Visualização interativa de rotas de entrega
              </p>
            </div>

            <div className="relative">
              <MapComponent />

              {/* Informações da rota */}
              <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Ponto de Partida</span>
                </div>
                <p className="text-xs text-gray-600 leading-tight">
                  {centroDistribuicao}
                </p>
              </div>

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

  // Renderização padrão como componente de mapa
  return (
    <div className="relative">
      <MapComponent />

      {/* Informações da rota */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">Ponto de Partida</span>
        </div>
        <p className="text-xs text-gray-600 leading-tight">
          {centroDistribuicao}
        </p>
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