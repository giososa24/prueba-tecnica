import { createTask, getByUserTask, updateTask, deleteTask, createTaskRandom, changeStateTask, filterByWeekTask } from '../actions/task';
import { errorMessage, successMessage } from "../functions/Swal";
import Tarea from "../interfaces/tarea";
import { Usuario } from "../interfaces/usuario";

export const useTask = () => {

    const payload = localStorage.getItem('usuario');
    let usuario: Usuario;
    if (payload) {
        usuario = JSON.parse(payload!) as Usuario;
    }

    const getByUser = async (page: number, limit: number, estado: number, duracion: number) => {

        try {
            const resp = await getByUserTask(usuario._id, page, limit, estado, duracion);
            if (resp.data.status === false) {
                errorMessage(resp.data.message);
            }
            return resp.data;
        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }

    }

    const create = async (tarea: Tarea) => {

        try {
            tarea.usuario = usuario._id;

            if (validarTiempo(tarea)) {
                const resp = await createTask(tarea);

                if (resp.data.status !== false) {
                    successMessage(resp.data.message);
                } else {
                    errorMessage(resp.data.message);
                }
            }
        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }
    }

    const createRandom = async () => {

        try {
            const resp = await createTaskRandom(usuario._id);

            if (resp.data.status !== false) {
                successMessage(resp.data.message);
            } else {
                errorMessage(resp.data.message);
            }
        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }
    }

    const update = async (tarea: Tarea) => {

        try {
            tarea.usuario = usuario._id;

            if (validarTiempo(tarea)) {
                const resp = await updateTask(tarea);

                if (resp.data.status !== false) {
                    successMessage(resp.data.message);
                } else {
                    errorMessage(resp.data.message);
                }
            }
        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }
    }

    const changeState = async (tarea: Tarea) => {

        try {
            tarea.usuario = usuario._id;

            const resp = await changeStateTask(tarea);

            if (resp.data.status !== false) {
                successMessage(resp.data.message);
            } else {
                errorMessage(resp.data.message);
            }
        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }
    }

    const Delete = async (idTarea: string) => {

        try {

            const resp = await deleteTask(idTarea);

            if (resp.data.status !== false) {
                successMessage(resp.data.message);
            } else {
                errorMessage(resp.data.message);
            }
        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }
    }

    const filterByWeek = async (fechaInicial: number, fechaFinal: number) => {

        try {

            const resp = await filterByWeekTask(usuario._id, fechaInicial, fechaFinal);

            return resp.data;

        } catch (error) {
            errorMessage('Ha surgido un error, favor contacte al administrador');
        }
    }

    const validarTiempo = (tarea: Tarea) => {
        const { horas, minutos, segundos } = tarea;

        if (Number(horas) >= 2 && Number(minutos) > 0 && Number(segundos) > 0) {
            errorMessage('La tarea no puede exceder las 2 horas');
            return false;
        } else {
            return true;
        }
    }

    return {
        create,
        createRandom,
        getByUser,
        update,
        changeState,
        Delete,
        filterByWeek,
    }
}
