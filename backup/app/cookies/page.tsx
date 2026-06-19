'use client';

import Navbar from '../components/Navbar';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-3xl py-16">
        <h1 className="text-5xl font-semibold tracking-tight">Política de Cookies</h1>
        <div className="prose mt-8 text-slate-700">
          <p>Utilizamos cookies esenciales para el correcto funcionamiento de la plataforma.</p>
          
          <h3>Cookies que usamos</h3>
          <ul>
            <li>Cookies de sesión (obligatorias)</li>
            <li>Cookies de preferencias</li>
            <li>Cookies analíticas (anónimas)</li>
          </ul>

          <p>Puedes configurar tus preferencias de cookies en cualquier momento desde los ajustes de tu navegador.</p>
        </div>
      </div>
    </div>
  );
}
