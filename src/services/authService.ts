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

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      // 2. Criar perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          nome,
          email,
        })

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Mesmo com erro no perfil, o usuário foi criado no Auth
      }

      return { user: authData.user, session: authData.session }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta')
    }
  }

  // Login
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { user: data.user, session: data.session }
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
        .single()

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
  getCurrentUser() {
    return supabase.auth.getUser()
  }

  // Escutar mudanças de autenticação
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

export const authService = new AuthService()