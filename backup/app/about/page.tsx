'use client';

import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container py-16 max-w-3xl">
        <h1 className="text-6xl font-semibold tracking-tight">Sobre CREAUNA</h1>
        
        <div className="prose text-lg mt-8">
          <p className="text-2xl text-slate-700">CREAUNA nació de una idea muy simple:</p>
          <p className="text-3xl font-medium mt-2">"¿Y si un equipo completo de inteligencias artificiales pudiera construir webs tan bonitas como las mejores agencias del mundo?"</p>

          <div className="mt-10">
            <h3>Fundador y Director Creativo</h3>
            <p><strong>Ramón del Pozo Rott</strong> — Diseñador, emprendedor y visionario. Ha creado CREAUNA con la misión de democratizar el diseño web de alto nivel.</p>
          </div>

          <h3 className="mt-8">Nuestro equipo de IAs</h3>
          <ul>
            <li><strong>Gemini</strong> — Especialista en imágenes y visuales (Unsplash + IA)</li>
            <li><strong>Claude 3.5</strong> — Textos persuasivos y SEO</li>
            <li><strong>Composer 2.5</strong> — Código limpio y moderno</li>
            <li><strong>GPT-4o</strong> — Diseño, paletas de color y experiencia de usuario</li>
          </ul>

          <p className="mt-8">Todo coordinado por Ramón del Pozo Rott, el director de orquesta.</p>
        </div>
      </div>
    </div>
  );
}
