import { Pagination } from "./pagination";

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