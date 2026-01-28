import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { receivingRepository } from '../repositories/receivingRepository';
import { inventoryRepository } from '../repositories/inventoryRepository';
import { transactionRepository } from '../repositories/transactionRepository';
import { lotService } from './lotService';
import { AppError } from '../middleware/errorHandler';

export interface ReceivingDetailInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateReceivingInput {
  receivingDate: Date;
  deliverySlipNo?: string;
  note?: string;
  details: ReceivingDetailInput[];
}

export const receivingService = {
  getAll: async () => {
    return receivingRepository.findAll();
  },

  getById: async (id: string) => {
    const receiving = await receivingRepository.findById(id);
    if (!receiving) {
      throw new AppError('入庫情報が見つかりません', 404);
    }
    return receiving;
  },

  create: async (input: CreateReceivingInput) => {
    if (!input.details || input.details.length === 0) {
      throw new AppError('入庫明細が必要です', 400);
    }

    return prisma.$transaction(async (tx) => {
      // 入庫番号を採番
      const receivingNumber = await receivingRepository.generateReceivingNumber(
        input.receivingDate
      );

      // 各明細のロット番号を採番し、明細データを準備
      const detailsWithLots: Array<{
        productId: string;
        quantity: Prisma.Decimal;
        unitPrice: Prisma.Decimal;
        lotNumber: string;
        lotId: string;
      }> = [];

      for (const detail of input.details) {
        // ロット番号を採番
        const lotNumber = await lotService.generateLotNumber(
          detail.productId,
          input.receivingDate
        );

        // ロットを作成
        const lot = await lotService.createLot(
          detail.productId,
          lotNumber,
          input.receivingDate,
          new Prisma.Decimal(detail.unitPrice),
          tx
        );

        detailsWithLots.push({
          productId: detail.productId,
          quantity: new Prisma.Decimal(detail.quantity),
          unitPrice: new Prisma.Decimal(detail.unitPrice),
          lotNumber,
          lotId: lot.id,
        });
      }

      // 入庫ヘッダーと明細を作成
      const receiving = await tx.receiving.create({
        data: {
          receivingNumber,
          receivingDate: input.receivingDate,
          deliverySlipNo: input.deliverySlipNo,
          note: input.note,
          details: {
            create: detailsWithLots.map((d) => ({
              productId: d.productId,
              quantity: d.quantity,
              unitPrice: d.unitPrice,
              lotNumber: d.lotNumber,
            })),
          },
        },
        include: {
          details: {
            include: {
              product: true,
            },
          },
        },
      });

      // 在庫更新と履歴記録
      for (const detail of detailsWithLots) {
        // 在庫を増加
        await inventoryRepository.upsert(
          detail.productId,
          detail.lotId,
          detail.quantity,
          tx
        );

        // 在庫移動履歴を記録
        await transactionRepository.create(
          {
            productId: detail.productId,
            lotId: detail.lotId,
            transactionType: 'RECEIVING',
            quantity: detail.quantity,
            referenceType: 'RECEIVING',
            referenceId: receiving.id,
          },
          tx
        );
      }

      return receiving;
    });
  },
};
