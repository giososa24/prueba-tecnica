import { AuthAction, AuthState } from "../types/types";

const initialState: AuthState = {
    status: 'not-authenticated',
    token: null,
    user: null,
}

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {

    switch (action.type) {

        case 'signIn':
            return {
                ...state,
                status: 'authenticated',
                user: action.payload,
                token: action.token,
            }

        case 'signUp':
            return {
                ...state,
                status: 'not-authenticated',
                user: action.payload,
            }

        case 'checkAuth':            
            return {
                ...state,
                status: 'authenticated',
                token: action.token,
                user: action.payload,
            }

        case 'logout':
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null,
            }
        case 'notAuthenticated':
            return {
                ...state,
                status: 'not-authenticated',
                token: null,
                user: null,
            }

        default:
            return initialState;
    }

}