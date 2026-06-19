'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="container pt-20 pb-16 max-w-5xl">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-semibold tracking-wider mb-6">
            FUNDADO EN 2024
          </div>
          <h1 className="text-7xl font-semibold tracking-tight leading-none">
            CREAUNA nace para<br />elevar el nivel.
          </h1>
          <p className="mt-6 text-2xl text-slate-600">
            No creamos webs funcionales.<br />
            Creamos presencia. Identidad. Experiencia.
          </p>
        </div>
      </div>

      {/* Sección del Creador - NIVEL MÁS ALTO */}
      <div className="bg-[#f8f7f4] py-20 border-y border-slate-200">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-12 gap-x-16 items-center">
            
            {/* Foto del creador - ultra premium */}
            <div className="md:col-span-5">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
                <img 
                  src="/images/ramon-del-pozo-rott.jpg" 
                  alt="Ramón del Pozo Rott - Fundador y Director Creativo de CREAUNA" 
                  className="w-full aspect-[4/3] object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/75" />
                <div className="absolute bottom-10 left-10 text-white">
                  <div className="text-[11px] tracking-[3px] font-medium opacity-75">FUNDADOR &amp; DIRECTOR CREATIVO</div>
                  <div className="text-5xl font-semibold tracking-[-1.2px] mt-2">Ramón del Pozo Rott</div>
                </div>
              </div>
            </div>

            {/* Texto del creador - muy refinado */}
            <div className="md:col-span-7 mt-10 md:mt-0">
              <div className="max-w-[560px]">
                <div className="uppercase tracking-[3px] text-xs font-semibold text-slate-500">EL HOMBRE DETRÁS DE CREAUNA</div>
                
                <h2 className="mt-3 text-5xl font-semibold tracking-[-1.5px] leading-none">
                  Diseñar al más alto nivel<br />no debería ser un privilegio.
                </h2>

                <div className="mt-8 text-[17px] leading-relaxed text-slate-700 space-y-6">
                  <p>
                    Llevo más de doce años creando webs para marcas que exigen lo mejor. 
                    Proyectos que duraban meses y costaban decenas de miles de euros.
                  </p>
                  <p>
                    Un día me pregunté: <span className="font-medium text-slate-900">“¿Por qué el mejor diseño solo está al alcance de unos pocos?”</span>
                  </p>
                  <p>
                    Esa pregunta fue el origen de CREAUNA. Hoy combinamos inteligencia artificial de vanguardia con dirección creativa humana para entregar el mismo nivel de excelencia en minutos, no en meses.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="text-sm font-medium">Ramón del Pozo Rott</div>
                  <div className="text-sm text-slate-500">Fundador &amp; Director Creativo</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container py-20 max-w-5xl">
        <div className="text-center mb-14">
          <div className="text-sm font-semibold tracking-[2px] text-indigo-600">NUESTRO ENFOQUE</div>
          <h2 className="text-5xl font-semibold tracking-tight mt-3">Lo que nos diferencia</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Diseño de estudio, no plantillas",
              desc: "Cada web que entregamos tiene el nivel de detalle, proporción y emoción de un proyecto de agencia de alto nivel."
            },
            {
              title: "Velocidad sin renunciar a nada",
              desc: "Hemos conseguido lo imposible: que una web premium pueda crearse en minutos manteniendo la máxima calidad."
            },
            {
              title: "Tecnología con alma",
              desc: "Usamos IA avanzada, pero todo el proceso creativo está dirigido por humanos con gusto exquisito."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 border border-slate-200 rounded-3xl">
              <div className="text-3xl font-semibold tracking-tight">{item.title}</div>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 text-white py-20">
        <div className="container max-w-3xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight">Nuestro compromiso</h2>
          <p className="mt-6 text-xl text-white/80">
            Si nuestra web no es espectacular, no tenemos derecho a cobrar por hacer webs espectaculares a otros.
          </p>
          <div className="mt-10">
            <Link href="/studio" className="inline-block px-10 py-4 rounded-3xl bg-white text-black font-semibold text-lg">
              Ver lo que hacemos
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-16 text-center text-sm text-slate-500">
        CREAUNA es una empresa española fundada por Ramón del Pozo Rott.
      </div>
    </div>
  );
}
