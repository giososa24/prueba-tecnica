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
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, estado: 3, activo: true }, { '__v': 0 }, { sort: { created: 1 } }), optionsPaginate);
            } else if (duracion > 0 && duracion <= 30) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, minutos: { $gt: 0, $lt: 30 }, horas: { $lte: 0 }, segundos: { $gte: 0 }, activo: true }, { '__v': 0 }, { sort: { created: 1 } }), optionsPaginate);
            } else if (duracion > 30 && duracion <= 60) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, minutos: { $gte: 30, $lt: 59 }, horas: { $lte: 0 }, segundos: { $gte: 0 }, activo: true }, { '__v': 0 }, { sort: { created: 1 } }), optionsPaginate);
            } else if (duracion > 60 && duracion <= 120) {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, horas: { $gte: 1 }, activo: true }, { '__v': 0 }, { sort: { created: 1 } }), optionsPaginate);
            } else {
                tareasPaginadas = await TareaModel.paginate(TareaModel.find({ usuario: idUsuario, activo: true }, { '__v': 0 }, { sort: { created: 1 } }), optionsPaginate);
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

    filterByWeek: async (req: Request, res: Response) => {

        try {

            const fechaInicial = Number(req.params.fechaInicial);
            const fechaFinal = Number(req.params.fechaFinal);
            const idUsuario = req.params.usuario;

            const tareasFind = await TareaModel.find({ _id: idUsuario, activo: true });

            if (tareasFind.length > 0) {

                let tareas: ITarea[] = [];

                tareasFind.forEach(tarea => {
                    if (Date.parse(moment(tarea.creado).format("YYYY-MM-DD")) >= fechaInicial && Date.parse(moment(tarea.creado).format("YYYY-MM-DD")) <= fechaFinal) {
                        tareas.push(tarea);
                    }
                });

                if (tareas) {
                    return res.status(202).send({
                        status: true,
                        tareas,
                    });
                } else {
                    return res.status(200).send({
                        status: false,
                        message: 'No hay tareas registradas en el rango de fechas',
                        tareas,
                    });
                }

            } else {
                return res.status(200).send({
                    status: false,
                    message: 'No hay tareas registradas'
                });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }
    },

}