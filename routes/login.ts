import { Router, Request, Response } from 'express';
import { loginController } from '../controllers/login';

export const loginRoutes = Router();

loginRoutes.post('/login', loginController.loginUser);

export default loginRoutes;