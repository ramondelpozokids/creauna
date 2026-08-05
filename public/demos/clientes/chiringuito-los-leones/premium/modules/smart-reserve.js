import { config } from '../config.js';
import { el, insertBefore, sectionShell } from '../utils.js';
import { applyPremiumI18n, t } from '../i18n.js';

export function initSmartReserve() {
  const anchor = document.getElementById('reservas');
  if (!anchor) return;

  const { section, container } = sectionShell({
    id: 'll-smart-reserve',
    className: 'll-section',
    titleKey: 'll_smart_title',
    subKey: 'll_smart_sub'
  });

  const form = el('form', { className: 'll-smartform', id: 'll-smart-reserve-form' });
  form.innerHTML = `
    <div class="ll-row">
      <div>
        <label for="ll-sr-name" data-ll-i18n="ll_name"></label>
        <input id="ll-sr-name" name="name" required autocomplete="name">
      </div>
      <div>
        <label for="ll-sr-phone" data-ll-i18n="ll_phone"></label>
        <input id="ll-sr-phone" name="phone" required autocomplete="tel">
      </div>
    </div>
    <div>
      <label for="ll-sr-email" data-ll-i18n="ll_email"></label>
      <input id="ll-sr-email" name="email" type="email" required autocomplete="email">
    </div>
    <div class="ll-row">
      <div>
        <label for="ll-sr-date" data-ll-i18n="ll_date"></label>
        <input id="ll-sr-date" name="date" type="date" required>
      </div>
      <div>
        <label for="ll-sr-time" data-ll-i18n="ll_time"></label>
        <select id="ll-sr-time" name="time" required>
          <option value="">--</option>
          ${['12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00'].map((h) => `<option value="${h}">${h}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="ll-row">
      <div>
        <label for="ll-sr-guests" data-ll-i18n="ll_guests"></label>
        <select id="ll-sr-guests" name="guests" required>
          <option value="">--</option>
          ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
          <option value="12+">12+</option>
        </select>
      </div>
      <div>
        <label for="ll-sr-zone" data-ll-i18n="ll_smart_zone"></label>
        <select id="ll-sr-zone" name="zone" required>
          <option value="terrace" data-ll-i18n="ll_smart_terrace">Terraza</option>
          <option value="indoor" data-ll-i18n="ll_smart_indoor">Interior</option>
        </select>
      </div>
    </div>
    <div>
      <label for="ll-sr-allergies" data-ll-i18n="ll_smart_allergies"></label>
      <textarea id="ll-sr-allergies" name="allergies" rows="2"></textarea>
    </div>
    <label class="ll-check"><input type="checkbox" name="birthday" value="1"> <span data-ll-i18n="ll_smart_birthday"></span></label>
    <label class="ll-check"><input type="checkbox" name="highchair" value="1"> <span data-ll-i18n="ll_smart_highchair"></span></label>
    <button type="submit" class="ll-btn ll-btn--solid" data-ll-i18n="ll_smart_submit"></button>
    <p class="ll-note" data-ll-i18n="ll_smart_note"></p>
  `;

  container.appendChild(form);
  insertBefore(anchor, section);
  applyPremiumI18n(section);

  const date = form.querySelector('#ll-sr-date');
  if (date) date.min = new Date().toISOString().slice(0, 10);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.birthday = form.birthday.checked ? 'yes' : 'no';
    data.highchair = form.highchair.checked ? 'yes' : 'no';

    if (config.reserveEndpoint) {
      try {
        await fetch(config.reserveEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, source: 'll-smart-reserve' })
        });
      } catch {
        /* fall through to local confirmation */
      }
    } else if (config.reserveMailto) {
      const subject = encodeURIComponent('Reserva inteligente — Los Leones');
      const body = encodeURIComponent(
        Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n')
      );
      // Open mailto as soft fallback without navigating away silently
      window.open(`mailto:${config.reserveMailto}?subject=${subject}&body=${body}`, '_blank');
    }

    alert(t('ll_smart_ok'));
    form.reset();
    if (date) date.min = new Date().toISOString().slice(0, 10);
  });
}
