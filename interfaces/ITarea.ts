import { Document } from 'mongoose';

export default interface ITarea extends Document {
    usuario: string;
    nombre: string;
    descripcion: string;
    horas: number;
    minutos: number;
    segundos: number;
    tiempoHoras: number;
    tiempoMinutos: number;
    tiempoSegundos: number;
    estado: number;
    creado: number;
    iniciado: number;
    terminado: number;
    activo: boolean;
}

//Estado 0 en curso, 1 por iniciar, 2 pausado, 3 finalizado