import { lotRepository } from '../repositories/lotRepository';
import { productRepository } from '../repositories/productRepository';
import { Prisma } from '@prisma/client';

export const lotService = {
  generateLotNumber: async (productId: string, receivingDate: Date): Promise<string> => {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('商品が見つかりません');
    }

    // 日付文字列（YYYYMMDD）
    const dateStr = receivingDate.toISOString().slice(0, 10).replace(/-/g, '');

    // 商品コードからハイフンを除去
    const productCode = product.code.replace(/-/g, '');

    // 同一日・同一商品の既存ロット数を取得
    const existingCount = await lotRepository.countByProductAndDate(productId, receivingDate);

    // 連番（3桁ゼロ埋め）
    const seq = (existingCount + 1).toString().padStart(3, '0');

    return `${dateStr}-${productCode}-${seq}`;
  },

  createLot: async (
    productId: string,
    lotNumber: string,
    receivingDate: Date,
    unitPrice: Prisma.Decimal,
    tx?: Prisma.TransactionClient
  ) => {
    return lotRepository.create(
      {
        lotNumber,
        product: { connect: { id: productId } },
        receivingDate,
        unitPrice,
      },
      tx
    );
  },
};
