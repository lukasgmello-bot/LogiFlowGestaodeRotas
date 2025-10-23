-- Criar tabela de relação entre usuários e empresas
CREATE TABLE public.user_companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, company_id)
);

-- Ativar RLS para a tabela user_companies
ALTER TABLE public.user_companies ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para a tabela user_companies
CREATE POLICY "Users can view their own company memberships." ON public.user_companies FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage company memberships." ON public.user_companies FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_companies
        WHERE user_id = auth.uid() AND company_id = company_id AND role = 'admin'
    )
);
CREATE POLICY "Admins can update company memberships." ON public.user_companies FOR UPDATE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.user_companies
        WHERE user_id = auth.uid() AND company_id = company_id AND role = 'admin'
    )
);
CREATE POLICY "Admins can delete company memberships." ON public.user_companies FOR DELETE TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.user_companies
        WHERE user_id = auth.uid() AND company_id = company_id AND role = 'admin'
    )
);

-- Atualizar as políticas de RLS para as tabelas existentes para considerar o acesso multi-empresa

-- Atualizar RLS para user_actions
DROP POLICY IF EXISTS "User actions are viewable by users of the same company." ON public.user_actions;
CREATE POLICY "User actions are viewable by users of the same company." ON public.user_actions FOR SELECT TO authenticated USING (
    company_id IN (
        SELECT company_id FROM public.user_companies WHERE user_id = auth.uid()
    )
);

-- Atualizar RLS para forms
DROP POLICY IF EXISTS "Forms are viewable by users of the same company." ON public.forms;
CREATE POLICY "Forms are viewable by users of the same company." ON public.forms FOR SELECT TO authenticated USING (
    company_id IN (
        SELECT company_id FROM public.user_companies WHERE user_id = auth.uid()
    )
);

-- Atualizar RLS para orders
DROP POLICY IF EXISTS "Orders are viewable by users of the same company." ON public.orders;
CREATE POLICY "Orders are viewable by users of the same company." ON public.orders FOR SELECT TO authenticated USING (
    company_id IN (
        SELECT company_id FROM public.user_companies WHERE user_id = auth.uid()
    )
);

-- Atualizar RLS para tracking
DROP POLICY IF EXISTS "Tracking info is viewable by users of the same company." ON public.tracking;
CREATE POLICY "Tracking info is viewable by users of the same company." ON public.tracking FOR SELECT TO authenticated USING (
    company_id IN (
        SELECT company_id FROM public.user_companies WHERE user_id = auth.uid()
    )
);

-- Atualizar RLS para history
DROP POLICY IF EXISTS "History is viewable by users of the same company." ON public.history;
CREATE POLICY "History is viewable by users of the same company." ON public.history FOR SELECT TO authenticated USING (
    company_id IN (
        SELECT company_id FROM public.user_companies WHERE user_id = auth.uid()
    )
);
