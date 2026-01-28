import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService';

export const productController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = (req.query.q as string) || '';
      const products = await productService.search(query);
      res.json(products);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await productService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
