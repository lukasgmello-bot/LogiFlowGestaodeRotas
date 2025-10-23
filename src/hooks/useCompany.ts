// Hook customizado para gerenciar a empresa selecionada e facilitar o acesso multi-empresa

import { useCallback } from 'react'
import { companyService, type Company } from '../services/companyService'
import { indexedDBService } from '../services/indexedDBService'

export const useCompany = (userId: string) => {
  // Obter a empresa selecionada do IndexedDB
  const getSelectedCompany = useCallback(async (): Promise<Company | null> => {
    try {
      const companyId = await indexedDBService.getSessionData('selectedCompanyId')
      if (companyId) {
        return await companyService.getCompany(companyId)
      }
      return null
    } catch (error) {
      console.error('Erro ao obter empresa selecionada:', error)
      return null
    }
  }, [])

  // Salvar a empresa selecionada
  const selectCompany = useCallback(
    async (company: Company) => {
      try {
        await indexedDBService.saveSessionData('selectedCompanyId', company.id)
        return true
      } catch (error) {
        console.error('Erro ao salvar empresa selecionada:', error)
        return false
      }
    },
    []
  )

  // Obter todas as empresas do usuário
  const getUserCompanies = useCallback(async (): Promise<Company[]> => {
    try {
      return await companyService.getUserCompanies(userId)
    } catch (error) {
      console.error('Erro ao obter empresas do usuário:', error)
      return []
    }
  }, [userId])

  // Criar uma nova empresa
  const createCompany = useCallback(
    async (name: string): Promise<Company | null> => {
      try {
        return await companyService.createCompany(name, userId)
      } catch (error) {
        console.error('Erro ao criar empresa:', error)
        return null
      }
    },
    [userId]
  )

  // Verificar se o usuário tem acesso a uma empresa
  const hasAccessToCompany = useCallback(
    async (companyId: string): Promise<boolean> => {
      try {
        return await companyService.hasAccessToCompany(userId, companyId)
      } catch (error) {
        console.error('Erro ao verificar acesso à empresa:', error)
        return false
      }
    },
    [userId]
  )

  // Obter o papel do usuário na empresa
  const getUserRoleInCompany = useCallback(
    async (companyId: string): Promise<string | null> => {
      try {
        return await companyService.getUserRoleInCompany(userId, companyId)
      } catch (error) {
        console.error('Erro ao obter papel do usuário:', error)
        return null
      }
    },
    [userId]
  )

  return {
    getSelectedCompany,
    selectCompany,
    getUserCompanies,
    createCompany,
    hasAccessToCompany,
    getUserRoleInCompany
  }
}

