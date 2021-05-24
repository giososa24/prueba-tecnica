import tareaApi from '../api/tareaApi';
import { Usuario } from '../interfaces/usuario';
import { AuthAction } from '../types/types';

//Funcion que hace el dispatch de login de usuario
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

//Funcion que hace el dispatch para que el usuario se desautentique de la aplicacion
export const Logout = () => {

    return async (dispatch: (action: AuthAction) => void) => {

        localStorage.clear();
        dispatch({ type: 'logout' });
    }
}

//Funcion que sirve para verificar el estado global del login en la aplicacion
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


//Funcion que hace el dispatch para registar a un nuevo usuario
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
