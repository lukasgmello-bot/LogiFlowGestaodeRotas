import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const authService = {
  register: async (email: string, password: string, nome: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // Cria o perfil automaticamente
      await supabase.from("profiles").upsert([
        { id: data.user.id, nome, email }
      ]);
    }
    return data;
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Busca o perfil do usuário, usando maybeSingle() para evitar erro se não existir
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError) throw new Error("Erro ao buscar perfil: " + profileError.message);

    return { session: data.session, user: profile };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  },
};
