'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const projects = [
    { id: 1, name: "Atelier Joyería", status: "Publicada", updated: "Hace 2h", style: "Elegante" },
    { id: 2, name: "Arc Finanzas", status: "Borrador", updated: "Ayer", style: "Minimal" },
    { id: 3, name: "Vesper", status: "Publicada", updated: "12 Mar", style: "Moderno" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar variant="dashboard" />

      <div className="container pt-12 pb-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="text-6xl font-semibold tracking-[-4.5px]">Tus proyectos</h1>
            <p className="text-slate-600 mt-2 text-lg">3 proyectos • 2 publicados</p>
          </div>

          <div className="flex gap-3">
            <Link 
              href="/studio" 
              className="flex items-center gap-3 px-8 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" /> Abrir Studio
            </Link>
            <Link 
              href="/studio" 
              className="flex items-center gap-3 bg-slate-900 text-white px-7 py-3 rounded-2xl font-medium text-sm"
            >
              <Plus className="w-4 h-4" /> Nuevo proyecto
            </Link>
          </div>
        </div>

        {/* Studio card */}
        <div className="mb-10">
          <Link href="/studio" className="group block">
            <div className="premium-card border-slate-200 rounded-3xl p-8 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1 bg-slate-100 text-xs tracking-[2px] rounded-full">NUEVO</div>
                    <span className="font-medium">CREAUNA Studio</span>
                  </div>
                  <div className="text-4xl tracking-[-2px] font-semibold mt-4">Crea con IA.<br />Al instante.</div>
                  <div className="text-slate-600 mt-3">La experiencia de diseño con IA más premium.</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400 group-hover:text-slate-600">Empezar ahora →</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Projects */}
        <div>
          <div className="flex justify-between items-center mb-5 px-1">
            <div className="text-sm text-slate-500 tracking-widest">PROYECTOS RECIENTES</div>
            <Link href="/templates" className="text-sm text-slate-500 hover:text-slate-900">Ver todas las plantillas →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/studio`} className="group">
                <div className="premium-card border-slate-200 p-8 rounded-3xl hover:border-slate-300 transition-all h-full flex flex-col">
                  <div className="flex-1">
                    <div className="font-semibold text-2xl tracking-tight">{project.name}</div>
                    <div className="text-slate-500 text-sm mt-1">{project.style} • {project.updated}</div>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-8">
                    <div className={`px-3 py-1 rounded-full ${project.status === 'Publicada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {project.status}
                    </div>
                    <div className="text-slate-400 group-hover:text-slate-600">Abrir →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
