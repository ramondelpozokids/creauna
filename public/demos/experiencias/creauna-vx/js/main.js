/**
 * Experiencia VELOCITY X — original CREAUNA.
 * Inventada desde el brief. Cero dependencia del proyecto Desktop.
 */
import * as THREE from 'three';
import { createBike, setExplode, setBikeColor, setAccent, spinWheels } from './bike.js?v=3';

const DEFAULT_MODELS = [
  { id: 'atlas', name: 'ATLAS', line: 'Silueta urbana. Torque limpio. Ciudad como circuito.' },
  { id: 'meridian', name: 'MERIDIAN', line: 'Larga distancia. Autonomía que se olvida de sí misma.' },
  { id: 'obsidian', name: 'OBSIDIAN', line: 'Negro absoluto. Reflejos como cuchilla.' },
  { id: 'helix', name: 'HELIX', line: 'Geometría en espiral. Curvas que se anticipan.' },
  { id: 'quasar', name: 'QUASAR', line: 'Pico de potencia. Destello, no ruido.' },
  { id: 'nadir', name: 'NADIR', line: 'Trail profundo. Suspensión que lee raíces.' },
  { id: 'solstice', name: 'SOLSTICE', line: 'Gravel de luz larga. Día infinito.' },
  { id: 'aether', name: 'AETHER', line: 'Casi sin masa. Casi sin resistencia.' },
  { id: 'umbra', name: 'UMBRA', line: 'Nocturna. HUD en iris. Camuflaje urbano.' },
  { id: 'horizon', name: 'HORIZON 2040', line: 'Concepto: gravedad negociable. Pieza de museo vivo.' },
];

function readSpectacleConfig() {
  try {
    if (window.__CREAUNA_SPECTACLE__) return window.__CREAUNA_SPECTACLE__;
    if (window.parent && window.parent !== window && window.parent.__CREAUNA_SPECTACLE__) {
      return window.parent.__CREAUNA_SPECTACLE__;
    }
  } catch {
    /* cross-origin ignore */
  }
  return null;
}

function modelsFromConfig(cfg) {
  if (!cfg?.models?.length) return DEFAULT_MODELS;
  return cfg.models.map((name, i) => ({
    id: `m${i}`,
    name: String(name).toUpperCase(),
    line: cfg.positioning || cfg.aboutHeadline || 'Temperamento propio. Ingeniería sin concesiones.',
  }));
}

const spectacleCfg = readSpectacleConfig();
const MODELS = modelsFromConfig(spectacleCfg);

function applySpectacleToDom(cfg) {
  if (!cfg) return;
  const mark = document.querySelector('.vx-mark');
  if (mark && cfg.brand) {
    mark.innerHTML = `<span class="vx-mark-dot"></span>${String(cfg.brand)
      .replace(/x$/i, '')
      .trim()}<span>X</span>`;
  }
  const h1 = document.querySelector('.vx-h1');
  if (h1 && cfg.heroTitle) h1.innerHTML = String(cfg.heroTitle).replace(/\n/g, '<br />');
  const lede = document.querySelector('.vx-hero-copy .vx-lede');
  if (lede && cfg.heroSubtitle) lede.textContent = cfg.heroSubtitle;
  const actions = document.querySelectorAll('.vx-hero-actions .vx-btn');
  if (actions[0] && cfg.primaryCta) actions[0].textContent = cfg.primaryCta;
  if (actions[1] && cfg.secondaryCta) actions[1].textContent = cfg.secondaryCta;
  document.title = `${cfg.brand || 'VELOCITY X'} — Experiencia`;
}

applySpectacleToDom(spectacleCfg);
window.addEventListener('creauna-spectacle', (ev) => applySpectacleToDom(ev.detail));

