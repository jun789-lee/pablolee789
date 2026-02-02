# Pocket Sort를 레퍼런스로 한 벤치마크

1. 하루 평균 플레이 타임 : 17.4분 ~ 23.57분
2. 하루 평균 세션 횟수 : 3.4회 ~ 5.06회
3. 세션 평균 지속 시간 : 4.76분
4. 리텐션률 : Day 1 : 34.3%, Day 2 : 27.2%, Day 3 : 21.3%, Day 7 : 10.5%, Day 14 : 7.2%, Day 30 : 6.6%
5. ARPDAU : $0.5 (도달시 매우 좋음)
6. Pocket Sort에서 가능한 IAP 종류를 모방할 것.
    아이템 명	기간	가격
Mini Gems Pack	일회성	$1.99
Revive bundle	일회성	$5.99
Small Gems Pack	일회성	$7.99
Extended Bundle	일회성	$19.99
Simple Bundle	일회성	$9.99
NoAds	일회성	$6.99
Simple Bundle NoAds	일회성	$9.99
Pick one offer bundle All	일회성	$12.99
Medium Gems Pack	일회성	$14.99
Pick one offer bundle1	일회성	$1.99
-> Gems를 현금으로 구매 Or 광고로 구매 가능하게끔
-> 아이템을 현금으로 구매 Or 광고로 구매 가능하게끔 설계.

# 이벤트 설계

<게임 시작 계열>
1. session_start : 세션 스타트

<게임 플레이 계열>
~~1. Merge : 자동 병합 ~~
2. Level_Start : 해당 레벨의 시작
    - 파라미터 : level : int.value <- 어떤 레벨을 시작하는지 
3. Level_Clear : 해당 레벨의 클리어
    - 파라미터 : level : int.value <- 어떤 레벨을 클리어했는지
    - 파라미터 : 'duration' 
        - [이슈] 이탈 후 복귀, Revive 후 지속 플레이 등 "순수 플레이 시간"과 "경과 시간"의 차이 발생. 
        - [결정] 일단 전체 경과 시간(Wall Clock)을 수집하되, 분석 시 Outlier(극단적으로 긴 시간)를 제거하거나, 가능하면 앱이 Active된 시간만 누적하는 로직(Pure Time)을 클라이언트에서 구현 시도.
    - 파라미터 : 'tab_count' : 클리어까지의 총 탭 횟수.
    - 파라미터 : 'used_shuffle_count', 'used_hammer_count', 'used_item_count' : 사용한 아이템별 횟수 집계.
    - 파라미터 : 'merge_count' : 해당 스테이지에서의 총 병합 횟수. 
3. Stage_Fail : 해당 레벨의 실패
    - 정의 : 모든 슬롯이 꽉 차고, 더 이상 움직일 수 없는 상태 (시간 제한 없음).
    - Trigger 시점 : 유저에게 **"조작 불가능(No Moves)" 메시지 팝업이 뜨는 순간** 발화.
    - 파라미터 : level : int.value
    - 목적 : 실패 후 유저의 행동 패턴(이탈 vs 부활 vs 아이템 사용) 추적.
    
4. Revive : 게임 오버 상태에서 부활
    - 파라미터 : level : int.value
    - 목적 : Stage_Fail 발생 후 목숨(Heart)을 소모하여 게임을 재개하는 전환율 측정.

5. Use_Item : 아이템 사용
    - 파라미터 : item_type : string (Shuffle, Hammer, etc.)
    - 파라미터 : level : int.value 




<아이템 구매 계열>
1. Buy_Item_Ad : 광고로 아이템 구매
    - 파라미터 : Stage : int.value. 어느 레벨에서 구매하였는지 
    - 파라미터 : Item_Type. 어떠한 아이템을 구매하였는지.
2. Buy_Item_Gem : 구매로 아이템 구매
    - 파라미터 : Stage : int.value. 어느 레벨에서 구매하였는지 
    - 파라미터 : Item_Type. 어떠한 아이템을 구매하였는지.
    - 파라미터 : User_Balance : int.value. 구매 직후(혹은 직전) 남은 재화 잔량. (잔고 부족으로 인한 구매인지, 여유 구매인지 패턴 분석)

<광고 시청 계열>
1. Watch_Inste : 영상 광고 시청
    - 파라미터 : Stage : int.value. 어느 레벨에서 시청하였는지
2. Watch_Banner : 배너 광고 시청
    - 파라미터 : Stage : int.value. 어느 레벨에서 시청하였는지 

<게임 종료 계열>
- session_end : 별도 수집 안 함. (분석 시 마지막 이벤트 발생 시각을 종료 시점으로 간주)

# 의논 사항
1. Card가 정말 적합한 Concept인가?
- Sort는 결국에 무언가를 모은다는 개념임. Pocket Sort는 도박에서 쓰이는 코인의 형태를 하고 있음. 도박에서의 코인은 무의식적으로 "돈"을 떠올리게 하고 "돈"은 유저에게 무의식적으로 "자산"을 떠올리게 함. 즉, 플레이하며 코인을 Sort해서, 모으는 것 자체가, 유저에게는 무의식적으로 "자산"을 모으는 것과 동일한 것. 

