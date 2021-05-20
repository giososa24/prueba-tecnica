import tareaApi from '../api/tareaApi';
import { Usuario } from '../interfaces/usuario';
import { AuthAction } from '../types/types';

export const Login = (email: string, password: string) => {

    return async (dispatch: (action: AuthAction) => void) => {

        const { data } = await tareaApi.post('/login/login', { email, password });

        if (data.data && data.status !== false) {
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.data));
                dispatch(login(data.data, data.token));
            }

        } else {
            localStorage.clear();
            dispatch({ type: 'notAuthenticated' });
        }

    }
}

const login = (user: Usuario, token: string): AuthAction => ({
    type: 'signIn',
    payload: user,
    token,
});

export const Logout = () => {

    return async (dispatch: (action: AuthAction) => void) => {

        localStorage.clear();
        dispatch({ type: 'logout' });
    }
}

export const CheckAuth = () => {

    return async (dispatch: (action: AuthAction) => void) => {

        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token');
            const payload = localStorage.getItem('usuario');

            if (token && payload) {
                const usuario = JSON.parse(payload);
                dispatch(checkAuth('authenticated', token, usuario as Usuario));
            }
        } else {
            localStorage.clear();
            dispatch({ type: 'notAuthenticated' });
        }

    }
}

const checkAuth = (status: string, token: string, payload: Usuario): AuthAction => ({
    type: 'checkAuth',
    status,
    token,
    payload,
});

export const Register = (form: Usuario) => {

    return async (dispatch: (action: AuthAction) => void) => {

        const { data } = await tareaApi.post('/usuario/save-user', form);

        if (data && data.status !== false) {
            dispatch(register(data.data));
        }
    }
}

const register = (user: Usuario): AuthAction => ({
    type: 'signUp',
    payload: user,
});
