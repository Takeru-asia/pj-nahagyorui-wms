import { inventoryRepository } from '../repositories/inventoryRepository';
import { productRepository } from '../repositories/productRepository';
import { AppError } from '../middleware/errorHandler';

export const inventoryService = {
  getAll: async () => {
    return inventoryRepository.findAll();
  },

  getProductSummary: async () => {
    return inventoryRepository.getProductSummary();
  },

  getByProductId: async (productId: string) => {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('商品が見つかりません', 404);
    }

    const inventories = await inventoryRepository.findByProductId(productId);
    return {
      product,
      inventories,
    };
  },
};
