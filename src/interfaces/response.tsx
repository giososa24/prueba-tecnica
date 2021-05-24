import { Pagination } from "./pagination";

//Interfaces que reciben un generico dependiendo del objecto que llegue del backend

export interface Response<T> {
    data?: T[],
    message: string,
    status: boolean,
    pagination?: Pagination
}

export interface ResponseWeek {
    dia: string,
    tareas: number,
}