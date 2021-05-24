import { Request, Response } from "express";
import { PaginateResult } from "mongoose";
import { IPagination } from "../interfaces/IPagination";
import ITarea from "../interfaces/ITarea";
import { TareaModel } from "../models/tarea";
import { UsuarioModel } from "../models/usuario";
import moment from 'moment';


export const tareaController = {

    getByUser: async (req: Request, res: Response) => {

        const idUsuario = req.params.id;
        const page = Number(req.params.page);
        const estado = Number(req.params.estado);
        const duracion = Number(req.params.duracion);
        const limit = Number(req.params.limit);
        const optionsPaginate = {
            page,
            limit,
        };

        try {

            let tareasPaginadas: PaginateResult<ITarea>;

            if (estado === 3) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, estado: 3, activo: true }, { '__v': 0 }, { sort: { nombre: 1 } }), optionsPaginate);
            } else if (duracion === 1) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, minutos: { $gt: 0, $lt: 30 }, horas: { $lte: 0 }, segundos: { $gte: 0 }, activo: true }, { '__v': 0 }, { sort: { estado: 1 } }), optionsPaginate);
            } else if (duracion === 2) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, minutos: { $gte: 30, $lt: 59 }, horas: { $lte: 0 }, segundos: { $gte: 0 }, activo: true }, { '__v': 0 }, { sort: { estado: 1 } }), optionsPaginate);
            } else if (duracion === 3) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, horas: { $gte: 1 }, activo: true }, { '__v': 0 }, { sort: { estado: 1 } }), optionsPaginate);
            } else {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, activo: true }, { '__v': 0 }, { sort: { estado: 1 } }), optionsPaginate);
            }

            const data: ITarea[] = tareasPaginadas.docs;
            const pagination: IPagination = {
                hasNextPage: tareasPaginadas.hasNextPage,
                hasPrevPage: tareasPaginadas.hasPrevPage,
                limit: tareasPaginadas.limit,
                nextPage: tareasPaginadas.nextPage,
                page: tareasPaginadas.page,
                pagingCounter: tareasPaginadas.pagingCounter,
                prevPage: tareasPaginadas.prevPage,
                totalDocs: tareasPaginadas.totalDocs,
                totalPages: tareasPaginadas.totalPages,
            };

            if (data.length > 0) {
                return res.status(202).send({
                    status: true,
                    pagination,
                    data
                });
            } else {
                return res.status(200).send({
                    status: false,
                    message: 'No existen tareas registradas',
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

    create: async (req: Request, res: Response) => {

        try {

            const body: ITarea = req.body;
            let tareaNueva: ITarea = new TareaModel();

            tareaNueva.usuario = body.usuario;
            tareaNueva.nombre = body.nombre;
            tareaNueva.descripcion = body.descripcion;
            tareaNueva.horas = body.horas;
            tareaNueva.minutos = body.minutos;
            tareaNueva.segundos = body.segundos;
            tareaNueva.creado = Date.now();

            const usuarioFind = await UsuarioModel.findOne({ _id: body.usuario, activo: true });

            if (usuarioFind) {

                const tareaCreated = await tareaNueva.save();

                if (tareaNueva.horas < 2) {
                    if (tareaCreated) {
                        return res.status(202).send({
                            status: true,
                            message: 'Tarea almacenada correctamente',
                        });
                    } else {
                        return res.status(200).send({
                            status: false,
                            message: 'Surgió un error al guardar la tarea',
                        });
                    }
                } else {
                    return res.status(200).send({
                        status: false,
                        message: 'La duración de la tarea no puede exceder las 2 horas',
                    });
                }

            } else {
                return res.status(200).send({
                    status: false,
                    message: 'El usuario no existe',
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

    createRandom: async (req: Request, res: Response) => {

        try {

            const idUsuario = req.params.idUsuario;
            let tareaIndice = await TareaModel.find({ usuario: idUsuario });

            for (let i = 0; i < 50; i++) {

                let tareaNueva: ITarea = new TareaModel();

                const daysRandom = Math.floor(Math.random() * (8 - 2) + 1);
                const dateRandomCreated = Date.parse(moment().subtract(daysRandom, 'days').format('llll'));

                const horas = Math.floor(Math.random() * (2 - 0) + 0);
                let minutos = Math.floor(Math.random() * (60 - 15) + 15);
                let segundos = Math.floor(Math.random() * (60 - 0) + 0);
                let horasEnd: number = 0;
                let minutosEnd: number = 0;
                let segundosEnd: number = 0;

                const porcentaje = Math.random() * (1 - 0.8) + 0.8;
                let totalTime: number = 0;
                let totalTimeEnd: number = 0;

                if (horas === 0) {
                    totalTime = minutos + (segundos / 60);
                }
                if (horas === 1) {
                    totalTime = minutos + 60 + (segundos / 60);
                }
                if (horas === 2) {
                    totalTime = 120;
                    minutos = 0;
                    segundos = 0;
                }

                totalTimeEnd = totalTime * porcentaje;
                segundosEnd = Math.floor((totalTimeEnd - parseInt(totalTimeEnd.toString(), 10)) * 60);

                if (totalTimeEnd >= 60) {
                    horasEnd = 1;
                    minutosEnd = Math.floor(totalTimeEnd - 60);
                } else {
                    minutosEnd = Math.floor(totalTimeEnd);
                }

                const dateRandomFinished = Date.parse(moment(dateRandomCreated).add(totalTimeEnd, 'minutes').format('llll'));

                tareaNueva.usuario = req.params.idUsuario;
                tareaNueva.nombre = `Tarea ${(i + 1) + tareaIndice.length}`;
                tareaNueva.descripcion = `Descripción de la tarea ${(i + 1) + tareaIndice.length}`;
                tareaNueva.horas = horas;
                tareaNueva.minutos = minutos;
                tareaNueva.segundos = segundos;
                tareaNueva.tiempoHoras = horasEnd;
                tareaNueva.tiempoMinutos = minutosEnd;
                tareaNueva.tiempoSegundos = segundosEnd;
                tareaNueva.estado = 3;
                tareaNueva.creado = dateRandomCreated;
                tareaNueva.iniciado = dateRandomCreated;
                tareaNueva.terminado = dateRandomFinished;
                tareaNueva.activo = true;

                await tareaNueva.save();
            }

            return res.status(202).send({
                status: true,
                message: 'Tareas almacenadas correctamente',
            });

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

    update: async (req: Request, res: Response) => {

        try {

            const body: ITarea = req.body;

            const tareaFind = await TareaModel.findOne({ _id: body._id, activo: true });

            if (tareaFind) {

                tareaFind.descripcion = body.descripcion;
                tareaFind.horas = body.horas;
                tareaFind.minutos = body.minutos;
                tareaFind.segundos = body.segundos;

                const tareaUpdated = await TareaModel.findByIdAndUpdate(tareaFind._id, tareaFind);

                if (tareaUpdated) {
                    return res.status(202).send({
                        status: true,
                        message: 'Tarea actualizada correctamente'
                    });
                } else {
                    return res.status(200).send({
                        status: false,
                        message: 'Surgió un error al actualizar la tarea'
                    });
                }

            } else {
                return res.status(200).send({
                    status: false,
                    message: 'La tarea que intentas actualizar no existe'
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

    delete: async (req: Request, res: Response) => {

        try {

            const idTarea = req.params.id;

            const tareaFind = await TareaModel.findOne({ _id: idTarea, activo: true });

            if (tareaFind) {

                tareaFind.activo = false;
                const tareaDeleted = await TareaModel.findByIdAndUpdate(tareaFind._id, tareaFind);

                if (tareaDeleted) {
                    return res.status(202).send({
                        status: true,
                        message: 'Tarea eliminada correctamente'
                    });
                } else {
                    return res.status(200).send({
                        status: false,
                        message: 'Surgió un error al eliminar la tarea'
                    });
                }

            } else {
                return res.status(200).send({
                    status: false,
                    message: 'La tarea que intentas eliminar no existe'
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

    changeState: async (req: Request, res: Response) => {

        try {

            const body: ITarea = req.body;

            const tareaFindCurrent = await TareaModel.findOne({ usuario: body.usuario, estado: 0, activo: true });            

            if (tareaFindCurrent && body.estado === 0 && tareaFindCurrent._id !== body._id ) {
                return res.status(200).send({
                    status: false,
                    message: 'Ya existe una tarea en curso',
                });
            } else {
                const tareaFind = await TareaModel.findOne({ _id: body._id, activo: true });

                if (tareaFind) {

                    tareaFind.estado = body.estado;
                    tareaFind.iniciado = Date.now();

                    if (body.estado === 3) {
                        tareaFind.tiempoHoras = body.tiempoHoras;
                        tareaFind.tiempoMinutos = body.tiempoMinutos;
                        tareaFind.tiempoSegundos = body.tiempoSegundos;
                        tareaFind.terminado = Date.now();
                    }

                    const tareaUpdated = await TareaModel.findByIdAndUpdate(tareaFind._id, tareaFind);

                    if (tareaUpdated) {
                        return res.status(202).send({
                            status: true,
                            message: 'Tarea actualizada correctamente',
                        });
                    } else {
                        return res.status(200).send({
                            status: false,
                            message: 'Surgió un error al actualizar la tarea',
                        });
                    }

                } else {
                    return res.status(200).send({
                        status: false,
                        message: 'La tarea que intentas actualizar no existe',
                    });
                }
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

    filterByWeek: async (req: Request, res: Response) => {

        try {

            const fechaInicial = Number(req.params.fechaInicial);
            const fechaFinal = Number(req.params.fechaFinal);

            if (fechaInicial > fechaFinal) {
                return res.status(200).send({
                    status: false,
                    message: 'La fecha inicial debe ser mayor a la fecha final',
                });
            }

            if( fechaInicial === fechaFinal) {
                return res.status(200).send({
                    status: false,
                    message: 'Las fechas no pueden ser iguales',
                });
            }

            const idUsuario = req.params.usuario;

            var numeroDias = moment(fechaFinal).diff(fechaInicial, 'days');
            let tareas = {};
            let resp = [];

            for (let i = 0; i < numeroDias + 1; i++) {
                let fechaI = Date.parse(moment(fechaInicial).add(i, 'days').format('L'));
                let fechaF = Date.parse(moment(fechaInicial).add(i + 1, 'days').format('L'));
                const fechaNombre = moment(fechaI).locale('es-mx').format('DD MMMM');
                const tareasFind = await TareaModel.find({ usuario: idUsuario, activo: true, estado: 3, terminado: { $gte: fechaI, $lt: fechaF } }, { _id: '1' });
                const total = tareasFind.length;

                tareas = {
                    x: fechaNombre,
                    y: total,
                }

                resp.push(tareas);
            }

            if (resp) {
                return res.status(202).send({
                    resp,
                });
            } else {
                return res.status(200).send({
                    status: false,
                    message: 'No hay tareas registradas en el rango de fechas',
                    tareas,
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

}