import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventoryService';

export const inventoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inventory = await inventoryService.getAll();
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  },

  getSummary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await inventoryService.getProductSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  },

  getByProductId: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await inventoryService.getByProductId(req.params.productId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },
};
