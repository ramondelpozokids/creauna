'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { findChatAnswer, quickTopics, quickTopicsEn } from '../data/chatKnowledge';
import { useLanguage } from './LanguageProvider';

interface Message {
  role: 'user' | 'ai';
  text: string;
  isFallback?: boolean;
}

const welcomeMessages = {
  es: '¡Hola! Soy el Asistente CREAUNA. Puedo resolver dudas sobre precios, plantillas, el Studio, créditos, modernización y más. ¿En qué te ayudo?',
  en: 'Hi! I am the CREAUNA Assistant. I can help with pricing, templates, Studio, credits, modernization, and more. How can I help?',
};

const ui = {
  es: {
    title: 'Asistente CREAUNA',
    online: 'En línea • Autorespuesta 24/7',
    placeholder: 'Escribe tu pregunta...',
    aria: 'Asistente de ayuda',
    send: 'Enviar',
    fallback: 'No pude procesar tu pregunta. Escribe a info@ramondelpozorott.es o usa /contacto.',
  },
  en: {
    title: 'CREAUNA Assistant',
    online: 'Online • 24/7 auto-reply',
    placeholder: 'Type your question...',
    aria: 'Help assistant',
    send: 'Send',
    fallback: 'I could not process your question. Email info@ramondelpozorott.es or use /contacto.',
  },
};

function renderMessageText(text: string) {
  const parts = text.split(/(\/[a-z0-9-]+|info@ramondelpozorott\.es|\+34\s?656\s?398\s?640)/gi);

  return parts.map((part, i) => {
    if (part.startsWith('/')) {
      return (
        <Link key={i} href={part} className="text-indigo-600 underline font-semibold hover:text-indigo-800">
          {part}
        </Link>
      );
    }
    if (part === 'info@ramondelpozorott.es') {
      return (
        <a key={i} href="mailto:info@ramondelpozorott.es" className="text-indigo-600 underline font-semibold">
          {part}
        </a>
      );
    }
    if (part.match(/\+34\s?656\s?398\s?640/i)) {
      return (
        <a key={i} href="https://wa.me/34656398640" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">
          {part}
        </a>
      );
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 && <br />}
      </span>
    ));
  });
}

export default function ChatAssistant() {
  const { lang } = useLanguage();
  const t = ui[lang];
  const topics = lang === 'en' ? quickTopicsEn : quickTopics;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: welcomeMessages[lang] },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'ai', text: welcomeMessages[lang] }]);
  }, [lang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const reply = async (userInput: string) => {
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, lang }),
      });
      const data = await res.json();
      const answer = data.answer || t.fallback;
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: answer, isFallback: !data.matched },
      ]);
    } catch {
      const { answer, matched } = findChatAnswer(userInput, lang);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: answer, isFallback: !matched },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = (text?: string) => {
    const message = (text ?? input).trim();
    if (!message) return;

    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setInput('');
    reply(message);
  };

  const handleQuickTopic = (query: string) => {
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    reply(query);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-slate-900 border border-slate-700/30 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all overflow-hidden cursor-pointer"
        aria-label={t.aria}
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <img
            src="/images/logo.png"
            alt="CREAUNA"
            className="w-full h-full object-cover scale-105"
          />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[22rem] sm:w-96 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-[100] overflow-hidden chat-assistant flex flex-col max-h-[32rem]"
          >
            <div className="bg-slate-900 text-white p-4 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-white/20 bg-slate-800">
                <img
                  src="/images/logo.png"
                  alt="CREAUNA logo"
                  className="w-full h-full object-cover scale-105"
                />
              </div>
              <div>
                <div className="font-semibold text-sm flex items-center gap-1.5">
                  {t.title}
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {t.online}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3.5 text-[13px] bg-slate-50 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[88%] shadow-sm font-medium'
                        : `bg-white border px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[88%] shadow-sm text-slate-800 leading-relaxed ${
                            msg.isFallback ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200/60'
                          }`
                    }
                  >
                    {msg.role === 'ai' ? renderMessageText(msg.text) : msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200/60 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 2 && !isTyping && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0 bg-slate-50">
                {topics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => handleQuickTopic(topic.query)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors cursor-pointer"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3 border-t border-slate-100 flex gap-2 bg-white shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t.placeholder}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors"
              />
              <button
                onClick={() => sendMessage()}
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black transition-colors cursor-pointer"
                aria-label={t.send}
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
