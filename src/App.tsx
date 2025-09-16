import React, { useState, useEffect } from 'react'
import { authService } from './services/authService'
import type { AuthUser } from './types/auth'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import Dashboard from './components/Dashboard'

type Screen = 'login' | 'register' | 'forgot-password' | 'dashboard'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há usuário logado
    const checkAuth = async () => {
      try {
        const current = await authService.getCurrentUser()
        const authUser = current?.user || null

        if (authUser) {
          // Buscar perfil do usuário
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
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Escutar mudanças de autenticação
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

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    // O listener já atualiza o user
  }

  const handleRegister = async () => {
    // O listener já atualiza o user
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setCurrentScreen('login')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
    }
  }

  const handleNavigate = (screen: Screen) => setCurrentScreen(screen)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  switch (currentScreen) {
    case 'register':
      return <Register onRegister={handleRegister} onNavigate={handleNavigate} />
    case 'forgot-password':
      return <ForgotPassword onNavigate={handleNavigate} />
    case 'dashboard':
      return user ? <Dashboard user={user} onLogout={handleLogout} /> : null
    default:
      return <Login onLogin={handleLogin} onNavigate={handleNavigate} />
  }
}

export default App
