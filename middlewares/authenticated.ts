import { NextFunction, Request, Response} from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';
import { secret } from '../services/jwt';
import IPayload from '../interfaces/IPayload';

const ensureAuth = (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return res.status(200).send({ message: 'La petición no tiene la cabecera de autenticación', status: false });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');
    const payload: IPayload = jwt.decode(token, secret);

    try {
        if (payload.exp <= moment().unix()) {
            return res.status(200).send({
                message: 'Su sesión ha expirado',
                sesion: false,
                status: false
            });
        }
    } catch (ex) {
        return res.status(200).send({
            message: 'Su sesión ha expirado', status: false, sesion: false
        });
    }

    req.body = payload;

    next();
}

export default ensureAuth;