import tareaApi from '../api/tareaApi';
import { Response, ResponseWeek } from '../interfaces/response';
import Tarea from '../interfaces/tarea';


export const getByUserTask = (idUsuario: string, page: number, limit: number, estado: number, duracion: number) => {
    
    return tareaApi.get<Response<Tarea>>(`/tarea/get-by-user/${idUsuario}/${page}/${limit}/${estado}/${duracion}`);
}

export const createTask = (tarea: Tarea) => {

    return tareaApi.post<Response<Tarea>>('/tarea/create', tarea);
}

export const createTaskRandom = (idUsuario: string) => {

    return tareaApi.get<Response<Tarea>>(`/tarea/create-random/${idUsuario}`);
}

export const updateTask = (tarea: Tarea) => {

    return tareaApi.put<Response<Tarea>>('/tarea/update', tarea);
}

export const changeStateTask = (tarea: Tarea) => {

    return tareaApi.put<Response<Tarea>>('/tarea/change-state', tarea);
}

export const deleteTask = (idTarea: string) => {

    return tareaApi.delete<Response<Tarea>>(`/tarea/delete/${idTarea}`);
}

export const filterByWeekTask = (usuario: string, fechaInicial: number, fechaFinal: number) => {

    return tareaApi.get<Response<Tarea> | ResponseWeek>(`/tarea/filter-by-week/${usuario}/${fechaInicial}/${fechaFinal}`);
}