1-2. 자산 축적의 쾌감 
- 자산 축적의 쾌감을 느끼기 위해서는 시각적/청각적 요소가 매우 중요하게 여겨질 것 같음.

2. 유저가 자산을 모은다는 감각을 어떻게 느끼게 해줄 것인가? 그리고 얼마나 빠른 속도로 자산을 모은다는 감각을 느끼게 해줄 것인가?
- 나의 가설로는 Pocket Sort보다 자산을 모은다는 감각을 좀 더 빠르게 느끼게 해줄 수 있다면, 헤비 유저의 비율이 더욱 높아지지 않을까라는 생각이 듦.

3. 게임 실패한 후, Revive 할 때, 어떻게 Revive 시킬 것인가?

# <기록용> 주요 의사결정 요약 (Design Decisions)

1. **Merge 이벤트 vs 파라미터 집계**
    - **결정**: 파라미터 집계 방식 사용.
    - **사유**: Sort 장르 특성상 수천 번 발생할 수 있는 고빈도 액션이므로, 개별 이벤트 로그 비용이 과다함. `Level_Clear` 등의 이벤트에 `total_merge_count`, `combo_count` 등으로 요약하여 남기는 것이 효율적.

2. **Use_Item 이벤트 발화 여부**
    - **결정**: 이벤트 발화 (+ 파라미터 집계 병행).
    - **사유**: 아이템 사용은 단순 횟수뿐만 아니라 "사용 시점(타이밍)"이 중요함 (위기 상황 탈출 vs 편의성). 따라서 개별 이벤트 로그를 남기대, 분석 편의를 위해 결과 이벤트에도 집계 파라미터를 남김.

3. **Stage_Fail 정의 및 Revive 흐름**
    - **정의**: 슬롯이 꽉 차서 이동 불가한 상태 (Time Over 없음).
    - **Revive 추적**: `Stage_Fail` 로그 발생 후 -> (`Revive` 이벤트 발생 OR `Ad_View` 후 아이템 사용 OR 이탈)의 흐름으로 유저의 "패배 시 행동 전환율"을 분석하기로 함.

4. **Buy_Item_Gem의 잔고 데이터**
    - **결정**: 구매 시점의 `User_Balance` 파라미터 추가.
    - **사유**: 유저가 재화가 바닥났을 때 "급하게" 구매하는지, 미리 "여유 있게" 구매하는지 성향 파악 용도.



<유저 플레이 플로우>

유저 A

Session_Start : 어플리케이션을 오픈함
Stage_Start
    - level : 1
    - 해석 : 스테이지1에서 플레이를 시작하였다.
Use_Item 
    - level : 1
    - item_type : Shuffle 
    - 스테이지1에서 셔플 아이템을 사용하였다.
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
    - 해석 : 스테이지1을 클리어하였다. 클리어까지 50초 소요되었으며, 37번 탭하였고, 8번 Merge하였다. Shuffle 아이템을 1회 사용하였다.
Stage_Start
    - level : 2
    - 해석 : 스테이지2에서 플레이를 시작하였다
Use_Item
    - level : 2
    - Item_Type : Hammer
    - 해석 : 스테이지2에서 Hammer 아이템을 사용하였다.
Use_Item
    - level : 2
    - Item_Type : ItemA
    - 해석 : 스테이지2에서 ItemA 아이템을 사용하였다.
Use_Item
    - level : 2
    - Item_Type : Shuffle
    - 해석 : 스테이지2에서 Shuffle 아이템을 사용하였다.
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
    - 해석 : 스테이지2를 클리어하였다. 클리어까지 90초 소요되었으며, 78번 탭하였고, 15번 Merge하였다. Hammer 아이템을 1회 사용하였다.
Stage_Start 
    - level : 3
    - 해석 : 스테이지3에서 플레이를 시작하였다
Use_Item
    - level : 3
    - item_type : Hammer
    - 해석 : 스테이지3에서 Hammer 아이템을 사용하였다.
Stage_Fail
    - level : 3
    - 횟수 : 1
    - 해석 : 스테이지3에서 실패하였다.
Revive
    - level : 3
    - 해석 : 스테이지3에서 실패한 후, 목숨을 소모하여 게임을 재진행하였다.
Stage_Fail
    - level : 3
    - level : 3
    - 횟수 : 2
    - 해석 : 또 스테이지3에서 실패하였다.
Watch_Inste
    - level : 3
    - 해석 : 아이템 구매를 위해, 광고 이벤트가 발생하였다.
Buy_Item_Ad
    - level : 3
    - Item_Type : Shuffle
    - 해석 : 이번에는 목숨을 소모하지 않았고, 광고로 Shuffle 아이템을 구매하였다.
Use_Item
    - level : 3
    - Item_Type : Shuffle
    - 해석 : 구매한 Shuffle 아이템을 즉시 사용하였다.
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
    - 해석 : 스테이지3을 클리어하였다. 클리어까지 200초 소요되었으며, 250번 탭하였고, 50번 Merge하였다. Hammer 1회, Shuffle 1회 사용하였다.

위 데이터 설계로 알 수 있는 것.


<유저 퍼널 : 난이도>
1. 스테이지별 평균 실패 횟수
2. 스테이지별 리바이브 횟수
3. 스테이지별 아이템 사용 횟수



