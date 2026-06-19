import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant";

export const metadata: Metadata = {
  title: "CREAUNA — Crea webs con IA en minutos | Diseño premium",
  description: "El constructor de páginas web con IA más avanzado del mundo. Equipo de 4 IAs (Gemini, Claude, Composer, GPT) trabajando en equipo. Diseños coloridos, modernos y premium. Creado por Ramón del Pozo Rott.",
  keywords: [
    "crear web con IA", "constructor web IA", "páginas web con inteligencia artificial",
    "diseño web premium", "web builder español", "IA para crear webs",
    "creauna", "diseño web moderno", "plantillas web IA", "web con colores",
    "Ramón del Pozo Rott", "mejor constructor web 2026"
  ],
  authors: [{ name: "Ramón del Pozo Rott", url: "https://creauna.com" }],
  openGraph: {
    title: "CREAUNA — Crea webs impresionantes con IA",
    description: "Diseños premium creados por un equipo de IAs especializadas. Español • Rápido • Seguro • Colorido",
    images: [{ url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80" }],
    siteName: "CREAUNA",
  },
  icons: { icon: "/favicon.ico" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        
        <Footer />
        <ChatAssistant />
        <Toaster position="top-center" richColors closeButton />

        {/* Security Layer 1: Client-side protection */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // CREAUNA Security Layer 1 & 2
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.addEventListener('keydown', function(e) {
              if (e.key === "F12" || 
                  (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || 
                  (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                console.log('%c[CREAUNA] Protección de seguridad activada. Acceso no autorizado registrado.', 'color:#f43f5e;font-size:10px');
              }
            });
            
            // Security Layer 3: Anti-inspect
            setInterval(() => {
              if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                document.body.innerHTML = '<div style="padding:40px;text-align:center;font-family:system-ui;color:#64748b">Acceso restringido por seguridad CREAUNA.</div>';
              }
            }, 3000);

            console.log('%c[CREAUNA] 4 capas de seguridad activas. Propiedad de Ramón del Pozo Rott.', 'color:#6366f1;font-size:9px');
          `
        }} />
      </body>
    </html>
  );
}
