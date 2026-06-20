'use client';

import Navbar from '../components/Navbar';
import LegalLangNotice from '../components/LegalLangNotice';

export default function Datos() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container max-w-4xl py-16">
        <LegalLangNotice />
        <div className="max-w-3xl">
          <h1 className="text-6xl font-semibold tracking-tight">Protección de Datos</h1>
          <p className="mt-2 text-slate-500">Cumplimos estrictamente con el RGPD y la LOPD-GDD</p>
        </div>

        <div className="prose max-w-none mt-12 text-[15px] text-slate-700 leading-relaxed space-y-10">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Responsable del tratamiento</h3>
            <p>
              El responsable del tratamiento de los datos personales es <strong>Ramón del Pozo Rott</strong>, 
              con domicilio en España. Puedes contactar con nosotros en privacy@creauna.com.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Finalidades del tratamiento</h3>
            <p>Tratamos tus datos personales para las siguientes finalidades:</p>
            <ul>
              <li>Registro y gestión de tu cuenta en la Plataforma</li>
              <li>Creación, edición y publicación de tus sitios web</li>
              <li>Prestación de servicios de soporte y atención al cliente</li>
              <li>Mejora continua de nuestros algoritmos de inteligencia artificial</li>
              <li>Envío de comunicaciones comerciales (solo si has dado tu consentimiento)</li>
              <li>Cumplimiento de obligaciones legales y fiscales</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Base jurídica</h3>
            <p>
              El tratamiento de tus datos se basa en el consentimiento que nos prestas al registrarte, 
              en la ejecución del contrato que mantenemos contigo, y en el interés legítimo de mejorar 
              nuestros servicios.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Tus derechos</h3>
            <p>
              De acuerdo con la normativa vigente, puedes ejercer los siguientes derechos:
            </p>
            <ul>
              <li><strong>Acceso</strong> — Saber qué datos tenemos sobre ti</li>
              <li><strong>Rectificación</strong> — Corregir datos inexactos</li>
              <li><strong>Supresión</strong> — Solicitar la eliminación de tus datos</li>
              <li><strong>Limitación</strong> — Restringir el tratamiento de tus datos</li>
              <li><strong>Oposición</strong> — Oponerte al tratamiento de tus datos</li>
              <li><strong>Portabilidad</strong> — Recibir tus datos en un formato estructurado</li>
            </ul>
            <p className="mt-2">
              Para ejercer cualquiera de estos derechos, envía un email a <strong>privacy@creauna.com</strong> 
              adjuntando copia de tu DNI o documento equivalente.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Plazo de conservación</h3>
            <p>
              Mantendremos tus datos personales mientras tu cuenta esté activa o mientras sea necesario 
              para las finalidades para las que fueron recogidos. Una vez finalizada la relación, 
              conservaremos los datos durante los plazos legales exigidos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">Transferencias internacionales</h3>
            <p>
              Algunos de nuestros proveedores de servicios (infraestructura en la nube e IA) pueden 
              estar ubicados fuera del Espacio Económico Europeo. En estos casos aplicamos las 
              garantías adecuadas (cláusulas contractuales tipo aprobadas por la Comisión Europea).
            </p>
          </div>

          <div className="pt-8 border-t text-sm text-slate-500">
            Para cualquier duda sobre el tratamiento de tus datos personales, contacta con nuestro 
            Delegado de Protección de Datos en privacy@creauna.com
          </div>
        </div>
      </div>
    </div>
  );
}
