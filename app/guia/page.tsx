'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import {
  BookOpen, Sparkles, LayoutGrid, Coins, Edit3, Download,
  RefreshCw, Paintbrush, CreditCard, MessageCircle, ChevronRight, CheckCircle2
} from 'lucide-react';

const sections = [
  { id: 'empezar', icon: Sparkles, title: '1. Crear tu web desde cero', color: 'text-indigo-600 bg-indigo-50' },
  { id: 'plantillas', icon: LayoutGrid, title: '2. Usar una plantilla', color: 'text-violet-600 bg-violet-50' },
  { id: 'creditos', icon: Coins, title: '3. Créditos y precios', color: 'text-amber-600 bg-amber-50' },
  { id: 'refinar', icon: Edit3, title: '4. Refinar tu diseño', color: 'text-emerald-600 bg-emerald-50' },
  { id: 'entrega', icon: Download, title: '5. Recibir y publicar tu web', color: 'text-rose-600 bg-rose-50' },
  { id: 'modernizar', icon: RefreshCw, title: '6. Modernizar una web antigua', color: 'text-orange-600 bg-orange-50' },
  { id: 'medida', icon: Paintbrush, title: '7. Web completamente a medida', color: 'text-cyan-600 bg-cyan-50' },
  { id: 'pago', icon: CreditCard, title: '8. Pago y suscripción', color: 'text-slate-600 bg-slate-100' },
  { id: 'ayuda', icon: MessageCircle, title: '9. Ayuda y contacto', color: 'text-indigo-600 bg-indigo-50' },
];

