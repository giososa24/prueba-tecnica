import { Usuario } from '../interfaces/usuario';

export interface AuthState {
    status: 'authenticated' | 'not-authenticated';
    token: string | null;
    user: Usuario | null;
}

export type AuthAction =
    | { type: 'signIn', payload: Usuario, token: string }
    | { type: 'checkAuth', status: string, token: string, payload: Usuario }
    | { type: 'signUp', payload: Usuario }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }
