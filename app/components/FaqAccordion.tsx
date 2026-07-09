'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqAccordion({
  items,
  variant = 'default',
}: {
  items: { q: string; a: string }[];
  variant?: 'default' | 'minimal';
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const cardClass =
    variant === 'minimal'
      ? 'border border-stone-200/80 rounded-xl bg-white overflow-hidden'
      : 'border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300 hover:border-slate-300';

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q} className={cardClass}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer gap-4"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-base md:text-lg text-slate-900 leading-snug">{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-700' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-slate-600 leading-relaxed text-sm md:text-base border-t border-slate-50">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
