'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product, Inventory } from '@/types';
import { inventoryApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/Table';
import { Button } from '@/components/Button';

export default function InventoryDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await inventoryApi.getByProductId(params.productId as string);
        setProduct(data.product);
        setInventories(data.inventories);
      } catch (err) {
        setError(err instanceof Error ? err.message : '読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.productId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const totalQuantity = inventories.reduce(
    (sum, inv) => sum + parseFloat(inv.quantity),
    0
  );

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || '商品が見つかりません'}</p>
        <Link href="/inventory">
          <Button>在庫一覧に戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ロット別在庫</h1>
        <Link href="/inventory">
          <Button variant="secondary">在庫一覧に戻る</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>商品情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <dt className="text-sm text-gray-500">商品コード</dt>
              <dd className="font-medium">{product.code}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">商品名</dt>
              <dd className="font-medium">{product.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">規格</dt>
              <dd className="font-medium">{product.specification || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">在庫合計</dt>
              <dd className="font-medium text-lg">
                {totalQuantity.toLocaleString()} {product.unit}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ロット別在庫</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>ロット番号</TableCell>
                <TableCell header>入庫日</TableCell>
                <TableCell header>仕入単価</TableCell>
                <TableCell header>在庫数量</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventories.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-500" colSpan={4}>
                    在庫がありません
                  </TableCell>
                </TableRow>
              ) : (
                inventories.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-sm">
                      {inv.lot?.lotNumber}
                    </TableCell>
                    <TableCell>
                      {inv.lot ? formatDate(inv.lot.receivingDate) : '-'}
                    </TableCell>
                    <TableCell>
                      {inv.lot ? `${parseFloat(inv.lot.unitPrice).toLocaleString()}円` : '-'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {parseFloat(inv.quantity).toLocaleString()} {product.unit}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
