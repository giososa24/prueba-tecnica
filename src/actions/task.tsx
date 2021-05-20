import tareaApi from '../api/tareaApi';
import { Response } from '../interfaces/response';
import Tarea from '../interfaces/tarea';

export const createTask = (tarea: Tarea) => {

    return tareaApi.post<Response<Tarea>>('/tarea/create', tarea);
}

export const getByUserTask = (idUsuario: string, page: number, limit: number, estado: number, duracion: number) => {
    
    return tareaApi.get<Response<Tarea>>(`/tarea/get-by-user/${idUsuario}/${page}/${limit}/${estado}/${duracion}`);
}