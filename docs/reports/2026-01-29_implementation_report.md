# 那覇魚類WMS 入庫処理MVP 実装レポート

**作成日**: 2026年1月29日

## 概要

那覇魚類WMSの入庫処理MVPを構築した。事務員が納品書を見ながら入庫情報を入力し、在庫数量とロット番号を管理するシステムの基盤を完成させた。

---

## 実装内容

### Phase 1: 基盤構築

#### Docker環境
- `docker-compose.yml` を作成し、PostgreSQL 16 コンテナを定義
- データベース: `nahagyorui_wms`
- 認証情報: `wms_user` / `wms_password`

#### バックエンド (Express + TypeScript)
- **フレームワーク**: Express.js
- **ORM**: Prisma
- **ポート**: 3001

**ディレクトリ構造**:
```
backend/
├── prisma/
│   ├── schema.prisma    # DBスキーマ定義
│   └── seed.ts          # シードデータ
└── src/
    ├── index.ts         # エントリーポイント
    ├── lib/prisma.ts    # Prismaクライアント
    ├── middleware/      # エラーハンドラー
    ├── routes/          # ルート定義
    ├── controllers/     # コントローラー
    ├── services/        # ビジネスロジック
    └── repositories/    # データアクセス層
```

#### フロントエンド (Next.js 14 + Tailwind CSS)
- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **ポート**: 3000

**ディレクトリ構造**:
```
frontend/
└── src/
    ├── app/            # ページ（App Router）
    ├── components/     # 共通UIコンポーネント
    ├── hooks/          # カスタムフック
    ├── lib/api.ts      # APIクライアント
    └── types/          # 型定義
```

---

### Phase 2: データモデル設計

以下の6テーブルをPrismaスキーマで定義:

| テーブル | 説明 |
|----------|------|
| `products` | 商品マスタ（商品コード、名称、規格、単位） |
| `lots` | ロット（ロット番号、入庫日、仕入単価） |
| `inventories` | 在庫（商品×ロット単位の数量） |
| `receivings` | 入庫ヘッダー（入庫番号、入庫日、納品書No） |
| `receiving_details` | 入庫明細（商品、数量、単価） |
| `inventory_transactions` | 在庫移動履歴（監査用） |

---

### Phase 3: API実装

#### 商品マスタ API
| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/products` | 商品一覧 |
| GET | `/api/products/search?q=xxx` | 商品検索 |
| GET | `/api/products/:id` | 商品詳細 |
| POST | `/api/products` | 商品登録（コード自動採番） |
| PUT | `/api/products/:id` | 商品更新 |
| DELETE | `/api/products/:id` | 商品削除 |

#### 入庫 API
| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/receivings` | 入庫一覧 |
| GET | `/api/receivings/:id` | 入庫詳細 |
| POST | `/api/receivings` | 入庫登録 |

#### 在庫 API
| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| GET | `/api/inventory` | 在庫一覧（ロット単位） |
| GET | `/api/inventory/summary` | 在庫一覧（商品別集計） |
| GET | `/api/inventory/:productId` | 商品別ロット一覧 |

---

### Phase 4: 画面実装

| パス | 画面名 | 説明 |
|------|--------|------|
| `/` | ダッシュボード | トップページ、各機能へのリンク |
| `/receiving` | 入庫一覧 | 入庫履歴の一覧表示 |
| `/receiving/new` | 入庫登録 | **MVP主要画面** - 納品書を見ながら入庫情報を入力 |
| `/receiving/[id]` | 入庫詳細 | 入庫情報の詳細表示 |
| `/inventory` | 在庫一覧 | 商品別在庫数量 |
| `/inventory/[productId]` | ロット別在庫 | 商品のロット別在庫詳細 |
| `/master/products` | 商品マスタ | 商品の登録・管理 |

#### 共通コンポーネント
- `Sidebar` - ナビゲーションメニュー
- `Button` - ボタン（primary/secondary/danger）
- `Input` - 入力フィールド
- `Card` - カードコンテナ
- `Table` - テーブル
- `ProductSearch` - 商品検索コンポーネント

---

## 追加対応

### 1. 入庫登録画面の商品検索改善

**変更前**: 検索文字を入力しないと商品が表示されない

**変更後**: 検索欄をクリック（フォーカス）すると全商品一覧がドロップダウンで表示され、文字入力で絞り込みが可能

### 2. 商品コード自動採番

**採番ルール**: `P00001` ～ `P99999`（5桁、99,999種類対応）

- 商品登録時に自動で連番を採番
- 商品登録画面から商品コード入力欄を削除
- 「商品コードは自動で採番されます」と表示

### 3. 既存商品データの商品コード更新

シードスクリプトを実行し、既存の17商品のコードを新ルールに更新:
- `MAGURO-001` → `P00001`
- `MAGURO-002` → `P00002`
- ... 以下同様

---

## ロット番号採番ルール

```
[入庫日]-[商品コード]-[連番]
例: 20260129-P00001-001
```

- 入庫日: YYYYMMDD形式
- 商品コード: ハイフン除去した商品コード
- 連番: 同一日・同一商品での3桁連番

---

## 起動手順

### 1. PostgreSQL起動
```bash
cd /Users/tatsumitakeru/pj-nahagyorui-wms
docker compose up -d
```

### 2. バックエンド起動
```bash
cd backend
npm run db:migrate   # 初回のみ
npm run db:seed      # 初回のみ
npm run dev
```

### 3. フロントエンド起動
```bash
cd frontend
npm run dev
```

### アクセスURL
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

---

## 今後の拡張予定

- 出庫機能の実装
- 加工処理の実装
- 在庫調整機能
- ユーザー認証
- レポート・帳票出力

---

## 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | Next.js 14, React 18, Tailwind CSS, TypeScript |
| バックエンド | Node.js, Express, TypeScript |
| データベース | PostgreSQL 16 |
| ORM | Prisma |
| コンテナ | Docker |
