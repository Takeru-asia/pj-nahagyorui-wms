'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Receiving } from '@/types';
import { receivingsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/Table';
import { Button } from '@/components/Button';

export default function ReceivingListPage() {
  const [receivings, setReceivings] = useState<Receiving[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceivings = async () => {
      try {
        const data = await receivingsApi.getAll();
        setReceivings(data);
      } catch (err) {
        console.error('Failed to fetch receivings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceivings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">入庫一覧</h1>
        <Link href="/receiving/new">
          <Button>新規入庫登録</Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>入庫番号</TableCell>
                <TableCell header>入庫日</TableCell>
                <TableCell header>納品書No</TableCell>
                <TableCell header>明細数</TableCell>
                <TableCell header>備考</TableCell>
                <TableCell header>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receivings.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-500" colSpan={6}>
                    入庫データがありません
                  </TableCell>
                </TableRow>
              ) : (
                receivings.map((receiving) => (
                  <TableRow key={receiving.id}>
                    <TableCell>{receiving.receivingNumber}</TableCell>
                    <TableCell>{formatDate(receiving.receivingDate)}</TableCell>
                    <TableCell>{receiving.deliverySlipNo || '-'}</TableCell>
                    <TableCell>{receiving.details?.length || 0}件</TableCell>
                    <TableCell>{receiving.note || '-'}</TableCell>
                    <TableCell>
                      <Link href={`/receiving/${receiving.id}`}>
                        <Button variant="secondary" className="text-sm px-2 py-1">
                          詳細
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
