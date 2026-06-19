'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-slate-900 font-bold">C</span>
              </div>
              <span className="font-semibold text-2xl tracking-tight">CREAUNA</span>
            </div>
            <p className="text-sm text-slate-400">
              El constructor de webs con IA más refinado del mundo.
            </p>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm tracking-wider">PRODUCTO</div>
            <div className="space-y-2 text-sm text-slate-400">
              <Link href="/studio" className="footer-link block hover:text-white">Studio IA</Link>
              <Link href="/templates" className="footer-link block hover:text-white">Plantillas</Link>
              <Link href="#precios" className="footer-link block hover:text-white">Precios</Link>
              <Link href="/studio" className="footer-link block hover:text-white">Equipo de IAs</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm tracking-wider">EMPRESA</div>
            <div className="space-y-2 text-sm text-slate-400">
              <Link href="/mapa" className="footer-link block hover:text-white">Mapa del sitio</Link>
              <Link href="/blog" className="footer-link block hover:text-white">Blog</Link>
              <Link href="/about" className="footer-link block hover:text-white">Sobre nosotros</Link>
              <a href="https://twitter.com" className="footer-link block hover:text-white">Twitter</a>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm tracking-wider">LEGAL</div>
            <div className="space-y-2 text-sm text-slate-400">
              <Link href="/legal" className="footer-link block hover:text-white">Aviso Legal</Link>
              <Link href="/privacidad" className="footer-link block hover:text-white">Política de Privacidad</Link>
              <Link href="/cookies" className="footer-link block hover:text-white">Política de Cookies</Link>
              <Link href="/datos" className="footer-link block hover:text-white">Protección de Datos</Link>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm tracking-wider">CONTACTO</div>
            <div className="space-y-2 text-sm text-slate-400">
              <a href="mailto:hola@creauna.com" className="footer-link block hover:text-white">hola@creauna.com</a>
              <a href="https://wa.me" className="footer-link block hover:text-white">WhatsApp Business</a>
              <div className="pt-3 text-xs text-slate-500">Ramón del Pozo Rott<br />Fundador &amp; Director Creativo</div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} CREAUNA. Todos los derechos reservados.</div>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-white">Privacidad</Link>
            <Link href="/legal" className="hover:text-white">Legal</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
            <span className="security-notice">Protegido por 4 capas de seguridad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
