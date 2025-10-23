# Guia de Persistência de Dados e Sincronização no LogiFlow

Este documento descreve como usar os serviços de persistência de dados e sincronização implementados no LogiFlow.

## Visão Geral

O LogiFlow implementa um sistema robusto de persistência de dados que combina:

1. **IndexedDB** para armazenamento local de dados do usuário
2. **Supabase** para armazenamento remoto e sincronização
3. **Row Level Security (RLS)** para garantir a segregação de dados por empresa

## Componentes Principais

### 1. IndexedDB Service (`src/services/indexedDBService.ts`)

Gerencia a persistência local de dados usando IndexedDB. Oferece métodos para:

- Salvar e recuperar ações do usuário
- Salvar e recuperar formulários
- Salvar e recuperar pedidos
- Salvar e recuperar informações de rastreamento
- Salvar e recuperar histórico de eventos
- Salvar e recuperar dados de sessão (tokens, informações de autenticação)

#### Exemplo de Uso

```typescript
import { indexedDBService } from './services/indexedDBService'

// Inicializar IndexedDB
await indexedDBService.init()

// Salvar uma ação do usuário
await indexedDBService.saveUserAction({
  id: 'action-1',
  userId: 'user-123',
  companyId: 'company-456',
  actionType: 'form_submission',
  details: { formId: 'form-1', data: {...} },
  createdAt: new Date().toISOString()
})

// Recuperar ações do usuário
const actions = await indexedDBService.getUserActions('user-123', 'company-456')
```

### 2. Sync Service (`src/services/syncService.ts`)

Sincroniza dados entre IndexedDB e Supabase continuamente. Oferece:

- Sincronização automática a cada 30 segundos (configurável)
- Sincronização forçada sob demanda
- Iniciar e parar sincronização

#### Exemplo de Uso

```typescript
import { syncService } from './services/syncService'

// Iniciar sincronização automática
syncService.startSync('user-123', 'company-456', 30000) // A cada 30 segundos

// Forçar sincronização imediata
await syncService.forceSyncNow('user-123', 'company-456')

// Parar sincronização
syncService.stopSync()
```

### 3. Company Service (`src/services/companyService.ts`)

Gerencia empresas e acesso multi-empresa. Oferece:

- Criar novas empresas
- Obter empresas do usuário
- Verificar acesso a uma empresa
- Gerenciar papéis de usuário nas empresas
- Adicionar/remover usuários de empresas

#### Exemplo de Uso

```typescript
import { companyService } from './services/companyService'

// Criar uma nova empresa
const company = await companyService.createCompany('Minha Empresa', 'user-123')

// Obter todas as empresas do usuário
const companies = await companyService.getUserCompanies('user-123')

// Verificar acesso a uma empresa
const hasAccess = await companyService.hasAccessToCompany('user-123', 'company-456')

// Obter papel do usuário na empresa
const role = await companyService.getUserRoleInCompany('user-123', 'company-456')
```

### 4. Hooks Customizados

#### `useDataPersistence` Hook

Facilita o uso dos serviços de IndexedDB e sincronização nos componentes.

```typescript
import { useDataPersistence } from './hooks/useDataPersistence'

function MyComponent() {
  const { saveAction, saveForm, saveOrder, getForms, getOrders, forceSyncNow } = 
    useDataPersistence('user-123', 'company-456')

  // Salvar uma ação
  await saveAction('button_click', { buttonId: 'btn-1' })

  // Salvar um formulário
  const form = await saveForm({ name: 'John', email: 'john@example.com' }, 'submitted')

  // Obter formulários salvos
  const forms = await getForms()

  // Forçar sincronização
  await forceSyncNow()
}
```

#### `useCompany` Hook

Facilita o gerenciamento de empresas nos componentes.

```typescript
import { useCompany } from './hooks/useCompany'

function MyComponent() {
  const { getSelectedCompany, selectCompany, getUserCompanies, createCompany } = 
    useCompany('user-123')

  // Obter empresa selecionada
  const company = await getSelectedCompany()

  // Selecionar uma empresa
  await selectCompany(company)

  // Obter todas as empresas
  const companies = await getUserCompanies()

  // Criar nova empresa
  const newCompany = await createCompany('Nova Empresa')
}
```

## Fluxo de Autenticação Multi-Empresa

1. **Login**: Usuário faz login com email e senha
2. **Seleção de Empresa**: Após o login, o usuário é direcionado para a tela de seleção de empresa
3. **Persistência**: A empresa selecionada é salva no IndexedDB
4. **Sincronização**: A sincronização automática é iniciada para a empresa selecionada
5. **Dashboard**: Usuário acessa o dashboard com dados da empresa selecionada

## Estrutura de Dados

### Tabelas no Supabase

- **companies**: Armazena informações das empresas
- **users**: Armazena informações dos usuários
- **user_companies**: Relacionamento entre usuários e empresas (com papéis)
- **user_actions**: Ações do usuário
- **forms**: Formulários salvos
- **orders**: Pedidos
- **tracking**: Informações de rastreamento
- **history**: Histórico de eventos

### Object Stores no IndexedDB

- **userActions**: Ações do usuário
- **forms**: Formulários
- **orders**: Pedidos
- **tracking**: Rastreamento
- **history**: Histórico
- **sessionData**: Dados de sessão (tokens, IDs, etc.)

## Row Level Security (RLS)

Todas as tabelas no Supabase têm políticas de RLS configuradas para garantir que:

1. Usuários só possam ver dados da sua empresa
2. Usuários só possam modificar seus próprios dados
3. Admins possam gerenciar membros da empresa

## Persistência de Login

O usuário permanece logado entre sessões graças a:

1. **Supabase Auth**: Gerencia tokens de autenticação
2. **IndexedDB**: Armazena dados de sessão localmente
3. **Sincronização Automática**: Mantém os dados sincronizados

## Tratamento de Erros

Todos os serviços incluem tratamento robusto de erros:

```typescript
try {
  await indexedDBService.saveUserAction(action)
} catch (error) {
  console.error('Erro ao salvar ação:', error)
  // Implementar fallback ou notificar usuário
}
```

## Performance

- **Sincronização**: A cada 30 segundos (configurável)
- **Armazenamento Local**: Até 50MB (dependendo do navegador)
- **Índices**: Otimizados para buscas rápidas

## Segurança

- **Criptografia em Trânsito**: HTTPS para comunicação com Supabase
- **Row Level Security**: Políticas de RLS no PostgreSQL
- **Tokens de Autenticação**: Gerenciados pelo Supabase Auth
- **Dados Sensíveis**: Nunca armazenados em texto plano

## Próximos Passos

1. Testar a persistência de dados em diferentes navegadores
2. Implementar notificações de sincronização
3. Adicionar funcionalidade de sincronização offline
4. Implementar versionamento de dados
5. Adicionar backup automático de dados

