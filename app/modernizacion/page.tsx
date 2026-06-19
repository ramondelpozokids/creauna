'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

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
                  <div className="text-slate-600 mt-1">Solo necesitamos la URL o capturas. Analizamos todo.</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <div className="font-semibold">La reconstruimos desde cero con IA avanzada</div>
                  <div className="text-slate-600 mt-1">Diseño actual, textos optimizados, imágenes nuevas, velocidad y experiencia moderna.</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-9 h-9 flex-shrink-0 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <div className="font-semibold">Te entregamos la nueva web</div>
                  <div className="text-slate-600 mt-1">En menos de 72 horas tienes una web completamente renovada.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Idea de valor añadido (lo que pidió el usuario) */}
          <div className="mt-10 p-8 border border-amber-200 bg-amber-50 rounded-3xl">
            <div className="font-semibold text-xl mb-3 text-amber-800">Lo que te llevas a cambio (Nuestra propuesta de valor)</div>
            <p className="text-slate-700 mb-4">
              No solo te entregamos una web nueva. Te damos un proceso completo de "Rescate de Imagen":
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">• <strong>Before & After profesional</strong> — Vídeo y presentación comparativa lista para usar en redes o presentaciones.</li>
              <li className="flex gap-2">• <strong>Archivo Legacy</strong> — Una versión elegante y bien presentada de tu web antigua (como recuerdo o para archivo histórico).</li>
              <li className="flex gap-2">• <strong>Migración garantizada</strong> — Todo tu contenido, textos, imágenes y SEO se transfieren correctamente.</li>
              <li className="flex gap-2">• <strong>3 meses de ajustes incluidos</strong> — Cambios menores sin coste adicional.</li>
              <li className="flex gap-2">• <strong>Garantía de satisfacción</strong> — Si no quedas contento, te devolvemos el 50% del importe.</li>
              <li className="flex gap-2">• <strong>Informe de mejora</strong> — Documento con las métricas antes/después (velocidad, SEO, experiencia de usuario).</li>
            </ul>
          </div>

          {/* Before & After premium con imágenes locales */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold tracking-widest text-amber-600">TRANSFORMACIÓN REAL</div>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">Before &amp; After</h3>
              <p className="text-slate-600 mt-1">Ejemplos reales de webs que rescatamos</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Antes */}
              <div className="relative group">
                <div className="overflow-hidden rounded-3xl border shadow-sm">
                  <img 
                    src="/images/modern-architecture-minimalist-building--2.jpg" 
                    alt="Web antigua - Antes" 
                    className="w-full h-[320px] object-cover grayscale-[0.7] group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white/95 px-4 py-1 rounded-full text-xs font-semibold tracking-wider shadow">ANTES (2017)</div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-2xl text-sm">
                  <div className="font-medium">Sitio antiguo • Lento y obsoleto</div>
                  <div className="text-xs text-slate-600">Sin responsive • Baja conversión</div>
                </div>
              </div>

              {/* Después */}
              <div className="relative group">
                <div className="overflow-hidden rounded-3xl border shadow-sm">
                  <img 
                    src="/images/fine-dining-restaurant-interior-elegant--1.jpg" 
                    alt="Web moderna - Después" 
                    className="w-full h-[320px] object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="absolute top-4 left-4 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wider shadow">DESPUÉS (2026)</div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 p-4 rounded-2xl text-sm">
                  <div className="font-medium">Rediseño premium • Alta conversión</div>
                  <div className="text-xs text-emerald-700">+340% visitas • Diseño de estudio</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cómo te lo entregamos - Muy claro */}
          <div className="mt-14 bg-white border border-slate-200 rounded-3xl p-10">
            <div className="text-center mb-8">
              <div className="text-sm font-semibold tracking-widest text-indigo-600">CÓMO TE LO HACEMOS LLEGAR</div>
              <h3 className="text-3xl font-semibold tracking-tight mt-2">El proceso completo de entrega</h3>
            </div>

            <div className="grid md:grid-cols-4 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-semibold text-lg">1. Revisión inicial</div>
                <div className="text-slate-600">Analizamos tu web actual (URL + capturas). Te enviamos un informe diagnóstico en 24h.</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">2. Diseño y reconstrucción</div>
                <div className="text-slate-600">Creamos la nueva web desde cero con nuestro sistema de IA + dirección creativa humana.</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">3. Entrega y revisión</div>
                <div className="text-slate-600">Te entregamos la web en un entorno privado. Tienes 72h para revisar y pedir cambios.</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold text-lg">4. Publicación final</div>
                <div className="text-slate-600">Subimos la web a tu dominio o te entregamos todo el código + archivos. Incluye formación básica.</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t text-sm text-slate-600">
              <strong>¿Cómo lo recibes?</strong> Te enviamos un enlace privado + un paquete completo con Before &amp; After, informe de mejoras y archivos.
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
                  <div className="text-slate-600">Web nueva completa + Before & After + Archivo Legacy</div>
                </div>
                <div>
                  <div className="font-medium">Rescate Completo — 1.290€</div>
                  <div className="text-slate-600">Todo lo anterior + subida a tu dominio + 3 meses de ajustes</div>
                </div>
                <div>
                  <div className="font-medium">Rescate Premium — 1.790€</div>
                  <div className="text-slate-600">Todo + hosting durante 1 año + formación para que la gestiones tú</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/studio" className="btn-gradient inline-block px-10 py-4 rounded-3xl text-lg font-semibold">
              Solicitar presupuesto de modernización
            </Link>
            <p className="text-xs text-slate-500 mt-3">Te enviaremos una propuesta personalizada en menos de 24h</p>
          </div>

          {/* Firma del creador */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow">
                <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-500 tracking-wider">DIRIGIDO POR</div>
                <div className="font-semibold tracking-tight">Ramón del Pozo Rott</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
