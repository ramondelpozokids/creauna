'use client';

import { motion } from 'framer-motion';

const motorsByLang = {
  es: [
    { id: 'visual', name: 'Motor Visual', role: 'Diseño e imágenes', color: 'bg-blue-500' },
    { id: 'copy', name: 'Motor de Redacción', role: 'Textos y SEO', color: 'bg-violet-500' },
    { id: 'code', name: 'Motor de Código', role: 'Estructura y animaciones', color: 'bg-emerald-500' },
    { id: 'ux', name: 'Motor de Experiencia', role: 'UX y conversión', color: 'bg-orange-500' },
  ],
  en: [
    { id: 'visual', name: 'Visual Engine', role: 'Design & images', color: 'bg-blue-500' },
    { id: 'copy', name: 'Copy Engine', role: 'Text & SEO', color: 'bg-violet-500' },
    { id: 'code', name: 'Code Engine', role: 'Structure & animations', color: 'bg-emerald-500' },
    { id: 'ux', name: 'Experience Engine', role: 'UX & conversion', color: 'bg-orange-500' },
  ],
};

interface Props {
  isActive: boolean;
  lang: 'es' | 'en';
}

export default function StudioAITeam({ isActive, lang }: Props) {
  const motors = motorsByLang[lang];

  return (
    <div className="px-7 py-4 border-b border-slate-100 bg-slate-50/50">
      <div className="text-[10px] tracking-widest text-slate-400 mb-2">
        {lang === 'es' ? 'EQUIPO IA EN SINCRONÍA' : 'AI TEAM IN SYNC'}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {motors.map((motor, i) => (
          <div
            key={motor.id}
            className={`flex items-center gap-2 p-2 rounded-xl border text-[10px] transition-all ${
              isActive ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-white'
            }`}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: isActive ? Infinity : 0, duration: 1.2, delay: i * 0.15 }}
              className={`w-2 h-2 rounded-full shrink-0 ${motor.color} ${isActive ? 'opacity-100' : 'opacity-40'}`}
            />
            <div className="min-w-0">
              <div className="font-semibold text-slate-800 truncate">{motor.name}</div>
              <div className="text-slate-400 truncate">{motor.role}</div>
            </div>
          </div>
        ))}
      </div>
      {isActive && (
        <p className="text-[10px] text-indigo-600 mt-2 font-medium">
          {lang === 'es' ? 'Cada motor cumple su misión sin conflictos…' : 'Each engine on mission, no conflicts…'}
        </p>
      )}
    </div>
  );
}
