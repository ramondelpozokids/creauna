'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const articles = [
  {
    id: 1,
    title: "El nuevo estándar del diseño web en 2026",
    excerpt: "Por qué las webs de alto nivel ya no se miden por velocidad, sino por emoción y presencia.",
    date: "12 Jun 2026",
    readTime: "8 min",
    category: "Diseño",
    image: "/images/luxury-jewelry-atelier-elegant-interior--1.jpg"
  },
  {
    id: 2,
    title: "Cómo rescatamos una web de 2014 en 72 horas",
    excerpt: "El caso real de un restaurante con 9 años de antigüedad que multiplicó por 4 sus reservas.",
    date: "5 Jun 2026",
    readTime: "12 min",
    category: "Modernización",
    image: "/images/fine-dining-restaurant-interior-elegant--1.jpg"
  },
  {
    id: 3,
    title: "Ramón del Pozo Rott: “El diseño ya no es opcional”",
    excerpt: "Entrevista exclusiva con el fundador de CREAUNA sobre el futuro del diseño web con IA.",
    date: "28 May 2026",
    readTime: "15 min",
    category: "Entrevista",
    image: "/images/modern-architecture-minimalist-building--1.jpg"
  },
  {
    id: 4,
    title: "Por qué 94% de nuestros clientes publican en menos de 10 minutos",
    excerpt: "El proceso detrás de la velocidad extrema sin sacrificar calidad de estudio.",
    date: "20 May 2026",
    readTime: "6 min",
    category: "Tecnología",
    image: "/images/luxury-jewelry-atelier-elegant-interior--2.jpg"
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm font-semibold tracking-[3px] text-indigo-600">DIARIO CREAUNA</div>
          <h1 className="text-7xl font-semibold tracking-tight mt-4">Ideas que dejan huella.</h1>
          <p className="mt-4 text-2xl text-slate-600">
            Reflexiones, casos reales y el futuro del diseño web de alto nivel.
          </p>
        </div>
      </div>

      <div className="border-t">
        <div className="container py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {articles.map((article, index) => (
              <Link 
                key={index} 
                href={`/blog/${article.id}`} 
                className="group block bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="relative h-80">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 text-xs font-semibold tracking-wider px-4 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime} de lectura</span>
                  </div>
                  <h3 className="text-3xl font-semibold tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="mt-6 text-sm font-medium text-indigo-600 flex items-center gap-1">
                    Leer artículo <span className="group-hover:translate-x-1 transition">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-white py-16">
        <div className="container text-center max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight">¿Quieres recibir nuestras reflexiones?</h2>
          <p className="mt-4 text-white/70">Una carta mensual con los mejores artículos y tendencias de diseño.</p>
          <div className="mt-8 flex justify-center">
            <Link href="/contacto" className="px-10 py-4 rounded-3xl bg-white text-black font-semibold">
              Suscribirme al boletín
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
