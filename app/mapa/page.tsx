'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Mapa() {
  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/studio', label: 'Studio IA' },
    { href: '/templates', label: 'Plantillas' },
    { href: '/precios', label: 'Precios' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/login', label: 'Iniciar sesión' },
    { href: '/signup', label: 'Crear cuenta' },
    { href: '/legal', label: 'Aviso Legal' },
    { href: '/privacidad', label: 'Política de Privacidad' },
    { href: '/cookies', label: 'Política de Cookies' },
    { href: '/datos', label: 'Protección de Datos' },
    { href: '/superadmin', label: 'Superadmin (Ramón)' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-2xl py-16">
        <h1 className="text-5xl font-semibold tracking-tight">Mapa del sitio</h1>
        <div className="mt-10 grid grid-cols-2 gap-4">
          {links.map((link, i) => (
            <Link key={i} href={link.href} className="p-4 border rounded-2xl hover:bg-slate-50">{link.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
