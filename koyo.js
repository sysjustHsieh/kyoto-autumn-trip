// Japan in Seasons publishes JMC's city observation-tree forecast as public JSON.
const koyoUrl = 'https://seasons.kooexperience.com/api/koyo/forecast';
const koyoCacheKey = 'trip-koyo-forecast-v1';
const koyoMaxAge = 12 * 60 * 60 * 1000;
const koyoTripYear = 2026;
let koyoPending = null;

function koyoShortDate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return null;
  return `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`;
}

function readKoyoCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(koyoCacheKey));
    if (cached && Number.isFinite(cached.fetchedAt) && cached.fetchedAt <= Date.now() &&
        Date.now() - cached.fetchedAt < 7 * 24 * 60 * 60 * 1000 &&
        cached.data && Array.isArray(cached.data.regions)) return cached;
  } catch { /* Storage may be unavailable. */ }
  return null;
}

function renderKoyo(data, cached = false) {
  const issued = data.freshness?.issued || data.lastUpdated;
  const issuedDate = koyoShortDate(issued);
  const currentSeason = Number(String(issued || '').slice(0, 4)) === koyoTripYear;
  const cities = data.regions.flatMap(region => Array.isArray(region.cities) ? region.cities : []);
  document.querySelectorAll('[data-koyo-city]').forEach(card => {
    const city = cities.find(item => item.nameEn === card.dataset.koyoCity);
    const forecast = currentSeason ? city?.maple?.forecast : null;
    const date = koyoShortDate(forecast);
    card.querySelector('.koyo-date').textContent = date ? `${date} 預測楓紅` : '尚無本季預測';
    const difference = city?.maple?.normalDiffDays;
    card.querySelector('.koyo-detail').textContent = date && Number.isFinite(difference)
      ? difference > 0 ? `較平年晚約 ${difference} 天` : difference < 0 ? `較平年早約 ${Math.abs(difference)} 天` : '約與平年相同'
      : '請參考來源網站的最新資訊';
  });
  document.getElementById('koyo-update').textContent = currentSeason && issuedDate
    ? `2026/${issuedDate} 發布${cached ? ' · 暫用快取' : ''}`
    : '等待 2026 年預測資料';
}

async function updateKoyo() {
  if (koyoPending) return koyoPending;
  const cached = readKoyoCache();
  if (cached && Date.now() - cached.fetchedAt < koyoMaxAge) {
    renderKoyo(cached.data);
    return;
  }
  koyoPending = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      let response;
      try { response = await fetch(koyoUrl, { signal: controller.signal }); }
      finally { clearTimeout(timer); }
      if (!response.ok) throw new Error(`Forecast HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.regions)) throw new Error('Invalid forecast data');
      renderKoyo(data);
      try { localStorage.setItem(koyoCacheKey, JSON.stringify({ fetchedAt: Date.now(), data })); }
      catch { /* Storage may be unavailable. */ }
    } catch {
      if (cached) renderKoyo(cached.data, true);
      else document.getElementById('koyo-update').textContent = '預測暫時無法讀取';
      if (!cached) document.querySelectorAll('.koyo-detail').forEach(item => { item.textContent = '請點下方資料來源查看'; });
    }
  })();
  try { await koyoPending; } finally { koyoPending = null; }
}

updateKoyo();
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) updateKoyo();
});