export default function GuiaCompleta() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />

      {/* Hero */}
      <div className="container pt-20 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-4 py-1.5 rounded-full font-semibold tracking-wider uppercase mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            GUÍA COMPLETA
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-950 leading-[1.08]">
            Todo lo que necesitas saber para crear o mejorar tu web
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Esta guía te acompaña paso a paso: desde tu primera web en el Studio hasta la publicación en tu propio dominio.
            En cada momento sabrás qué hacer y qué esperar.
          </p>
        </div>

        {/* Índice */}
        <div className="max-w-4xl mx-auto mt-12 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
          <h2 className="font-bold text-lg text-slate-950 mb-4">Índice de contenidos</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
              >
                <s.icon className="w-4 h-4 text-indigo-600 shrink-0" />
                {s.title}
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Secciones */}
      <div className="container max-w-4xl pb-24 space-y-16">

        {/* 1. Empezar */}
        <section id="empezar" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">1. Crear tu web desde cero</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>La forma más rápida de tener una web profesional es usar el <strong>Studio</strong> de CREAUNA.</p>
            <ol className="space-y-3 list-none">
              {[
                'Entra en /studio (no necesitas tarjeta para empezar).',
                'Describe tu negocio con tus propias palabras: sector, ciudad, estilo, colores, secciones que necesitas.',
                'La IA genera tu web en menos de 8 minutos con diseño de estudio.',
                'Verás una preview en tiempo real de cómo queda.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm italic text-slate-600">
              Ejemplo: &ldquo;Quiero una web elegante para mi barbería en Valencia. Estilo masculino, colores oscuros, sección de servicios con precios y botón de reserva por WhatsApp.&rdquo;
            </div>
            <Link href="/studio" className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-2xl text-sm font-semibold">
              Abrir el Studio <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 2. Plantillas */}
        <section id="plantillas" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">2. Usar una plantilla</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>Si prefieres empezar con una base visual, tenemos <strong>60+ plantillas premium</strong> en 5 categorías:</p>
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {['Gastronomía (restaurantes, cafeterías…)', 'Servicios (barberías, talleres, clínicas…)', 'Lujo & Estilo (joyería, spas, hoteles…)', 'Corporativo (abogados, consultoras…)', 'Tecnología (startups, SaaS, fintech…)'].map((cat) => (
                <div key={cat} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />
                  {cat}
                </div>
              ))}
            </div>
            <p>Cada plantilla tiene una imagen acorde al sector. Elige una, ábrela en el Studio y personalízala con tus textos, colores y fotos.</p>
            <Link href="/templates" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800">
              Ver catálogo de plantillas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 3. Créditos */}
        <section id="creditos" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">3. Créditos y precios</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>Cada cambio que pides en el Studio consume <strong>1 crédito</strong>. Los créditos se renuevan cada mes.</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { plan: 'Gratis', price: '0€', credits: '15 créditos/mes' },
                { plan: 'Pro', price: '19€/mes', credits: '120 créditos/mes' },
                { plan: 'Business', price: '49€/mes', credits: '300 créditos/mes' },
              ].map((p) => (
                <div key={p.plan} className="border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="font-bold text-slate-950">{p.plan}</div>
                  <div className="text-2xl font-bold text-indigo-600 mt-1">{p.price}</div>
                  <div className="text-xs text-slate-500 mt-1">{p.credits}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              A diferencia de otras plataformas como Emergent, <strong>no gastamos créditos extra</strong> solo por tener tu web publicada.
              Cuanto más refinada quieras tu diseño, más créditos usarás — tú controlas el proceso.
            </p>
            <Link href="/precios" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800">
              Ver precios y comparativa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 4. Refinar */}
        <section id="refinar" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">4. Refinar tu diseño</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>En el Studio puedes pedir cambios de forma conversacional. Cada cambio es <strong>instantáneo</strong> y ves el resultado al momento:</p>
            <ul className="space-y-2 text-sm">
              {[
                '“Hazla más elegante y con más espacio en blanco”',
                '“Cambia los colores a tonos tierra”',
                '“Añade una sección de testimonios”',
                '“Haz el botón de contacto más visible”',
                '“Optimiza la versión móvil”',
              ].map((q) => (
                <li key={q} className="flex gap-2 p-3 bg-slate-50 rounded-xl">
                  <span className="text-emerald-600">→</span> {q}
                </li>
              ))}
            </ul>
            <p className="text-sm">Sigue refinando hasta que quedes satisfecho. Recuerda: cada cambio = 1 crédito.</p>
          </div>
        </section>

        {/* 5. Entrega */}
        <section id="entrega" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
              <Download className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">5. Recibir y publicar tu web</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900">
              <strong>Importante:</strong> CREAUNA diseña y te entrega tu web. La publicación en tu dominio la haces tú (o tu técnico de confianza).
            </div>
            <p>Cuando tu diseño esté finalizado y hayas completado el pago, te entregamos la web de una de estas formas:</p>
            <ol className="space-y-3 list-none">
              {[
                'Enlace privado de preview para revisión final.',
                'Paquete de archivos completo (HTML, CSS, JS, imágenes).',
                'Exportación de código limpio (planes Pro y Business).',
                'Recibes la web en el mismo formato en que nos enviaste la antigua (si es modernización).',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-sm text-slate-600">
              Para publicar: sube los archivos a tu hosting, conecta tu dominio (.com, .es…) y listo.
              Si contratas el plan Business, incluimos hosting durante 1 año con guía paso a paso.
            </p>
          </div>
        </section>

        {/* 6. Modernizar */}
        <section id="modernizar" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">6. Modernizar una web antigua</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>¿Tu web tiene 5, 8 o más años? El servicio de <strong>Modernización</strong> la transforma por completo:</p>
            <ol className="space-y-3 list-none">
              {[
                'Nos envías la URL o capturas de tu web actual.',
                'Analizamos todo y te enviamos un informe en 24h.',
                'Reconstruimos la web desde cero con IA + supervisión creativa humana.',
                'Te entregamos la nueva web en menos de 72h para que la revises.',
                'Tú la publicas en tu dominio con los archivos que te entregamos.',
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="text-sm">Incluye comparativa Antes/Después, archivo de tu web antigua y 3 meses de ajustes menores. Planes desde 890€.</p>
            <Link href="/modernizacion" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800">
              Ver servicio de modernización <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 7. A medida */}
        <section id="medida" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <Paintbrush className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">7. Web completamente a medida</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>Para proyectos exclusivos, agencias o necesidades especiales que van más allá del Studio, ofrecemos <strong>Web a Medida</strong> supervisada personalmente por Ramón del Pozo Rott.</p>
            <p className="text-sm">Rellena el formulario de contacto, cuéntanos tu proyecto y recibirás una propuesta personalizada en menos de 24 horas.</p>
            <Link href="/web-a-medida" className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800">
              Solicitar web a medida <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 8. Pago */}
        <section id="pago" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">8. Pago y suscripción</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>Estamos integrando <strong>Stripe</strong> como pasarela de pago segura. De momento los cobros no están activos mientras preparamos la cuenta empresarial.</p>
            <p>Cuando esté disponible:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> Pago con tarjeta desde la página de precios.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> Sin permanencia: cancela cuando quieras.</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" /> La entrega de la web final solo se realiza tras completar el pago.</li>
            </ul>
          </div>
        </section>

        {/* 9. Ayuda */}
        <section id="ayuda" className="scroll-mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">9. Ayuda y contacto</h2>
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 text-slate-700 leading-relaxed">
            <p>¿Tienes dudas? Estamos aquí para ayudarte:</p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="font-semibold text-slate-950">Asistente CREAUNA</div>
                <p className="mt-1 text-slate-600">Chat en la esquina inferior derecha. Responde al instante, 24/7.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="font-semibold text-slate-950">Formulario de contacto</div>
                <p className="mt-1 text-slate-600">/contacto — Respuesta personal en menos de 24h.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="font-semibold text-slate-950">Email</div>
                <p className="mt-1 text-slate-600">info@ramondelpozorott.es</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="font-semibold text-slate-950">WhatsApp (solo urgencias)</div>
                <p className="mt-1 text-slate-600">+34 656 398 640</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <div className="text-center bg-slate-900 text-white rounded-3xl p-10 md:p-14">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">¿Listo para empezar?</h3>
          <p className="mt-3 text-slate-400 max-w-md mx-auto text-sm">
            Ahora ya sabes todo el proceso. Abre el Studio y crea tu web en minutos.
          </p>
          <Link href="/studio" className="mt-6 inline-block btn-gradient px-10 py-4 rounded-2xl text-base font-semibold shadow-lg">
            Crear mi web ahora
          </Link>
        </div>
      </div>
    </div>
  );
}
