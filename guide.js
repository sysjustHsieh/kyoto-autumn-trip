const chapters = [
  {image:'heian.jpg',label:'岡崎・洛東',caption:'平安神宮',photo:'平安神宮・參考景色',route:['京都站','平安神宮','南禪寺','永觀堂'],memo:'晚上的永觀堂是這天的重點。把排隊和回程巴士的時間留進行程。'},
  {image:'amanohashidate.jpg',label:'海之京都',caption:'天橋立 View Land',photo:'天橋立 View Land・參考景色',route:['京都站','天橋立','伊根舟屋','京都站'],memo:'帶上交通票券與班次截圖。天橋立、伊根之間要留意巴士銜接。'},
  {image:'tofukuji.jpg',label:'洛南・洛北',caption:'東福寺',photo:'東福寺・參考景色',route:['京都站','東福寺','出町柳','詩仙堂','圓光寺'],memo:'午餐安排在鴨川周邊；洛北的兩座寺院，慢慢走、慢慢看。'},
  {image:'gyoen.jpg',label:'京都中心',caption:'京都御苑',photo:'京都御苑・參考景色',route:['京都站','京都御苑','京都站'],memo:'離境日先確認退房與交通時間；伴手禮採買留在車站周邊。'}
];
const $ = id => document.getElementById(id);
function el(tag, cls, value) {
  const node=document.createElement(tag);
  if(cls) node.className=cls;
  if(value!==undefined) node.textContent=value;
  return node;
}
function mapLink(label,query){
  const a=el('a','map',label+' 地圖 ↗');
  a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);
  a.target='_blank';a.rel='noopener noreferrer';
  a.setAttribute('aria-label','開啟'+label+'的 Google 地圖');
  return a;
}
function journalPage(index, printable=false){
  const day=days[index],chapter=chapters[index];
  const page=el('div',printable?'day-print':'day-content');
  const header=el('div','page-header'),heading=el('div','day-heading'),number=el('span','day-number',String(index+1).padStart(2,'0'));
  number.prepend(el('small','', 'DAY'));
  const title=el('div');title.append(el('h3','',day.title),el('p','',day.area));heading.append(number,title);header.append(heading);
  const stamp=el('span','date-stamp',day.date||'草稿');stamp.append(el('small','','KYOTO JOURNAL'));header.append(stamp);page.append(header);
  if(chapter){
    const route=el('div','route-section');route.append(el('p','mini-label','TODAY’S ROUTE / 今日路線'));
    const list=el('ol','route-line');for(const stop of chapter.route)list.append(el('li','',stop));route.append(list);page.append(route);
  }
  const columns=el('div','journal-columns'),timeline=el('div','timeline');
  for(const [i,stop] of day.stops.entries()){
    const [time,name,description,query,extra]=stop;
    const transit=/→|移動|排隊|返程|退房/.test(name);
    const card=el('section','stop'+(transit?' transit':''));
    card.append(el('span','stop-number',String(i+1)));
    const content=el('div','stop-content');content.append(el('div','time',time),el('h4','',name),el('p','',description));
    const links=el('div','map-links');links.append(mapLink(name,query));if(extra)links.append(mapLink(extra[0],extra[1]));content.append(links);card.append(content);timeline.append(card);
  }
  columns.append(timeline);
  const side=el('aside','scrapbook');
  if(chapter){
    const photo=el('figure','photo-frame'),img=el('img');img.src='assets/'+chapter.image;img.alt=chapter.photo;img.loading=printable?'eager':'lazy';img.width=1280;img.height=850;
    const caption=el('figcaption','',chapter.caption);caption.append(el('span','photo-sub','PHOTO NOTE · '+chapter.label));photo.append(img,caption);side.append(photo);
    const memo=el('div','memo-card');memo.append(el('h4','','✿ 今日小提醒'),el('p','',chapter.memo));side.append(memo);
  }else{
    const sketch=el('div','mini-art'),img=el('img');img.src='assets/kyoto-autumn-illustration.png';img.alt='手繪京都秋日風景';img.loading='lazy';sketch.append(img);side.append(sketch);
    const memo=el('div','memo-card');memo.append(el('h4','','✿ 草稿提醒'),el('p','','這天仍是原先的行程草稿，日期與交通待安排。'));side.append(memo);
  }
  const tip=el('div','memo-card');tip.append(el('h4','','旅人筆記'),el('p','',day.tip));side.append(tip);columns.append(side);page.append(columns);
  if(!printable){
    const note=el('div','journal-note'),label=el('label','', '留給今天的一句話'),status=el('span','note-status','僅儲存在此瀏覽器');
    label.htmlFor='day-note-'+index;label.append(status);
    const box=el('textarea');box.id='day-note-'+index;box.placeholder='想吃的店、想買的東西、旅途中的小發現…';box.setAttribute('aria-label','第'+(index+1)+'天的旅行筆記');
    try{box.value=localStorage.getItem('kyoto-day-note-'+index)||'';}catch{status.textContent='此瀏覽器無法儲存';}
    box.addEventListener('input',()=>{try{localStorage.setItem('kyoto-day-note-'+index,box.value);status.textContent='已儲存於此瀏覽器';}catch{status.textContent='此瀏覽器無法儲存';}});
    note.append(label,box);page.append(note);
  }
  page.append(el('p','page-foot','京都秋日 · 旅のしおり　 /　'+String(index+1).padStart(2,'0')));
  return page;
}
const tabs=$('tabs'),panel=$('panel');let selected=0;
function showDay(index,focus=false){
  selected=index;for(const [i,tab] of [...tabs.children].entries()){
    tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;
  }
  panel.setAttribute('aria-labelledby','day-'+index);panel.replaceChildren(journalPage(index));
  $('previous-day').disabled=index===0;$('next-day').disabled=index===days.length-1;
  $('page-position').textContent=String(index+1).padStart(2,'0')+' / '+String(days.length).padStart(2,'0');
  if(focus){tabs.children[index].focus();tabs.children[index].scrollIntoView({block:'nearest',inline:'nearest'});}
}
days.forEach((day,i)=>{
  const tab=el('button','tab');tab.type='button';tab.id='day-'+i;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','panel');
  tab.append(el('strong','','DAY '+String(i+1).padStart(2,'0')+(day.date?' · '+day.date:'')),el('span','',day.short));
  tab.addEventListener('click',()=>showDay(i));
  tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%days.length;if(event.key==='ArrowLeft')next=(i+days.length-1)%days.length;if(event.key==='Home')next=0;if(event.key==='End')next=days.length-1;if(next!==undefined){event.preventDefault();showDay(next,true);}});
  tabs.append(tab);
});showDay(0);
chapters.forEach((chapter,i)=>{
  const card=el('button','chapter');card.type='button';card.setAttribute('aria-label','查看第'+(i+1)+'天：'+days[i].title);
  const image=el('img');image.src='assets/'+chapter.image;image.alt='';image.loading='lazy';image.width=1280;image.height=850;
  const copy=el('span','chapter-copy'),label=el('span','chapter-label');label.append(el('span','','DAY '+String(i+1).padStart(2,'0')),el('span','',days[i].date));
  copy.append(label,el('span','chapter-title',days[i].title),el('span','chapter-desc',chapter.label),el('span','chapter-arrow','↗'));
  card.append(image,copy);card.addEventListener('click',()=>{showDay(i);$('journey').scrollIntoView({behavior:'smooth'});});$('chapter-list').append(card);
});
$('previous-day').addEventListener('click',()=>{if(selected>0){showDay(selected-1);$('journey').scrollIntoView({behavior:'smooth'});}});
$('next-day').addEventListener('click',()=>{if(selected<days.length-1){showDay(selected+1);$('journey').scrollIntoView({behavior:'smooth'});}});
$('print-guide').addEventListener('click',()=>window.print());
const pack=[['passport','護照、機票與住宿確認'],['internet','手機網路、充電器與行動電源'],['clothes','保暖外套與好走的鞋'],['money','日圓、信用卡與交通卡'],['umbrella','雨具、常用藥與水瓶']];
let saved={};try{const data=JSON.parse(localStorage.getItem('kyoto-autumn-packing-v1')||'{}');if(data&&typeof data==='object'&&!Array.isArray(data))saved=data;}catch{$('storage-message').textContent='目前無法讀取儲存的清單。';}
for(const [key,title] of pack){const label=el('label','packing'),check=el('input');check.type='checkbox';check.checked=saved[key]===true;check.addEventListener('change',()=>{saved[key]=check.checked;try{localStorage.setItem('kyoto-autumn-packing-v1',JSON.stringify(saved));}catch{$('storage-message').textContent='此瀏覽器無法儲存清單。';}});label.append(check,el('span','',title));$('packing-list').append(label);}
const credits=[
  ['平安神宮','heian','Maechan0360','CC BY-SA 3.0'],
  ['天橋立','amanohashidate','inunami','CC BY 2.0'],
  ['東福寺','tofukuji','663highland','CC BY 2.5'],
  ['京都御苑','gyoen','Another Believer','CC BY-SA 4.0']
];
const sources={heian:'https://commons.wikimedia.org/wiki/File:%E5%B9%B3%E5%AE%89%E7%A5%9E%E5%AE%AE_01.JPG',amanohashidate:'https://commons.wikimedia.org/wiki/File:Amanohashidate_20211008160710_(51811911021).jpg',tofukuji:'https://commons.wikimedia.org/wiki/File:Tofukuji_Kyoto01bs3200.jpg',gyoen:'https://commons.wikimedia.org/wiki/File:Various_autumn_trees_at_Kyoto_Gyoen_National_Garden_in_Kyoto,_Japan_(2019)_-_116.jpg'};
const licenseUrls={'CC BY-SA 3.0':'https://creativecommons.org/licenses/by-sa/3.0/','CC BY 2.0':'https://creativecommons.org/licenses/by/2.0/','CC BY 2.5':'https://creativecommons.org/licenses/by/2.5/','CC BY-SA 4.0':'https://creativecommons.org/licenses/by-sa/4.0/'};
for(const [title,id,author,license] of credits){
  const line=el('p'),source=el('a','',author),terms=el('a','',license);
  source.href=sources[id];terms.href=licenseUrls[license];
  for(const link of [source,terms]){link.target='_blank';link.rel='noopener noreferrer';}
  line.append(title+'：',source,' · ',terms,'（網站以縮圖顯示）');$('photo-credits').append(line);
}
const printPages=el('div','print-pages');printPages.setAttribute('aria-hidden','true');for(let i=0;i<4;i++)printPages.append(journalPage(i,true));$('journey').append(printPages);
