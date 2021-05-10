import { Schema, model, PaginateModel, Document } from "mongoose";
import mongoosePaginate = require('mongoose-paginate-v2');
import IUsuario from "../interfaces/IUsuario";

const usuarioSchema = new Schema({
    correo: {
        type: String,
        required: [true, "El usuario debe tener un correo"],
    },
    contrasena: {
        type: String,
        required: [true, "Debes dejar una contraseña"],
    },
    nombre: {
        type: String,
        required: [true, "Debes dejar un nombre"],
    },
    apePat: {
        type: String,
        required: [true, "Debes dejar un apéllido paterno"],
    },
    apeMat: {
        type: String,
        required: [true, "Debes dejar un apéllido materno"],
    },
    created: {
        type: Number,
        default: Date.now(),
    },
    activo: {
        type: Boolean,
        default: true,
    },
});

usuarioSchema.plugin(mongoosePaginate);

interface UsuarioModel<T extends Document> extends PaginateModel<T> { }

export const UsuarioModel: UsuarioModel<IUsuario> = model<IUsuario>('Usuario', usuarioSchema, 'usuarios') as UsuarioModel<IUsuario>;
