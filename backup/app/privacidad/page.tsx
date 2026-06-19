'use client';

import Navbar from '../components/Navbar';

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-3xl py-16">
        <h1 className="text-5xl font-semibold tracking-tight">Política de Privacidad</h1>
        <div className="prose mt-8 text-slate-700">
          <p>En CREAUNA respetamos tu privacidad al 100%.</p>

          <h3>Datos que recogemos</h3>
          <ul>
            <li>Datos de registro (nombre, email)</li>
            <li>Contenido de las webs que creas</li>
            <li>Información de uso para mejorar el servicio</li>
          </ul>

          <h3>Cómo protegemos tus datos</h3>
          <p>Utilizamos 4 capas de seguridad avanzadas. Tus webs y datos nunca se comparten con terceros.</p>

          <h3>Tus derechos</h3>
          <p>Puedes solicitar acceso, modificación o eliminación de tus datos en cualquier momento escribiendo a <strong>privacy@creauna.com</strong>.</p>
        </div>
      </div>
    </div>
  );
}
