import { Schema, model, PaginateModel, Document } from "mongoose";
import mongoosePaginate = require('mongoose-paginate-v2');
import ITarea from "../interfaces/ITarea";

const tareaSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario',
        required: [true, "Debe existir la referencia a un usuario"],
      },
    nombre: {
        type: String,
        required: [true, "Debes dejar un nombre para la tarea"],
    },
    descripcion: {
        type: String,
        required: [true, "Debes dejar una descripción para la tarea"],
    },
    duracion: {
        horas: {
            type: Number,
            default: 0,
        },
        minutos: {
            type: Number,
            default: 0,
        },
        segundos: {
            type: Number,
            default: 0,
        },
    },
    tiempo: {
        horas: {
            type: Number,
            default: 0,
        },
        minutos: {
            type: Number,
            default: 0,
        },
        segundos: {
            type: Number,
            default: 0,
        },
    },
    estado: {
        type: Number,
        default: 0,
    },
    terminado: {
        type: Number,
        default: Date.now(),
    },
    activo: {
        type: Boolean,
        default: true,
    },
});

tareaSchema.plugin(mongoosePaginate);

interface TareaModel<T extends Document> extends PaginateModel<T> { }

export const TareaModel: TareaModel<ITarea> = model<ITarea>('Tarea', tareaSchema, 'tareas') as TareaModel<ITarea>;
