# 在庫フロー図

## 在庫の動きの全体像

```mermaid
graph TB
    subgraph 入庫経路
        IN1[仕入れ入庫]
        IN2[加工品入庫]
        IN3[返品再入庫]
        IN4[持ち回り再入庫]
    end

    subgraph 在庫
        INV[在庫<br/>倉庫内]
    end

    subgraph 出庫経路
        OUT1[販売出庫]
        OUT2[加工材料出庫]
        OUT3[持ち回り出庫]
        OUT4[廃棄]
        OUT5[仕入先返品]
    end

    IN1 --> INV
    IN2 --> INV
    IN3 --> INV
    IN4 -.記録なし.-> INV

    INV --> OUT1
    INV --> OUT2
    INV -.記録なし.-> OUT3
    INV --> OUT4
    INV --> OUT5

    OUT2 --> P[加工]
    P --> IN2

    style IN4 fill:#ff6666
    style OUT3 fill:#ff6666
    style INV fill:#90EE90
```

## 詳細在庫フロー（現状）

```mermaid
stateDiagram-v2
    [*] --> 発注: 営業マンが発注<br/>(記録なし)

    発注 --> 入庫待ち: 仕入先へ発注

    入庫待ち --> 納品: 商品到着

    納品 --> 検品: 検品担当者

    検品 --> 入庫登録: 納品書を事務員へ

    入庫登録 --> 在庫: システム入力

    在庫 --> 通過在庫: 当日出荷の場合<br/>(問題)

    通過在庫 --> 出荷済み: 先に出荷<br/>処理順序逆転

    在庫 --> 出荷指示: 通常フロー

    出荷指示 --> ピッキング: 営業マンへ伝票

    ピッキング --> 出荷済み: 配送

    在庫 --> 持ち回り出庫: 記録なし<br/>(問題)

    持ち回り出庫 --> 販売: 顧客で売れた

    持ち回り出庫 --> 預け置き: 顧客先に預ける

    持ち回り出庫 --> 持ち回り再入庫: 売れず戻す<br/>記録なし

    持ち回り再入庫 --> 在庫

    預け置き --> 販売: 使用分請求

    預け置き --> 持ち回り再入庫: 余剰分回収

    在庫 --> 加工材料出庫: 製造部へ

    加工材料出庫 --> 加工中: 加工作業

    加工中 --> 製品入庫: 出来高報告

    製品入庫 --> 在庫: 加工品

    在庫 --> 返品受付: 顧客から返品

    返品受付 --> 再販判定: 状態確認

    再販判定 --> 在庫: 再販可能

    再販判定 --> 加工材料: 加工に使用可能

    再販判定 --> 廃棄処理: 使用不可

    再販判定 --> 仕入先返品: 品質問題

    販売 --> [*]
    出荷済み --> [*]
    廃棄処理 --> [*]
    仕入先返品 --> [*]

    note right of 発注
        記録がない
        追跡不可能
    end note

    note right of 通過在庫
        処理順序が逆転
        在庫計算が破綻
    end note

    note right of 持ち回り出庫
        記録なし
        在庫ずれの原因
    end note
```

## ロット管理と先入先出（理想）

```mermaid
graph TB
    subgraph 入庫
        A1[ロットA<br/>2024/01/10入庫<br/>単価1000円]
        A2[ロットB<br/>2024/01/15入庫<br/>単価1050円]
        A3[ロットC<br/>2024/01/20入庫<br/>単価1100円]
    end

    subgraph 在庫倉庫
        INV[在庫管理]
    end

    subgraph 出庫FIFO
        OUT1[出荷1<br/>2024/01/21<br/>→ロットA優先]
        OUT2[出荷2<br/>2024/01/22<br/>→ロットA/B]
        OUT3[出荷3<br/>2024/01/23<br/>→ロットB/C]
    end

    A1 --> INV
    A2 --> INV
    A3 --> INV

    INV -->|古い順| OUT1
    INV -->|古い順| OUT2
    INV -->|古い順| OUT3

    OUT1 -.原価追跡.- C1[原価: 1000円]
    OUT2 -.原価追跡.- C2[原価: 1000円/1050円]
    OUT3 -.原価追跡.- C3[原価: 1050円/1100円]

    style A1 fill:#FFE4B5
    style A2 fill:#FFE4B5
    style A3 fill:#FFE4B5
    style INV fill:#90EE90
    style C1 fill:#DDA0DD
    style C2 fill:#DDA0DD
    style C3 fill:#DDA0DD
```

## 在庫精度の問題（現状 vs 理想）

