import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../lib/supabase'

export interface AuthUser {
  id: string
  email: string
  nome: string
}

class AuthService {
  // Cadastro de usuário
  async signUp(email: string, password: string, nome: string) {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      // 2. Criar perfil na tabela profiles (upsert evita duplicação)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          nome,
          email,
        })

      if (profileError) console.error('Erro ao criar perfil:', profileError)

      return { user: authData.user, session: authData.session }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta')
    }
  }

  // Login
  async signIn(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Usuário não encontrado')

      // Buscar perfil do usuário, usando maybeSingle() para evitar erro se não existir
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle()

      if (profileError) console.error('Erro ao buscar perfil:', profileError)

      return { user: authData.user, session: authData.session, profile }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer login')
    }
  }

  // Logout
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout')
    }
  }

  // Reset de senha
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao enviar email de recuperação')
    }
  }

  // Buscar perfil do usuário
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // evita erro se não existir

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return null
    }
  }

  // Escutar mudanças de autenticação
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

export const authService = new AuthService()
