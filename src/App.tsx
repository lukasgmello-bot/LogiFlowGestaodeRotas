import React, { useState, useEffect } from 'react'
import { authService } from './services/authService'
import { indexedDBService } from './services/indexedDBService'
import { syncService } from './services/syncService'
import { companyService, type Company } from './services/companyService'
import type { AuthUser } from './types/auth'

import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import CompanySelector from './components/CompanySelector'
import Dashboard from './components/Dashboard'
import MapaReal from './components/MapaReal'

type Screen = 'login' | 'register' | 'forgot-password' | 'company-selector' | 'dashboard' | 'mapa-real'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  // Inicializar IndexedDB na montagem do componente
  useEffect(() => {
    const initIndexedDB = async () => {
      console.log('Iniciando inicialização do IndexedDB...');
      try {
        await indexedDBService.init()
        console.log('IndexedDB inicializado com sucesso')
      } catch (err) {
        console.error('Erro crítico ao inicializar IndexedDB:', err)
      }
    }

    initIndexedDB()
  }, [])

  // Checagem de autenticação inicial
  useEffect(() => {
    const initAuth = async () => {
      console.log('Iniciando verificação de autenticação...');
      try {
        const authUser = await authService.getCurrentUser()
        console.log('Usuário atual:', authUser ? 'Autenticado' : 'Não autenticado');
        if (authUser) {
          const profile = await authService.getProfile(authUser.id)
          if (profile) {
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              nome: profile.nome
            })
            
            // Verificar se há uma empresa selecionada anteriormente
            const savedCompanyId = await indexedDBService.getSessionData('selectedCompanyId')
            if (savedCompanyId) {
              const company = await companyService.getCompany(savedCompanyId)
              if (company) {
                setSelectedCompany(company)
                setCurrentScreen('dashboard')
                syncService.startSync(authUser.id, company.id)
              } else {
                setCurrentScreen('company-selector')
              }
            } else {
              setCurrentScreen('company-selector')
            }
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err)
        setUser(null)
        setCurrentScreen('login')
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listener de mudanças de sessão
    const { subscription } = authService.onAuthStateChange(async (authUser) => {
      if (authUser) {
        const profile = await authService.getProfile(authUser.id)
        if (profile) {
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            nome: profile.nome
          })
          
          // Verificar se há uma empresa selecionada anteriormente
          const savedCompanyId = await indexedDBService.getSessionData('selectedCompanyId')
          if (savedCompanyId) {
            const company = await companyService.getCompany(savedCompanyId)
            if (company) {
              setSelectedCompany(company)
              setCurrentScreen('dashboard')
              syncService.startSync(authUser.id, company.id)
            } else {
              setCurrentScreen('company-selector')
            }
          } else {
            setCurrentScreen('company-selector')
          }
        }
      } else {
        setUser(null)
        setSelectedCompany(null)
        setCurrentScreen('login')
        syncService.stopSync()
      }
    })

    return () => {
      subscription?.unsubscribe()
      syncService.stopSync()
    }
  }, [])

  const handleLogout = async () => {
    try {
      syncService.stopSync()
      await indexedDBService.deleteSessionData('selectedCompanyId')
      await authService.signOut()
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      setUser(null)
      setSelectedCompany(null)
      setCurrentScreen('login')
    }
  }

  const handleSelectCompany = async (company: Company) => {
    try {
      // Salvar a empresa selecionada no IndexedDB
      await indexedDBService.saveSessionData('selectedCompanyId', company.id)
      setSelectedCompany(company)
      setCurrentScreen('dashboard')
      
      // Iniciar sincronização para a empresa selecionada
      if (user) {
        syncService.startSync(user.id, company.id)
      }
    } catch (err) {
      console.error('Erro ao selecionar empresa:', err)
    }
  }

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  switch (currentScreen) {
    case 'register':
      return <Register onRegister={() => {}} onNavigate={handleNavigate} />
    case 'forgot-password':
      return <ForgotPassword onNavigate={handleNavigate} />
    case 'company-selector':
      return user ? (
        <CompanySelector
          userId={user.id}
          onSelectCompany={handleSelectCompany}
          onLogout={handleLogout}
        />
      ) : null
    case 'dashboard':
      return user && selectedCompany ? (
        <Dashboard
          user={user}
          company={selectedCompany}
          onLogout={handleLogout}
          onRedirectToMap={() => setCurrentScreen('mapa-real')}
        />
      ) : null
    case 'mapa-real':
      return user && selectedCompany ? (
        <MapaReal 
          user={user} 
          company={selectedCompany}
          onLogout={handleLogout} 
        />
      ) : null
    default:
      return <Login onLogin={() => {}} onNavigate={handleNavigate} />
  }
}

