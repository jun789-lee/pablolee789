# Pocket Sortをリファレンスとしたベンチマーク
1. 1日平均プレイ時間：17.4分 〜 23.57分
2. 1日平均セッション数：3.4回 〜 5.06回
3. セッション平均持続時間：4.76分
4. リテンション率：Day 1: 34.3%、Day 2: 27.2%、Day 3: 21.3%、Day 7: 10.5%、Day 14: 7.2%、Day 30: 6.6%
5. ARPDAU：$0.5（達成時非常に良好）
6. Pocket Sortで可能なIAP（アプリ内課金）の種類を模倣すること。
    アイテム名	期間	価格
Mini Gems Pack	一回性	$1.99
Revive bundle	一回性	$5.99
Small Gems Pack	一回性	$7.99
Extended Bundle	一回性	$19.99
Simple Bundle	一回性	$9.99
NoAds	一回性	$6.99
Simple Bundle NoAds	一回性	$9.99
Pick one offer bundle All	一回性	$12.99
Medium Gems Pack	一回性	$14.99
Pick one offer bundle1	一回性	$1.99
-> Gemsを現金で購入 Or 広告で購入可能にする
-> アイテムを現金で購入 Or 広告で購入できるように設計。

# イベント設計

<ゲーム開始系列>
1. session_start：セッションスタート

<ゲームプレイ系列>
~~1. Merge：自動マージ ~~
2. Level_Start：該当レベルの開始
    - パラメータ：level : int.value <- どのレベルを開始するか
3. Level_Clear：該当レベルのクリア
    - パラメータ：level : int.value <- どのレベルをクリアしたか
    - パラメータ：'duration' 
        - [課題] 離脱後の復帰、Revive後の継続プレイなど、「純粋なプレイ時間」と「経過時間」の差異が発生。
        - [決定] 一旦全体の経過時間（Wall Clock）を収集するが、分析時にOutlier（極端に長い時間）を除外するか、可能であればアプリがActiveな時間のみ累積するロジック（Pure Time）をクライアントで実装試行。
    - パラメータ：'tab_count'：クリアまでの総タップ回数。
    - パラメータ：'used_shuffle_count'、'used_hammer_count'、'used_item_count'：使用したアイテム別の回数集計。
    - パラメータ：'merge_count'：該当ステージでの総マージ回数。
3. Stage_Fail：該当レベルの失敗
    - 定義：すべてのスロットが埋まり、これ以上動けない状態（時間制限なし）。
    - Trigger時点：ユーザーに**「操作不可能（No Moves）」メッセージポップアップが表示された瞬間**に発火。
    - パラメータ：level : int.value
    - 目的：失敗後のユーザーの行動パターン（離脱 vs 復活 vs アイテム使用）を追跡。
    
4. Revive：ゲームオーバー状態からの復活
    - パラメータ：level : int.value
    - 目的：Stage_Fail発生後、ライフ（Heart）を消費してゲームを再開する転換率（Conversion Rate）を測定。

5. Use_Item：アイテム使用
    - パラメータ：item_type : string (Shuffle, Hammer, etc.)
    - パラメータ：level : int.value 




<アイテム購入系列>
1. Buy_Item_Ad：広告でアイテム購入
    - パラメータ：Stage : int.value。どのレベルで購入したか
    - パラメータ：Item_Type。どのアイテムを購入したか。
2. Buy_Item_Gem：購入でアイテム購入
    - パラメータ：Stage : int.value。どのレベルで購入したか
    - パラメータ：Item_Type。どのアイテムを購入したか。
    - パラメータ：User_Balance : int.value。購入直後（あるいは直前）の財貨残量。（残高不足による購入か、余裕のある購入かのパターン分析）

<広告視聴系列>
1. Watch_Inste：動画広告視聴
    - パラメータ：Stage : int.value。どのレベルで視聴したか
2. Watch_Banner：バナー広告視聴
    - パラメータ：Stage : int.value。どのレベルで視聴したか 

<ゲーム終了系列>
- session_end：別途収集しない。（分析時に最後のイベント発生時刻を終了時点とみなす）

# 議論事項
1. Cardが本当に適切なコンセプトか？
- Sortは結局何かを集めるという概念である。Pocket Sortはギャンブルで使われるコインの形態をしている。ギャンブルでのコインは無意識的に「お金」を連想させ、「お金」はユーザーに無意識的に「資産」を連想させる。つまり、プレイしながらコインをSortして集めること自体が、ユーザーにとっては無意識的に「資産」を集めることと同一なのだ。

1-2. 資産蓄積の快感
- 資産蓄積の快感を感じるためには、視覚的/聴覚的要素が非常に重要視されると思われる。

2. ユーザーが資産を集めている感覚をどのように感じさせるか？そしてどれくらい速い速度で資産を集めている感覚を感じさせるか？
- 私の仮説では、Pocket Sortより資産を集めている感覚をもう少し早く感じさせることができれば、ヘビーユーザーの比率がさらに高くなるのではないかと思う。

