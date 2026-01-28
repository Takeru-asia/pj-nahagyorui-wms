'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Receiving } from '@/types';
import { receivingsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/Table';
import { Button } from '@/components/Button';

export default function ReceivingDetailPage() {
  const params = useParams();
  const [receiving, setReceiving] = useState<Receiving | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceiving = async () => {
      try {
        const data = await receivingsApi.getById(params.id as string);
        setReceiving(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchReceiving();
  }, [params.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error || !receiving) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || '入庫情報が見つかりません'}</p>
        <Link href="/receiving">
          <Button>一覧に戻る</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">入庫詳細</h1>
        <Link href="/receiving">
          <Button variant="secondary">一覧に戻る</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>入庫情報</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <dt className="text-sm text-gray-500">入庫番号</dt>
              <dd className="font-medium">{receiving.receivingNumber}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">入庫日</dt>
              <dd className="font-medium">{formatDate(receiving.receivingDate)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">納品書No</dt>
              <dd className="font-medium">{receiving.deliverySlipNo || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">備考</dt>
              <dd className="font-medium">{receiving.note || '-'}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>入庫明細</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>商品コード</TableCell>
                <TableCell header>商品名</TableCell>
                <TableCell header>数量</TableCell>
                <TableCell header>単価</TableCell>
                <TableCell header>金額</TableCell>
                <TableCell header>ロット番号</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiving.details?.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>{detail.product?.code}</TableCell>
                  <TableCell>{detail.product?.name}</TableCell>
                  <TableCell>
                    {parseFloat(detail.quantity).toLocaleString()} {detail.product?.unit}
                  </TableCell>
                  <TableCell>{parseFloat(detail.unitPrice).toLocaleString()}円</TableCell>
                  <TableCell>
                    {(parseFloat(detail.quantity) * parseFloat(detail.unitPrice)).toLocaleString()}円
                  </TableCell>
                  <TableCell className="font-mono text-sm">{detail.lotNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
