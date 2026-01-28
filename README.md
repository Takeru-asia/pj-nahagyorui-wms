# 那覇魚類WMS

那覇魚類株式会社 倉庫管理システム (Warehouse Management System)

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + Tailwind CSS
- **バックエンド**: Node.js + Express + TypeScript
- **データベース**: PostgreSQL 16
- **ORM**: Prisma

## セットアップ手順

### 1. PostgreSQLの起動

Docker Composeを使用:

```bash
docker compose up -d
```

または、ローカルのPostgreSQLを使用する場合は、以下の設定でデータベースを作成:

- データベース名: `nahagyorui_wms`
- ユーザー: `wms_user`
- パスワード: `wms_password`

### 2. バックエンドのセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定（必要に応じて.envを編集）
cp .env.example .env

# データベースマイグレーション
npm run db:migrate

# シードデータの投入
npm run db:seed

# 開発サーバー起動
npm run dev
```

バックエンドは `http://localhost:3001` で起動します。

### 3. フロントエンドのセットアップ

```bash
cd frontend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local

# 開発サーバー起動
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

## 画面構成

| パス | 画面名 | 説明 |
|------|--------|------|
| `/` | ダッシュボード | トップページ |
| `/receiving` | 入庫一覧 | 入庫履歴の一覧表示 |
| `/receiving/new` | 入庫登録 | **MVP主要画面** - 納品書を見ながら入庫情報を入力 |
| `/receiving/[id]` | 入庫詳細 | 入庫情報の詳細表示 |
| `/inventory` | 在庫一覧 | 商品別在庫数量 |
| `/inventory/[productId]` | ロット別在庫 | 商品のロット別在庫詳細 |
| `/master/products` | 商品マスタ | 商品の登録・管理 |

## API エンドポイント

### 商品マスタ
- `GET /api/products` - 商品一覧
- `GET /api/products/search?q=xxx` - 商品検索
- `GET /api/products/:id` - 商品詳細
- `POST /api/products` - 商品登録
- `PUT /api/products/:id` - 商品更新
- `DELETE /api/products/:id` - 商品削除

### 入庫
- `GET /api/receivings` - 入庫一覧
- `GET /api/receivings/:id` - 入庫詳細
- `POST /api/receivings` - 入庫登録

### 在庫
- `GET /api/inventory` - 在庫一覧（ロット単位）
- `GET /api/inventory/summary` - 在庫一覧（商品別集計）
- `GET /api/inventory/:productId` - 商品別ロット一覧

## ロット番号採番ルール

```
[入庫日]-[商品コード]-[連番]
例: 20260128-MAGURO001-001
```

- 入庫日: YYYYMMDD形式
- 商品コード: ハイフン除去した商品コード
- 連番: 同一日・同一商品での3桁連番

## データモデル

| テーブル | 説明 |
|----------|------|
| Product | 商品マスタ（商品コード、名称、規格、単位） |
| Lot | ロット（ロット番号、入庫日、仕入単価） |
| Inventory | 在庫（商品×ロット単位の数量） |
| Receiving | 入庫ヘッダー（入庫番号、入庫日、納品書No） |
| ReceivingDetail | 入庫明細（商品、数量、単価） |
| InventoryTransaction | 在庫移動履歴（監査用） |

## 開発コマンド

### バックエンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run db:migrate   # マイグレーション実行
npm run db:seed      # シードデータ投入
npm run db:studio    # Prisma Studio起動
```

### フロントエンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # ビルド
npm run lint   # リント実行
```
