import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 商品マスタのシードデータ（コードは自動採番）
  const products = [
    { name: 'マグロ（本マグロ）', specification: '生・1本', unit: 'kg' },
    { name: 'マグロ（キハダ）', specification: '生・1本', unit: 'kg' },
    { name: 'サケ（銀鮭）', specification: '生・フィレ', unit: 'kg' },
    { name: 'サケ（紅鮭）', specification: '冷凍・フィレ', unit: 'kg' },
    { name: 'エビ（ブラックタイガー）', specification: '冷凍・16/20', unit: 'kg' },
    { name: 'エビ（バナメイ）', specification: '冷凍・21/25', unit: 'kg' },
    { name: 'イカ（スルメイカ）', specification: '生・1杯', unit: 'kg' },
    { name: 'タコ（マダコ）', specification: 'ボイル・足', unit: 'kg' },
    { name: 'ホタテ', specification: '生・貝柱', unit: 'kg' },
    { name: 'サンマ', specification: '生・1尾', unit: '匹' },
    { name: 'アジ', specification: '生・1尾', unit: '匹' },
    { name: 'サバ', specification: '生・1尾', unit: '匹' },
    { name: 'ブリ', specification: '生・フィレ', unit: 'kg' },
    { name: 'タイ（マダイ）', specification: '生・1尾', unit: 'kg' },
    { name: 'ヒラメ', specification: '生・1尾', unit: 'kg' },
  ];

  const existingProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'asc' },
  });

  if (existingProducts.length > 0) {
    console.log('Updating existing product codes...');

    // Step 1: 一時的なコードに変更（衝突を避けるため）
    for (let i = 0; i < existingProducts.length; i++) {
      const tempCode = `TEMP_${i}_${Date.now()}`;
      await prisma.product.update({
        where: { id: existingProducts[i].id },
        data: { code: tempCode },
      });
    }

    // Step 2: 新しいコードに更新
    for (let i = 0; i < existingProducts.length; i++) {
      const newCode = `P${(i + 1).toString().padStart(5, '0')}`;
      await prisma.product.update({
        where: { id: existingProducts[i].id },
        data: { code: newCode },
      });
      console.log(`  ${existingProducts[i].name} -> ${newCode}`);
    }

    console.log(`Updated ${existingProducts.length} products`);
  } else {
    // 新規作成
    for (let i = 0; i < products.length; i++) {
      const code = `P${(i + 1).toString().padStart(5, '0')}`;
      await prisma.product.create({
        data: {
          code,
          ...products[i],
        },
      });
    }
    console.log(`Created ${products.length} products`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
