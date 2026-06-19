'use client';

import Navbar from '../components/Navbar';

export default function Legal() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container max-w-4xl py-16">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-semibold tracking-tight">Aviso Legal</h1>
          <p className="mt-2 text-slate-500">Última actualización: 19 de junio de 2026</p>
        </div>

        <div className="prose max-w-none mt-12 text-slate-700 text-[15px] leading-relaxed space-y-8">
          <div>
            <h3 className="font-semibold text-xl text-slate-900">1. Información general</h3>
            <p>
              Este sitio web es propiedad de <strong>Ramón del Pozo Rott</strong>, con domicilio en España. 
              CREAUNA es una marca registrada y operada bajo su titularidad.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-slate-900">2. Objeto</h3>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web www.creauna.com y de todos los servicios, 
              herramientas y contenidos que ofrece la plataforma CREAUNA (en adelante, “la Plataforma”).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-slate-900">3. Propiedad intelectual e industrial</h3>
            <p>
              Todos los contenidos del sitio (diseños, textos, código, imágenes, logotipos, software, etc.) son propiedad 
              exclusiva de Ramón del Pozo Rott o de terceros que han autorizado su uso. 
              Queda estrictamente prohibida la reproducción, distribución, comunicación pública o transformación de dichos 
              contenidos sin autorización expresa y por escrito del titular.
            </p>
            <p>
              Las webs generadas por los usuarios mediante la Plataforma son propiedad del usuario que las creó, 
              siempre que haya abonado los servicios correspondientes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-slate-900">4. Responsabilidad</h3>
            <p>
              CREAUNA no se responsabiliza del contenido de las webs creadas por los usuarios ni del uso que estos 
              hagan de las mismas. El usuario es el único responsable del contenido, legalidad y correcta utilización 
              de las webs que cree.
            </p>
            <p>
              CREAUNA no garantiza la disponibilidad ininterrumpida del servicio, aunque realizará los esfuerzos 
              razonables para mantener la Plataforma operativa.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-slate-900">5. Protección de datos</h3>
            <p>
              El tratamiento de los datos personales se rige por nuestra Política de Privacidad y Política de Protección de Datos, 
              disponibles en este mismo sitio.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-slate-900">6. Legislación aplicable y jurisdicción</h3>
            <p>
              El presente Aviso Legal se rige por la legislación española. 
              Para la resolución de cualquier controversia derivada del uso de la Plataforma, las partes se someten 
              a los Juzgados y Tribunales de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-slate-900">7. Contacto</h3>
            <p>
              Para cualquier cuestión legal relacionada con CREAUNA, puedes contactar con nosotros en:
            </p>
            <p className="font-medium">legal@creauna.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
