'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  Plus, Trash2, Eye, Save, ArrowLeft, 
  Type, Image as ImageIcon, MousePointer, Layout 
} from 'lucide-react';
import { toast } from 'sonner';

interface Block {
  id: number;
  type: string;
  content: string;
  style?: string;
}

export default function Editor() {
  const params = useParams();
  const websiteId = params.id;

  const [websiteName, setWebsiteName] = useState('My New Website');
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'hero', content: 'Welcome to the future', style: 'default' },
    { id: 2, type: 'text', content: 'Build beautiful websites in minutes with our powerful no-code platform.' },
    { id: 3, type: 'cta', content: 'Start for free' },
  ]);
  
  const [selectedBlockId, setSelectedBlockId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const addBlock = (type: string) => {
    const defaultContent = {
      hero: 'Your new headline here',
      text: 'Add your compelling text here...',
      cta: 'Get started',
      image: 'Beautiful image',
      features: 'Our key features',
      testimonial: 'This changed everything for us.'
    }[type] || 'New content';

    const newBlock: Block = {
      id: Date.now(),
      type,
      content: defaultContent,
    };

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    toast.success(`Added ${type} block`);
  };

  const updateBlockContent = (id: number, content: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content } : block
    ));
  };

  const deleteBlock = (id: number) => {
    setBlocks(blocks.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    toast.info("Block deleted");
  };

  const moveBlock = (id: number, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(direction === 'up' ? index - 1 : index + 1, 0, moved);
    
    setBlocks(newBlocks);
  };

  const saveWebsite = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Website saved successfully!");
    }, 650);
  };

  const publishWebsite = () => {
    saveWebsite();
    setTimeout(() => {
      toast.success("Website published! Live at yourdomain.webfactory.app", {
        action: { label: "View", onClick: () => window.open('/preview/' + websiteId, '_blank') }
      });
    }, 800);
  };

  const blockTypes = [
    { type: 'hero', label: 'Hero', icon: <Layout className="w-4 h-4" /> },
    { type: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { type: 'cta', label: 'Call to Action', icon: <MousePointer className="w-4 h-4" /> },
    { type: 'image', label: 'Image', icon: <ImageIcon className="w-4 h-4" /> },
    { type: 'features', label: 'Features', icon: <Layout className="w-4 h-4" /> },
    { type: 'testimonial', label: 'Testimonial', icon: <Type className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
      {/* LEFT SIDEBAR - BLOCKS */}
      <div className="w-72 border-r bg-white flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center text-sm gap-2 text-gray-600 hover:text-black">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold tracking-widest text-gray-500 mb-3 px-1">ADD BLOCKS</div>
          <div className="grid grid-cols-2 gap-2">
            {blockTypes.map((item) => (
              <button
                key={item.type}
                onClick={() => addBlock(item.type)}
                className="flex flex-col items-center justify-center gap-1.5 p-3 border rounded-2xl hover:bg-gray-50 hover:border-gray-300 text-sm transition-all active:scale-[0.985]"
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="text-xs font-semibold tracking-widest text-gray-500 mb-3 px-1">AI TOOLS</div>
          <button 
            onClick={() => toast("AI generation coming soon!")}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-2xl flex items-center justify-center gap-2 font-medium"
          >
            ✨ Generate with AI
          </button>
          <button 
            onClick={() => toast.info("Improving layout with AI...")}
            className="w-full mt-2 py-2.5 text-sm border rounded-2xl hover:bg-gray-50"
          >
            Improve current page
          </button>
        </div>
      </div>

      {/* MAIN EDITOR AREA */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-[60px] bg-white border-b px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="text-xl font-semibold bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none px-1 py-0.5 w-[300px]"
            />
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium tracking-wider">
              LIVE
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href={`/preview/${websiteId}`} 
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-2xl hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" /> Preview
            </Link>

            <button 
              onClick={saveWebsite}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-2xl hover:bg-gray-50 disabled:opacity-60"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button 
              onClick={publishWebsite}
              className="px-6 py-2 bg-black text-white text-sm rounded-2xl font-medium flex items-center gap-2"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8 bg-[#f1f1f1] flex justify-center">
          <div className="w-full max-w-[860px] bg-white shadow-xl min-h-[820px] rounded-3xl border overflow-hidden">
            {/* Fake browser header */}
            <div className="h-9 bg-gray-100 border-b flex items-center px-4 gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1 text-center text-[10px] text-gray-500 tracking-widest">https://{websiteName.toLowerCase().replace(/\s+/g, '-')}.webfactory.app</div>
            </div>

            <div className="p-10">
              <div className="flex justify-between items-center mb-6">
                <div className="font-semibold text-sm tracking-widest text-gray-500">PREVIEW</div>
                <div className="text-xs text-gray-400">Desktop • 1200px</div>
              </div>

              {/* Blocks rendering */}
              {blocks.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  Add blocks from the sidebar to start building
                </div>
              ) : (
                <div className="space-y-4">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      onClick={() => setSelectedBlockId(block.id)}
                      className={`group relative border-2 rounded-3xl p-8 transition-all cursor-pointer ${
                        selectedBlockId === block.id 
                          ? 'border-blue-500 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Block Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="uppercase text-[10px] tracking-[1px] font-medium text-blue-600">
                          {block.type}
                        </div>
                        
                        {selectedBlockId === block.id && (
                          <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }} className="text-xs px-2 py-1 hover:bg-gray-100 rounded">↑</button>
                            <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }} className="text-xs px-2 py-1 hover:bg-gray-100 rounded">↓</button>
                            <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="text-xs px-2 py-1 hover:bg-red-50 text-red-600 rounded">Delete</button>
                          </div>
                        )}
                      </div>

                      {/* Block Content Preview */}
                      {block.type === 'hero' && (
                        <div className="text-center py-8">
                          <div className="text-5xl font-semibold tracking-tighter">{block.content}</div>
                          <div className="mt-4 text-gray-500">Add a short subtitle here</div>
                          <button className="mt-6 bg-black text-white px-7 py-2.5 rounded-2xl text-sm">Get Started</button>
                        </div>
                      )}

                      {block.type === 'text' && (
                        <div className="prose text-xl text-gray-700 max-w-prose">
                          {block.content}
                        </div>
                      )}

                      {block.type === 'cta' && (
                        <div className="flex justify-center py-6">
                          <div className="bg-blue-600 text-white text-lg font-medium px-9 py-3.5 rounded-2xl">
                            {block.content}
                          </div>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="bg-gray-100 border border-dashed rounded-2xl h-52 flex items-center justify-center text-gray-400">
                          {block.content} (Image placeholder)
                        </div>
                      )}

                      {block.type === 'features' && (
                        <div>
                          <h3 className="font-semibold mb-4 text-xl">{block.content}</h3>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            {['Fast', 'Secure', 'Beautiful'].map((f, i) => (
                              <div key={i} className="border rounded-2xl p-4">✦ {f}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {block.type === 'testimonial' && (
                        <div className="italic text-xl text-gray-700">“{block.content}”</div>
                      )}

                      {/* Editable field when selected */}
                      {selectedBlockId === block.id && (
                        <div className="mt-6 pt-6 border-t">
                          <label className="text-xs font-medium block mb-1.5 text-gray-600">CONTENT</label>
                          <textarea
                            value={block.content}
                            onChange={(e) => updateBlockContent(block.id, e.target.value)}
                            onClick={e => e.stopPropagation()}
                            className="w-full border rounded-2xl p-3 text-sm resize-y min-h-[68px]"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PROPERTIES PANEL */}
      {selectedBlock && (
        <div className="w-72 border-l bg-white p-5 overflow-auto">
          <div className="font-semibold mb-1">Block Settings</div>
          <div className="text-sm text-gray-500 mb-6">{selectedBlock.type}</div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold tracking-widest block mb-2">CONTENT</label>
              <textarea
                value={selectedBlock.content}
                onChange={(e) => updateBlockContent(selectedBlock.id, e.target.value)}
                className="w-full border rounded-xl p-3 text-sm min-h-[110px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold tracking-widest block mb-2">STYLE</label>
              <select 
                className="w-full border rounded-xl px-3 py-2.5 text-sm"
                value={selectedBlock.style || 'default'}
                onChange={(e) => {
                  const newBlocks = blocks.map(b =>
                    b.id === selectedBlock.id ? { ...b, style: e.target.value } : b
                  );
                  setBlocks(newBlocks);
                }}
              >
                <option value="default">Default</option>
                <option value="accent">Accent</option>
                <option value="minimal">Minimal</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <button
              onClick={() => deleteBlock(selectedBlock.id)}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 w-full px-3 py-2 rounded-xl text-sm border border-red-100"
            >
              <Trash2 className="w-4 h-4" /> Delete this block
            </button>
          </div>

          <div className="mt-10 pt-6 border-t text-xs text-gray-500">
            Drag to reorder coming soon
          </div>
        </div>
      )}
    </div>
  );
}
