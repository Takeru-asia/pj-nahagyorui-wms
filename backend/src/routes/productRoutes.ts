import { Router } from 'express';
import { productController } from '../controllers/productController';

export const productRoutes = Router();

productRoutes.get('/search', productController.search);
productRoutes.get('/', productController.getAll);
productRoutes.get('/:id', productController.getById);
productRoutes.post('/', productController.create);
productRoutes.put('/:id', productController.update);
productRoutes.delete('/:id', productController.delete);
