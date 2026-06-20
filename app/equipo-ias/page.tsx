'use client';

import Navbar from '../components/Navbar';

const motores = [
  {
    name: "Motor Visual",
    role: "Imágenes & Visuales",
    desc: "Genera fotos de alta calidad y visuales profesionales. Iluminación perfecta y composición de nivel estudio.",
    color: "from-blue-500 to-cyan-400"
  },
  {
    name: "Motor de Redacción",
    role: "Textos & Copywriting",
    desc: "Escribe textos persuasivos, SEO optimizados, descripciones de producto y storytelling emocional.",
    color: "from-purple-500 to-violet-500"
  },
  {
    name: "Motor de Código",
    role: "Código & Estructura",
    desc: "Construye componentes modernos, animaciones suaves, código limpio y responsive perfecto.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "Motor de Experiencia",
    role: "Diseño & UX",
    desc: "Elige paletas de color vibrantes, tipografía elegante y crea la mejor experiencia de usuario.",
    color: "from-orange-500 to-rose-500"
  }
];

export default function EquipoIAs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-medium text-indigo-600">EL EQUIPO DETRÁS DE CADA WEB</div>
          <h1 className="text-6xl font-semibold tracking-tight mt-3">Inteligencia artificial trabajando como un solo equipo</h1>
          <p className="mt-6 text-xl text-slate-600">Ramón del Pozo Rott supervisa el proceso. Cada motor hace lo que mejor sabe hacer.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {motores.map((motor, index) => (
            <div key={index} className="premium-card p-8 rounded-3xl border">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${motor.color} mb-6`} />
              <div className="font-semibold text-2xl">{motor.name}</div>
              <div className="text-sm text-indigo-600 font-medium mt-1">{motor.role}</div>
              <p className="mt-4 text-slate-600">{motor.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-slate-50 rounded-3xl p-12">
          <div className="text-2xl font-medium">“No es solo una IA. Es un equipo completo de especialistas trabajando en sincronía.”</div>
          <div className="mt-6 text-sm text-slate-500">— Ramón del Pozo Rott, Supervisor Creativo</div>
        </div>
      </div>
    </div>
  );
}
