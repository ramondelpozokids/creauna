'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import BeforeAfterDemo from '../components/BeforeAfterDemo';

export default function Modernizacion() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            SERVICIO ESPECIAL
          </div>
          <h1 className="text-6xl font-semibold tracking-tight">Modernización de Webs Antiguas</h1>
          <p className="text-2xl text-slate-600 mt-4">
            ¿Tu web tiene 5, 8 o más años? La transformamos en una web moderna, rápida, bonita y profesional.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-slate-50 rounded-3xl p-10">
            <h3 className="font-semibold text-2xl mb-6">Cómo funciona</h3>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <div className="font-semibold">Envíanos tu web actual</div>
                  <div className="text-slate-600 mt-1">Solo necesitamos la URL o capturas de pantalla. Analizamos todo el contenido, estructura y SEO.</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <div className="font-semibold">La reconstruimos desde cero con IA avanzada</div>
                  <div className="text-slate-600 mt-1">Diseño actual, textos optimizados, imágenes nuevas, velocidad y experiencia moderna bajo supervisión creativa humana.</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <div className="font-semibold">Te entregamos la nueva web</div>
                  <div className="text-slate-600 mt-1">En menos de 72 horas recibes la web renovada en un entorno privado para revisar y pedir cambios.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 p-8 border border-amber-200 bg-amber-50 rounded-3xl">
            <div className="font-semibold text-xl mb-3 text-amber-800">Lo que te llevas a cambio</div>
            <p className="text-slate-700 mb-4">
              No solo te entregamos una web nueva. Te damos un proceso completo de rescate de imagen:
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">• <strong>Antes y Después profesional</strong> — Presentación comparativa lista para usar en redes o con clientes.</li>
              <li className="flex gap-2">• <strong>Archivo Legacy</strong> — Versión elegante de tu web antigua como recuerdo o archivo histórico.</li>
              <li className="flex gap-2">• <strong>Migración garantizada</strong> — Contenido, textos, imágenes y SEO transferidos correctamente.</li>
              <li className="flex gap-2">• <strong>3 meses de ajustes incluidos</strong> — Cambios menores sin coste adicional.</li>
              <li className="flex gap-2">• <strong>Garantía de satisfacción</strong> — Si no quedas contento, te devolvemos el 50% del importe.</li>
              <li className="flex gap-2">• <strong>Informe de mejora</strong> — Métricas antes/después: velocidad, SEO y experiencia de usuario.</li>
            </ul>
          </div>

          {/* Demo interactivo Antes / Después */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold tracking-widest text-amber-600">TRANSFORMACIÓN REAL</div>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">Antes y Después</h3>
              <p className="text-slate-600 mt-1">Demo interactiva: arrastra para comparar la web antigua con el rediseño moderno</p>
            </div>

            <BeforeAfterDemo />

            <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <div className="font-semibold text-red-800">Antes (2017)</div>
                <ul className="mt-2 space-y-1 text-red-700/80 text-xs">
                  <li>• Diseño obsoleto y poco profesional</li>
                  <li>• Sin versión móvil (no responsive)</li>
                  <li>• Textos desactualizados y sin SEO</li>
                  <li>• Carga lenta y baja conversión</li>
                </ul>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="font-semibold text-emerald-800">Después (2026)</div>
                <ul className="mt-2 space-y-1 text-emerald-700/80 text-xs">
                  <li>• Diseño premium de estudio</li>
                  <li>• 100% adaptable a móvil y tablet</li>
                  <li>• Textos optimizados y SEO actualizado</li>
                  <li>• +340% visitas y mayor conversión</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Proceso de entrega */}
          <div className="mt-14 bg-white border border-slate-200 rounded-3xl p-10">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold tracking-widest text-indigo-600">CÓMO TE LO ENTREGAMOS</div>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">El proceso completo de entrega</h3>
            </div>

            <div className="grid md:grid-cols-4 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-lg">1. Revisión inicial</div>
                <div className="text-slate-600">Analizamos tu web actual (URL + capturas). Informe diagnóstico en 24h.</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">2. Diseño y reconstrucción</div>
                <div className="text-slate-600">Creamos la nueva web con IA + supervisión creativa humana.</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">3. Entrega y revisión</div>
                <div className="text-slate-600">Te entregamos la web en entorno privado. 72h para revisar y pedir cambios.</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">4. Entrega final</div>
                <div className="text-slate-600">
                  <strong>No subimos la web a tu dominio.</strong> Te entregamos todos los archivos y tú (o tu técnico) la publicáis donde queráis. Incluye guía básica de publicación.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t text-sm text-slate-600 space-y-2">
              <p><strong>¿Cómo lo recibes?</strong> Enlace privado de preview + paquete completo con Antes/Después, informe de mejoras y archivos listos para subir.</p>
              <p><strong>¿En qué formato?</strong> Según cómo nos enviaste la web antigua (URL, ZIP, FTP…), te la devolvemos del mismo modo con la nueva versión.</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="premium-card p-7 rounded-3xl">
              <div className="font-semibold text-lg">¿Qué incluye?</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ Rediseño completo moderno</li>
                <li>✓ Textos actualizados y SEO</li>
                <li>✓ Imágenes profesionales nuevas</li>
                <li>✓ Versión móvil perfecta</li>
                <li>✓ Velocidad optimizada</li>
                <li>✓ Formularios y funcionalidades actuales</li>
              </ul>
            </div>

            <div className="premium-card p-7 rounded-3xl">
              <div className="font-semibold text-lg mb-4">Precios de Modernización</div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium">Rescate Digital — 890€</div>
                  <div className="text-slate-600">Web nueva + Antes/Después + Archivo Legacy</div>
                </div>
                <div>
                  <div className="font-medium">Rescate Completo — 1.290€</div>
                  <div className="text-slate-600">Todo lo anterior + guía de publicación + 3 meses de ajustes</div>
                </div>
                <div>
                  <div className="font-medium">Rescate Premium — 1.790€</div>
                  <div className="text-slate-600">Todo + hosting 1 año + formación para que la gestiones tú</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/contacto" className="btn-gradient inline-block px-10 py-4 rounded-3xl text-lg font-semibold">
              Solicitar presupuesto de modernización
            </Link>
            <p className="text-xs text-slate-500 mt-3">Te enviaremos una propuesta personalizada en menos de 24h</p>
            <Link href="/guia" className="block mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              Consulta la guía completa →
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow">
                <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
              </div>
              <div className="text-[10px] text-slate-500 tracking-wider mt-2">SUPERVISADO POR</div>
              <div className="text-sm font-medium text-slate-700">Ramón del Pozo Rott</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
