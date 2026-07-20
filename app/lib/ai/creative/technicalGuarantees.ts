/**
 * Technical Guarantees — suelo técnico, NO dictador estético.
 * Prohibido forzar hero 70vh / grid 3cols / Playfair universal.
 */

import { promptWantsWhatsApp } from '../agencyChromePolicy';

export interface TechnicalGuaranteeOpts {
  prompt: string;
  lang: 'es' | 'en';
  businessName: string;
  wantsWhatsApp?: boolean;
}

/** Inject minimal legal modal shell if missing (does not rewrite design). */
export function ensureLegalModalShell(html: string, businessName: string, lang: 'es' | 'en'): string {
  if (/id=["']cua-legal-modal["']/i.test(html) || /function\s+openModal\s*\(/i.test(html)) {
    // Ensure modal markup exists if only script present
    if (!/id=["']cua-legal-modal["']/i.test(html)) {
      const modal = `
<div id="cua-legal-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;align-items:center;justify-content:center;padding:1.5rem;" onclick="if(event.target===this)closeModal()">
  <div role="dialog" aria-modal="true" style="background:#fff;color:#111;max-width:560px;width:100%;padding:1.75rem;border-radius:12px;max-height:80vh;overflow:auto;">
    <h3 id="cua-legal-title" style="margin-top:0;"></h3>
    <p id="cua-legal-body"></p>
    <button type="button" onclick="closeModal()" style="margin-top:1rem;padding:.6rem 1rem;cursor:pointer;">${lang === 'es' ? 'Cerrar' : 'Close'}</button>
  </div>
</div>`;
      return html.replace(/<\/body>/i, `${modal}\n</body>`);
    }
    return html;
  }
  const modal = `
<div id="cua-legal-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;align-items:center;justify-content:center;padding:1.5rem;" onclick="if(event.target===this)closeModal()">
  <div role="dialog" aria-modal="true" style="background:#fff;color:#111;max-width:560px;width:100%;padding:1.75rem;border-radius:12px;max-height:80vh;overflow:auto;">
    <h3 id="cua-legal-title" style="margin-top:0;"></h3>
    <p id="cua-legal-body"></p>
    <button type="button" onclick="closeModal()" style="margin-top:1rem;padding:.6rem 1rem;cursor:pointer;">${lang === 'es' ? 'Cerrar' : 'Close'}</button>
  </div>
</div>
<script>
function openModal(kind){
  var m=document.getElementById('cua-legal-modal');
  if(!m)return;
  var titles={aviso:'Aviso legal',privacidad:'Privacidad',cookies:'Cookies'};
  var t=document.getElementById('cua-legal-title');
  var b=document.getElementById('cua-legal-body');
  if(t)t.textContent=titles[kind]||kind;
  if(b)b.textContent='Información legal de ${businessName.replace(/'/g, "\\'")} — '+ (titles[kind]||kind);
  m.style.display='flex';
}
function closeModal(){var m=document.getElementById('cua-legal-modal');if(m)m.style.display='none';}
</script>`;
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${modal}\n</body>`);
  return html + modal;
}

export function stripUnwantedWhatsAppFab(html: string, prompt: string): string {
  if (promptWantsWhatsApp(prompt)) return html;
  return html
    .replace(/<a[^>]+wa\.me[^>]*>[\s\S]*?<\/a>/gi, (m) =>
      /position\s*:\s*fixed|fab|whatsapp-float|cua-wa/i.test(m) ? '' : m
    )
    .replace(/<div[^>]*(?:whatsapp-fab|cua-wa-fab)[^>]*>[\s\S]*?<\/div>/gi, '');
}

export function ensureLazyImages(html: string): string {
  return html.replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy" ');
}

export function applyTechnicalGuarantees(html: string, opts: TechnicalGuaranteeOpts): string {
  let out = html;
  out = ensureLegalModalShell(out, opts.businessName, opts.lang);
  out = stripUnwantedWhatsAppFab(out, opts.prompt);
  out = ensureLazyImages(out);
  // Fix empty src only — no aesthetic rewrite
  out = out.replace(/src=["']\s*["']/gi, 'src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"');
  return out;
}
