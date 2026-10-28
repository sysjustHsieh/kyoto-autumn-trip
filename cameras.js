// Camera sources checked 2026-10-28. YouTube IDs and streams may change.
const cameraDays = [
  [
    {place:'京都站・抵達',view:'京都站八條口',use:'看京都市區天氣與集合處周邊',url:'https://www.youtube.com/watch?v=372yduHx8dQ',type:'near'},
    {place:'平安神宮',view:'平安神宮門前',use:'看門前天氣、人潮；神苑紅葉不在畫面內',url:'https://www.youtube.com/watch?v=iUbbYRWIEzo',type:'spot'},
    {place:'南禪寺水路閣',view:'永觀堂總門',use:'鄰近鏡頭；可看岡崎一帶天氣與路邊樹色，非水路閣',url:'https://www.youtube.com/watch?v=bK9vpKisRnQ',type:'near'},
    {place:'永觀堂夜楓',view:'永觀堂總門',use:'看入場附近人潮與樹色；池畔夜楓不在畫面內',url:'https://www.youtube.com/watch?v=bK9vpKisRnQ',type:'spot'}
  ],
  [
    {place:'京都 AVANTI 集合',view:'京都站八條口',use:'看集合處附近天氣；鏡頭朝計程車乘車處',url:'https://www.youtube.com/watch?v=372yduHx8dQ',type:'near'},
    {place:'天橋立 View Land',view:'View Land 展望台',use:'官方定點畫面，可看飛龍觀方向的天氣與沙洲',url:'https://www.viewland.jp/camera/',type:'spot'}
  ],
  [], // No verified camera at these stops or close enough to represent them.
  [
    {place:'京都站・敘敘苑',view:'京都站八條口',use:'看車站附近天氣；餐廳室內不在畫面內',url:'https://www.youtube.com/watch?v=372yduHx8dQ',type:'near'}
  ],
  [
    {place:'嵐山小火車',view:'渡月橋北端',use:'嵐山山色與天氣參考；小火車路線不在畫面內',url:'https://www.youtube.com/watch?v=2WB7nCKjijg',type:'near'},
    {place:'保津川遊船',view:'渡月橋北端',use:'可看嵐山終點附近天氣、水面；不能判斷龜岡碼頭船班',url:'https://www.youtube.com/watch?v=2WB7nCKjijg',type:'near'},
    {place:'渡月橋・嵐山散策',view:'渡月橋北端',use:'可看橋邊人潮、天氣與部分山色',url:'https://www.youtube.com/watch?v=2WB7nCKjijg',type:'spot'}
  ],
  [
    {place:'清水寺',view:'清水坂參道',use:'看上山路況與天氣；清水舞台不在畫面內',url:'https://www.youtube.com/watch?v=cUnYPpK7ENk',type:'near'},
    {place:'御金神社',view:'薰習館前烏丸通',use:'附近街景與天氣參考；神社銀杏不在畫面內',url:'https://www.youtube.com/watch?v=PC8V6QP5R2M',type:'near'}
  ],
  [
    {place:'神戶港夜景候選',view:'美利堅公園與神戶港塔',use:'可看港區天氣與夜間燈光；若改去摩耶山則不適用',url:'https://www.youtube.com/watch?v=AU_2zfM4m68',type:'spot'}
  ],
  [
    {place:'神戶動物王國',view:'神戶港灣人工島碼頭',use:'同在港灣人工島，可看周邊天氣；園區內部不在畫面內',url:'https://www.youtube.com/watch?v=2uv-DaUuZi0',type:'near'},
    {place:'神戶機場・返程',view:'神戶機場跑道',use:'看機場天氣；航班狀態仍以航空公司公告為準',url:'https://www.youtube.com/watch?v=1V-rE4Z1ZZQ',type:'spot'}
  ]
];

function cameraGuide(dayIndex){
  if(!cameraDays[dayIndex]?.length)return null;
  const section=document.createElement('section');section.className='camera-guide';
  const heading=document.createElement('div');heading.className='camera-heading';
  const eyebrow=document.createElement('p');eyebrow.className='mini-label';eyebrow.textContent='LIVE WINDOW / 即時看一眼';
  const title=document.createElement('h4');title.textContent='景點周邊鏡頭';
  const note=document.createElement('p');note.textContent='點開來源確認是否正在直播及畫面時間。鄰近鏡頭只能參考天氣與人潮，無法代表景點內的葉況。';
  heading.append(eyebrow,title,note);section.append(heading);
  const grid=document.createElement('div');grid.className='camera-grid';
  for(const cam of cameraDays[dayIndex]){
    const card=document.createElement('article');card.className='camera-card';
    const badge=document.createElement('span');badge.className='camera-badge '+cam.type;badge.textContent={spot:'景點／門前',near:'鄰近參考'}[cam.type];
    const name=document.createElement('h5');name.textContent=cam.place;
    const view=document.createElement('p');view.className='camera-view';view.textContent='鏡頭：'+cam.view;
    const use=document.createElement('p');use.className='camera-use';use.textContent=cam.use;
    const link=document.createElement('a');link.href=cam.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='開啟現場畫面 ↗';
    card.append(badge,name,view,use,link);
    grid.append(card);
  }
  section.append(grid);return section;
}
