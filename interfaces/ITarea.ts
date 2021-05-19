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
    terminado: number;
    activo: boolean;
}

//Estado 0 por iniciar, 1 en curso, 2 pausado, 3 finalizado