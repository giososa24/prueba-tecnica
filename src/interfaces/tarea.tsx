
//Interfaz con las propiedades que tiene una tarea
export default interface Tarea {
    _id?: string;
    usuario?: string;
    nombre: string;
    descripcion: string;
    duracion?: string;
    tiempo?: string;
    horas: number;
    minutos: number;
    segundos: number;
    tiempoHoras?: number;
    tiempoMinutos?: number;
    tiempoSegundos?: number;
    estado?: number;
    estadoString?: string;
    creado?: number;
    iniciado?: number;
    iniciadoString?: string;
    terminado?: number;
    terminadoString?: string;
}