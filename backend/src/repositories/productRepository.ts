import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const productRepository = {
  findAll: async () => {
    return prisma.product.findMany({
      orderBy: { code: 'asc' },
    });
  },

  findById: async (id: string) => {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  findByCode: async (code: string) => {
    return prisma.product.findUnique({
      where: { code },
    });
  },

  search: async (query: string) => {
    return prisma.product.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { code: 'asc' },
      take: 20,
    });
  },

  create: async (data: Prisma.ProductCreateInput) => {
    return prisma.product.create({ data });
  },

  update: async (id: string, data: Prisma.ProductUpdateInput) => {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.product.delete({
      where: { id },
    });
  },

  getLastAutoCode: async () => {
    const product = await prisma.product.findFirst({
      where: {
        code: { startsWith: 'P' },
      },
      orderBy: { code: 'desc' },
    });
    return product?.code || null;
  },
};
