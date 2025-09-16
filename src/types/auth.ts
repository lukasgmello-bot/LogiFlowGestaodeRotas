export interface AuthUser {
  id: string
  email: string
  nome: string
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
}