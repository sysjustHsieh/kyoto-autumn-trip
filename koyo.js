// The public REST endpoint exposes the same JMC spot data as Japan in Seasons' koyo_spots MCP tool.
const koyoPrefectures = ['Kyoto', 'Osaka'];
const koyoSpots = [
  { code: '26360007', pref: 'Kyoto', name: '永觀堂', day: 'DAY 01 · 12/1', visit: '2026-12-01' },
  { code: '26360009', pref: 'Kyoto', name: '東福寺通天橋', day: 'DAY 03 · 12/3', visit: '2026-12-03' },
  { code: '26360046', pref: 'Kyoto', name: '圓光寺', day: 'DAY 03 · 12/3', visit: '2026-12-03' },
  { code: '26360011', pref: 'Kyoto', name: '嵐山', day: 'DAY 05 · 12/5', visit: '2026-12-05' },
  { code: '26360015', pref: 'Kyoto', name: '清水寺', day: 'DAY 06 · 12/6', visit: '2026-12-06' },
  { code: '27360008', pref: 'Osaka', name: '勝尾寺', day: 'DAY 07 · 12/7', visit: '2026-12-07' }
];
const koyoCacheKey = 'trip-koyo-spots-v1';
const koyoMaxAge = 12 * 60 * 60 * 1000;
const koyoReportMaxAge = 48 * 60 * 60 * 1000;
let koyoPending = null;

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

function renderKoyo(datasets, stale = false) {
  let available = 0;
  koyoSpots.forEach(spot => {
    const card = document.querySelector(`[data-koyo-code="${spot.code}"]`);
    const data = datasets[spot.pref]?.spots?.find(item => item.code === spot.code);
    const valid = data && String(data.bestPeak || '').startsWith('2026-');
    card.classList.remove('koyo-green', 'koyo-yellow', 'koyo-red', 'koyo-past');
    if (!valid) {
      card.querySelector('.koyo-status').textContent = '景點資料暫缺';
      card.querySelector('.koyo-report-date').textContent = '';
      card.querySelector('.koyo-window').textContent = '請參考來源網站';
      card.querySelector('.koyo-visit').textContent = '';
      return;
    }
    available++;
    const reportAge = Date.now() - Date.parse(data.reportUpdated);
    const recent = Number.isFinite(reportAge) && reportAge >= 0 && reportAge <= koyoReportMaxAge;
    const states = { 0: ['green', '青葉'], 1: ['yellow', '開始轉色'], 2: ['red', '見頃'], 3: ['past', '見頃已過'] };
    const state = recent ? states[data.reportState] : null;
    if (state) card.classList.add(`koyo-${state[0]}`);
    card.querySelector('.koyo-status').textContent = state ? state[1] : '近期葉色回報暫缺';
    card.querySelector('.koyo-report-date').textContent = recent ? `${koyoShortDate(data.reportUpdated)} 景點回報` : '';
    const start = koyoShortDate(data.bestStart);
    const end = koyoShortDate(data.bestEnd);
    const peak = koyoShortDate(data.bestPeak);
    card.querySelector('.koyo-window').textContent = start && end
      ? `預測見頃 ${start}–${end}${peak ? ` · 高峰約 ${peak}` : ''}` : '尚無見頃日期';
    card.querySelector('.koyo-visit').textContent = koyoVisitText(spot, data);
  });
  document.getElementById('koyo-update').textContent = available
    ? `${available} 個行程景點${stale ? ' · 暫用快取' : ''}` : '景點資料暫時無法讀取';
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
updateKoyo();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateKoyo();
});
