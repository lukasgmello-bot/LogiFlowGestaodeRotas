// Serviço para sincronizar dados entre IndexedDB e Supabase

import { supabase } from '../lib/supabase'
import { indexedDBService } from './indexedDBService'

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null
  private isSyncing = false

  // Iniciar sincronização contínua
  startSync(userId: string, companyId: string, intervalMs: number = 30000): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    // Sincronizar imediatamente ao iniciar
    this.syncData(userId, companyId)

    // Depois, sincronizar periodicamente
    this.syncInterval = setInterval(() => {
      this.syncData(userId, companyId)
    }, intervalMs)

    console.log('Sincronização iniciada a cada', intervalMs, 'ms')
  }

  // Parar sincronização contínua
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
      console.log('Sincronização parada')
    }
  }

  // Sincronizar todos os dados
  private async syncData(userId: string, companyId: string): Promise<void> {
    if (this.isSyncing) return

    this.isSyncing = true

    try {
      // Sincronizar ações do usuário
      await this.syncUserActions(userId, companyId)

      // Sincronizar formulários
      await this.syncForms(userId, companyId)

      // Sincronizar pedidos
      await this.syncOrders(userId, companyId)

      // Sincronizar rastreamento
      await this.syncTracking(companyId)

      // Sincronizar histórico
      await this.syncHistory(userId, companyId)

      console.log('Sincronização concluída com sucesso')
    } catch (error) {
      console.error('Erro durante sincronização:', error)
    } finally {
      this.isSyncing = false
    }
  }

  // Sincronizar ações do usuário
  private async syncUserActions(userId: string, companyId: string): Promise<void> {
    try {
      const localActions = await indexedDBService.getUserActions(userId, companyId)

      // Enviar ações locais para o Supabase
      for (const action of localActions) {
        const { error } = await supabase
          .from('user_actions')
          .upsert(action)

        if (error) {
          console.error('Erro ao sincronizar ação:', error)
        }
      }

      // Buscar ações do Supabase e atualizar IndexedDB
      const { data: remoteActions, error } = await supabase
        .from('user_actions')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)

      if (error) {
        console.error('Erro ao buscar ações do Supabase:', error)
        return
      }

      if (remoteActions) {
        for (const action of remoteActions) {
          await indexedDBService.saveUserAction(action)
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar ações do usuário:', error)
    }
  }

  // Sincronizar formulários
  private async syncForms(userId: string, companyId: string): Promise<void> {
    try {
      const localForms = await indexedDBService.getForms(userId, companyId)

      // Enviar formulários locais para o Supabase
      for (const form of localForms) {
        const { error } = await supabase
          .from('forms')
          .upsert(form)

        if (error) {
          console.error('Erro ao sincronizar formulário:', error)
        }
      }

      // Buscar formulários do Supabase e atualizar IndexedDB
      const { data: remoteForms, error } = await supabase
        .from('forms')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)

      if (error) {
        console.error('Erro ao buscar formulários do Supabase:', error)
        return
      }

      if (remoteForms) {
        for (const form of remoteForms) {
          await indexedDBService.saveForm(form)
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar formulários:', error)
    }
  }

  // Sincronizar pedidos
  private async syncOrders(userId: string, companyId: string): Promise<void> {
    try {
      const localOrders = await indexedDBService.getOrders(userId, companyId)

      // Enviar pedidos locais para o Supabase
      for (const order of localOrders) {
        const { error } = await supabase
          .from('orders')
          .upsert(order)

        if (error) {
          console.error('Erro ao sincronizar pedido:', error)
        }
      }

      // Buscar pedidos do Supabase e atualizar IndexedDB
      const { data: remoteOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)

      if (error) {
        console.error('Erro ao buscar pedidos do Supabase:', error)
        return
      }

      if (remoteOrders) {
        for (const order of remoteOrders) {
          await indexedDBService.saveOrder(order)
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar pedidos:', error)
    }
  }

  // Sincronizar rastreamento
  private async syncTracking(companyId: string): Promise<void> {
    try {
      // Buscar rastreamento do Supabase e atualizar IndexedDB
      const { data: remoteTracking, error } = await supabase
        .from('tracking')
        .select('*')
        .eq('company_id', companyId)

      if (error) {
        console.error('Erro ao buscar rastreamento do Supabase:', error)
        return
      }

      if (remoteTracking) {
        for (const tracking of remoteTracking) {
          await indexedDBService.saveTracking(tracking)
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar rastreamento:', error)
    }
  }

  // Sincronizar histórico
  private async syncHistory(userId: string, companyId: string): Promise<void> {
    try {
      // Buscar histórico do Supabase e atualizar IndexedDB
      const { data: remoteHistory, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId)

      if (error) {
        console.error('Erro ao buscar histórico do Supabase:', error)
        return
      }

      if (remoteHistory) {
        for (const event of remoteHistory) {
          await indexedDBService.saveHistoryEvent(event)
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar histórico:', error)
    }
  }

  // Forçar sincronização imediata
  async forceSyncNow(userId: string, companyId: string): Promise<void> {
    await this.syncData(userId, companyId)
  }
}

export const syncService = new SyncService()

