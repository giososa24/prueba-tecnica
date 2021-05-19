import { createTask } from "../actions/task";
import { errorMessage, successMessage } from "../functions/Swal";
import Tarea from "../interfaces/tarea";
import { Usuario } from "../interfaces/usuario";

export const useTask = () => {

    const create = async (nombre: string, descripcion: string, horas: number, minutos: number, segundos: number) => {

        const payload = localStorage.getItem('usuario');
        let usuario: Usuario;
        let task: Tarea;

        if (payload) {
            usuario = JSON.parse(payload) as Usuario;            
            task = {
                usuario: usuario._id,
                nombre,
                descripcion,
                duracion: {
                    horas,
                    minutos,
                    segundos
                },

            };

            if (Number(horas) >= 2 && Number(minutos) > 0 && Number(segundos) > 0) {
                errorMessage('La tarea no puede exceder las 2 horas');
            } else {
                try {
                    const resp = await createTask(task);

                    if (resp.data.status !== false) {
                        successMessage(resp.data.message);
                    } else {
                        errorMessage(resp.data.message);
                    }
                } catch (error) {
                    errorMessage('Ha surgido un error, favor contacte al administrador');
                }
            }
        }
    }

    return {
        create,
    }
}
