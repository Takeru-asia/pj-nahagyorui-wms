'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/Table';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specification: '',
    unit: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await productsApi.create({
        name: formData.name,
        specification: formData.specification || undefined,
        unit: formData.unit,
      });
      setFormData({ name: '', specification: '', unit: '' });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この商品を削除しますか？')) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : '削除に失敗しました');
    }
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品マスタ</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'キャンセル' : '新規登録'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>商品登録</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>
              )}
              <p className="text-sm text-gray-500 mb-4">商品コードは自動で採番されます</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="商品名"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="例: マグロ（本マグロ）"
                />
                <Input
                  label="規格"
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                  placeholder="例: 生・1本"
                />
                <Input
                  label="単位"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                  placeholder="例: kg"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? '登録中...' : '登録'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>商品コード</TableCell>
                <TableCell header>商品名</TableCell>
                <TableCell header>規格</TableCell>
                <TableCell header>単位</TableCell>
                <TableCell header>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center text-gray-500" colSpan={5}>
                    商品が登録されていません
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.specification || '-'}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(product.id)}
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
    </div>
  );
}
