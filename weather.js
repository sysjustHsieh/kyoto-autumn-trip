// One request supplies current conditions and a short forecast for all three stops.
const weatherPlaces = [
  { area: 'kyoto', latitude: 35.0116, longitude: 135.7681 },
  { area: 'miyazu', latitude: 35.535, longitude: 135.195 },
  { area: 'kobe', latitude: 34.6901, longitude: 135.1955 }
];
const weatherCacheKey = 'trip-weather-open-meteo-v2';
const weatherMaxAge = 30 * 60 * 1000;
let weatherCache = null;
let weatherRequest = null;

function weatherText(code) {
  if (code === 0) return '晴';
  if ([1, 2].includes(code)) return '晴時多雲';
  if (code === 3) return '陰';
  if ([45, 48].includes(code)) return '有霧';
  if ([51, 53, 55, 56, 57].includes(code)) return '毛毛雨';
  if ([61, 63, 65, 66, 67].includes(code)) return '下雨';
  if ([71, 73, 75, 77].includes(code)) return '下雪';
  if ([80, 81, 82].includes(code)) return '陣雨';
  if ([85, 86].includes(code)) return '陣雪';
  if ([95, 96, 99].includes(code)) return '雷雨';
  return '天氣資料更新中';
}

function weatherKind(code, isDay = 1) {
  if (code === 0) return isDay ? 'sun' : 'moon';
  if ([1, 2].includes(code)) return isDay ? 'partly' : 'moon-cloud';
  if (code === 3) return 'cloud';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloud';
}

function weatherScene(code, isDay = 1) {
  const kind = weatherKind(code, isDay);
  const sun = '<g stroke="#d38b4d" stroke-width="3" stroke-linecap="round"><path d="M39 13v7M39 58v7M12 39h7M59 39h7M20 20l5 5M53 53l5 5M58 20l-5 5M25 53l-5 5"/></g><circle cx="39" cy="39" r="16" fill="#f6ca72" stroke="#d38b4d" stroke-width="2"/>';
  const moon = '<path d="M52 17a23 23 0 1 0 20 36 25 25 0 0 1-20-36Z" fill="#eed497" stroke="#b9955d" stroke-width="2"/><circle cx="25" cy="20" r="2" fill="#b9955d"/><circle cx="72" cy="25" r="2" fill="#b9955d"/>';
  const cloud = '<path d="M27 62c-9 0-15-6-15-14 0-7 5-13 12-14 3-11 13-18 24-16 9 1 16 7 19 15 11-1 20 6 20 16 0 8-7 13-16 13Z" fill="#d8e3e2" stroke="#829b9e" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 55h49" stroke="#f8faf5" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
  const rain = '<g fill="#77a4ad"><path d="M29 69l-5 11a4 4 0 0 0 7 2l4-13Z"/><path d="M49 69l-5 11a4 4 0 0 0 7 2l4-13Z"/><path d="M69 69l-5 11a4 4 0 0 0 7 2l4-13Z"/></g>';
  const snow = '<g stroke="#7fa9b7" stroke-width="2.5" stroke-linecap="round"><path d="M29 69v14m-7-7h14m-11-5 8 10m0-10-8 10M68 69v14m-7-7h14m-11-5 8 10m0-10-8 10"/></g>';
  const fog = '<g stroke="#8ba4a4" stroke-width="3" stroke-linecap="round"><path d="M17 68h62M27 77h46M20 85h57"/></g>';
  const storm = '<path d="m53 65-12 16h10l-5 13 20-23H54l8-13Z" fill="#e0ad5c" stroke="#b67f39" stroke-width="2" stroke-linejoin="round"/>';
  const scenes = {
    sun, moon, partly: `${sun}${cloud}`, 'moon-cloud': `${moon}${cloud}`,
    cloud, fog: `${cloud}${fog}`, rain: `${cloud}${rain}`,
    snow: `${cloud}${snow}`, storm: `${cloud}${storm}`
  };
  return `<svg viewBox="0 0 100 100" focusable="false" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#f3f1e7"/>${scenes[kind]}</svg>`;
}

function weatherTime(value) {
  // The API returns local Japan time because timezone=Asia/Tokyo is requested.
  return value ? `${Number(value.slice(5, 7))}/${Number(value.slice(8, 10))} ${value.slice(11, 16)}` : '時間不明';
}

