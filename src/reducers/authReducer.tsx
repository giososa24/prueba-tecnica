import { AuthAction, AuthState } from "../types/types";

const initialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
}

export const authReducer = (state = initialState, action: AuthAction): AuthState => {

    switch (action.type) {

        case 'signIn':
            return {
                ...state,
                status: 'authenticated',
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
            return state;
    }

}