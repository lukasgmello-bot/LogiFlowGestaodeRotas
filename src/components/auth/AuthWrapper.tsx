import React, { useState, useEffect } from 'react';
import { Usuario, AuthState } from '../../types';
import { authService } from '../../services/auth';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import Profile from './Profile';

interface AuthWrapperProps {
  children: (authState: AuthState) => React.ReactNode;
}

type AuthScreen = 'login' | 'register' | 'forgot-password' | 'profile';

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const token = authService.getToken();
    const userData = authService.getUser();

    if (token && userData) {
      setAuthState({
        isAuthenticated: true,
        user: userData,
        token: token
      });
    }

    setLoading(false);
  }, []);

  const handleLogin = (token: string, user: Usuario) => {
    setAuthState({
      isAuthenticated: true,
      user: user,
      token: token
    });
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    setCurrentScreen('login');
  };

  const handleUpdateUser = (user: Usuario) => {
    setAuthState(prev => ({
      ...prev,
      user: user
    }));
  };

  const handleNavigate = (screen: AuthScreen) => {
    setCurrentScreen(screen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostrar telas de auth
  if (!authState.isAuthenticated) {
    switch (currentScreen) {
      case 'register':
        return <Register onNavigate={handleNavigate} />;
        return <Register onRegister={handleLogin} onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'profile':
        return (
          <Profile 
            user={authState.user!} 
            onLogout={handleLogout}
            onUpdateUser={handleUpdateUser}
          />
        );
      default:
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  }

  // Se está autenticado, verificar se quer ver o perfil
  if (currentScreen === 'profile') {
    return (
      <Profile 
        user={authState.user!} 
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  // Se está autenticado, mostrar a aplicação principal
  return (
    <>
      {children(authState)}
    </>
  );
}