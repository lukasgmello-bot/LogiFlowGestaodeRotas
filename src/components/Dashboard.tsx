import React, { useState } from 'react';
import { Caminhao, Pedido, Rota, ConfiguracaoRota, TelaAtiva } from '../types';
import DashboardPrincipal from './src/components/DashboardPrincipal';
import CadastroCaminhoes from './CadastroCaminhoes';

interface DashboardProps {
  caminhoes: Caminhao[];
  setCaminhoes: (caminhoes: Caminhao[]) => void;
  pedidos: Pedido[];
  rotas: Rota[];
  configuracoes: ConfiguracaoRota[];
  pontoPartidaSelecionado?: string;
}

export default function Dashboard({
  caminhoes,
  setCaminhoes,
  pedidos,
  rotas,
  configuracoes,
  pontoPartidaSelecionado,
}: DashboardProps) {
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>('Dashboard');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {telaAtiva === 'Dashboard' && (
        <DashboardPrincipal
          caminhoes={caminhoes}
          pedidos={pedidos}
          rotas={rotas}
          configuracoes={configuracoes}
          pontoPartidaSelecionado={pontoPartidaSelecionado}
          setTelaAtiva={setTelaAtiva}
        />
      )}

      {telaAtiva === 'CadastroCaminhoes' && (
        <CadastroCaminhoes
          caminhoes={caminhoes}
          setCaminhoes={(novoCaminhoes) => {
            setCaminhoes(novoCaminhoes);
            setTelaAtiva('Dashboard'); // volta automaticamente para o Dashboard
          }}
        />
      )}
    </div>
  );
}
