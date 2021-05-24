import { Column } from 'material-table';
import { Usuario } from '../interfaces/usuario';
import Tarea from '../interfaces/tarea';

export interface AuthState {
    status: 'authenticated' | 'not-authenticated';
    token: string | null;
    user: Usuario | null;
}

//Ttipos de acciones para manejar el estado del login
export type AuthAction =
    | { type: 'signIn', payload: Usuario, token: string }
    | { type: 'checkAuth', status: string, token: string, payload: Usuario }
    | { type: 'signUp', payload: Usuario }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }


    //Se crea las columans de la tabla de tareas
export const columnsTask: Column<Tarea>[] = [
    { field: 'nombre', title: 'Nombre', width: 250, filtering: true, sorting: true },
    { field: 'descripcion', title: 'Descripción', width: 300, sorting: true },
    { field: 'duracion', title: 'Duración', width: 150, sorting: true },
    { field: 'tiempo', title: 'Tiempo', width: 150, sorting: true },
    { field: 'estadoString', title: 'Estado', width: 150, sorting: true },
    { field: 'iniciadoString', title: 'Iniciado', width: 150, sorting: true },
    { field: 'terminadoString', title: 'Terminado', width: 150, sorting: true },

];
