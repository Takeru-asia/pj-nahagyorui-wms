import { productRepository } from '../repositories/productRepository';
import { AppError } from '../middleware/errorHandler';

export interface CreateProductInput {
  name: string;
  specification?: string;
  unit: string;
}

export interface UpdateProductInput {
  name?: string;
  specification?: string;
  unit?: string;
}

const generateNextCode = async (): Promise<string> => {
  const lastCode = await productRepository.getLastAutoCode();

  if (!lastCode) {
    return 'P00001';
  }

  const numPart = parseInt(lastCode.substring(1), 10);
  const nextNum = numPart + 1;

  if (nextNum > 99999) {
    throw new AppError('商品コードの上限に達しました', 400);
  }

  return `P${nextNum.toString().padStart(5, '0')}`;
};

export const productService = {
  getAll: async () => {
    return productRepository.findAll();
  },

  getById: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('商品が見つかりません', 404);
    }
    return product;
  },

  search: async (query: string) => {
    return productRepository.search(query);
  },

  create: async (input: CreateProductInput) => {
    const code = await generateNextCode();

    return productRepository.create({
      code,
      name: input.name,
      specification: input.specification,
      unit: input.unit,
    });
  },

  update: async (id: string, input: UpdateProductInput) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('商品が見つかりません', 404);
    }

    return productRepository.update(id, input);
  },

  delete: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError('商品が見つかりません', 404);
    }

    return productRepository.delete(id);
  },
};
