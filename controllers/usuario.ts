import { Request, Response } from "express";
import IUsuario from "../interfaces/IUsuario";
import { UsuarioModel } from '../models/usuario';
import bcrypt from 'bcrypt-nodejs';


export const usuarioController = {

    saveUsuario: async (req: Request, res: Response) => {

        try {

            const params = req.body;
            const usuario: IUsuario = new UsuarioModel();

            if (params.correo && params.contrasena && params.nombre && params.apePat && params.apeMat) {
                usuario.correo = params.correo;
                usuario.contrasena = params.contrasena;
                usuario.nombre = params.nombre;
                usuario.apePat = params.apePat;
                usuario.apeMat = params.apeMat;
                usuario.creado = Date.now();
                usuario.activo = true;

                // Controlar usuarios duplicados
                const usuarioFind = await UsuarioModel.findOne({ $and: [{ nombre: usuario.nombre }, { apePat: usuario.apePat }, { apeMat: usuario.apeMat }] });

                if (usuarioFind) {
                    return res.status(200).send({ message: 'El usuario que intentas registrar ya existe', status: false });
                }

                const usuarioCorreoFind = UsuarioModel.findOne({ email: usuario.correo.toLowerCase() });

                if (usuarioCorreoFind) {
                    return res.status(200).send({ message: 'El usuario que intentas registrar ya existe', status: false });
                }

                //Cifrar la contraseña y guardar los datos
                bcrypt.hash(params.contrasena, '100', null, async (err, hash) => {

                    if (hash) {
                        usuario.contrasena = hash;
                        const usuarioSave = await usuario.save();

                        if (usuarioSave) {
                            return res.status(202).send({ message: 'Usuario registrado correctamente', status: true });
                        } else {
                            return res.status(202).send({ message: 'No se pudo registrar el usuario, intentalo más tarde', status: false });
                        }
                    } else {
                        throw err;
                    }
                });

            } else {
                return res.status(200).send({ message: 'No se permitirán campos vacios', status: false });
            }

        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
                status: false,
            });
        }
    },
}

