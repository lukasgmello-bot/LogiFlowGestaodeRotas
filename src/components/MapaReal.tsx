import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const centroDistribuicao = pontoPartida || CENTRO_DISTRIBUICAO_PADRAO;

  useEffect(() => {
    if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
      setError('Chave da API do Google Maps não configurada');
      setLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 }, // São Paulo como centro inicial
          zoom: 10,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const directionsServiceInstance = new google.maps.DirectionsService();
        const directionsRendererInstance = new google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#2563EB',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        });

        directionsRendererInstance.setMap(mapInstance);

        setMap(mapInstance);
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Erro ao carregar Google Maps:', error);
      setError('Erro ao carregar o mapa');
      setLoading(false);
    });
  }, [apiKey]);

  useEffect(() => {
    if (map && directionsService && directionsRenderer && pedidos.length > 0 && rotaOtimizada) {
      calcularRota();
    }
  }, [map, directionsService, directionsRenderer, pedidos, rotaOtimizada]);

  const calcularRota = async () => {
    if (!directionsService || !directionsRenderer || pedidos.length === 0) return;

    try {
      // Preparar waypoints (pontos intermediários)
      const waypoints = pedidos.slice(1).map(pedido => ({
        location: pedido.endereco,
        stopover: true
      }));

      const request: google.maps.DirectionsRequest = {
        origin: centroDistribuicao,
        destination: pedidos.length === 1 ? pedidos[0].endereco : centroDistribuicao, // Volta para o centro
        waypoints: pedidos.length > 1 ? waypoints : [],
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        region: 'BR'
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          
          // Adicionar marcadores customizados
          adicionarMarcadores(result);
        } else {
          console.error('Erro ao calcular rota:', status);
          setError('Erro ao calcular a rota');
        }
      });
    } catch (error) {
      console.error('Erro ao processar rota:', error);
      setError('Erro ao processar a rota');
    }
  };

  const adicionarMarcadores = (result: google.maps.DirectionsResult) => {
    if (!map) return;

    // Marcador do centro de distribuição
    new google.maps.Marker({
      position: result.routes[0].legs[0].start_location,
      map: map,
      title: 'Centro de Distribuição',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#2563EB',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3
      }
    });

    // Marcadores dos pontos de entrega
    result.routes[0].legs.forEach((leg, index) => {
      if (index < pedidos.length) {
        new google.maps.Marker({
          position: leg.end_location,
          map: map,
          title: `Entrega ${index + 1}: ${pedidos[index].endereco}`,
          label: {
            text: (index + 1).toString(),
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#059669',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
          }
        });
      }
    });
  };

  if (loading) {
    return (
      <div className={`${altura} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${altura} bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-2">Erro no Mapa</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          {!apiKey || apiKey === 'your_google_maps_api_key_here' ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-xs">
                Configure sua chave da API do Google Maps no arquivo .env:
                <br />
                <code className="bg-yellow-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui</code>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={mapRef} className={`${altura} rounded-lg border border-gray-200`} />
      
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