3. ゲーム失敗後、Reviveする際、どのようにReviveさせるか？

# <記録用> 主要意思決定要約 (Design Decisions)

1. **Mergeイベント vs パラメータ集計**
    - **決定**：パラメータ集計方式を使用。
    - **理由**：Sortジャンルの特性上、数千回発生する可能性のある高頻度アクションであるため、個別のイベントログコストが過多。`Level_Clear`などのイベントに`total_merge_count`、`combo_count`などで要約して残すのが効率的。

2. **Use_Itemイベント発火可否**
    - **決定**：イベント発火（+ パラメータ集計並行）。
    - **理由**：アイテム使用は単純な回数だけでなく「使用時点（タイミング）」が重要（危機状況脱出 vs 利便性）。したがって、個別のイベントログを残しつつ、分析の利便性のために結果イベントにも集計パラメータを残す。

3. **Stage_Fail定義およびReviveフロー**
    - **定義**：スロットが埋まり移動不可能な状態（Time Overなし）。
    - **Revive追跡**：`Stage_Fail`ログ発生後 -> （`Revive`イベント発生 OR `Ad_View`後アイテム使用 OR 離脱）の流れでユーザーの「敗北時の行動転換率」を分析することにする。

4. **Buy_Item_Gemの残高データ**
    - **決定**：購入時点の`User_Balance`パラメータ追加。
    - **理由**：ユーザーが財貨が底をついた時に「急いで」購入するのか、予め「余裕を持って」購入するのかの性向把握用途。



<ユーザープレイフロー>

ユーザーA

Session_Start：アプリケーションを開く
Stage_Start
    - level : 1
    - 解釈：ステージ1でプレイを開始した。
Use_Item 
    - level : 1
    - item_type : Shuffle 
    - ステージ1でシャッフルアイテムを使用した。
Stage_Clear
    - level : 1
    - duration : 50s
    - tab_count : 37
    - merge_count : 8
    - used_shuffle_count : 1
    - used_hammer_count : 0
    - used_itemA_count : 0
    - failure_count : 0
    - revive_count : 0
    - 解釈：ステージ1をクリアした。クリアまで50秒所要し、37回タップし、8回Mergeした。Shuffleアイテムを1回使用した。
Stage_Start
    - level : 2
    - 解釈：ステージ2でプレイを開始した
Use_Item
    - level : 2
    - Item_Type : Hammer
    - 解釈：ステージ2でHammerアイテムを使用した。
Use_Item
    - level : 2
    - Item_Type : ItemA
    - 解釈：ステージ2でItemAアイテムを使用した。
Use_Item
    - level : 2
    - Item_Type : Shuffle
    - 解釈：ステージ2でShuffleアイテムを使用した。
Stage_Clear
    - level : 2
    - duration : 90s
    - tab_count : 78
    - merge_count : 15
    - used_shuffle_count : 1
    - used_hammer_count : 1
    - used_itemA_count : 1
    - failure_count : 0
    - revive_count : 0
    - 解釈：ステージ2をクリアした。クリアまで90秒所要し、78回タップし、15回Mergeした。Hammerアイテムを1回使用した。
Stage_Start 
    - level : 3
    - 解釈：ステージ3でプレイを開始した
Use_Item
    - level : 3
    - item_type : Hammer
    - 解釈：ステージ3でHammerアイテムを使用した。
Stage_Fail
    - level : 3
    - 回数 : 1
    - 解釈：ステージ3で失敗した。
Revive
    - level : 3
    - 解釈：ステージ3で失敗した後、ライフを消費してゲームを再進行した。
Stage_Fail
    - level : 3
    - 回数 : 2
    - 解釈：またステージ3で失敗した。
Watch_Inste
    - level : 3
    - 解釈：アイテム購入のために、広告イベントが発生した。
Buy_Item_Ad
    - level : 3
    - Item_Type : Shuffle
    - 解釈：今回はライフを消費せず、広告でShuffleアイテムを購入した。
Use_Item
    - level : 3
    - Item_Type : Shuffle
    - 解釈：購入したShuffleアイテムを即時使用した。
Stage_Clear : 
    - level : 3
    - duration : 200s
    - tab_count : 250
    - merge_count : 50
    - used_shuffle_count : 1
    - used_hammer_count : 1
    - used_itemA_count : 0
    - failure_count : 2
    - revive_count : 1
    - 解釈：ステージ3をクリアした。クリアまで200秒所要し、250回タップし、50回Mergeした。Hammer1回、Shuffle1回使用した。

上記データ設計でわかること。


<ユーザーファネル：難易度>
1. ステージ別平均失敗回数
2. ステージ別リバイブ回数
3. ステージ別アイテム使用回数
