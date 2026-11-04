// The public REST endpoint exposes the same JMC spot data as Japan in Seasons' koyo_spots MCP tool.
const koyoPrefectures = ['Kyoto', 'Osaka'];
const koyoSpots = [
  { code: '26360007', pref: 'Kyoto', name: '永觀堂', day: 'DAY 01 · 12/1', visit: '2026-12-01' },
  { code: '26360009', pref: 'Kyoto', name: '東福寺通天橋', day: 'DAY 03 · 12/3', visit: '2026-12-03' },
  { code: '26360046', pref: 'Kyoto', name: '圓光寺', day: 'DAY 03 · 12/3', visit: '2026-12-03' },
  { code: '26360011', pref: 'Kyoto', name: '嵐山', day: 'DAY 05 · 12/5', visit: '2026-12-05' },
  { code: '26360021', pref: 'Kyoto', name: '保津峽谷（遊船沿線）', day: 'DAY 05 · 12/5', visit: '2026-12-05' },
  { code: '26360015', pref: 'Kyoto', name: '清水寺', day: 'DAY 06 · 12/6', visit: '2026-12-06' },
  { code: '27360008', pref: 'Osaka', name: '勝尾寺', day: 'DAY 07 · 12/7', visit: '2026-12-07' }
];
const koyoDayPlaces = [
  [{ name: '平安神宮' }, { name: '南禪寺' }, { name: '永觀堂', code: '26360007' }],
  [{ name: '天橋立 View Land' }, { name: '伊根舟屋' }],
  [{ name: '東福寺通天橋', code: '26360009' }, { name: '詩仙堂' }, { name: '圓光寺', code: '26360046' }],
  [{ name: '京都御苑' }],
  [{ name: '保津峽谷（遊船沿線）', code: '26360021' }, { name: '嵐山', code: '26360011' }],
  [{ name: '清水寺', code: '26360015' }, { name: '御金神社' }],
  [{ name: '勝尾寺', code: '27360008' }],
  [{ name: '神戶須磨海洋世界' }, { name: '神戶動物王國' }]
];
const koyoCacheKey = 'trip-koyo-spots-v1';
const koyoMaxAge = 12 * 60 * 60 * 1000;
const koyoReportMaxAge = 48 * 60 * 60 * 1000;
let koyoPending = null;
let koyoCurrentData = null;

function koyoShortDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return null;
  return `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
}

function buildKoyoCards() {
  const container = document.getElementById('koyo-spots');
  koyoSpots.forEach(spot => {
    const card = document.createElement('article');
    card.className = 'koyo-spot';
    card.dataset.koyoCode = spot.code;
    card.innerHTML = '<p class="koyo-spot-day"></p><h4></h4><div class="koyo-reading"><span class="koyo-leaf" aria-hidden="true"></span><div><strong class="koyo-status">讀取中…</strong><span class="koyo-report-date"></span></div></div><p class="koyo-window"></p><p class="koyo-visit"></p>';
    card.querySelector('.koyo-spot-day').textContent = spot.day;
    card.querySelector('h4').textContent = spot.name;
    container.append(card);
  });
}

function readKoyoCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(koyoCacheKey));
    if (cached && Number.isFinite(cached.fetchedAt) && cached.fetchedAt <= Date.now() &&
        Date.now() - cached.fetchedAt < 7 * 24 * 60 * 60 * 1000 && cached.datasets) return cached;
  } catch { /* Storage may be unavailable. */ }
  return null;
}

function koyoVisitText(spot, data) {
  const visit = Date.parse(spot.visit);
  const start = Date.parse(String(data.bestStart).slice(0, 10));
  const end = Date.parse(String(data.bestEnd).slice(0, 10));
  if (![visit, start, end].every(Number.isFinite)) return '';
  if (visit < start) return '行程早於預測見頃';
  if (visit > end) return '行程晚於預測見頃';
  return '行程落在預測見頃';
}

function koyoSpotData(spot, datasets) {
  const data = datasets?.[spot.pref]?.spots?.find(item => item.code === spot.code);
  return data && String(data.bestPeak || '').startsWith('2026-') ? data : null;
}

function koyoReportInfo(data) {
  const reportAge = Date.now() - Date.parse(data.reportUpdated);
  const recent = Number.isFinite(reportAge) && reportAge >= 0 && reportAge <= koyoReportMaxAge;
  const states = { 0: ['green', '青葉'], 1: ['yellow', '開始轉色'], 2: ['red', '見頃'], 3: ['past', '見頃已過'] };
  const state = recent ? states[data.reportState] : null;
  return { color: state?.[0] || '', label: state?.[1] || '近期葉色回報暫缺',
    date: state ? `${koyoShortDate(data.reportUpdated)} 景點回報` : '' };
}

function renderDayKoyo(scope = document) {
  const section = scope.querySelector('.day-koyo[data-day-index]');
  if (!section) return;
  const dayIndex = Number(section.dataset.dayIndex);
  const places = koyoDayPlaces[dayIndex] || [];
  const heading = document.createElement('div');
  heading.className = 'day-koyo-heading';
  const title = document.createElement('h4');
  title.textContent = '今日景點楓況';
  const note = document.createElement('span');
  note.textContent = '葉色回報與見頃預測';
  heading.append(title, note);
  const list = document.createElement('div');
  list.className = 'day-koyo-list';
  places.forEach(place => {
    const row = document.createElement('div');
    row.className = 'day-koyo-row';
    const leaf = document.createElement('span');
    leaf.className = 'koyo-leaf';
    leaf.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = place.name;
    const status = document.createElement('span');
    status.className = 'day-koyo-status';
    const detail = document.createElement('small');
    const spot = koyoSpots.find(item => item.code === place.code);
    const data = spot && koyoSpotData(spot, koyoCurrentData);
    if (data) {
      const report = koyoReportInfo(data);
      if (report.color) row.classList.add(`koyo-${report.color}`);
      status.textContent = `${report.label}${report.date ? ` · ${report.date}` : ''}`;
      const start = koyoShortDate(data.bestStart);
      const end = koyoShortDate(data.bestEnd);
      detail.textContent = start && end ? `預測見頃 ${start}–${end} · ${koyoVisitText(spot, data)}` : '尚無見頃日期';
    } else if (spot && !koyoCurrentData?.[spot.pref]) {
      status.textContent = koyoCurrentData ? '資料暫時無法讀取' : '讀取中…';
    } else {
      status.textContent = '無此景點楓況資料';
    }
    copy.append(name, status, detail);
    row.append(leaf, copy);
    list.append(row);
  });
  const source = document.createElement('a');
  source.href = 'https://seasons.kooexperience.com/autumn-leaves-forecast';
  source.target = '_blank';
  source.rel = 'noopener noreferrer';
  source.textContent = 'Japan in Seasons 資料來源';
  section.replaceChildren(heading, list, source);
}

function renderKoyo(datasets, stale = false) {
  koyoCurrentData = datasets;
  let available = 0;
  koyoSpots.forEach(spot => {
    const card = document.querySelector(`[data-koyo-code="${spot.code}"]`);
    const data = koyoSpotData(spot, datasets);
    card.classList.remove('koyo-green', 'koyo-yellow', 'koyo-red', 'koyo-past');
    if (!data) {
      card.querySelector('.koyo-status').textContent = '景點資料暫缺';
      card.querySelector('.koyo-report-date').textContent = '';
      card.querySelector('.koyo-window').textContent = '請參考來源網站';
      card.querySelector('.koyo-visit').textContent = '';
      return;
    }
    available++;
    const report = koyoReportInfo(data);
    if (report.color) card.classList.add(`koyo-${report.color}`);
    card.querySelector('.koyo-status').textContent = report.label;
    card.querySelector('.koyo-report-date').textContent = report.date;
    const start = koyoShortDate(data.bestStart);
    const end = koyoShortDate(data.bestEnd);
    const peak = koyoShortDate(data.bestPeak);
    card.querySelector('.koyo-window').textContent = start && end
      ? `預測見頃 ${start}–${end}${peak ? ` · 高峰約 ${peak}` : ''}` : '尚無見頃日期';
    card.querySelector('.koyo-visit').textContent = koyoVisitText(spot, data);
  });
  document.getElementById('koyo-update').textContent = available
    ? `${available} 個行程景點${stale ? ' · 暫用快取' : ''}` : '景點資料暫時無法讀取';
  renderDayKoyo(document);
}

async function updateKoyo() {
  if (koyoPending) return koyoPending;
  const cached = readKoyoCache();
  if (cached && Date.now() - cached.fetchedAt < koyoMaxAge) {
    renderKoyo(cached.datasets);
    return;
  }
  koyoPending = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      let responses;
      try {
        responses = await Promise.all(koyoPrefectures.map(pref =>
          fetch(`https://seasons.kooexperience.com/api/koyo/spots?pref=${pref}`, { signal: controller.signal })));
      } finally { clearTimeout(timer); }
      if (responses.some(response => !response.ok)) throw new Error('Forecast request failed');
      const [kyoto, osaka] = await Promise.all(responses.map(response => response.json()));
      if (!Array.isArray(kyoto.spots) || !Array.isArray(osaka.spots)) throw new Error('Invalid spot data');
      const datasets = { Kyoto: kyoto, Osaka: osaka };
      renderKoyo(datasets);
      try { localStorage.setItem(koyoCacheKey, JSON.stringify({ fetchedAt: Date.now(), datasets })); }
      catch { /* Storage may be unavailable. */ }
    } catch {
      if (cached) renderKoyo(cached.datasets, true);
      else renderKoyo({});
    }
  })();
  try { await koyoPending; } finally { koyoPending = null; }
}

buildKoyoCards();
window.renderDayKoyo = renderDayKoyo;
renderDayKoyo(document);
updateKoyo();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateKoyo();
});
