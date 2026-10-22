// Public camera links checked 2026-10-23. Streams may change or pause.
const cameraDays = [
  [
    {place:'京都站・抵達',view:'京都站八條口',use:'看京都市區天氣與集合處周邊',url:'https://www.youtube.com/watch?v=CO_ZjH6N7RE',type:'near'},
    {place:'平安神宮',view:'平安神宮門前',use:'看門前天氣、人潮；神苑紅葉不在畫面內',url:'https://www.youtube.com/watch?v=iUbbYRWIEzo',type:'spot'},
    {place:'南禪寺水路閣',view:'永觀堂總門',use:'鄰近鏡頭；可看岡崎一帶天氣與路邊樹色，非水路閣',url:'https://www.youtube.com/watch?v=bK9vpKisRnQ',type:'near'},
    {place:'永觀堂夜楓',view:'永觀堂總門',use:'看入場附近人潮與樹色；池畔夜楓不在畫面內',url:'https://www.youtube.com/watch?v=bK9vpKisRnQ',type:'spot'}
  ],
  [
    {place:'京都 AVANTI 集合',view:'京都站八條口',use:'看集合處附近天氣；鏡頭朝計程車乘車處',url:'https://www.youtube.com/watch?v=CO_ZjH6N7RE',type:'near'},
    {place:'天橋立 View Land',view:'View Land 展望台',use:'官方定點畫面，可看飛龍觀方向的天氣與沙洲',url:'https://www.viewland.jp/camera/',type:'spot'},
    {place:'伊根舟屋・遊船',view:'未找到可核實的伊根近距離常設直播',use:'天橋立鏡頭距伊根甚遠，不能用來判斷伊根灣即時天氣；出發前查當地公告',url:'https://www.ine-kankou.jp/',type:'none'}
  ],
  [
    {place:'東福寺・通天橋',view:'京都站八條口',use:'較遠的市區天氣參考，無法判斷通天橋紅葉；另查官方紅葉情報',url:'https://www.youtube.com/watch?v=CO_ZjH6N7RE',type:'near',extra:'https://ja.kyoto.travel/flower/momiji/'},
    {place:'出町柳・鴨川',view:'京都府出町橋河川鏡頭',use:'官方河川定點影像；進站後選「出町橋」',url:'https://chisuibousai.pref.kyoto.jp/bousai/mobile/',type:'spot'},
    {place:'詩仙堂・圓光寺',view:'哲學之道北端',use:'洛北外圍天氣與樹色參考；兩寺庭園未入鏡',url:'https://ja.kyoto.travel/tourism/single01.php?category_id=8&tourism_id=2684',type:'near'}
  ],
  [
    {place:'京都御苑',view:'拾翠亭鏡頭目前暫停公開',use:'環境省影像網站因安全維護暫停服務；改查京都市官方紅葉情報',url:'https://ja.kyoto.travel/flower/momiji/',type:'none'},
    {place:'京都站・敘敘苑',view:'京都站八條口',use:'看車站附近天氣；餐廳室內不在畫面內',url:'https://www.youtube.com/watch?v=CO_ZjH6N7RE',type:'near'}
  ],
  [
    {place:'嵐山小火車',view:'渡月橋北端',use:'嵐山山色與天氣參考；小火車路線不在畫面內',url:'https://www.youtube.com/watch?v=jqtsC5BYlIk',type:'near'},
    {place:'保津川遊船',view:'渡月橋北端',use:'可看嵐山終點附近天氣、水面；不能判斷龜岡碼頭船班',url:'https://www.youtube.com/watch?v=jqtsC5BYlIk',type:'near'},
    {place:'渡月橋・嵐山散策',view:'渡月橋北端',use:'可看橋邊人潮、天氣與部分山色',url:'https://www.youtube.com/watch?v=jqtsC5BYlIk',type:'spot'}
  ],
  [
    {place:'清水寺',view:'清水坂參道',use:'看上山路況與天氣；清水舞台不在畫面內',url:'https://www.youtube.com/watch?v=cUnYPpK7ENk',type:'near'},
    {place:'御金神社',view:'未找到神社附近常設公開直播',use:'京都市觀光鏡頭地圖可作市區天氣參考；銀杏葉況請看現地',url:'https://ja.kyoto.travel/comfort/',type:'none'},
    {place:'鴨川周邊午餐・散策',view:'京都府三條大橋河川鏡頭',use:'官方河川定點影像；進站後選「三條大橋」',url:'https://chisuibousai.pref.kyoto.jp/bousai/mobile/',type:'spot'}
  ],
  [
    {place:'勝尾寺',view:'未找到寺院附近可核實的常設直播',use:'箕面市觀光協會每週更新勝尾寺紅葉狀態；比遠處鏡頭更適合看葉況',url:'https://minohkankou.net/',type:'none'},
    {place:'神戶三宮',view:'JR 三宮站',use:'看車站周邊即時天氣與人流',url:'https://www.m-fst.net/live/',type:'near'},
    {place:'神戶港夜景',view:'美利堅公園海岸鏡頭',use:'神戶市港灣局畫面，可看港區天氣；夜間以現場亮度為準',url:'https://kobeko-bousai.jp/video/meriken-park/',type:'spot'}
  ],
  [
    {place:'須磨海洋世界',view:'未找到園區附近可核實的常設直播',use:'可從兵庫縣天氣鏡頭索引找須磨區畫面；無法看園區內部',url:'https://weathernews.jp/onebox/livecam/kinki/hyogo/',type:'none'},
    {place:'神戶動物王國',view:'神戶機場',use:'同在港灣人工島一帶，可看天氣；園區動物與室內花園不在畫面內',url:'https://www.youtube.com/watch?v=1V-rE4Z1ZZQ',type:'near'},
    {place:'神戶機場・返程',view:'神戶機場跑道',use:'看機場天氣；航班狀態仍以航空公司公告為準',url:'https://www.youtube.com/watch?v=1V-rE4Z1ZZQ',type:'spot'}
  ]
];

