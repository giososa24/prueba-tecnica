import tareaApi from '../api/tareaApi';
import { Usuario } from '../interfaces/usuario';
import { Response } from '../interfaces/response';
import { AuthAction } from '../types/types';


export const Login = (email: string, password: string) => {

    return async (dispatch: (action: AuthAction) => void) => {

        const { data } = await tareaApi.post('/login/login', { email, password });

        console.log(data);
        
        if (data.data && data.status !== false) {
            if (data.token) {
                localStorage.setItem('token', data.token);

                dispatch(login(data.data));
            }

        } else {
            localStorage.clear();
            dispatch({ type: 'notAuthenticated' });
        }

    }
}

const login = (user: Usuario): AuthAction => ({
    type: 'signIn',
    payload: user,
});

export const Register = ( form: Usuario ) => {
    
    return async (dispatch: (action: AuthAction) => void) => {

        const { data } = await tareaApi.post<Response<null>>('/usuario/save-user', form);

        if (data && data.status !== false) {
            dispatch(register(data.data!));
        } 

        console.log(data);
        
    }  
}

const register = (user: Usuario): AuthAction => ({
    type: 'signIn',
    payload: user,
});
