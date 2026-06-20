'use client';

import Navbar from '../components/Navbar';
import LegalLangNotice from '../components/LegalLangNotice';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container max-w-4xl py-16">
        <LegalLangNotice />
        <div className="max-w-3xl">
          <h1 className="text-6xl font-semibold tracking-tight">Política de Cookies</h1>
          <p className="mt-2 text-slate-500">Última actualización: 19 de junio de 2026</p>
        </div>

        <div className="prose max-w-none mt-12 text-[15px] text-slate-700 leading-relaxed space-y-10">
          <p className="text-xl">Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la plataforma y ofrecerte un servicio más personalizado.</p>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">1. ¿Qué son las cookies?</h3>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. 
              Permiten recordar tus preferencias y mejorar la navegación.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">2. Tipos de cookies que utilizamos</h3>
            
            <div className="space-y-6 mt-4">
              <div>
                <div className="font-semibold">Cookies esenciales (obligatorias)</div>
                <p className="text-sm">Necesarias para el funcionamiento básico de la Plataforma (inicio de sesión, seguridad, carrito, etc.). No se pueden desactivar.</p>
              </div>

              <div>
                <div className="font-semibold">Cookies de preferencias</div>
                <p className="text-sm">Permiten recordar tus elecciones (idioma, tema, configuraciones del Studio).</p>
              </div>

              <div>
                <div className="font-semibold">Cookies analíticas</div>
                <p className="text-sm">Nos ayudan a entender cómo se utiliza la plataforma para mejorarla. Usamos datos anonimizados.</p>
              </div>

              <div>
                <div className="font-semibold">Cookies de rendimiento</div>
                <p className="text-sm">Permiten medir el rendimiento de las webs creadas y optimizar la experiencia.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">3. Cómo gestionar las cookies</h3>
            <p>
              Puedes configurar o rechazar las cookies en cualquier momento a través de la configuración de tu navegador. 
              Ten en cuenta que desactivar algunas cookies puede afectar al correcto funcionamiento de CREAUNA.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">4. Cookies de terceros</h3>
            <p>
              Utilizamos servicios de terceros de confianza (análisis, seguridad, procesamiento de pagos). 
              Estos terceros pueden instalar sus propias cookies. Consulta sus políticas de privacidad para más información.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900">5. Contacto</h3>
            <p>
              Si tienes dudas sobre nuestra política de cookies, escríbenos a <strong>privacy@creauna.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
