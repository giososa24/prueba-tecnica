

export default interface Tarea {
    _id?: string;
    usuario?: string;
    nombre: string;
    descripcion: string;
    duracion: Duracion;
    tiempo?: Duracion;
    estado?: number;
    creado?: number;
    terminado?: number;
}

export interface Duracion {
    horas: number;
    minutos: number;
    segundos: number;
}