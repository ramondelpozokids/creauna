'use client';

import Navbar from '../components/Navbar';
import LegalLangNotice from '../components/LegalLangNotice';

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container max-w-4xl py-16">
        <LegalLangNotice />
        <div className="max-w-3xl">
          <h1 className="text-6xl font-semibold tracking-tight">Política de Privacidad</h1>
          <p className="mt-2 text-slate-500">Última actualización: 19 de junio de 2026</p>
        </div>

        <div className="prose max-w-none mt-12 text-[15px] text-slate-700 leading-relaxed space-y-10">
          <p className="text-xl text-slate-800">En CREAUNA respetamos tu privacidad al máximo nivel. Esta política explica cómo recogemos, usamos y protegemos tus datos.</p>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">1. Responsable del tratamiento</h3>
            <p>
              Ramón del Pozo Rott es el responsable del tratamiento de los datos personales que se recogen a través de la Plataforma CREAUNA.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">2. Datos que recogemos</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Datos de registro (nombre, correo electrónico, contraseña)</li>
              <li>Información necesaria para crear tus webs (textos, imágenes, preferencias)</li>
              <li>Datos de uso y navegación para mejorar el servicio</li>
              <li>Información de pago (gestionada por proveedores seguros)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">3. Finalidad del tratamiento</h3>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Proporcionarte acceso a la Plataforma y permitirte crear y gestionar webs</li>
              <li>Mejorar la experiencia de usuario y los algoritmos de IA</li>
              <li>Enviar comunicaciones relacionadas con el servicio</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">4. Cómo protegemos tus datos</h3>
            <p>
              Implementamos 4 capas de seguridad avanzadas. Tus webs y datos personales nunca se comparten con terceros 
              con fines comerciales. Toda la información se almacena en servidores seguros con cifrado de nivel empresarial.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">5. Tus derechos</h3>
            <p>
              Tienes derecho a acceder, rectificar, suprimir, limitar el tratamiento, oponerte y solicitar la portabilidad 
              de tus datos personales en cualquier momento.
            </p>
            <p className="mt-2">
              Para ejercer estos derechos, escríbenos a: <strong>privacy@creauna.com</strong>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">6. Conservación de datos</h3>
            <p>
              Conservaremos tus datos mientras mantengas una cuenta activa o mientras sea necesario para cumplir 
              con las finalidades para las que fueron recogidos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">7. Cambios en esta política</h3>
            <p>
              Nos reservamos el derecho a modificar esta Política de Privacidad. Cualquier cambio será publicado 
              en esta página con la fecha de actualización correspondiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
