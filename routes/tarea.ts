import { Router, Request, Response } from 'express';
import { tareaController } from '../controllers/tarea';
import ensureAuth from '../middlewares/authenticated';

export const tareaRoutes = Router();

tareaRoutes.get('/get-by-user/:id/:page/:limit/:estado/:duracion', [ensureAuth], tareaController.getByUser);

tareaRoutes.post('/create', [ensureAuth], tareaController.create);

tareaRoutes.get('/create-random/:idUsuario', [ensureAuth], tareaController.createRandom);

tareaRoutes.put('/update', [ensureAuth], tareaController.update);

tareaRoutes.delete('/delete/:id', [ensureAuth], tareaController.delete);

tareaRoutes.put('/change-state', [ensureAuth], tareaController.changeState);

tareaRoutes.get('/filter-by-week', [ensureAuth], tareaController.filterByWeek);

export default tareaRoutes;