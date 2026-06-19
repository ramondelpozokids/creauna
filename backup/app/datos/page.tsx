'use client';

import Navbar from '../components/Navbar';

export default function Datos() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-3xl py-16">
        <h1 className="text-5xl font-semibold tracking-tight">Protección de Datos</h1>
        <div className="prose mt-8 text-slate-700">
          <p>En CREAUNA tu privacidad es sagrada. Cumplimos con el RGPD y la LOPD-GDD.</p>
          
          <h3>Responsable del tratamiento</h3>
          <p>Ramón del Pozo Rott es el responsable del tratamiento de tus datos personales.</p>

          <h3>Finalidad</h3>
          <p>Crear y gestionar tus sitios web, mejorar el servicio y enviarte comunicaciones relacionadas con CREAUNA.</p>

          <h3>Derechos</h3>
          <p>Tienes derecho a acceder, rectificar, suprimir, limitar, oponerte y portar tus datos. Contacta con privacy@creauna.com</p>

          <p className="mt-8 text-sm text-slate-500">Última actualización: Junio 2026</p>
        </div>
      </div>
    </div>
  );
}
