import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/prueba', ( req: Request, res: Response ) => {
    res.json({
        status: true,
        mensaje: 'Todo esta bien!!'
    });
});

router.post('/prueba', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    res.json({
        status: true,
        cuerpo, 
        de
    });
});

export default router;