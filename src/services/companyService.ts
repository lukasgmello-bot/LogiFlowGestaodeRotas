// Serviço para gerenciar empresas e acesso multi-empresa

import { supabase } from '../lib/supabase'

export interface Company {
  id: string
  name: string
  created_at: string
}

export interface UserCompany {
  id: string
  user_id: string
  company_id: string
  role: 'admin' | 'manager' | 'user'
  created_at: string
}

class CompanyService {
  // Criar uma nova empresa
  async createCompany(name: string, userId: string): Promise<Company | null> {
    try {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{ name }])
        .select()
        .single()

      if (companyError) throw companyError
      if (!company) throw new Error('Erro ao criar empresa')

      // Adicionar o usuário como admin da empresa
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert([
          {
            user_id: userId,
            company_id: company.id,
            role: 'admin'
          }
        ])

      if (userCompanyError) throw userCompanyError

      return company
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error)
      throw new Error(error.message || 'Erro ao criar empresa')
    }
  }

  // Obter todas as empresas do usuário
  async getUserCompanies(userId: string): Promise<Company[]> {
    try {
      const { data: userCompanies, error: userCompaniesError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', userId)

      if (userCompaniesError) throw userCompaniesError

      if (!userCompanies || userCompanies.length === 0) {
        return []
      }

      const companyIds = userCompanies.map((uc) => uc.company_id)

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .in('id', companyIds)

      if (companiesError) throw companiesError

      return companies || []
    } catch (error: any) {
      console.error('Erro ao obter empresas do usuário:', error)
      throw new Error(error.message || 'Erro ao obter empresas')
    }
  }

  // Obter uma empresa específica
  async getCompany(companyId: string): Promise<Company | null> {
    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()

      if (error) throw error

      return company
    } catch (error: any) {
      console.error('Erro ao obter empresa:', error)
      return null
    }
  }

  // Verificar se o usuário tem acesso a uma empresa
  async hasAccessToCompany(userId: string, companyId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select('id')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return !!data
    } catch (error: any) {
      console.error('Erro ao verificar acesso à empresa:', error)
      return false
    }
  }

  // Obter o papel do usuário na empresa
  async getUserRoleInCompany(userId: string, companyId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select('role')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data?.role || null
    } catch (error: any) {
      console.error('Erro ao obter papel do usuário:', error)
      return null
    }
  }

  // Adicionar um usuário a uma empresa
  async addUserToCompany(userId: string, companyId: string, role: string = 'user'): Promise<UserCompany | null> {
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .insert([
          {
            user_id: userId,
            company_id: companyId,
            role
          }
        ])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error: any) {
      console.error('Erro ao adicionar usuário à empresa:', error)
      throw new Error(error.message || 'Erro ao adicionar usuário')
    }
  }

  // Remover um usuário de uma empresa
  async removeUserFromCompany(userId: string, companyId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_companies')
        .delete()
        .eq('user_id', userId)
        .eq('company_id', companyId)

      if (error) throw error
    } catch (error: any) {
      console.error('Erro ao remover usuário da empresa:', error)
      throw new Error(error.message || 'Erro ao remover usuário')
    }
  }

  // Obter todos os usuários de uma empresa
  async getCompanyUsers(companyId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_companies')
        .select('user_id, role')
        .eq('company_id', companyId)

      if (error) throw error

      return data || []
    } catch (error: any) {
      console.error('Erro ao obter usuários da empresa:', error)
      throw new Error(error.message || 'Erro ao obter usuários')
    }
  }

  // Atualizar o papel de um usuário na empresa
  async updateUserRoleInCompany(userId: string, companyId: string, role: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_companies')
        .update({ role })
        .eq('user_id', userId)
        .eq('company_id', companyId)

      if (error) throw error
    } catch (error: any) {
      console.error('Erro ao atualizar papel do usuário:', error)
      throw new Error(error.message || 'Erro ao atualizar papel')
    }
  }
}

export const companyService = new CompanyService()

