import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Pedido } from '../types';

interface MapaSimuladoProps {
  pedidos: Pedido[];
  rotaOtimizada?: boolean;
}

export default function MapaSimulado({ pedidos, rotaOtimizada = false }: MapaSimuladoProps) {
  const pontos = pedidos.slice(0, 8); // Máximo 8 pontos para visualização

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-blue-200 h-96 overflow-hidden">
      {/* Simulação de mapa de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-gray-300"></div>
          ))}
        </div>
      </div>

      {/* Ponto de origem (centro de distribuição) */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg">
        <Navigation className="w-4 h-4" />
        <span className="text-sm font-medium">Centro</span>
      </div>

      {/* Pontos de entrega */}
      {pontos.map((pedido, index) => (
        <div key={pedido.id} className="absolute" style={{
          top: `${20 + (index * 8) + Math.sin(index) * 15}%`,
          left: `${15 + (index * 9) + Math.cos(index) * 20}%`
        }}>
          <div className="relative">
            {rotaOtimizada && index > 0 && (
              <svg className="absolute -top-6 -left-6 w-12 h-12 text-blue-500 opacity-70">
                <path
                  d="M6 6 L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="4" 
                    refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="currentColor" />
                  </marker>
                </defs>
              </svg>
            )}
            
            <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full shadow-lg font-bold text-sm">
              {index + 1}
            </div>
            
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md border text-xs whitespace-nowrap max-w-32 overflow-hidden text-ellipsis">
              {pedido.endereco.split(',')[0]}
            </div>
          </div>
        </div>
      ))}

      {rotaOtimizada && (
        <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md border">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="font-medium">Rota Otimizada</span>
          </div>
        </div>
      )}
    </div>
  );
}