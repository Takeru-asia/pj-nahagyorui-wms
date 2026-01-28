import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/receiving/new">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>入庫登録</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">納品書を元に入庫情報を登録</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/receiving">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>入庫一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">過去の入庫履歴を確認</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/inventory">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>在庫一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">商品別の在庫数量を確認</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/master/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle>商品マスタ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">商品情報の登録・管理</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
