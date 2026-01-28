import { Request, Response, NextFunction } from 'express';
import { receivingService } from '../services/receivingService';

export const receivingController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const receivings = await receivingService.getAll();
      res.json(receivings);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const receiving = await receivingService.getById(req.params.id);
      res.json(receiving);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { receivingDate, deliverySlipNo, note, details } = req.body;
      const receiving = await receivingService.create({
        receivingDate: new Date(receivingDate),
        deliverySlipNo,
        note,
        details,
      });
      res.status(201).json(receiving);
    } catch (error) {
      next(error);
    }
  },
};
