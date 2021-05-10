import { Router, Request, Response } from 'express';
import { usuarioController } from '../controllers/usuario';

export const usuarioRoutes = Router();

usuarioRoutes.post('/save-user', usuarioController.saveUsuario);


export default usuarioRoutes;