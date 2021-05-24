import { combineReducers } from 'redux';
import { authReducer } from './authReducer';

//Se genera el root reducer donde se combina con el reducer de autenticacion
export const rootReducer = combineReducers({
    auth: authReducer
});