const TECHS = [
  {
    t: 'Batería de grafeno',
    d: 'Celdas tejidas en el cuadro. Carga solar invisible en el clear-coat. Densidad que parece trampa.',
  },
  {
    t: 'Motor predictivo',
    d: 'Asistencia que adelanta el pedaleo. No empuja: acompaña. Torque como extensión del tobillo.',
  },
  {
    t: 'Carbono líquido',
    d: 'Fibra que se deposita en capas ópticas. Rigidez donde hace falta, flexión donde respira.',
  },
  {
    t: 'Suspensión IA',
    d: 'Lee el terreno 200 veces por segundo. Amortigua antes de que el impacto te avise.',
  },
  {
    t: 'Sensores biometría',
    d: 'Ritmo, fatiga, agarre. La máquina ajusta potencia y aviso sin que abras una app.',
  },
  {
    t: 'Enjambre VX',
    d: 'Comunicación entre bicicletas. Detección de incidente. Señal satélite cuando el asfalto desaparece.',
  },
];

const AI_LINES = {
  terreno: 'Mapa de microrelieve en tiempo real. Anticipo baches como si fueran notas de una partitura.',
  pedaleo: 'Tu cadencia tiene firma. Aprendo el ritmo y elimino el esfuerzo inútil.',
  averias: 'Vibración anómala en el buje. Predigo mantenimiento 40 horas antes del fallo.',
  potencia: 'Curva de torque adaptativa. Más empuje en arranque, seda a velocidad de crucero.',
};

const LAB = [
  { t: 'Túnel de viento', d: 'Humedad controlada. Humo láser. Coeficiente que baja en silencio.' },
  { t: 'Impresión 3D titanio', d: 'Nodos imposibles de mecanizar. Hueso metálico.' },
  { t: 'Escáner de fatiga', d: 'Millones de ciclos comprimidos en una noche.' },
  { t: 'Pintura autorreparable', d: 'Microcápsulas. El arañazo se cierra como herida limpia.' },
  { t: 'HUD óptico', d: 'Proyección en gafas. Velocidad, ruta, alerta — sin pantalla en el manillar.' },
  { t: 'Bloqueo facial', d: 'La máquina solo responde a tu rostro. Robo = escultura inútil.' },
];

const CINE = [
  { label: '01 · Oscuridad', line: 'Antes del movimiento, solo hay vacío conductor.' },
  { label: '02 · Rueda', line: 'Una circunferencia. Promesa de camino.' },
  { label: '03 · Ensamble', line: 'El cuadro nace. Piezas buscan su sitio.' },
  { label: '04 · Vida', line: 'Corriente. El motor abre los ojos.' },
  { label: '05 · Ciudad', line: 'Asfalto negro. Reflejos de neón frío.' },
  { label: '06 · Elementos', line: 'Lluvia. Nieve. Polvo. La misma máquina.' },
  { label: '07 · Infinito', line: 'Carretera que no termina. Horizonte que se aleja.' },
  { label: '08 · Retorno', line: 'Vuelves. La bici recuerda cada kilómetro.' },
];

const COLORS = [
  { id: 'titanium', hex: '#d0d7e0', label: 'Titanio' },
  { id: 'ice', hex: '#f2f5f8', label: 'Hielo' },
  { id: 'graphite', hex: '#6a7380', label: 'Grafito' },
  { id: 'void', hex: '#2a3340', label: 'Vacío' },
  { id: 'arc', hex: '#3a5a7c', label: 'Arc' },
  { id: 'ember', hex: '#5a4038', label: 'Ember' },
];

const CFG = {
  motor: ['VX-680 Calma', 'VX-920 Empuje', 'VX-1200 Horizon'],
  battery: ['400 Wh · 180 km', '650 Wh · 340 km', '900 Wh · 520 km'],
  suspension: ['Rígida carbono', 'IA Adaptativa 100', 'IA Adaptativa 140'],
  tires: ['Slick 28', 'All-road 40', 'Trail 2.2'],
  light: ['LED integrado', 'Láser de vía', 'Halo perimetral'],
};

const DUEL = [
  { part: 'Cuadro', a: 'Carbono líquido Atlas', b: 'Titanio 3D Aether' },
  { part: 'Motor', a: 'VX-920 Empuje', b: 'VX-1200 Horizon' },
  { part: 'Batería', a: '650 Wh grafeno', b: '900 Wh solar-skin' },
  { part: 'Suspensión', a: 'IA 100 mm', b: 'IA 140 mm' },
  { part: 'Sensores', a: 'Biometría + radar', b: 'Biometría + enjambre' },
  { part: 'Masa', a: '8.4 kg', b: '7.1 kg' },
];