function weatherNumber(value, suffix) {
  return Number.isFinite(value) ? `${Math.round(value)}${suffix}` : '—';
}

function readWeatherCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(weatherCacheKey));
    if (saved && Number.isFinite(saved.fetchedAt) && saved.fetchedAt <= Date.now() &&
        Date.now() - saved.fetchedAt < 24 * 60 * 60 * 1000 &&
        Array.isArray(saved.places) && saved.places.length === weatherPlaces.length) {
      return saved;
    }
  } catch { /* Private browsing may disable storage. */ }
  return null;
}

function weatherDayLabel(date, index) {
  const shortDate = `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`;
  return index === 0 ? `今天 ${shortDate}` : index === 1 ? `明天 ${shortDate}` : shortDate;
}

function renderWeather(places, stale = false) {
  document.querySelectorAll('.weather-place[data-weather-area]').forEach(card => {
    const index = weatherPlaces.findIndex(place => place.area === card.dataset.weatherArea);
    const data = places[index];
    if (!data?.current || !data?.daily?.time?.length) return;
    const current = data.current;
    const daily = data.daily;
    card.querySelector('.weather-illustration').innerHTML = weatherScene(current.weather_code, current.is_day);
    card.querySelector('.weather-current-temp').textContent = weatherNumber(current.temperature_2m, '°');
    card.querySelector('.weather-condition').textContent = weatherText(current.weather_code);
    card.querySelector('.weather-feels').textContent = `體感 ${weatherNumber(current.apparent_temperature, '°C')}`;
    card.querySelector('.weather-live-label').textContent = `日本時間 ${weatherTime(current.time)}${stale ? ' · 更新中' : ''}`;
    card.querySelector('.weather-days').innerHTML = daily.time.slice(0, 4).map((date, day) => `
      <div class="weather-day">
        <span class="weather-day-date">${weatherDayLabel(date, day)}</span>
        <span class="weather-illustration weather-illustration-small" aria-hidden="true">${weatherScene(daily.weather_code?.[day])}</span>
        <span class="weather-day-condition">${weatherText(daily.weather_code?.[day])}<small>降雨 ${weatherNumber(daily.precipitation_probability_max?.[day], '%')}</small></span>
        <strong>${weatherNumber(daily.temperature_2m_max?.[day], '°')} <span>/ ${weatherNumber(daily.temperature_2m_min?.[day], '°')}</span></strong>
      </div>`).join('');
  });
}

async function updateWeather() {
  if (weatherRequest || document.hidden) return weatherRequest;
  if (weatherCache && Date.now() - weatherCache.fetchedAt < weatherMaxAge) return;

  const params = new URLSearchParams({
    latitude: weatherPlaces.map(place => place.latitude).join(','),
    longitude: weatherPlaces.map(place => place.longitude).join(','),
    current: 'temperature_2m,apparent_temperature,weather_code,is_day',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',
    timezone: 'Asia/Tokyo',
    forecast_days: '4'
  });

  weatherRequest = (async () => {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
        cache: 'no-store', signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) throw new Error(`Open-Meteo HTTP ${response.status}`);
      const places = await response.json();
      if (!Array.isArray(places) || places.length !== weatherPlaces.length ||
          places.some(place => !place.current?.time || !place.daily?.time?.length)) {
        throw new Error('Open-Meteo response is incomplete');
      }
      weatherCache = { fetchedAt: Date.now(), places };
      renderWeather(places);
      try { localStorage.setItem(weatherCacheKey, JSON.stringify(weatherCache)); } catch { /* Storage is optional. */ }
    } catch {
      if (weatherCache) {
        renderWeather(weatherCache.places, true);
        document.querySelectorAll('.weather-place .weather-live-label').forEach(label => {
          label.textContent = label.textContent.replace('更新中', '更新失敗，顯示上次資料');
        });
      } else {
        document.querySelectorAll('.weather-condition').forEach(description => {
          description.textContent = '天氣暫時無法載入，請稍後再試。';
        });
      }
    } finally {
      weatherRequest = null;
    }
  })();
  return weatherRequest;
}

weatherCache = readWeatherCache();
if (weatherCache) renderWeather(weatherCache.places, Date.now() - weatherCache.fetchedAt >= weatherMaxAge);
updateWeather();
setInterval(updateWeather, weatherMaxAge);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateWeather(); });
