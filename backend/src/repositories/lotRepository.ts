import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const lotRepository = {
  findByLotNumber: async (lotNumber: string) => {
    return prisma.lot.findUnique({
      where: { lotNumber },
    });
  },

  findByProductAndDate: async (productId: string, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.lot.findMany({
      where: {
        productId,
        receivingDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { lotNumber: 'desc' },
    });
  },

  create: async (data: Prisma.LotCreateInput, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma;
    return client.lot.create({ data });
  },

  countByProductAndDate: async (productId: string, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.lot.count({
      where: {
        productId,
        receivingDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  },
};
