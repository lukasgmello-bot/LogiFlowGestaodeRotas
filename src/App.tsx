import React, { useState, useEffect } from 'react'
import { authService } from './services/authService'
import type { AuthUser } from './types/auth'

import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'
import MapaReal from './components/MapaReal'

type Screen = 'login' | 'register' | 'forgot-password' | 'dashboard' | 'mapa-real'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Checagem de autenticação inicial
  useEffect(() => {
    const initAuth = async () => {
      try {
        const authUser = await authService.getCurrentUser()
        if (authUser) {
          const profile = await authService.getProfile(authUser.id)
          if (profile) {
            setUser({
              id: authUser.id,
              email: authUser.email || '',
              nome: profile.nome
            })
            setCurrentScreen('dashboard')
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
          setCurrentScreen('dashboard')
        }
      } else {
        setUser(null)
        setCurrentScreen('login')
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    } finally {
      setUser(null)
      setCurrentScreen('login')
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
    case 'dashboard':
      return user ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onRedirectToMap={() => setCurrentScreen('mapa-real')}
        />
      ) : null
    case 'mapa-real':
      return user ? <MapaReal user={user} onLogout={handleLogout} /> : null
    default:
      return <Login onLogin={() => {}} onNavigate={handleNavigate} />
  }
}
