import { config } from '../config.js';
import { knowledge, matchKnowledge, quickPrompts } from '../data/knowledge.js';
import { getLang } from '../i18n.js';

async function askRemote(text, lang) {
  if (!config.aiEndpoint) return null;
  try {
    const res = await fetch(config.aiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, lang, source: 'll-premium' })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.answer || data.message || null;
  } catch {
    return null;
  }
}

function addBubble(text, who) {
  const box = document.getElementById('chat-messages');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'chat-bubble ' + who;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function defaultAnswer(lang) {
  const map = {
    es: 'Puedo ayudarte con horarios, reservas, carta, alérgenos, playa, aparcamiento, mascotas y eventos. También: losleonesplaya@gmail.com / +34 952 37 43 13.',
    en: 'I can help with hours, bookings, menu, allergens, beach, parking, pets and events. Also: losleonesplaya@gmail.com / +34 952 37 43 13.',
    fr: 'Je peux aider pour horaires, réservations, carte, allergènes, plage, parking, animaux et événements. Email: losleonesplaya@gmail.com / +34 952 37 43 13.',
    de: 'Ich helfe bei Zeiten, Reservierung, Karte, Allergenen, Strand, Parken, Haustieren und Events. E-Mail: losleonesplaya@gmail.com / +34 952 37 43 13.',
    it: 'Posso aiutarti con orari, prenotazioni, menu, allergeni, spiaggia, parcheggio, animali ed eventi. Email: losleonesplaya@gmail.com / +34 952 37 43 13.'
  };
  return map[lang] || map.es;
}

async function resolveAnswer(text) {
  const lang = getLang() === 'it' ? 'it' : getLang();
  const remote = await askRemote(text, lang);
  if (remote) return remote;
  return matchKnowledge(text, lang) || defaultAnswer(lang);
}

function enhanceSuggestions() {
  const sugg = document.getElementById('chat-suggestions');
  if (!sugg || sugg.dataset.llEnhanced === '1') return;
  sugg.dataset.llEnhanced = '1';

  const lang = getLang() === 'it' ? 'it' : getLang();
  // Append premium chips without removing existing ones from extras.js
  quickPrompts.forEach((p) => {
    const exists = Array.from(sugg.querySelectorAll('button')).some(
      (b) => b.dataset.llPrompt === p.id
    );
    if (exists) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.llPrompt = p.id;
    b.textContent = (p.label && (p.label[lang] || p.label.es)) || p.id;
    b.addEventListener('click', async () => {
      const label = b.textContent;
      addBubble(label, 'user');
      const item = knowledge.find((k) => k.id === p.id);
      const ans = item ? (item.answer[lang] || item.answer.es) : await resolveAnswer(label);
      addBubble(ans, 'bot');
    });
    sugg.appendChild(b);
  });
}

export function initAiAssistant() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  if (!form || !input) return;

  // Capture-phase: expand knowledge without editing extras.js
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    const val = (input.value || '').trim();
    if (!val) return;
    addBubble(val, 'user');
    input.value = '';
    const ans = await resolveAnswer(val);
    addBubble(ans, 'bot');
  }, true);

  const toggle = document.getElementById('chat-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      setTimeout(enhanceSuggestions, 50);
    });
  }

  // Refresh chips on language change
  window.addEventListener('ll:langchange', () => {
    const sugg = document.getElementById('chat-suggestions');
    if (sugg) {
      sugg.querySelectorAll('button[data-ll-prompt]').forEach((b) => b.remove());
      sugg.dataset.llEnhanced = '0';
      enhanceSuggestions();
    }
  });

  window.LLPremium = window.LLPremium || {};
  window.LLPremium.ask = resolveAnswer;
  window.LLPremium.knowledge = knowledge;
}
