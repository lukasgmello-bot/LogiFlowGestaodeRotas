// Serviço para gerenciar a persistência de dados do usuário usando IndexedDB

const DB_NAME = 'LogiFlowDB'
const DB_VERSION = 1

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

interface TrackingInfo {
  id: string
  orderId: string
  userId: string
  companyId: string
  location: any
  statusUpdate: string
  timestamp: string
}

interface HistoryEvent {
  id: string
  userId: string
  companyId: string
  eventType: string
  eventDetails: any
  createdAt: string
}

class IndexedDBService {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        console.log('IndexedDB inicializado com sucesso')
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Criar object stores para cada tipo de dado
        if (!db.objectStoreNames.contains('userActions')) {
          db.createObjectStore('userActions', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('forms')) {
          db.createObjectStore('forms', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('tracking')) {
          db.createObjectStore('tracking', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' })
        }

        if (!db.objectStoreNames.contains('sessionData')) {
          db.createObjectStore('sessionData', { keyPath: 'key' })
        }

        console.log('Object stores criados com sucesso')
      }
    })
  }

  // Ações do usuário
  async saveUserAction(action: UserAction): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userActions'], 'readwrite')
      const store = transaction.objectStore('userActions')
      const request = store.add(action)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getUserActions(userId: string, companyId: string): Promise<UserAction[]> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userActions'], 'readonly')
      const store = transaction.objectStore('userActions')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const actions = request.result.filter(
          (action) => action.userId === userId && action.companyId === companyId
        )
        resolve(actions)
      }
    })
  }

  // Formulários
  async saveForm(form: Form): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['forms'], 'readwrite')
      const store = transaction.objectStore('forms')
      const request = store.put(form)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getForms(userId: string, companyId: string): Promise<Form[]> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['forms'], 'readonly')
      const store = transaction.objectStore('forms')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const forms = request.result.filter(
          (form) => form.userId === userId && form.companyId === companyId
        )
        resolve(forms)
      }
    })
  }

  // Pedidos
  async saveOrder(order: Order): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readwrite')
      const store = transaction.objectStore('orders')
      const request = store.put(order)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getOrders(userId: string, companyId: string): Promise<Order[]> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['orders'], 'readonly')
      const store = transaction.objectStore('orders')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const orders = request.result.filter(
          (order) => order.userId === userId && order.companyId === companyId
        )
        resolve(orders)
      }
    })
  }

  // Rastreamento
  async saveTracking(tracking: TrackingInfo): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tracking'], 'readwrite')
      const store = transaction.objectStore('tracking')
      const request = store.add(tracking)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getTracking(companyId: string): Promise<TrackingInfo[]> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tracking'], 'readonly')
      const store = transaction.objectStore('tracking')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const tracking = request.result.filter(
          (t) => t.companyId === companyId
        )
        resolve(tracking)
      }
    })
  }

  // Histórico
  async saveHistoryEvent(event: HistoryEvent): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['history'], 'readwrite')
      const store = transaction.objectStore('history')
      const request = store.add(event)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getHistory(userId: string, companyId: string): Promise<HistoryEvent[]> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['history'], 'readonly')
      const store = transaction.objectStore('history')
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const history = request.result.filter(
          (event) => event.userId === userId && event.companyId === companyId
        )
        resolve(history)
      }
    })
  }

  // Dados de sessão (para armazenar tokens e informações de autenticação)
  async saveSessionData(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessionData'], 'readwrite')
      const store = transaction.objectStore('sessionData')
      const request = store.put({ key, value })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getSessionData(key: string): Promise<any> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessionData'], 'readonly')
      const store = transaction.objectStore('sessionData')
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        resolve(request.result?.value || null)
      }
    })
  }

  async deleteSessionData(key: string): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['sessionData'], 'readwrite')
      const store = transaction.objectStore('sessionData')
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Limpar todos os dados
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('IndexedDB não inicializado')

    const stores = ['userActions', 'forms', 'orders', 'tracking', 'history', 'sessionData']

    for (const storeName of stores) {
      await new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(null)
      })
    }

    console.log('Todos os dados foram limpos do IndexedDB')
  }
}

export const indexedDBService = new IndexedDBService()

