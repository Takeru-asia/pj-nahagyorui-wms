import { Router } from 'express';
import { receivingController } from '../controllers/receivingController';

export const receivingRoutes = Router();

receivingRoutes.get('/', receivingController.getAll);
receivingRoutes.get('/:id', receivingController.getById);
receivingRoutes.post('/', receivingController.create);
