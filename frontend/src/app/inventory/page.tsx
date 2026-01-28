'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InventorySummary } from '@/types';
import { inventoryApi } from '@/lib/api';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/Table';
import { Button } from '@/components/Button';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await inventoryApi.getSummary();
        setInventory(data);
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">在庫一覧</h1>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>商品コード</TableCell>
                <TableCell header>商品名</TableCell>
                <TableCell header>規格</TableCell>
                <TableCell header>在庫数量</TableCell>
                <TableCell header>単位</TableCell>
                <TableCell header>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-500" colSpan={6}>
                    在庫データがありません
                  </TableCell>
                </TableRow>
              ) : (
                inventory.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.product?.code}</TableCell>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.product?.specification || '-'}</TableCell>
                    <TableCell className="font-medium">
                      {item.totalQuantity
                        ? parseFloat(item.totalQuantity).toLocaleString()
                        : '0'}
                    </TableCell>
                    <TableCell>{item.product?.unit}</TableCell>
                    <TableCell>
                      <Link href={`/inventory/${item.productId}`}>
                        <Button variant="secondary" className="text-sm px-2 py-1">
                          ロット別
                        </Button>
                      </Link>
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
