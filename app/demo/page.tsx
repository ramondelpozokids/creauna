'use client';

import Navbar from '../components/Navbar';
import ClientProductDemo from '../components/ClientProductDemo';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />
      <div className="container pt-24 pb-20">
        <ClientProductDemo />
      </div>
    </div>
  );
}
