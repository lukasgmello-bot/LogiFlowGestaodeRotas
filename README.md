# LogiFlow - Sistema de Autenticação com Supabase

Sistema completo de autenticação usando React + TypeScript + TailwindCSS + Supabase.

## 🚀 Funcionalidades

- ✅ **Login** com email e senha
- ✅ **Cadastro** de novos usuários
- ✅ **Recuperação de senha** via email
- ✅ **Dashboard** protegido após login
- ✅ **Logout** com limpeza de sessão
- ✅ **Persistência de sessão** automática

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **TailwindCSS** para estilização
- **Supabase** para autenticação e banco de dados
- **Lucide React** para ícones
- **Vite** como bundler

## 📋 Pré-requisitos

### 1. Configuração do Banco de Dados

Execute este SQL no Supabase SQL Editor para criar a tabela `profiles`:

```sql
-- Criar tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários lerem seus próprios dados
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Política para usuários criarem seus próprios dados
CREATE POLICY "Users can create own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem seus próprios dados
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### 2. Configuração de Email (Opcional)

Para testar recuperação de senha, configure um provedor de email no Supabase:

1. Vá em **Authentication > Settings**
2. Configure **SMTP Settings** ou use um provedor como SendGrid
3. Ative **Enable email confirmations** se desejar

## 🎯 Como Testar

### 1. Cadastro de Usuário
1. Clique em "Criar conta"
2. Preencha: Nome, Email, Senha, Confirmar Senha
3. Clique em "Criar Conta"
4. ✅ Usuário será criado e redirecionado para o Dashboard

### 2. Login
1. Use o email e senha cadastrados
2. Clique em "Entrar"
3. ✅ Será redirecionado para o Dashboard

### 3. Recuperação de Senha
1. Na tela de login, clique "Esqueci minha senha"
2. Digite seu email
3. Clique "Enviar Link de Recuperação"
4. ✅ Email será enviado (se SMTP configurado)

### 4. Logout
1. No Dashboard, clique no botão "Sair"
2. ✅ Será redirecionado para a tela de login

## 🔧 Estrutura do Projeto

```
src/
├── components/
│   ├── Login.tsx           # Tela de login
│   ├── Register.tsx        # Tela de cadastro
│   ├── ForgotPassword.tsx  # Recuperação de senha
│   └── Dashboard.tsx       # Dashboard após login
├── services/
│   └── authService.ts      # Serviços de autenticação
├── lib/
│   └── supabase.ts         # Configuração do Supabase
├── types/
│   └── auth.ts             # Tipos TypeScript
└── App.tsx                 # Componente principal
```

## 🎨 Design

- **Login**: Gradiente azul/indigo
- **Cadastro**: Gradiente roxo/rosa
- **Recuperação**: Gradiente laranja/âmbar
- **Dashboard**: Gradiente azul/indigo
- **Responsivo**: Funciona em mobile e desktop
- **Animações**: Loading states e transições suaves

## 🔒 Segurança

- ✅ **RLS (Row Level Security)** habilitado
- ✅ **Políticas de acesso** configuradas
- ✅ **Validação de formulários** no frontend
- ✅ **Senhas criptografadas** pelo Supabase
- ✅ **Tokens JWT** para autenticação
- ✅ **Sessões persistentes** com renovação automática

## 🚨 Possíveis Erros e Soluções

### Erro: "Email signups are disabled"
- ✅ Vá em **Authentication > Settings** no Supabase
- ✅ Ative **Enable email provider** 
- ✅ Certifique-se de que **Allow new users to sign up** está habilitado

### Erro: "Invalid login credentials"
- ✅ Verifique se o email e senha estão corretos
- ✅ Confirme se o usuário foi cadastrado com sucesso

### Erro: "Email not confirmed"
- ✅ **Opção 1**: Desative confirmação de email em **Auth > Settings > Email Auth**
- ✅ **Opção 2**: Configure SMTP para envio de emails em **Auth > Settings > SMTP Settings**
- ✅ **Opção 3**: Confirme manualmente o usuário em **Auth > Users** (clique no usuário e marque como confirmado)

### Configuração Recomendada para Desenvolvimento:
1. Vá em **Authentication > Settings**
2. Em **Email Auth**, desmarque **Enable email confirmations**
3. Certifique-se de que **Enable email provider** está marcado
4. Em **User Management**, marque **Allow new users to sign up**

### Erro: "Row Level Security policy violation"
- ✅ Execute o SQL de criação da tabela `profiles`
- ✅ Verifique se as políticas RLS foram criadas

### Erro de conexão com Supabase
- ✅ Verifique as variáveis de ambiente no `.env`
- ✅ Confirme se a URL e chave estão corretas

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador para erros
2. Confirme se a tabela `profiles` foi criada
3. Teste com um email válido
4. Verifique as configurações do Supabase

---

**🎉 Projeto pronto para uso em produção!**