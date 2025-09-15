interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  nome: string;
  telefone?: string;
}

interface AuthResponse {
  token: string;
  id?: number;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    return response.json();
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch('https://reqres.in/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar conta');
    }

    return response.json();
  },

  async getUserProfile(userId: string): Promise<any> {
    const response = await fetch(`https://dummyjson.com/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar perfil do usuário');
    }

    return response.json();
  },

  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken(): void {
    localStorage.removeItem('auth_token');
  },

  saveUser(user: any): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  getUser(): any | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  removeUser(): void {
    localStorage.removeItem('user_data');
  },

  logout(): void {
    this.removeToken();
    this.removeUser();
  }
};