/* ---------- DOM fill ---------- */
const atlasRail = document.getElementById('atlas-rail');
MODELS.forEach((m, i) => {
  const el = document.createElement('article');
  el.className = 'vx-atlas-card';
  el.setAttribute('role', 'listitem');
  el.innerHTML = `<span class="idx">${String(i + 1).padStart(2, '0')}</span><h3>${m.name}</h3><p>${m.line}</p>`;
  atlasRail.appendChild(el);
});

const techStack = document.getElementById('tech-stack');
TECHS.forEach((t) => {
  const el = document.createElement('article');
  el.className = 'vx-tech';
  el.innerHTML = `<div><p class="vx-kicker">SISTEMA</p><h3>${t.t}</h3></div><p>${t.d}</p>`;
  techStack.appendChild(el);
});

const aiChips = document.getElementById('ai-chips');
const aiSpeak = document.getElementById('ai-speak');
Object.keys(AI_LINES).forEach((k, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = k;
  if (i === 0) b.classList.add('is-on');
  b.addEventListener('click', () => {
    aiChips.querySelectorAll('button').forEach((x) => x.classList.remove('is-on'));
    b.classList.add('is-on');
    aiSpeak.style.opacity = '0';
    setTimeout(() => {
      aiSpeak.textContent = AI_LINES[k];
      aiSpeak.style.opacity = '1';
    }, 180);
  });
  aiChips.appendChild(b);
});
aiSpeak.style.transition = 'opacity .25s ease';

const lab = document.getElementById('lab-grid');
LAB.forEach((x) => {
  const el = document.createElement('article');
  el.className = 'vx-lab-card';
  el.innerHTML = `<h3>${x.t}</h3><p>${x.d}</p>`;
  lab.appendChild(el);
});

const duelParts = document.getElementById('duel-parts');
DUEL.forEach((d) => {
  const li = document.createElement('li');
  li.innerHTML = `<span>${d.a}</span><span>${d.part}</span><span>${d.b}</span>`;
  duelParts.appendChild(li);
});

document.getElementById('duel-a').classList.add('is-on');
document.getElementById('duel-b').classList.add('is-on');
document.querySelectorAll('.vx-duelo-pick').forEach((btn) => {
  btn.addEventListener('click', () => btn.classList.toggle('is-on'));
});

/* ---------- Cursor ---------- */
const cursor = document.getElementById('cursor');
let cx = 0;
let cy = 0;
let tx = 0;
let ty = 0;
window.addEventListener('pointermove', (e) => {
  tx = e.clientX;
  ty = e.clientY;
  const hot = e.target.closest('a, button, .vx-atlas-card, .vx-swatch');
  cursor.classList.toggle('is-hot', Boolean(hot));
});
function tickCursor() {
  cx += (tx - cx) * 0.22;
  cy += (ty - cy) * 0.22;
  cursor.style.left = `${cx}px`;
  cursor.style.top = `${cy}px`;
  requestAnimationFrame(tickCursor);
}
tickCursor();

/* ---------- Hero Three scene ---------- */
const heroCanvas = document.getElementById('vx-canvas');
const hero = setupScene(heroCanvas, { fov: 38, camZ: 4.4, camY: 0.85 });
const heroBike = createBike({ color: '#d0d7e0', accent: '#3aa0ff' });
heroBike.scale.setScalar(1.25);
heroBike.position.set(0.35, -0.55, 0);
hero.scene.add(heroBike);

const particles = makeParticles(700);
hero.scene.add(particles);

hero.scene.fog = new THREE.FogExp2(0x050607, 0.028);
hero.scene.background = new THREE.Color('#050607');

