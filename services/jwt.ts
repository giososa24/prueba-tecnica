import IUsuario from '../interfaces/IUsuario';
import jwt from 'jwt-simple';
import moment from 'moment';
import IPayload from '../interfaces/IPayload';

export const secret = '[14V3_$3[R374';

const createToken = (Usuario: IUsuario): string => {
    const payload: IPayload = {
        sub: Usuario._id,
        Nombre: Usuario.nombre,
        ApePat: Usuario.apePat,
        ApeMat: Usuario.apeMat,
        iat: Date.now(),
        exp: moment().add(3, 'day').unix(),
    };

    return jwt.encode(payload, secret);
};

export default createToken;