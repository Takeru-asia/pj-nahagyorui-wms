'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { receivingsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/Table';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ProductSearch } from '@/components/ProductSearch';

interface ReceivingDetailRow {
  id: string;
  product: Product;
  quantity: string;
  unitPrice: string;
}

export default function NewReceivingPage() {
  const router = useRouter();
  const [receivingDate, setReceivingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deliverySlipNo, setDeliverySlipNo] = useState('');
  const [note, setNote] = useState('');
  const [details, setDetails] = useState<ReceivingDetailRow[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddProduct = (product: Product) => {
    const existing = details.find((d) => d.product.id === product.id);
    if (existing) {
      alert('この商品は既に追加されています');
      return;
    }
    setDetails([
      ...details,
      {
        id: crypto.randomUUID(),
        product,
        quantity: '',
        unitPrice: '',
      },
    ]);
  };

  const handleUpdateDetail = (
    id: string,
    field: 'quantity' | 'unitPrice',
    value: string
  ) => {
    setDetails(
      details.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleRemoveDetail = (id: string) => {
    setDetails(details.filter((d) => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (details.length === 0) {
      setError('入庫明細を1件以上追加してください');
      return;
    }

    const invalidDetails = details.filter(
      (d) => !d.quantity || !d.unitPrice || parseFloat(d.quantity) <= 0
    );
    if (invalidDetails.length > 0) {
      setError('全ての明細に数量と単価を入力してください');
      return;
    }

    setSubmitting(true);

    try {
      await receivingsApi.create({
        receivingDate,
        deliverySlipNo: deliverySlipNo || undefined,
        note: note || undefined,
        details: details.map((d) => ({
          productId: d.product.id,
          quantity: parseFloat(d.quantity),
          unitPrice: parseFloat(d.unitPrice),
        })),
      });
      router.push('/receiving');
    } catch (err) {
      setError(err instanceof Error ? err.message : '入庫登録に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">入庫登録</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-6">{error}</div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>入庫情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="入庫日"
                type="date"
                value={receivingDate}
                onChange={(e) => setReceivingDate(e.target.value)}
                required
              />
              <Input
                label="納品書No"
                value={deliverySlipNo}
                onChange={(e) => setDeliverySlipNo(e.target.value)}
                placeholder="任意"
              />
              <Input
                label="備考"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="任意"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>入庫明細</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                商品を追加
              </label>
              <ProductSearch onSelect={handleAddProduct} />
            </div>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>商品コード</TableCell>
                  <TableCell header>商品名</TableCell>
                  <TableCell header>規格</TableCell>
                  <TableCell header>数量</TableCell>
                  <TableCell header>単位</TableCell>
                  <TableCell header>仕入単価</TableCell>
                  <TableCell header>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center text-gray-500" colSpan={7}>
                      商品を検索して追加してください
                    </TableCell>
                  </TableRow>
                ) : (
                  details.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>{detail.product.code}</TableCell>
                      <TableCell>{detail.product.name}</TableCell>
                      <TableCell>{detail.product.specification || '-'}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={detail.quantity}
                          onChange={(e) =>
                            handleUpdateDetail(detail.id, 'quantity', e.target.value)
                          }
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>{detail.product.unit}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={detail.unitPrice}
                          onChange={(e) =>
                            handleUpdateDetail(detail.id, 'unitPrice', e.target.value)
                          }
                          placeholder="0"
                          min="0"
                          step="1"
                          className="w-28"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleRemoveDetail(detail.id)}
                          className="text-sm px-2 py-1"
                        >
                          削除
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/receiving')}
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? '登録中...' : '入庫登録'}
          </Button>
        </div>
      </form>
    </div>
  );
}