const hemi = new THREE.HemisphereLight(0xb8d4ff, 0x1a1520, 1.1);
hero.scene.add(hemi);
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(4, 6, 5);
hero.scene.add(key);
const rim = new THREE.DirectionalLight(0x3aa0ff, 2.4);
rim.position.set(-5, 3, -2);
hero.scene.add(rim);
const fill = new THREE.AmbientLight(0x8899aa, 0.65);
hero.scene.add(fill);
const floorGlow = new THREE.PointLight(0x3aa0ff, 2.8, 12);
floorGlow.position.set(0.4, 0.2, 2);
hero.scene.add(floorGlow);
const frontSpot = new THREE.SpotLight(0xffffff, 2.5, 18, Math.PI / 5, 0.4, 1);
frontSpot.position.set(2, 4, 6);
frontSpot.target.position.copy(heroBike.position);
hero.scene.add(frontSpot);
hero.scene.add(frontSpot.target);

// Suelo espejo suave para anclar la silueta
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(3.2, 64),
  new THREE.MeshStandardMaterial({
    color: '#0a0e14',
    metalness: 0.9,
    roughness: 0.35,
    transparent: true,
    opacity: 0.55,
  })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0.35, -0.55, 0);
hero.scene.add(ground);

/* ---------- Configurator scene ---------- */
const cfgCanvas = document.getElementById('cfg-canvas');
const cfg = setupScene(cfgCanvas, { fov: 36, camZ: 4.0, camY: 0.75 });
const cfgBike = createBike({ color: '#d0d7e0', accent: '#3aa0ff' });
cfgBike.scale.setScalar(1.15);
cfg.scene.add(cfgBike);
cfg.scene.background = new THREE.Color('#0a0c10');
cfg.scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x101018, 1.0));
cfg.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const cfgKey = new THREE.DirectionalLight(0xffffff, 2.2);
cfgKey.position.set(3, 5, 4);
cfg.scene.add(cfgKey);
const cfgRim = new THREE.PointLight(0x3aa0ff, 2.6, 12);
cfgRim.position.set(-2, 1.2, 2.5);
cfg.scene.add(cfgRim);
const cfgGround = new THREE.Mesh(
  new THREE.CircleGeometry(2.6, 48),
  new THREE.MeshStandardMaterial({ color: '#12161e', metalness: 0.85, roughness: 0.4, transparent: true, opacity: 0.5 })
);
cfgGround.rotation.x = -Math.PI / 2;
cfgGround.position.y = -0.02;
cfg.scene.add(cfgGround);

let cfgDragging = false;
let cfgLX = 0;
let cfgLY = 0;
cfgCanvas.addEventListener('pointerdown', (e) => {
  cfgDragging = true;
  cfgLX = e.clientX;
  cfgLY = e.clientY;
  cfgCanvas.setPointerCapture(e.pointerId);
});
cfgCanvas.addEventListener('pointerup', () => {
  cfgDragging = false;
});
cfgCanvas.addEventListener('pointermove', (e) => {
  if (!cfgDragging) return;
  const dx = e.clientX - cfgLX;
  const dy = e.clientY - cfgLY;
  cfgLX = e.clientX;
  cfgLY = e.clientY;
  cfgBike.rotation.y += dx * 0.008;
  cfgBike.rotation.x = THREE.MathUtils.clamp(cfgBike.rotation.x + dy * 0.004, -0.4, 0.5);
});
cfgCanvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    cfg.camera.position.z = THREE.MathUtils.clamp(cfg.camera.position.z + e.deltaY * 0.004, 3.2, 6.5);
  },
  { passive: false }
);

buildForjaPanel();

/* ---------- AI sphere canvas (2D) ---------- */
const aiCanvas = document.getElementById('ai-canvas');
const aiCtx = aiCanvas.getContext('2d');
function resizeAi() {
  const s = Math.min(420, aiCanvas.parentElement.clientWidth || 420);
  aiCanvas.width = s * devicePixelRatio;
  aiCanvas.height = s * devicePixelRatio;
  aiCanvas.style.width = `${s}px`;
  aiCanvas.style.height = `${s}px`;
}
resizeAi();
window.addEventListener('resize', resizeAi);

