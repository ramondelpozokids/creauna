import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant";
import { LanguageProvider } from "./components/LanguageProvider";
import { CREAUNA_SECURITY_SCRIPT } from "./lib/securityLayers";

export const metadata: Metadata = {
  title: "CREAUNA — Crea webs con IA en minutos | Diseño premium",
  description: "Crea webs modernas, rápidas y profesionales en minutos. Diseño premium y tecnología avanzada. Español. Fundado por Ramón del Pozo Rott.",
  keywords: [
    "crear web con IA", "constructor web IA", "páginas web con inteligencia artificial",
    "diseño web premium", "web builder español", "IA para crear webs",
    "creauna", "diseño web moderno", "plantillas web IA", "web con colores",
    "Ramón del Pozo Rott", "mejor constructor web 2026"
  ],
  authors: [{ name: "Ramón del Pozo Rott", url: "https://creauna.com" }],
  openGraph: {
    title: "CREAUNA — Crea webs impresionantes con IA",
    description: "Crea webs modernas y profesionales en minutos. Diseño premium, rápido y seguro. Español. Creado por Ramón del Pozo Rott.",
    images: [{ url: "/images/modern-architecture-minimalist-building--1.jpg" }],
    siteName: "CREAUNA",
  },
  icons: {
    icon: "/favicon.webp",
    apple: "/favicon.webp",
    shortcut: "/favicon.webp",
  },
  manifest: "/manifest.json",
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
        <LanguageProvider>
          {children}
          
          <Footer />
          <ChatAssistant />
          <Toaster position="top-center" richColors closeButton />
        </LanguageProvider>

        <script dangerouslySetInnerHTML={{ __html: CREAUNA_SECURITY_SCRIPT }} />
      </body>
    </html>
  );
}
