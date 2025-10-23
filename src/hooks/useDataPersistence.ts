// Hook customizado para facilitar o uso dos serviços de IndexedDB e sincronização

import { useCallback } from 'react'
import { indexedDBService } from '../services/indexedDBService'
import { syncService } from '../services/syncService'

interface UserAction {
  id: string
  userId: string
  companyId: string
  actionType: string
  details: any
  createdAt: string
}

interface Form {
  id: string
  userId: string
  companyId: string
  formData: any
  status: string
  createdAt: string
}

interface Order {
  id: string
  userId: string
  companyId: string
  orderNumber: string
  status: string
  details: any
  createdAt: string
}

export const useDataPersistence = (userId: string, companyId: string) => {
  // Salvar ação do usuário
  const saveAction = useCallback(
    async (actionType: string, details: any) => {
      try {
        const action: UserAction = {
          id: `${userId}-${Date.now()}-${Math.random()}`,
          userId,
          companyId,
          actionType,
          details,
          createdAt: new Date().toISOString()
        }
        await indexedDBService.saveUserAction(action)
        console.log('Ação salva com sucesso:', action)
      } catch (error) {
        console.error('Erro ao salvar ação:', error)
      }
    },
    [userId, companyId]
  )

  // Salvar formulário
  const saveForm = useCallback(
    async (formData: any, status: string = 'draft') => {
      try {
        const form: Form = {
          id: `form-${userId}-${Date.now()}`,
          userId,
          companyId,
          formData,
          status,
          createdAt: new Date().toISOString()
        }
        await indexedDBService.saveForm(form)
        console.log('Formulário salvo com sucesso:', form)
        return form
      } catch (error) {
        console.error('Erro ao salvar formulário:', error)
      }
    },
    [userId, companyId]
  )

  // Salvar pedido
  const saveOrder = useCallback(
    async (orderNumber: string, status: string, details: any) => {
      try {
        const order: Order = {
          id: `order-${userId}-${Date.now()}`,
          userId,
          companyId,
          orderNumber,
          status,
          details,
          createdAt: new Date().toISOString()
        }
        await indexedDBService.saveOrder(order)
        console.log('Pedido salvo com sucesso:', order)
        return order
      } catch (error) {
        console.error('Erro ao salvar pedido:', error)
      }
    },
    [userId, companyId]
  )

  // Obter formulários salvos
  const getForms = useCallback(async () => {
    try {
      const forms = await indexedDBService.getForms(userId, companyId)
      return forms
    } catch (error) {
      console.error('Erro ao obter formulários:', error)
      return []
    }
  }, [userId, companyId])

  // Obter pedidos salvos
  const getOrders = useCallback(async () => {
    try {
      const orders = await indexedDBService.getOrders(userId, companyId)
      return orders
    } catch (error) {
      console.error('Erro ao obter pedidos:', error)
      return []
    }
  }, [userId, companyId])

  // Obter histórico
  const getHistory = useCallback(async () => {
    try {
      const history = await indexedDBService.getHistory(userId, companyId)
      return history
    } catch (error) {
      console.error('Erro ao obter histórico:', error)
      return []
    }
  }, [userId, companyId])

  // Forçar sincronização imediata
  const forceSyncNow = useCallback(async () => {
    try {
      await syncService.forceSyncNow(userId, companyId)
      console.log('Sincronização forçada concluída')
    } catch (error) {
      console.error('Erro ao forçar sincronização:', error)
    }
  }, [userId, companyId])

  return {
    saveAction,
    saveForm,
    saveOrder,
    getForms,
    getOrders,
    getHistory,
    forceSyncNow
  }
}