/* ---------- Station footer scene ---------- */
const stationCanvas = document.getElementById('station-canvas');
const station = setupScene(stationCanvas, { fov: 50, camZ: 6.5, camY: 0.2 });
const stationBike = createBike({ color: '#c5ccd6', accent: '#3aa0ff' });
stationBike.scale.setScalar(1.05);
station.scene.add(stationBike);
station.scene.background = new THREE.Color('#050607');
station.scene.fog = new THREE.FogExp2(0x050607, 0.06);
station.scene.add(new THREE.AmbientLight(0x334455, 0.5));
const stRim = new THREE.PointLight(0x3aa0ff, 2, 12);
stRim.position.set(0, 1.5, 2);
station.scene.add(stRim);
const stars = makeParticles(1400, 18);
station.scene.add(stars);

/* ---------- Cine scroll ---------- */
const cineLabel = document.getElementById('cine-label');
const cineLine = document.getElementById('cine-line');
const cineSection = document.getElementById('cine');

/* ---------- Loop ---------- */
const clock = new THREE.Clock();
let explodeT = 0;

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  // hero float + rotate — la bici es el sujeto, siempre legible
  heroBike.position.y = -0.55 + Math.sin(t * 0.7) * 0.06;
  heroBike.rotation.y = Math.PI * 0.22 + t * 0.12;
  spinWheels(heroBike, dt);
  setExplode(heroBike, explodeT);
  particles.rotation.y = t * 0.02;
  particles.rotation.x = Math.sin(t * 0.1) * 0.05;
  // mouse parallax light
  floorGlow.position.x = (tx / window.innerWidth - 0.5) * 2.5;
  floorGlow.position.z = 1 + (ty / window.innerHeight - 0.5) * 1.5;
  hero.renderer.render(hero.scene, hero.camera);

  cfgBike.rotation.y += cfgDragging ? 0 : dt * 0.25;
  spinWheels(cfgBike, dt);
  cfg.renderer.render(cfg.scene, cfg.camera);

  stationBike.rotation.y = t * 0.22;
  stationBike.position.y = Math.sin(t * 0.55) * 0.2;
  spinWheels(stationBike, dt);
  stars.rotation.y = t * 0.015;
  station.renderer.render(station.scene, station.camera);

  drawAiSphere(t);
  updateCine();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.addEventListener('resize', () => {
  resizeThree(hero, heroCanvas);
  resizeThree(cfg, cfgCanvas);
  resizeThree(station, stationCanvas);
});

function updateCine() {
  const rect = cineSection.getBoundingClientRect();
  const total = cineSection.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  const p = total > 0 ? scrolled / total : 0;
  explodeT = THREE.MathUtils.smoothstep(p, 0.05, 0.55);
  const idx = Math.min(CINE.length - 1, Math.floor(p * CINE.length));
  const beat = CINE[idx];
  if (cineLabel.textContent !== beat.label) {
    cineLabel.textContent = beat.label;
    cineLine.textContent = beat.line;
    cineLine.style.opacity = '0';
    requestAnimationFrame(() => {
      cineLine.style.transition = 'opacity .4s ease';
      cineLine.style.opacity = '1';
    });
  }
  // environment tint via fog density
  hero.scene.fog.density = 0.02 + p * 0.035;
  const hueShift = 0.55 + p * 0.08;
  rim.color.setHSL(hueShift, 0.85, 0.55);
}

