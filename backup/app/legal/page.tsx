'use client';

import Navbar from '../components/Navbar';

export default function Legal() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container max-w-3xl py-16">
        <h1 className="text-5xl font-semibold tracking-tight">Aviso Legal</h1>
        <div className="prose max-w-none mt-8 text-slate-700">
          <p><strong>CREAUNA</strong> es una marca registrada propiedad de Ramón del Pozo Rott.</p>
          
          <h3>1. Información general</h3>
          <p>Este sitio web es propiedad de Ramón del Pozo Rott, con domicilio en España.</p>

          <h3>2. Propiedad intelectual</h3>
          <p>Todos los diseños, textos, códigos y herramientas generadas mediante CREAUNA están protegidos. Queda prohibida la copia, reproducción o uso comercial sin autorización expresa del titular.</p>

          <h3>3. Responsabilidad</h3>
          <p>CREAUNA no se hace responsable del uso indebido de las webs creadas por los usuarios.</p>

          <h3>4. Contacto</h3>
          <p>Para cualquier consulta legal: <a href="mailto:legal@creauna.com">legal@creauna.com</a></p>
        </div>
      </div>
    </div>
  );
}
