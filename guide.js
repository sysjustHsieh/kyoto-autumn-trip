const chapters=[
  {image:'heian.jpg',label:'岡崎・永觀堂',caption:'平安神宮',alt:'平安神宮的秋日景色',memo:'抵達日留點彈性，把夜楓作為第一晚的主角。'},
  {image:'amanohashidate.jpg',label:'海之京都',caption:'天橋立',alt:'天橋立沙洲與海景',memo:'預訂京都 AVANTI 前集合的 KKday 方案，門票與時程以憑證為準。'},
  {image:'tofukuji.jpg',label:'洛南・洛北',caption:'東福寺',alt:'東福寺的秋日紅葉',memo:'把出町柳當作午餐與轉乘的休息站。'},
  {image:'gyoen.jpg',label:'御苑・換宿',caption:'京都御苑',alt:'京都御苑的秋色',memo:'帶行李移宿，先核對京蘭無幻邸的確切棟別。'},
  {image:'arashiyama.jpg',label:'嵐山水路',caption:'嵐山・渡月橋',alt:'嵐山渡月橋與山色',memo:'小火車與遊船依預約銜接，傍晚搭車返回京都。'},
  {image:'kiyomizu.jpg',label:'京都散策',caption:'清水寺秋色',alt:'清水寺的秋日景色',memo:'今天仍住京都，慢慢散策；明早才退房取車。'},
  {image:'katsuoji.jpg',label:'達摩與港都',caption:'勝尾寺達摩',alt:'勝尾寺的紅色達摩',memo:'從京都出發經勝尾寺直達神戶，抵達後停車放慢步調。'},
  {image:'suma.jpg',label:'神戶返程',caption:'神戶須磨海洋世界',alt:'神戶須磨海洋世界的水族館',memo:'返程日以報到時間為界，前面的活動保留機動。'}
];
const $=id=>document.getElementById(id);
function el(tag,cls,value){const n=document.createElement(tag);if(cls)n.className=cls;if(value!==undefined)n.textContent=value;return n;}
function external(label,url,cls=''){const a=el('a',cls,label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function mapLink(label,query){return external(label+' ↗','https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query),'map');}
function detailCard(title,items,cls){const card=el('section','detail-card '+cls);card.append(el('h4','',title));const list=el('ul');items.forEach(item=>list.append(el('li','',item)));card.append(list);return card;}
const illustratedMaps={
  1:[
    {src:'assets/day2-amanohashidate-town.svg',title:'天橋立・站前散步地圖',alt:'天橋立站前手繪街道圖，以插畫標出車站、View Land、智恩寺和智惠之餅。',places:[
      ['天橋立站','天橋立駅','站前散步地標'],['View Land','天橋立 View Land','吊椅上山看飛龍觀'],['智恩寺','智恩寺 天橋立','沙洲入口旁的寺院'],['智惠之餅','智恩寺 勘七茶屋','當地名物甜點']
    ],note:'站前小區域的手繪示意，步行時間請以實際導航為準。'},
    {src:'assets/day2-ine-harbor.svg',title:'伊根灣・舟屋與海風地圖',alt:'伊根灣手繪海岸圖，標出遊覽船碼頭、舟屋街景及 INE CAFE。',places:[
      ['伊根灣遊覽船','伊根湾めぐり遊覧船','乘船約 25 分鐘'],['舟屋街景','伊根舟屋','沿岸散步'],['INE CAFE','INE CAFE 伊根','週三僅外帶飲料與冰淇淋']
    ],note:'跟團停留時間以當日安排為準；遊覽船碼頭至 INE CAFE 步行約 25 分鐘，若時間不足可略過。'}
  ],
  4:[
    {src:'assets/day5-arashiyama.svg',title:'嵐山・小火車與保津川',alt:'紅黑色嵯峨野小火車穿過秋日山谷，木造長舟沿保津川而下，渡月橋橫跨河面；附行程能量雷達圖和三則提醒。',places:[
      ['嵐山小火車','トロッコ嵯峨駅','紅葉車窗與山谷'],['保津川遊船','保津川下り 乗船場','木舟賞峽谷'],['渡月橋','渡月橋 京都','嵐山代表景色']
    ],note:'車次、船班與乘船碼頭請依預約資訊與當日天候核對。'}
  ],
  5:[
    {src:'assets/day6-kiyomizu-lanes.svg',title:'清水寺・東山坂道地圖',alt:'清水寺周邊手繪街道圖，畫出清水寺、清水坂、二年坂、三年坂和茶屋點心。',places:[
      ['清水寺','清水寺 京都','清晨參拜'],['二年坂','二年坂 京都','石板路與町家街景'],['三年坂','三年坂 京都','坂道散步'],['茶屋點心','清水坂 京都','沿途街景插畫，非指定店家']
    ],note:'清水寺一帶為坡道；茶屋點心圖只代表街景，請按當日營業店家選擇。'},
    {src:'assets/day6-central-kyoto.svg',title:'京都市中心・神社與美食地圖',alt:'京都市中心手繪街道圖，以鳥居、店舖、甜點和壽喜燒插畫標出御金神社、然花抄院及三嶋亭本店。',places:[
      ['御金神社','御金神社 京都','金色鳥居'],['然花抄院','然花抄院 室町本店 京都','甜點候選'],['三嶋亭本店','三嶋亭 本店 京都','壽喜燒午餐候選']
    ],note:'市中心小區域的手繪示意，店家營業與訂位請出發前核對。'}
  ]
};
function illustratedMap(config,printable){
  const section=el('section','illustrated-map'),heading=el('div','sketch-heading');
  heading.append(el('p','mini-label','手繪旅行地圖'),el('h4','',config.title));section.append(heading);
  const posterUrl=config.src+'?v=poster-5';
  const layout=el('div','illustrated-map-layout'),figure=el('figure','sketch-paper'),img=el('img'),enlarge=external('',posterUrl,'sketch-image-link');
  enlarge.setAttribute('aria-label','放大手繪地圖：'+config.title);
  img.src=posterUrl;img.alt=config.alt;img.loading=printable?'eager':'lazy';img.width=800;img.height=1000;
  enlarge.append(img);figure.append(enlarge,el('figcaption','','沿著路線，收集今天的風景'));
  const legend=el('div','sketch-legend');legend.append(el('p','sketch-intro','圖上編號對照以下地點，點選可查看實際位置。'));
  const list=el('ol','sketch-places');config.places.forEach(([name,query,description])=>{const item=el('li');const copy=el('span');copy.append(el('strong','',name),el('small','',description));item.append(copy,mapLink('查看地圖',query));list.append(item);});legend.append(list);
  legend.append(el('p','sketch-caveat',config.note));if(!printable)legend.append(external('放大插畫 ↗',posterUrl,'sketch-zoom'));
  layout.append(figure,legend);section.append(layout);return section;
}
function journalPage(i,printable=false){
  const day=days[i],chapter=chapters[i],page=el('div',printable?'day-print':'day-content');
  const header=el('div','page-header'),heading=el('div','day-heading'),number=el('span','day-number',String(i+1).padStart(2,'0'));number.prepend(el('small','','DAY'));
  const title=el('div');title.append(el('h3','',day.title),el('p','',day.area));heading.append(number,title);header.append(heading);
  const stamp=el('span','date-stamp',day.date);stamp.append(el('small','','2026 KYOTO JOURNAL'));header.append(stamp);page.append(header);
  const lodging=el('p','stay-line','⌂ 住宿｜'+day.stay);page.append(lodging);
  const route=el('div','route-section');route.append(el('p','mini-label','TODAY’S ROUTE / 今日動線'));const steps=el('ol','route-line');day.route.forEach(s=>steps.append(el('li','',s)));route.append(steps);page.append(route);
  if(!printable)page.append(cameraGuide(i));
  if(illustratedMaps[i])illustratedMaps[i].forEach(config=>page.append(illustratedMap(config,printable)));
  const columns=el('div','journal-columns'),timeline=el('div','timeline');
  day.stops.forEach((stop,n)=>{const [time,name,description,query]=stop,card=el('section','stop'+(/交通|巴士|特急|HARUKA|取行李|還車|自駕|租車/.test(name)?' transit':''));card.append(el('span','stop-number',String(n+1)));const content=el('div','stop-content');content.append(el('div','time',time),el('h4','',name),el('p','',description));const links=el('div','map-links');links.append(mapLink('查看地圖',query));content.append(links);card.append(content);timeline.append(card);});columns.append(timeline);
  const side=el('aside','scrapbook'),photo=el('figure','photo-frame'),img=el('img');img.src='assets/'+chapter.image;img.alt=chapter.alt;img.loading=printable?'eager':'lazy';photo.append(img,el('figcaption','',chapter.caption));side.append(photo);
  const memo=el('div','memo-card');memo.append(el('h4','','旅途小筆記'),el('p','',chapter.memo));side.append(memo);
  const tip=el('div','memo-card');tip.append(el('h4','','出發前提醒'),el('p','',day.tip));side.append(tip);columns.append(side);page.append(columns);
  const details=el('div','detail-grid');details.append(detailCard('🚃 交通與估價',day.transport,'transport-detail'),detailCard('🍡 美食・甜點・伴手禮',day.food,'food-detail'));page.append(details);
  const source=el('div','day-sources');source.append(el('strong','','查核連結：'));day.source.forEach(([label,url],n)=>{if(n)source.append(' · ');source.append(external(label,url));});page.append(source);
  if(!printable){const note=el('div','journal-note'),label=el('label','','我的旅行筆記'),status=el('span','note-status','儲存在此瀏覽器');label.htmlFor='day-note-'+i;label.append(status);const box=el('textarea');box.id='day-note-'+i;box.placeholder='記下訂位、車次與想吃的東西…';try{box.value=localStorage.getItem('kyoto-day-note-'+i)||'';}catch{status.textContent='無法使用本機儲存';}box.addEventListener('input',()=>{try{localStorage.setItem('kyoto-day-note-'+i,box.value);status.textContent='已儲存';}catch{status.textContent='無法儲存';}});note.append(label,box);page.append(note);}
  page.append(el('p','page-foot','京都・神戶秋日旅行手帳 / '+String(i+1).padStart(2,'0')));return page;
}
const tabs=$('tabs'),panel=$('panel');let selected=0;
function showDay(i,focus=false){selected=i;[...tabs.children].forEach((tab,n)=>{tab.setAttribute('aria-selected',String(i===n));tab.tabIndex=i===n?0:-1;});panel.setAttribute('aria-labelledby','day-'+i);panel.replaceChildren(journalPage(i));$('previous-day').disabled=i===0;$('next-day').disabled=i===days.length-1;$('page-position').textContent=String(i+1).padStart(2,'0')+' / 08';if(focus){tabs.children[i].focus();tabs.children[i].scrollIntoView({block:'nearest',inline:'nearest'});}}
days.forEach((day,i)=>{const tab=el('button','tab');tab.type='button';tab.id='day-'+i;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','panel');tab.append(el('strong','','DAY '+String(i+1).padStart(2,'0')+' · '+day.date),el('span','',day.short));tab.addEventListener('click',()=>showDay(i));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%days.length;if(e.key==='ArrowLeft')next=(i+days.length-1)%days.length;if(e.key==='Home')next=0;if(e.key==='End')next=days.length-1;if(next!==undefined){e.preventDefault();showDay(next,true);}});tabs.append(tab);});showDay(0);
chapters.forEach((chapter,i)=>{const card=el('button','chapter');card.type='button';card.setAttribute('aria-label','開啟第 '+(i+1)+' 天：'+days[i].title);const img=el('img');img.src='assets/'+chapter.image;img.alt='';img.loading='lazy';const copy=el('span','chapter-copy'),label=el('span','chapter-label');label.append(el('span','','DAY '+String(i+1).padStart(2,'0')),el('span','',days[i].date));copy.append(label,el('span','chapter-title',days[i].title),el('span','chapter-desc',chapter.label),el('span','chapter-arrow','↗'));card.append(img,copy);card.addEventListener('click',()=>{showDay(i);$('journey').scrollIntoView({behavior:'smooth'});});$('chapter-list').append(card);});
$('previous-day').addEventListener('click',()=>{if(selected>0){showDay(selected-1);$('journey').scrollIntoView({behavior:'smooth'});}});
$('next-day').addEventListener('click',()=>{if(selected<7){showDay(selected+1);$('journey').scrollIntoView({behavior:'smooth'});}});
const pack=[['passport','護照、機票與住宿確認書'],['internet','網路、行動電源與轉接頭'],['clothes','保暖外套、舒適步行鞋'],['money','日圓現金、信用卡與交通卡'],['bookings','KKday 團、嵐山小火車、遊船、餐廳與租車預約'],['umbrella','雨具與保溫水壺']];
let saved={};try{const v=JSON.parse(localStorage.getItem('kyoto-autumn-packing-v1')||'{}');if(v&&typeof v==='object')saved=v;}catch{$('storage-message').textContent='本機儲存暫時無法使用';}
for(const [key,title] of pack){const label=el('label','packing'),check=el('input');check.type='checkbox';check.checked=saved[key]===true;check.addEventListener('change',()=>{saved[key]=check.checked;try{localStorage.setItem('kyoto-autumn-packing-v1',JSON.stringify(saved));}catch{$('storage-message').textContent='本機儲存暫時無法使用';}});label.append(check,el('span','',title));$('packing-list').append(label);}
const credits=[['平安神宮','https://commons.wikimedia.org/wiki/File:%E5%B9%B3%E5%AE%89%E7%A5%9E%E5%AE%AE_01.JPG','Maechan0360','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/'],['天橋立','https://commons.wikimedia.org/wiki/File:Amanohashidate_20211008160710_(51811911021).jpg','inunami','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/'],['東福寺','https://commons.wikimedia.org/wiki/File:Tofukuji_Kyoto01bs3200.jpg','663highland','CC BY 2.5','https://creativecommons.org/licenses/by/2.5/'],['京都御苑','https://commons.wikimedia.org/wiki/File:Various_autumn_trees_at_Kyoto_Gyoen_National_Garden_in_Kyoto,_Japan_(2019)_-_116.jpg','Another Believer','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/'],['嵐山','https://commons.wikimedia.org/wiki/File:Togetsu_bridge_and_Arashiyama_hills_under_the_rain_(Kyoto,_Japan)_(3262583370).jpg','KimonBerlin','CC BY-SA 2.0','https://creativecommons.org/licenses/by-sa/2.0/'],['清水寺','https://commons.wikimedia.org/wiki/File:Kiyomizudera_autumn.jpg','lumoplank','CC0','https://creativecommons.org/publicdomain/zero/1.0/'],['勝尾寺','https://commons.wikimedia.org/wiki/File:Katsuo-ji_daruma.jpg','Chris Gladis','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/'],['神戶須磨海洋世界','https://commons.wikimedia.org/wiki/File:Kobe_Suma_Sea_World_5.jpg','Totti','CC BY-SA 4.0','https://creativecommons.org/licenses/by-sa/4.0/']];
credits.forEach(([name,url,author,license,terms])=>{const line=el('p');line.append(name+'：',external(author,url),' · ',external(license,terms));$('photo-credits').append(line);});
const printPages=el('div','print-pages');printPages.setAttribute('aria-hidden','true');for(let i=0;i<days.length;i++)printPages.append(journalPage(i,true));$('journey').append(printPages);
