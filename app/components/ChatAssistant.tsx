'use client';

import { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy el Asistente CREAUNA. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const userInput = input;
    setInput('');

    setTimeout(() => {
      let response = "¡Perfecto! Puedo ayudarte con eso.";

      if (userInput.toLowerCase().includes('precio') || userInput.toLowerCase().includes('plan')) {
        response = "Tenemos planes desde 0€ hasta 79€/mes. ¿Quieres que te explique las diferencias?";
      } else if (userInput.toLowerCase().includes('ia') || userInput.toLowerCase().includes('inteligencia')) {
        response = "Trabajamos con tecnología de IA avanzada. ¿Quieres ver cómo funciona el proceso?";
      } else if (userInput.toLowerCase().includes('tiempo') || userInput.toLowerCase().includes('rápido')) {
        response = "La mayoría de webs se crean en menos de 8 minutos. ¿Quieres probar ahora mismo?";
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-slate-900 border border-slate-700/30 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all overflow-hidden cursor-pointer"
        aria-label="Asistente de ayuda"
      >
        {isOpen ? (
          <X size={22} className="text-white animate-spin-once" />
        ) : (
          <img 
            src="/chat.webp" 
            alt="Asistente CREAUNA" 
            className="w-full h-full object-cover scale-105" 
          />
        )}
      </button>

      {/* Chat Window with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-80 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-[100] overflow-hidden chat-assistant"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/20 bg-slate-800">
                <img 
                  src="/chat.webp" 
                  alt="CREAUNA logo" 
                  className="w-full h-full object-cover scale-105" 
                />
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  Asistente CREAUNA
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  En línea • Autorespuesta
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="h-72 overflow-auto p-4 space-y-3.5 text-[13.5px] bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={msg.role === 'user' 
                    ? "bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm font-medium" 
                    : "bg-white border border-slate-200/60 px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm text-slate-800"}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors"
              />
              <button 
                onClick={sendMessage} 
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black transition-colors cursor-pointer"
                aria-label="Enviar"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