function cameraGuide(dayIndex){
  const section=document.createElement('section');section.className='camera-guide';
  const heading=document.createElement('div');heading.className='camera-heading';
  const eyebrow=document.createElement('p');eyebrow.className='mini-label';eyebrow.textContent='LIVE WINDOW / 即時看一眼';
  const title=document.createElement('h4');title.textContent='景點周邊鏡頭';
  const note=document.createElement('p');note.textContent='點開原站確認是否正在直播及畫面時間。門前、遠處鏡頭只能作參考，寺院庭園葉況請搭配官方紅葉情報。';
  heading.append(eyebrow,title,note);section.append(heading);
  const grid=document.createElement('div');grid.className='camera-grid';
  for(const cam of cameraDays[dayIndex]){
    const card=document.createElement('article');card.className='camera-card';
    const badge=document.createElement('span');badge.className='camera-badge '+cam.type;badge.textContent={spot:'景點／門前',near:'鄰近參考',still:'定時照片',none:'無近距離直播'}[cam.type];
    const name=document.createElement('h5');name.textContent=cam.place;
    const view=document.createElement('p');view.className='camera-view';view.textContent='鏡頭：'+cam.view;
    const use=document.createElement('p');use.className='camera-use';use.textContent=cam.use;
    const link=document.createElement('a');link.href=cam.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=cam.type==='none'?'看替代資訊 ↗':'開啟現場畫面 ↗';
    card.append(badge,name,view,use,link);
    if(cam.extra){const extra=document.createElement('a');extra.href=cam.extra;extra.target='_blank';extra.rel='noopener noreferrer';extra.className='camera-extra';extra.textContent='查官方紅葉情報 ↗';card.append(extra);}
    grid.append(card);
  }
  section.append(grid);return section;
}
