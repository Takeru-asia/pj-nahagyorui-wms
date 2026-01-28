import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export type TransactionType = 'RECEIVING' | 'SHIPPING' | 'PROCESSING' | 'ADJUSTMENT';

export const transactionRepository = {
  create: async (
    data: {
      productId: string;
      lotId: string;
      transactionType: TransactionType;
      quantity: Prisma.Decimal;
      referenceType?: string;
      referenceId?: string;
      note?: string;
    },
    tx?: Prisma.TransactionClient
  ) => {
    const client = tx || prisma;
    return client.inventoryTransaction.create({
      data: {
        productId: data.productId,
        lotId: data.lotId,
        transactionType: data.transactionType,
        quantity: data.quantity,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        note: data.note,
      },
    });
  },

  findByProduct: async (productId: string) => {
    return prisma.inventoryTransaction.findMany({
      where: { productId },
      include: {
        product: true,
        lot: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByLot: async (lotId: string) => {
    return prisma.inventoryTransaction.findMany({
      where: { lotId },
      include: {
        product: true,
        lot: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
