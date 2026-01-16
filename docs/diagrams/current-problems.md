# 現状の問題点マップ

## 問題の全体像

```mermaid
mindmap
  root((那覇魚類<br/>在庫管理の問題))
    在庫管理の欠如
      在庫数量が不明
        リアルタイム在庫把握不可
        棚卸し高頻度化
      先入先出FIFO未実施
        古い在庫の残留
        品質劣化リスク
      原価管理の欠如
        売上と仕入れが紐づかない
        ロット管理なし
        利益計算不可
    記録の欠如
      持ち回り出庫
        記録なし
        追跡不可能
      発注履歴なし
        電話発注のみ
        社内共有なし
      返品・再入庫
        記録不明確
        在庫ずれの原因
    業務効率の問題
      二重入力
        手書き→システム入力
        転記ミス
      部門間伝達ミス
        口頭依存
        認識齟齬
      属人化
        営業マン個人のノート
        情報分散
    システムの限界
      レガシーシステム
        連携困難
        データ活用不可
      手動入力依存
        商品コード手入力
        打ち間違いリスク
```

## 問題の影響範囲マップ

```mermaid
graph TB
    subgraph 根本原因
        P1[在庫管理システムなし]
        P2[記録・履歴の欠如]
        P3[レガシーシステム]
    end

    subgraph 直接的な影響
        I1[在庫数が分からない]
        I2[原価が分からない]
        I3[入力ミス発生]
        I4[伝達ミス発生]
        I5[追跡不可能]
    end

    subgraph 業務への影響
        B1[棚卸し頻度増]
        B2[先入先出不可]
        B3[二重作業]
        B4[検品不十分]
        B5[業務効率低下]
    end

    subgraph 経営への影響
        M1[利益率不明]
        M2[経営判断困難]
        M3[人的コスト増]
        M4[品質リスク]
        M5[顧客満足度低下]
    end

    P1 --> I1
    P1 --> I2
    P2 --> I5
    P3 --> I3
    P3 --> I4

    I1 --> B1
    I1 --> B2
    I2 --> M1
    I3 --> B5
    I4 --> B5
    I5 --> B4

    B1 --> M3
    B2 --> M4
    B3 --> M3
    B4 --> M4
    B5 --> M3

    M1 --> M2
    M4 --> M5

    style P1 fill:#ff6666
    style P2 fill:#ff6666
    style P3 fill:#ff6666
    style M2 fill:#ffcccc
    style M5 fill:#ffcccc
```

## 業務別の課題詳細

### 1. 受注業務の課題

```mermaid
graph LR
    A[顧客注文] --> B[営業マン]
    B --> C[ノート手書き]
    C --> D[事務員確認]
    D --> E[システム入力]

    C -.課題1.- C1[読み取りにくい<br/>筆跡問題]
    C -.課題2.- C2[情報の属人化]
    D -.課題3.- D1[口頭確認依存]
    E -.課題4.- E1[二重入力<br/>転記ミス]
    E -.課題5.- E2[商品コード<br/>手入力ミス]

    style C1 fill:#ffcccc
    style C2 fill:#ffcccc
    style D1 fill:#ffcccc
    style E1 fill:#ffcccc
    style E2 fill:#ffcccc
```

### 2. 入庫業務の課題

```mermaid
graph TB
    A[営業マン発注] --> B{記録は?}
    B -->|なし| C[電話発注]
    C --> D[仕入れ先]
    D --> E[納品]
    E --> F[検品担当]
    F --> G{発注内容<br/>知ってる?}
    G -->|知らない| H[納品書のみ確認]
    H --> I[事務員へ]
    I --> J[システム入力]

    subgraph 重大問題
        K1[発注履歴なし]
        K2[社内共有なし]
        K3[照合不可能]
        K4[通過在庫<br/>処理順序逆転]
    end

    C --> K1
    C --> K2
    H --> K3

    style K1 fill:#ff6666
    style K2 fill:#ff6666
    style K3 fill:#ff6666
    style K4 fill:#ff6666
```

#### 通過在庫問題の詳細

```mermaid
sequenceDiagram
    participant 仕入先
    participant 倉庫
    participant システム
    participant 顧客

    Note over 仕入先,顧客: 当日出荷の場合（問題）

    仕入先->>倉庫: 1. 納品
    Note right of 倉庫: 納品書は<br/>後で事務員へ
    倉庫->>顧客: 2. 即出荷
    顧客->>システム: 3. 出荷処理<br/>在庫マイナス！
    Note right of システム: 在庫がない<br/>状態で出荷
    システム->>システム: 4. 入庫処理<br/>在庫プラス
    Note right of システム: 処理順序が<br/>実態と逆転

    rect rgb(255, 200, 200)
        Note over システム: 在庫計算の整合性が崩れる
    end
```

