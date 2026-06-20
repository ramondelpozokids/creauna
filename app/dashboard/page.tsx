'use client';

import Link from 'next/link';
import { useLanguage } from '../components/LanguageProvider';
import { dashboardI18n } from '../data/i18n/secondary';
import {
  Plus, Sparkles, TrendingUp, Users, Globe, Clock, ArrowUpRight, 
  Activity, Award, BarChart3, Eye, Edit3, ExternalLink, Calendar,
  ChevronRight, Star
} from 'lucide-react';

export default function Dashboard() {
  const { lang } = useLanguage();
  const d = dashboardI18n[lang];

  const stats = [
    { 
      label: "Webs activas", 
      value: "47", 
      change: "+12 este mes", 
      icon: Globe, 
      trend: "+26%", 
      trendUp: true,
      description: "vs. mes pasado"
    },
    { 
      label: "Publicadas", 
      value: "31", 
      change: "+8 este mes", 
      icon: TrendingUp, 
      trend: "+35%", 
      trendUp: true,
      description: "ya en producción"
    },
    { 
      label: "Visitantes totales", 
      value: "184.2k", 
      change: "+23% este mes", 
      icon: Users, 
      trend: "+19%", 
      trendUp: true,
      description: "sesiones únicas"
    },
    { 
      label: "Tiempo medio creación", 
      value: "8m 14s", 
      change: "Mejor que la media", 
      icon: Clock, 
      trend: "", 
      trendUp: true,
      description: "récord histórico"
    },
  ];

  const projects = [
    { 
      id: 1, 
      name: "Atelier Joyería", 
      status: "Publicada", 
      updated: "Hace 2 horas", 
      style: "Lujo", 
      visitors: "42.8k", 
      url: "atelier.creauna.com", 
      growth: "+18%", 
      growthUp: true 
    },
    { 
      id: 2, 
      name: "Arc Arquitectos", 
      status: "Publicada", 
      updated: "Ayer", 
      style: "Minimal", 
      visitors: "19.4k", 
      url: "arc.creauna.com", 
      growth: "+7%", 
      growthUp: true 
    },
    { 
      id: 3, 
      name: "Sable Restaurant", 
      status: "Borrador", 
      updated: "Hace 3 días", 
      style: "Gastronomía", 
      visitors: "—", 
      url: "", 
      growth: "—", 
      growthUp: false 
    },
    { 
      id: 4, 
      name: "Lumen Clinic", 
      status: "Publicada", 
      updated: "12 Mar", 
      style: "Salud & Belleza", 
      visitors: "31.2k", 
      url: "lumen.creauna.com", 
      growth: "+12%", 
      growthUp: true 
    },
    { 
      id: 5, 
      name: "Vesper Studio", 
      status: "Publicada", 
      updated: "Hace 1 semana", 
      style: "Diseño", 
      visitors: "27.6k", 
      url: "vesper.creauna.com", 
      growth: "+31%", 
      growthUp: true 
    },
  ];

  const recentActivity = [
    { action: "Web publicada", project: "Atelier Joyería", time: "Hace 2 horas", icon: ExternalLink },
    { action: "Cambios guardados", project: "Arc Arquitectos", time: "Ayer", icon: Edit3 },
    { action: "Nueva web creada", project: "Sable Restaurant", time: "Hace 3 días", icon: Plus },
    { action: "Dominio conectado", project: "Lumen Clinic", time: "12 Mar", icon: Globe },
    { action: "Plantilla aplicada", project: "Vesper Studio", time: "Hace 1 semana", icon: Star },
  ];

  const insights = [
    { label: "Mejor rendimiento", value: "Atelier (+42%)", detail: "Conversión líder" },
    { label: "Crecimiento promedio", value: "+19%", detail: "Últimos 30 días" },
    { label: "Webs con mejor conversión", value: "3", detail: "Top performers" },
    { label: "Tasa de finalización", value: "94%", detail: "Studio → Publicación" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Ultra-Premium Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-black/10 shadow-sm">
                <img 
                  src="/images/logo.png" 
                  alt="CREAUNA" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <span className="font-semibold text-[21px] tracking-[-1.8px] text-slate-900">CREAUNA</span>
              </div>
            </Link>
            <div className="px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-medium tracking-[1px] border border-emerald-200">PRO</div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/studio" 
              className="flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium hover:bg-slate-100 rounded-2xl transition-all text-slate-700 hover:text-slate-900"
            >
              <Sparkles className="w-4 h-4" /> Studio
            </Link>
            <Link 
              href="/templates" 
              className="flex items-center gap-2.5 px-6 py-2.5 text-sm font-medium hover:bg-slate-100 rounded-2xl transition-all text-slate-700 hover:text-slate-900"
            >
              {lang === 'es' ? 'Plantillas' : 'Templates'}
            </Link>
            <div className="flex items-center gap-4 pl-6 ml-2 border-l border-slate-200">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[15px] font-semibold tracking-tight text-slate-900">Ramón del Pozo Rott</div>
                  <div className="text-xs text-slate-500 tracking-wide">{lang === 'es' ? 'Fundador • Superadmin' : 'Founder • Superadmin'}</div>
                </div>
                <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-inner">
                  <img src="/creador.webp" alt="Ramón del Pozo Rott" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Luxurious Header - Ultra Refined */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-xs font-medium text-slate-500 tracking-[3px] uppercase">{lang === 'es' ? 'DASHBOARD PRIVADO' : 'PRIVATE DASHBOARD'}</div>
            <div className="h-px w-8 bg-slate-300"></div>
            <div className="text-xs font-medium text-emerald-700 tracking-wider">19 de junio, 2026</div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="luxury-heading text-[64px] leading-[1.05] font-semibold tracking-[-5.2px] text-slate-950">
                {lang === 'es' ? 'Buenos días, Ramón.' : 'Good morning, Ramón.'}
              </h1>
              <p className="text-2xl text-slate-600 mt-3 max-w-[620px] tracking-[-0.2px]">
                {lang === 'es'
                  ? 'Tienes 47 webs activas. El 66% ya están generando resultados medibles.'
                  : 'You have 47 active sites. 66% are already generating measurable results.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link 
                href="/studio" 
                className="flex items-center gap-3 px-7 py-3.5 rounded-3xl border border-slate-200 hover:bg-white hover:border-slate-300 text-sm font-medium transition-all group"
              >
                <Sparkles className="w-4 h-4" /> 
                {d.openStudio}
              </Link>
              <Link 
                href="/studio" 
                className="premium-btn premium-btn-primary flex items-center gap-3 px-7 py-3.5 rounded-3xl text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" /> {d.newProject}
              </Link>
            </div>
          </div>
        </div>

        {/* Ultra Premium Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card rounded-3xl p-7 border border-slate-200 bg-white group"
            >
              <div className="flex items-start justify-between mb-7">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <stat.icon className="w-4.5 h-4.5 text-slate-600 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium tracking-wider text-slate-500">{stat.label}</div>
                  </div>
                </div>
                {stat.trend && (
                  <div className={`text-xs font-semibold px-3 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {stat.trend}
                  </div>
                )}
              </div>
              
              <div className="text-[52px] leading-none font-semibold tracking-[-2.8px] text-slate-950 mb-1">{stat.value}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-emerald-700 tracking-tight">{stat.change}</div>
                <div className="text-xs text-slate-500">{stat.description}</div>
              </div>
              {/* Subtle trend line */}
              {stat.trend && (
                <div className="mt-4 h-px bg-gradient-to-r from-emerald-300/30 to-transparent w-1/3"></div>
              )}
            </div>
          ))}
        </div>

        {/* Main Premium Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Projects Section - The Star */}
          <div className="lg:col-span-8">
            <div className="flex items-end justify-between mb-7 px-1">
              <div>
                <div className="text-sm font-medium tracking-[2px] text-slate-500">TUS PROYECTOS</div>
                <div className="text-[34px] font-semibold tracking-[-1.4px] mt-1 text-slate-950">Webs activas</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-500">5 de 47</div>
                <Link 
                  href="/templates" 
                  className="text-sm font-medium text-slate-900 hover:text-slate-600 flex items-center gap-1.5 transition-colors"
                >
                  Ver catálogo completo <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Premium Search + Filters */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar proyectos..." 
                    className="bg-white border border-slate-200 focus:border-slate-300 text-sm rounded-2xl pl-10 py-2.5 pr-4 w-72 placeholder:text-slate-400 focus:outline-none"
                  />
                  <div className="absolute left-4 top-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex text-sm bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <button className="px-5 py-2 text-slate-700 hover:bg-slate-50 font-medium text-xs tracking-wider">TODOS</button>
                  <button className="px-5 py-2 text-slate-700 hover:bg-slate-50 border-l border-slate-200 font-medium text-xs tracking-wider">PUBLICADAS</button>
                  <button className="px-5 py-2 text-slate-700 hover:bg-slate-50 border-l border-slate-200 font-medium text-xs tracking-wider">BORRADORES</button>
                </div>
              </div>
              
              <Link href="/studio" className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-2xl transition-all">
                <Plus className="w-3.5 h-3.5" /> NUEVO PROYECTO
              </Link>
            </div>

            {/* High-End Projects Table */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full premium-table">
                <thead>
                  <tr className="border-b bg-slate-50/70">
                    <th className="text-left px-8 py-5 text-xs font-medium text-slate-500 tracking-wider">PROYECTO</th>
                    <th className="text-left px-6 py-5 text-xs font-medium text-slate-500 tracking-wider">ESTILO</th>
                    <th className="text-left px-6 py-5 text-xs font-medium text-slate-500 tracking-wider">ESTADO</th>
                    <th className="text-left px-6 py-5 text-xs font-medium text-slate-500 tracking-wider">VISITANTES</th>
                    <th className="text-left px-6 py-5 text-xs font-medium text-slate-500 tracking-wider">CRECIMIENTO</th>
                    <th className="text-left px-6 py-5 text-xs font-medium text-slate-500 tracking-wider">ACTUALIZADO</th>
                    <th className="text-right px-8 py-5 text-xs font-medium text-slate-500 tracking-wider w-44">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50/70 group transition-colors">
                      <td className="px-8 py-[23px]">
                        <div>
                          <div className="font-semibold text-[17px] tracking-[-0.3px] text-slate-900">{project.name}</div>
                          {project.url && (
                            <a 
                              href={`https://${project.url}`} 
                              target="_blank" 
                              className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline font-medium flex items-center gap-1 mt-0.5"
                            >
                              {project.url} <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-[23px]">
                        <span className="inline-flex text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full tracking-wider">
                          {project.style}
                        </span>
                      </td>
                      <td className="px-6 py-[23px]">
                        <span className={`status-badge inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold tracking-wide ${project.status === 'Publicada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-[23px]">
                        <div className="text-[15px] font-semibold tracking-tight text-slate-800">{project.visitors}</div>
                      </td>
                      <td className="px-6 py-[23px]">
                        <div className={`flex items-center gap-1 text-sm font-semibold tracking-tight ${project.growthUp ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {project.growth !== "—" && <ArrowUpRight className="w-3.5 h-3.5" />}
                          {project.growth}
                        </div>
                      </td>
                      <td className="px-6 py-[23px]">
                        <div className="text-sm text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {project.updated}
                        </div>
                      </td>
                      <td className="px-8 py-[23px] text-right">
                        <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100">
                          {project.status === 'Publicada' ? (
                            <>
                              <a 
                                href={`https://${project.url}`} 
                                target="_blank" 
                                className="action-btn px-4 py-2 text-xs rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-white font-medium flex items-center gap-1.5 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5" /> Ver
                              </a>
                              <Link 
                                href={`/studio?id=${project.id}`} 
                                className="action-btn px-4 py-2 text-xs rounded-2xl bg-slate-900 text-white font-medium hover:bg-black flex items-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> Editar
                              </Link>
                            </>
                          ) : (
                            <Link 
                              href={`/studio?id=${project.id}`} 
                              className="action-btn px-5 py-2 text-xs rounded-2xl bg-slate-900 text-white font-medium hover:bg-black flex items-center gap-1.5"
                            >
                              Continuar <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-500">
              <div>Mostrando 5 proyectos recientes • <span className="font-medium text-slate-700">42 proyectos más</span></div>
              <Link href="/studio" className="font-medium hover:text-slate-900 flex items-center gap-1">Ver todos los proyectos <ChevronRight className="w-3 h-3" /></Link>
            </div>
          </div>

          {/* Right Sidebar - Ultra Premium */}
          <div className="lg:col-span-4 space-y-7">
            
            {/* Recent Activity */}
            <div>
              <div className="flex items-center gap-2 px-1 mb-4">
                <Activity className="w-4 h-4 text-slate-500" />
                <div className="text-sm font-medium text-slate-500 tracking-[1.5px]">ACTIVIDAD RECIENTE</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-7 sidebar-card">
                <div className="space-y-6">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="insight-row flex justify-between items-start gap-4 py-0.5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 mt-0.5 rounded-2xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-medium text-[14.5px] tracking-tight">{item.action}</div>
                          <div className="text-xs text-slate-500 mt-px">{item.project}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 whitespace-nowrap pt-1 font-mono tracking-tight">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Snapshot / Insights */}
            <div>
              <div className="flex items-center gap-2 px-1 mb-4">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <div className="text-sm font-medium text-slate-500 tracking-[1.5px]">SNAPSHOT DE RENDIMIENTO</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-7 sidebar-card">
                <div className="space-y-6">
                  {insights.map((insight, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-slate-600">{insight.label}</div>
                        <div className="font-semibold tracking-tight mt-0.5 text-lg">{insight.value}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-emerald-700 font-medium mt-2">{insight.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t flex items-center justify-between text-xs text-slate-400">
                  <div>Última actualización</div>
                  <div className="font-mono tracking-tight">hace 8 minutos</div>
                </div>
              </div>
            </div>

            {/* Premium Recommendations */}
            <div>
              <div className="flex items-center gap-2 px-1 mb-4">
                <Award className="w-4 h-4 text-slate-500" />
                <div className="text-sm font-medium text-slate-500 tracking-[1.5px]">ACCIONES RECOMENDADAS</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-7 sidebar-card space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                  <div>
                    <div className="font-medium text-slate-900">Optimizar Atelier</div>
                    <div className="text-xs text-slate-500">+12% potencial de conversión</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                  <div>
                    <div className="font-medium text-slate-900">Conectar dominio Arc</div>
                    <div className="text-xs text-slate-500">Listo para producción</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all">
                  <div>
                    <div className="font-medium text-slate-900">Revisar estadísticas Lumen</div>
                    <div className="text-xs text-slate-500">Mejora de 29% detectada</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Quick Stats Mini */}
            <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-3xl p-7 text-sm">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4" />
                <div className="text-xs tracking-[1.5px] font-medium opacity-75">DESTACADO DEL MES</div>
              </div>
              <div className="text-4xl font-semibold tracking-[-1.5px]">Atelier Joyería</div>
              <div className="mt-1 text-white/70">42.8k visitantes • Mejor conversión</div>
              <div className="text-xs mt-5 opacity-60">Recomendado para destacar en la web corporativa</div>
            </div>
          </div>
        </div>

        {/* Bottom Premium Bar */}
        <div className="mt-14 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">Todo está al día.</span> Última sincronización hace 3 minutos.
          </div>
          <Link 
            href="/studio" 
            className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium group"
          >
            {d.studioLink} <span className="font-semibold underline group-hover:no-underline">{d.studioLinkAction}</span> 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Ultra-Premium Trust Footer Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            {d.secure}
          </div>
        </div>
      </div>
    </div>
  );
}
