import { Document } from 'mongoose';
import IDuracion from "./IDuracion";

export default interface ITarea extends Document {
    usuario: string;
    nombre: string;
    descripcion: string;
    duracion: IDuracion;
    tiempo: IDuracion;
    estado: number;
    creado: number;
    terminado: number;
    activo: boolean;
}

//Estado 0 por iniciar, 1 en curso, 2 pausado, 3 finalizado