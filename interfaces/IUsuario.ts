import { Document } from 'mongoose';

export default interface IUsuario extends Document {
    correo: string;
    contrasena: string;
    nombre: string;
    apePat: string;
    apeMat: string;
    creado: number;
    activo: boolean;
    token?: string;
}