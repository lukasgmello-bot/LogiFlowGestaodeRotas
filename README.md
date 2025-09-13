# LogiFlow - SaaS de Gestão de Rotas de Entrega

Sistema completo para gestão e otimização de rotas de entrega com integração ao Google Maps.

## Configuração da API do Google Maps

Para utilizar o mapa real com rotas otimizadas, você precisa configurar uma chave da API do Google Maps:

### 1. Obter Chave da API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as seguintes APIs:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API

4. Vá para "Credenciais" e crie uma nova chave de API
5. Configure as restrições da chave para maior segurança

### 2. Configurar no Projeto

1. Abra o arquivo `.env` na raiz do projeto
2. Substitua `your_google_maps_api_key_here` pela sua chave real:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBvOkBwGyD...sua_chave_aqui
```

### 3. Ponto de Partida Fixo

O sistema está configurado para usar como ponto de partida:
**75 - Estr. do Minami, sem número - Hiroy, Biritiba Mirim - SP, 08940-000**

## Funcionalidades

- **Dashboard**: Visão geral com métricas e mapa de rotas ativas
- **Nova Carga**: Cadastro de pedidos com visualização no mapa
- **Otimização de Rotas**: Cálculo automático da melhor rota com Google Maps
- **Relatórios**: Análise de performance da frota
- **Cadastro de Caminhões**: Gestão da frota com controle de rodízio

## Tecnologias

- React + TypeScript
- Tailwind CSS
- Google Maps JavaScript API
- Lucide React (ícones)
- Vite

## Como Executar

```bash
npm install
npm run dev
```

## Observações

- Sem a chave da API configurada, o sistema mostrará uma mensagem de erro nos mapas
- O sistema funciona normalmente para todas as outras funcionalidades
- As rotas são calculadas em tempo real usando a API do Google Maps
- O sistema otimiza automaticamente a ordem das entregas para menor distância