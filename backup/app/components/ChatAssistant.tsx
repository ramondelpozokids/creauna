'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

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
        response = "Trabajamos con un equipo de IAs especializadas: Gemini (imágenes), Claude (textos), y más. ¿Quieres ver cómo funciona?";
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
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-gradient-to-r from-indigo-600 to-rose-500 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl z-[100] overflow-hidden chat-assistant">
          <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-slate-900" />
            </div>
            <div>
              <div className="font-semibold">Asistente CREAUNA</div>
              <div className="text-xs text-white/60">En línea • Responde en segundos</div>
            </div>
          </div>

          <div className="h-72 overflow-auto p-4 space-y-3 text-sm bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
                <div className={msg.role === 'user' 
                  ? "bg-indigo-600 text-white px-4 py-2 rounded-2xl max-w-[80%]" 
                  : "bg-white border px-4 py-2 rounded-2xl max-w-[80%]"}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 border border-slate-200 rounded-2xl px-4 py-2 text-sm focus:outline-none"
            />
            <button onClick={sendMessage} className="bg-slate-900 text-white p-2 rounded-2xl">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
