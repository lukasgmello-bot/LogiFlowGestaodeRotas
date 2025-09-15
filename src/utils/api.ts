import { authService } from '../services/auth';

interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const apiRequest = async (url: string, options: ApiRequestOptions = {}) => {
  const { requireAuth = false, headers = {}, ...restOptions } = options;

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Adicionar token de autorização se necessário
  if (requireAuth) {
    const token = authService.getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  if (!response.ok) {
    // Se token expirou ou inválido, fazer logout
    if (response.status === 401 && requireAuth) {
      authService.logout();
      window.location.reload();
    }
    
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Exemplo de uso para chamadas autenticadas:
export const fetchUserData = () => {
  return apiRequest('/api/user', { requireAuth: true });
};

export const fetchPublicData = () => {
  return apiRequest('/api/public');
};