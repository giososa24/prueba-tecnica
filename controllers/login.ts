import { Request, Response } from "express";
import bcrypt from 'bcrypt-nodejs';
import { UsuarioModel } from '../models/usuario';
import createToken from '../services/jwt';


export const loginController = {

    //Login
    loginUser: async (req: Request, res: Response) => {

        const params = req.body;
        const email = params.Email;
        const contrasena = params.Contrasena;

        try {
            if (email && contrasena) {
                const usuarioFind = await UsuarioModel.findOne({ email: email, activo: true });

                if (usuarioFind) {
                    bcrypt.compare(contrasena, usuarioFind.contrasena, (err, check) => {
                        if (err) {
                            throw err;
                        }
                        if (check) {
                            //Devolver datos de usuario y token
                            return res.status(200).send({
                                token: createToken(usuarioFind),
                                usuarioFind,
                            });
                        } else {
                            return res.status(200).send({ message: 'Email o contraseña incorrectos, vuelve a intentarlo', status: false });
                        }

                    });
                } else {
                    return res.status(200).send({ message: 'Email o contraseña incorrectos, vuelve a intentarlo', status: false });
                }

            } else {
                return res.status(200).send({ message: 'No se permitirán campos vacíos!', status: false });
            }
        } catch (error) {
            return res.status(500).send({
                message: 'Ha surgido un error, contacte al administrador',
            });
        }

    },

}