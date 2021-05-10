import { Router, Request, Response } from 'express';
import { tareaController } from '../controllers/tarea';
import ensureAuth from '../middlewares/authenticated';

export const tareaRoutes = Router();

tareaRoutes.get('/get-by-user', [ensureAuth], tareaController.getByUser);

tareaRoutes.get('/create', [ensureAuth], tareaController.create);

tareaRoutes.get('/update', [ensureAuth], tareaController.update);

tareaRoutes.get('/delete', [ensureAuth], tareaController.delete);

tareaRoutes.get('/filter-by-week', [ensureAuth], tareaController.filterByWeek);

export default tareaRoutes;