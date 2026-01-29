# PrismaとDBMLの同期スキル

PrismaスキーマとDBMLファイルを双方向で同期します。

## 使用方法

引数で同期方向を指定してください：
- `prisma` - Prismaスキーマ → DBML を生成
- `dbml` - DBML → Prismaスキーマ を生成
- 引数なし - 両ファイルを比較して差分を確認

## 実行手順

### 1. 引数が `prisma` の場合（Prisma → DBML）

1. `backend/prisma/schema.prisma` を読み取る
2. Prismaスキーマを解析してDBML形式に変換
3. `docs/database/schema.dbml` に出力
4. 変換結果をユーザーに報告

### 2. 引数が `dbml` の場合（DBML → Prisma）

1. `docs/database/schema.dbml` を読み取る
2. DBMLを解析してPrismaスキーマ形式に変換
3. 変換結果を表示し、ユーザーに確認を求める
4. 確認後、`backend/prisma/schema.prisma` に反映
5. `npx prisma format` でフォーマット

### 3. 引数なしの場合（差分確認）

1. 両ファイルを読み取る
2. テーブル/モデルの差分を分析
3. 差分レポートを表示

## ファイルパス

- Prismaスキーマ: `backend/prisma/schema.prisma`
- DBMLファイル: `docs/database/schema.dbml`

## 注意事項

- DBMLからPrismaへの変換時は、既存のリレーション定義を保持するよう注意
- 変換前に必ずgitで変更をコミットしておくことを推奨
- Prisma固有の機能（@@map, @default(cuid())等）はDBMLに完全には反映されない場合がある

$ARGUMENTS
