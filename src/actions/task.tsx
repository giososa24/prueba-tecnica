import tareaApi from '../api/tareaApi';
import { Response } from '../interfaces/response';
import Tarea from '../interfaces/tarea';

export const createTask = (tarea: Tarea) => {

    return tareaApi.post<Response<Tarea>>('/tarea/create', tarea);
}