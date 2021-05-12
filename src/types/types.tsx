import { Usuario } from '../interfaces/usuario';

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    user: Usuario | null;
}

export type AuthAction =
    | { type: 'signIn', payload: Usuario }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }
