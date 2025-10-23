-- Criação da tabela de empresas
CREATE TABLE public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Criação da tabela de usuários
CREATE TABLE public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    email text UNIQUE,
    full_name text,
    created_at timestamp with time zone DEFAULT now()
);

-- Ativar RLS para a tabela de empresas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de empresas
CREATE POLICY "Companies are viewable by authenticated users." ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create companies." ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their own companies." ON public.companies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete their own companies." ON public.companies FOR DELETE TO authenticated USING (true);

-- Ativar RLS para a tabela de usuários
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de usuários
CREATE POLICY "Users can view their own profile." ON public.users FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile." ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile." ON public.users FOR DELETE TO authenticated USING (auth.uid() = id);

-- Criação da tabela de ações do usuário
CREATE TABLE public.user_actions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    action_type text NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Ativar RLS para a tabela de ações do usuário
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de ações do usuário
CREATE POLICY "User actions are viewable by users of the same company." ON public.user_actions FOR SELECT TO authenticated USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can insert their own actions." ON public.user_actions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own actions." ON public.user_actions FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own actions." ON public.user_actions FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Criação da tabela de formulários
CREATE TABLE public.forms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    form_data jsonb NOT NULL,
    status text,
    created_at timestamp with time zone DEFAULT now()
);

-- Ativar RLS para a tabela de formulários
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de formulários
CREATE POLICY "Forms are viewable by users of the same company." ON public.forms FOR SELECT TO authenticated USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can insert their own forms." ON public.forms FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own forms." ON public.forms FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own forms." ON public.forms FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Criação da tabela de pedidos
CREATE TABLE public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    order_number text UNIQUE NOT NULL,
    status text NOT NULL,
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Ativar RLS para a tabela de pedidos
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de pedidos
CREATE POLICY "Orders are viewable by users of the same company." ON public.orders FOR SELECT TO authenticated USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can insert their own orders." ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own orders." ON public.orders FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own orders." ON public.orders FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Criação da tabela de rastreamento
CREATE TABLE public.tracking (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    location jsonb,
    status_update text,
    timestamp timestamp with time zone DEFAULT now()
);

-- Ativar RLS para a tabela de rastreamento
ALTER TABLE public.tracking ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de rastreamento
CREATE POLICY "Tracking info is viewable by users of the same company." ON public.tracking FOR SELECT TO authenticated USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can insert their own tracking updates." ON public.tracking FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own tracking updates." ON public.tracking FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own tracking updates." ON public.tracking FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Criação da tabela de histórico
CREATE TABLE public.history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    event_details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Ativar RLS para a tabela de histórico
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela de histórico
CREATE POLICY "History is viewable by users of the same company." ON public.history FOR SELECT TO authenticated USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));
CREATE POLICY "Users can insert their own history events." ON public.history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own history events." ON public.history FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own history events." ON public.history FOR DELETE TO authenticated USING (user_id = auth.uid());
