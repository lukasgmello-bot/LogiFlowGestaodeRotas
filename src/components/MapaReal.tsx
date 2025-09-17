import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Pedido } from '../types';

interface MapaRealProps {
  pedidos: Pedido[];
  pontoPartida?: string;
  rotaOtimizada?: boolean;
  altura?: string;
}

const CENTRO_DISTRIBUICAO_PADRAO = "75 - Estr. do Minami, sem número - Hiroy, Biritiba Mirim - SP, 08940-000";

export default function MapaReal({ pedidos, pontoPartida, rotaOtimizada = false, altura = "h-96" }: MapaRealProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const centroDistribuicao = pontoPartida || CENTRO_DISTRIBUICAO_PADRAO;

  // Definir ícone padrão para marcadores do Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  const defaultPosition: [number, number] = [-23.5505, -46.6333]; // São Paulo

  return (
    <div className="relative">
      <MapContainer center={defaultPosition} zoom={10} scrollWheelZoom={false} className={`${altura} rounded-lg border border-gray-200`}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={defaultPosition}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>

      {/* Informações da rota (manter por enquanto, adaptar se necessário) */}
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