```mermaid
graph LR
    subgraph 現状の在庫
        C1[システム在庫]
        C2[実在庫]
        C3[差異発生]
    end

    subgraph 差異の原因
        R1[持ち回り出庫<br/>記録なし]
        R2[持ち回り再入庫<br/>記録なし]
        R3[通過在庫<br/>処理順序逆転]
        R4[加工材料出庫<br/>記録不明]
        R5[返品再入庫<br/>記録不明]
    end

    subgraph 影響
        I1[棚卸し時の<br/>差異判明]
        I2[原因特定不可]
        I3[在庫を信頼<br/>できない]
    end

    C1 --> C3
    C2 --> C3

    R1 --> C3
    R2 --> C3
    R3 --> C3
    R4 --> C3
    R5 --> C3

    C3 --> I1
    I1 --> I2
    I2 --> I3

    style C3 fill:#ff6666
    style R1 fill:#ff6666
    style R2 fill:#ff6666
    style R3 fill:#ff6666
    style I3 fill:#ffcccc
```

```mermaid
graph LR
    subgraph 理想の在庫WMS導入後
        I1[システム在庫]
        I2[実在庫]
        I3[一致]
    end

    subgraph 対策
        S1[持ち回り申請<br/>記録する]
        S2[持ち回り再入庫<br/>記録する]
        S3[入出庫順序<br/>正しく管理]
        S4[加工材料出庫<br/>記録する]
        S5[返品再入庫<br/>記録する]
    end

    subgraph 効果
        E1[リアルタイム<br/>在庫把握]
        E2[原因追跡可能]
        E3[在庫精度向上]
    end

    I1 --> I3
    I2 --> I3

    S1 --> I3
    S2 --> I3
    S3 --> I3
    S4 --> I3
    S5 --> I3

    I3 --> E1
    I3 --> E2
    E1 --> E3
    E2 --> E3

    style I3 fill:#90EE90
    style S1 fill:#90EE90
    style S2 fill:#90EE90
    style S3 fill:#90EE90
    style S4 fill:#90EE90
    style S5 fill:#90EE90
    style E3 fill:#ADD8E6
```

## 加工業務の在庫フロー

```mermaid
graph TB
    subgraph 材料在庫
        M1[マグロ 原魚<br/>ロットA]
    end

    subgraph 加工プロセス
        P1[加工指図]
        P2[材料出庫<br/>マグロ 5本]
        P3[加工作業]
        P4[出来高<br/>500gブロック 20個<br/>70gブロック 50個]
    end

    subgraph 製品在庫
        F1[500gブロック<br/>ロットA-1]
        F2[70gブロック<br/>ロットA-2]
    end

    subgraph 原価追跡
        C1[材料原価<br/>マグロ 5本分]
        C2[加工原価<br/>工賃・人件費]
        C3[製品原価<br/>按分計算]
    end

    M1 --> P2
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> F1
    P4 --> F2

    M1 -.原価.- C1
    P3 -.原価.- C2
    C1 --> C3
    C2 --> C3
    C3 -.製品原価.- F1
    C3 -.製品原価.- F2

    style M1 fill:#FFE4B5
    style F1 fill:#90EE90
    style F2 fill:#90EE90
    style C3 fill:#DDA0DD
```

### 現状の加工原価管理の問題

```mermaid
graph LR
    A[材料出庫] --> B[加工]
    B --> C[出来高]
    C --> D{原価計算}

    D -->|現状| E[Excel<br/>根拠不明]
    E --> F[計算方法<br/>不明確]
    F --> G[原価の<br/>信頼性低]

    D -->|理想| H[システム<br/>自動計算]
    H --> I[材料原価+<br/>加工原価]
    I --> J[正確な<br/>製品原価]

    style E fill:#ff6666
    style F fill:#ff6666
    style G fill:#ffcccc
    style H fill:#90EE90
    style I fill:#90EE90
    style J fill:#ADD8E6
```

## 返品・再入庫フロー

```mermaid
graph TB
    A[顧客返品] --> B{返品理由}

    B -->|受発注ミス| C1[状態確認]
    C1 --> D1{再販可能?}
    D1 -->|可能| E1[在庫へ再入庫]
    D1 -->|不可| E2[加工材料または廃棄]

    B -->|商品状態| C2{加工に使用可能?}
    C2 -->|可能| E3[加工材料在庫へ]
    C2 -->|不可| C3{品質問題?}
    C3 -->|はい| E4[仕入先へ返品]
    C3 -->|いいえ| E5[廃棄]

    E1 --> INV[通常在庫]
    E3 --> MINV[加工材料在庫]

    style E1 fill:#90EE90
    style E3 fill:#90EE90
    style E2 fill:#ffcccc
    style E4 fill:#ADD8E6
    style E5 fill:#ffcccc
```

## 持ち回り在庫の追跡（現状 vs 理想）

### 現状: 追跡不可能

