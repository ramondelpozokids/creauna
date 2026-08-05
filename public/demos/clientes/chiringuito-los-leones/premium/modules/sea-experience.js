/**
 * Weather for Torremolinos / La Carihuela (Open-Meteo).
 * Only renders panels that are enabled and have real data.
 */
import { config } from '../config.js';
import { el, insertAfter, sectionShell, whenVisible } from '../utils.js';
import { applyPremiumI18n, t } from '../i18n.js';

const CACHE_KEY = 'll_weather_cache_v2';

async function fetchWeather() {
  const mins = config.weatherCacheMinutes || 20;
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.ts < mins * 60 * 1000) return cached.data;
  } catch { /* ignore */ }

  const { lat, lon } = config.coords;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index` +
    `&timezone=Europe%2FMadrid`;
  const marineUrl =
    `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
    `&current=wave_height&timezone=Europe%2FMadrid`;

  const [wxRes, marineRes] = await Promise.all([
    fetch(url),
    fetch(marineUrl).catch(() => null)
  ]);
  if (!wxRes.ok) throw new Error('weather');
  const wx = await wxRes.json();
  let marine = null;
  if (marineRes && marineRes.ok) marine = await marineRes.json();

  const data = { wx, marine };
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  return data;
}

function seaStateKey(h) {
  if (h == null || Number.isNaN(h)) return null;
  if (h < 0.5) return 'll_sea_calm';
  if (h < 1.2) return 'll_sea_slight';
  if (h < 2.5) return 'll_sea_moderate';
  return 'll_sea_rough';
}

export function initSeaExperience() {
  if (!config.features.weather) return;

  const galeria = document.getElementById('galeria');
  if (!galeria) return;

  const { section, container } = sectionShell({
    id: 'll-sea',
    className: 'll-section ll-section--dark',
    titleKey: 'll_sea_title',
    subKey: 'll_sea_sub'
  });

  const grid = el('div', { className: 'll-sea-grid ll-sea-grid--single' });
  const weatherPanel = el('div', { className: 'll-panel', id: 'll-weather' });
  weatherPanel.innerHTML = `<h3 data-ll-i18n="ll_weather"></h3><p class="ll-muted" data-ll-i18n="ll_weather_loading"></p>`;
  grid.appendChild(weatherPanel);
  container.appendChild(grid);
  insertAfter(galeria, section);
  applyPremiumI18n(section);

  whenVisible(section, async () => {
    try {
      const { wx, marine } = await fetchWeather();
      const c = wx.current || {};
      const wave = marine && marine.current ? marine.current.wave_height : null;
      const stateKey = seaStateKey(wave);
      const stateLabel = stateKey ? t(stateKey) : '—';

      weatherPanel.innerHTML = `
        <h3 data-ll-i18n="ll_weather"></h3>
        <p class="ll-muted" data-ll-i18n="ll_weather_place"></p>
        <div class="ll-metrics">
          <div class="ll-metric"><span data-ll-i18n="ll_temp"></span><strong>${c.temperature_2m ?? '—'}°C</strong></div>
          <div class="ll-metric"><span data-ll-i18n="ll_wind"></span><strong>${c.wind_speed_10m ?? '—'} km/h</strong></div>
          <div class="ll-metric"><span data-ll-i18n="ll_humidity"></span><strong>${c.relative_humidity_2m ?? '—'}%</strong></div>
          <div class="ll-metric"><span data-ll-i18n="ll_uv"></span><strong>${c.uv_index ?? '—'}</strong></div>
          <div class="ll-metric"><span data-ll-i18n="ll_waves"></span><strong>${wave != null ? wave + ' m' : '—'}</strong></div>
          <div class="ll-metric"><span data-ll-i18n="ll_sea_state"></span><strong>${stateLabel}</strong></div>
        </div>`;
      applyPremiumI18n(weatherPanel);
    } catch {
      weatherPanel.innerHTML = `<h3 data-ll-i18n="ll_weather"></h3><p class="ll-muted" data-ll-i18n="ll_weather_error"></p>`;
      applyPremiumI18n(weatherPanel);
    }
  });
}
