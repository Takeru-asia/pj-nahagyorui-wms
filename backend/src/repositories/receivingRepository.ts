import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const receivingRepository = {
  findAll: async () => {
    return prisma.receiving.findMany({
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { receivingDate: 'desc' },
    });
  },

  findById: async (id: string) => {
    return prisma.receiving.findUnique({
      where: { id },
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  create: async (
    data: Prisma.ReceivingCreateInput,
    tx?: Prisma.TransactionClient
  ) => {
    const client = tx || prisma;
    return client.receiving.create({
      data,
      include: {
        details: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  generateReceivingNumber: async (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `RCV-${dateStr}`;

    const lastReceiving = await prisma.receiving.findFirst({
      where: {
        receivingNumber: { startsWith: prefix },
      },
      orderBy: { receivingNumber: 'desc' },
    });

    if (!lastReceiving) {
      return `${prefix}-001`;
    }

    const lastSeq = parseInt(lastReceiving.receivingNumber.split('-').pop() || '0');
    const nextSeq = (lastSeq + 1).toString().padStart(3, '0');
    return `${prefix}-${nextSeq}`;
  },
};
