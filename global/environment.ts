
export const SERVER_PORT: number = Number( process.env.PORT ) || 3200;

export const USER_BD: string = 'prueba-tecnica';
export const PASSOWORD_BD: string = '123456_';

export const CONEXION_STRING = `mongodb+srv://${USER_BD}:${PASSOWORD_BD}@cluster0.v1wv9.mongodb.net/test`;
