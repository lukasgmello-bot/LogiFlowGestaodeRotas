export type TelaAtiva = 'dashboard' | 'nova-entrega' | 'otimizacao' | 'relatorios' | 'caminhoes' | 'configuracoes';

export interface Pedido {
  id: string;
  endereco: string;
  volume: number;
  status: 'Pendente' | 'Em Rota' | 'Entregue';
}

export interface Caminhao {
  id: string;
  placa: string;
  capacidade: number;
  status: 'Livre' | 'Alocado' | 'Em Rota';
  rodizio?: string;
  pedidosAlocados: Pedido[];
  volumeOcupado: number;
}

export interface Rota {
  id: string;
  caminhaoId: string;
  pedidos: Pedido[];
  distanciaTotal: number;
  tempoEstimado: number;
  status: 'Planejada' | 'Em Andamento' | 'Concluída';
  pontoPartida: string;
}

export interface ConfiguracaoRota {
  id: string;
  nome: string;
  endereco: string;
  padrao: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
}