function drawAiSphere(t) {
  const w = aiCanvas.width;
  const h = aiCanvas.height;
  const cx0 = w / 2;
  const cy0 = h / 2;
  const r = Math.min(w, h) * 0.28;
  aiCtx.clearRect(0, 0, w, h);
  aiCtx.fillStyle = 'rgba(5,6,7,0.35)';
  aiCtx.fillRect(0, 0, w, h);
  for (let i = 0; i < 3; i++) {
    const rr = r * (1.2 + i * 0.35) + Math.sin(t * 1.2 + i) * 8 * devicePixelRatio;
    aiCtx.beginPath();
    aiCtx.arc(cx0, cy0, rr, 0, Math.PI * 2);
    aiCtx.strokeStyle = `rgba(58,160,255,${0.18 - i * 0.04})`;
    aiCtx.lineWidth = 1.5 * devicePixelRatio;
    aiCtx.stroke();
  }
  const grd = aiCtx.createRadialGradient(cx0 - r * 0.3, cy0 - r * 0.3, r * 0.1, cx0, cy0, r);
  grd.addColorStop(0, '#9fd0ff');
  grd.addColorStop(0.45, '#3aa0ff');
  grd.addColorStop(1, '#0a1a2e');
  aiCtx.beginPath();
  aiCtx.arc(cx0, cy0, r, 0, Math.PI * 2);
  aiCtx.fillStyle = grd;
  aiCtx.fill();
  aiCtx.strokeStyle = 'rgba(255,255,255,0.35)';
  aiCtx.lineWidth = 1 * devicePixelRatio;
  aiCtx.stroke();
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2 + t * 0.4;
    const rr = r * (0.4 + (i % 5) * 0.1);
    const x = cx0 + Math.cos(a) * rr;
    const y = cy0 + Math.sin(a * 1.3) * rr * 0.55;
    aiCtx.fillStyle = `rgba(255,255,255,${0.25 + (i % 3) * 0.15})`;
    aiCtx.fillRect(x, y, 2 * devicePixelRatio, 2 * devicePixelRatio);
  }
}

function buildForjaPanel() {
  const panel = document.getElementById('forja-panel');
  panel.innerHTML = '';

  const colorGroup = document.createElement('div');
  colorGroup.className = 'vx-forja-group';
  colorGroup.innerHTML = '<h4>Color + chasis</h4>';
  const sw = document.createElement('div');
  sw.className = 'vx-swatches';
  COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vx-swatch' + (i === 0 ? ' is-on' : '');
    b.style.setProperty('--c', c.hex);
    b.title = c.label;
    b.setAttribute('aria-label', c.label);
    b.addEventListener('click', () => {
      sw.querySelectorAll('.vx-swatch').forEach((x) => x.classList.remove('is-on'));
      b.classList.add('is-on');
      setBikeColor(cfgBike, c.hex);
      setBikeColor(heroBike, c.hex);
    });
    sw.appendChild(b);
  });
  colorGroup.appendChild(sw);
  panel.appendChild(colorGroup);

  Object.entries(CFG).forEach(([key, opts]) => {
    const g = document.createElement('div');
    g.className = 'vx-forja-group';
    g.innerHTML = `<h4>${labelCfg(key)}</h4>`;
    const box = document.createElement('div');
    box.className = 'vx-opts';
    opts.forEach((o, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = o;
      if (i === 0) b.classList.add('is-on');
      b.addEventListener('click', () => {
        box.querySelectorAll('button').forEach((x) => x.classList.remove('is-on'));
        b.classList.add('is-on');
        if (key === 'motor') setAccent(cfgBike, i === 2 ? '#6ec1ff' : '#3aa0ff');
        if (key === 'light') setAccent(heroBike, i === 0 ? '#3aa0ff' : i === 1 ? '#7ad0ff' : '#a8e0ff');
        cfgBike.rotation.y += 0.35;
      });
      box.appendChild(b);
    });
    g.appendChild(box);
    panel.appendChild(g);
  });
}

function labelCfg(k) {
  return (
    {
      motor: 'Motor',
      battery: 'Batería + grafeno',
      suspension: 'Suspensión',
      tires: 'Neumáticos',
      light: 'Iluminación',
    }[k] || k
  );
}

function setupScene(canvas, { fov, camZ, camY }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, camY, camZ);
  const api = { renderer, scene, camera };
  resizeThree(api, canvas);
  return api;
}

function resizeThree(api, canvas) {
  const w = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
  api.renderer.setSize(w, h, false);
  api.camera.aspect = w / Math.max(h, 1);
  api.camera.updateProjectionMatrix();
}

function makeParticles(count, spread = 10) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x8ec9ff,
    size: 0.025,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}
