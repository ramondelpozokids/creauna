'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function Preview() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Toolbar */}
      <div className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-lg">
        <div className="container flex h-14 items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4" /> Back to dashboard
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <div>
              <span className="font-medium">Preview Mode</span> — 
              <span className="text-gray-500 ml-1">This is how your site will look live</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={`/editor/${id}`} 
              className="px-5 py-2 border text-sm rounded-2xl hover:bg-gray-50 font-medium"
            >
              Edit site
            </Link>
            <a 
              href={`https://demo-${id}.webfactory.app`} 
              target="_blank"
              className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-2xl font-medium text-sm"
            >
              Visit live site <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Site Preview */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium mb-2">PUBLISHED</div>
            <h1 className="text-5xl font-semibold tracking-tighter">Welcome to your beautiful website</h1>
            <p className="text-xl text-gray-600 mt-4 max-w-md mx-auto">This is a live preview of the site you are building with Web Factory.</p>
          </div>

          {/* Hero mock */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-12 mb-6">
            <div className="max-w-lg">
              <h2 className="text-5xl font-semibold tracking-tight">Build faster.<br />Launch better.</h2>
              <p className="mt-4 text-blue-100">The easiest way to create professional websites without code.</p>
              <div className="mt-8 flex gap-3">
                <button className="px-7 py-3 bg-white text-black font-medium rounded-2xl">Get started</button>
                <button className="px-7 py-3 border border-white/40 rounded-2xl">Watch demo</button>
              </div>
            </div>
          </div>

          {/* Features mock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-3xl p-7">
                <div className="font-semibold">Feature {i}</div>
                <div className="text-gray-600 mt-2 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
              </div>
            ))}
          </div>

          <div className="text-center py-6 text-sm text-gray-400 border-t">
            This is a simulated preview. Your real site will include all the blocks and design you create in the editor.
          </div>
        </div>
      </div>
    </div>
  );
}