### 3. 加工業務の課題

```mermaid
graph TB
    A[材料出庫] --> B[加工作業]
    B --> C[手書き帳票]
    C --> D[事務員]
    D --> E[システム入力]

    subgraph 問題点
        F1[材料消費の<br/>ロット追跡不可]
        F2[歩留まり<br/>把握不正確]
        F3[原価計算<br/>根拠なし]
        F4[Excelで管理<br/>長期未更新]
    end

    A --> F1
    B --> F2
    E --> F3
    E --> F4

    style F1 fill:#ff6666
    style F2 fill:#ffcccc
    style F3 fill:#ff6666
    style F4 fill:#ff6666
```

#### 加工原価管理の問題

```mermaid
graph LR
    A[Excel原価計算] --> B{根拠は?}
    B -->|不明| C[数式なし]
    B -->|不明| D[工賃計算<br/>ロジック不明]
    B -->|不明| E[長期未更新]

    C --> F[計算の正確性<br/>検証不可]
    D --> G[原価の<br/>信頼性低下]
    E --> H[実態との乖離]

    F --> I[経営判断に<br/>使えない]
    G --> I
    H --> I

    style A fill:#ff6666
    style I fill:#ffcccc
```

### 4. 出荷業務の課題

```mermaid
graph TB
    A[伝票受取] --> B[ピッキング]
    B --> C[積み込み]
    C --> D[配送]

    subgraph 通常出荷の課題
        E1[先入先出<br/>指示なし]
        E2[在庫確認困難]
        E3[ピッキングミス]
    end

    B --> E1
    B --> E2
    B --> E3

    subgraph 持ち回りの重大問題
        F1[記録なし]
        F2[承認なし]
        F3[追跡不可能]
        F4[在庫ずれ]
    end

    G[持ち回り出庫] --> F1
    G --> F2
    G --> F3
    F3 --> F4

    style E1 fill:#ffcccc
    style E2 fill:#ffcccc
    style E3 fill:#ffcccc
    style F1 fill:#ff6666
    style F2 fill:#ff6666
    style F3 fill:#ff6666
    style F4 fill:#ff6666
```

## 問題の優先順位マトリクス

```mermaid
quadrantChart
    title 課題の優先順位（影響度 × 発生頻度）
    x-axis 発生頻度低 --> 発生頻度高
    y-axis 影響度低 --> 影響度高
    quadrant-1 最優先対応
    quadrant-2 重要課題
    quadrant-3 改善検討
    quadrant-4 優先度中

    持ち回り記録なし: [0.9, 0.95]
    発注履歴なし: [0.85, 0.9]
    原価管理の欠如: [0.5, 0.95]
    通過在庫問題: [0.6, 0.85]
    在庫数不明: [0.95, 0.8]
    先入先出未実施: [0.8, 0.75]
    入力ミス: [0.7, 0.6]
    二重入力: [0.85, 0.5]
    伝達ミス: [0.6, 0.55]
    棚卸し頻度高: [0.9, 0.6]
```

## 問題解決の期待効果

```mermaid
graph LR
    subgraph 導入するシステム
        S1[在庫管理システム]
    end

    subgraph 直接的な改善
        D1[在庫の可視化]
        D2[記録・履歴の保存]
        D3[ロット管理]
        D4[先入先出実現]
        D5[入力ミス削減]
    end

    subgraph 業務への効果
        B1[棚卸し削減]
        B2[二重作業削減]
        B3[検品精度向上]
        B4[伝達ミス削減]
    end

    subgraph 経営への効果
        M1[原価管理実現]
        M2[利益率把握]
        M3[業務効率化]
        M4[品質向上]
        M5[経営判断支援]
    end

    S1 --> D1
    S1 --> D2
    S1 --> D3
    S1 --> D4
    S1 --> D5

    D1 --> B1
    D2 --> B4
    D3 --> M1
    D4 --> M4
    D5 --> B2

    B1 --> M3
    B2 --> M3
    B3 --> M4
    B4 --> M3

    M1 --> M2
    M2 --> M5
    M3 --> M5
    M4 --> M5

    style S1 fill:#90EE90
    style M5 fill:#90EE90
```

## 課題の色分け凡例

- 🔴 **赤色（濃）**: 重大な問題（記録なし、追跡不可能、経営に直結）
- 🟠 **赤色（薄）**: 改善必要（業務効率、品質に影響）
- 🟢 **緑色**: 改善後の状態、ポジティブな効果
