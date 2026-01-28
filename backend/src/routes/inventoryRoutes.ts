import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController';

export const inventoryRoutes = Router();

inventoryRoutes.get('/', inventoryController.getAll);
inventoryRoutes.get('/summary', inventoryController.getSummary);
inventoryRoutes.get('/:productId', inventoryController.getByProductId);