```mermaid
sequenceDiagram
    participant 在庫
    participant 営業マン
    participant 顧客
    participant システム

    Note over 在庫,システム: 現状（記録なし）

    在庫->>営業マン: 出庫（記録なし）
    Note right of 在庫: 実在庫は減る<br/>システム在庫は減らない

    営業マン->>顧客: 商品提案

    alt 売れた場合
        顧客->>営業マン: 購入
        営業マン->>システム: 売上入力
        Note right of システム: 在庫がないのに<br/>売上が計上される
    else 売れなかった場合
        顧客->>営業マン: 返却
        営業マン->>在庫: 再入庫（記録なし）
        Note right of 在庫: 実在庫は戻る<br/>システム在庫は変わらない
    end

    rect rgb(255, 200, 200)
        Note over 在庫,システム: システム在庫と実在庫が乖離
    end
```

### 理想: WMSで追跡

```mermaid
sequenceDiagram
    participant 在庫
    participant 営業マン
    participant 顧客
    participant WMS

    Note over 在庫,WMS: 理想（WMS導入後）

    営業マン->>WMS: 持ち回り申請
    WMS->>営業マン: 承認
    在庫->>営業マン: 出庫
    WMS->>WMS: 在庫減算<br/>持ち回り在庫計上

    営業マン->>顧客: 商品提案

    alt 売れた場合
        顧客->>営業マン: 購入
        営業マン->>WMS: 売上確定
        WMS->>WMS: 持ち回り在庫から売上へ
    else 顧客先に預ける
        営業マン->>WMS: 預け置き登録
        WMS->>WMS: 預け置き在庫として追跡
    else 売れなかった場合
        顧客->>営業マン: 返却
        営業マン->>WMS: 再入庫登録
        WMS->>WMS: 持ち回り在庫から通常在庫へ
        在庫->>在庫: 再入庫
    end

    rect rgb(200, 255, 200)
        Note over 在庫,WMS: システム在庫と実在庫が一致
    end
```

## 在庫KPI（導入前後の比較）

```mermaid
graph TB
    subgraph 現状の指標
        K1[在庫精度: 不明<br/>棚卸し差異率が高い]
        K2[棚卸し頻度: 高<br/>週次・月次で複数回]
        K3[欠品率: 不明<br/>把握できていない]
        K4[過剰在庫: 不明<br/>把握できていない]
        K5[在庫回転率: 不明<br/>計算できない]
    end

    subgraph 目標指標WMS導入後
        T1[在庫精度: 98%以上<br/>差異率2%以下]
        T2[棚卸し頻度: 削減<br/>月次1回]
        T3[欠品率: 5%以下<br/>リアルタイム把握]
        T4[過剰在庫: 把握可能<br/>適正在庫維持]
        T5[在庫回転率: 計測可能<br/>改善サイクル確立]
    end

    K1 -.改善.- T1
    K2 -.改善.- T2
    K3 -.改善.- T3
    K4 -.改善.- T4
    K5 -.改善.- T5

    style K1 fill:#ffcccc
    style K2 fill:#ffcccc
    style K3 fill:#ffcccc
    style K4 fill:#ffcccc
    style K5 fill:#ffcccc
    style T1 fill:#90EE90
    style T2 fill:#90EE90
    style T3 fill:#90EE90
    style T4 fill:#90EE90
    style T5 fill:#90EE90
```

## 在庫可視化ダッシュボード（想定）

```mermaid
graph TB
    subgraph ダッシュボード
        D1[リアルタイム在庫数量]
        D2[ロット別在庫一覧]
        D3[賞味期限アラート]
        D4[在庫推移グラフ]
        D5[ABC分析]
        D6[回転率分析]
    end

    subgraph データソース
        S1[入庫実績]
        S2[出庫実績]
        S3[加工実績]
        S4[棚卸し実績]
    end

    S1 --> D1
    S1 --> D2
    S1 --> D3
    S2 --> D1
    S2 --> D4
    S3 --> D1
    S4 --> D1

    D4 --> D6
    D1 --> D5

    style D1 fill:#90EE90
    style D2 fill:#90EE90
    style D3 fill:#FFB6C1
    style D4 fill:#ADD8E6
    style D5 fill:#ADD8E6
    style D6 fill:#ADD8E6
```

## まとめ: 在庫管理の改善方向

```mermaid
graph LR
    A[現状] --> B[WMS導入]
    B --> C[改善効果]

    subgraph 現状の問題
        A1[在庫不明]
        A2[記録なし]
        A3[追跡不可]
    end

    subgraph WMSの機能
        B1[リアルタイム在庫]
        B2[全操作を記録]
        B3[ロット追跡]
        B4[先入先出]
    end

    subgraph 期待される効果
        C1[在庫精度98%以上]
        C2[棚卸し削減]
        C3[原価管理実現]
        C4[業務効率化]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B3
    A3 --> B4

    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C3
    B1 --> C4
    B2 --> C4

    style A1 fill:#ff6666
    style A2 fill:#ff6666
    style A3 fill:#ff6666
    style B1 fill:#90EE90
    style B2 fill:#90EE90
    style B3 fill:#90EE90
    style B4 fill:#90EE90
    style C1 fill:#ADD8E6
    style C2 fill:#ADD8E6
    style C3 fill:#ADD8E6
    style C4 fill:#ADD8E6
```
