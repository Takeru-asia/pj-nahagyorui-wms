import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const inventoryRepository = {
  findAll: async () => {
    return prisma.inventory.findMany({
      include: {
        product: true,
        lot: true,
      },
      orderBy: [{ product: { code: 'asc' } }, { lot: { lotNumber: 'asc' } }],
    });
  },

  findByProductId: async (productId: string) => {
    return prisma.inventory.findMany({
      where: { productId },
      include: {
        lot: true,
      },
      orderBy: { lot: { lotNumber: 'desc' } },
    });
  },

  findByProductAndLot: async (productId: string, lotId: string) => {
    return prisma.inventory.findUnique({
      where: {
        productId_lotId: {
          productId,
          lotId,
        },
      },
    });
  },

  upsert: async (
    productId: string,
    lotId: string,
    quantity: Prisma.Decimal,
    tx?: Prisma.TransactionClient
  ) => {
    const client = tx || prisma;
    return client.inventory.upsert({
      where: {
        productId_lotId: {
          productId,
          lotId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        productId,
        lotId,
        quantity,
      },
    });
  },

  getProductSummary: async () => {
    const result = await prisma.inventory.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
    });

    const productIds = result.map((r) => r.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    return result.map((r) => ({
      productId: r.productId,
      product: products.find((p) => p.id === r.productId),
      totalQuantity: r._sum.quantity,
    }));
  },
};
