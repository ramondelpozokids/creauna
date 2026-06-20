'use client';

import { useEffect, useState } from 'react';
import { X, CreditCard, Package, Mail, FileArchive, Link2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { setPaid } from '../lib/studioCredits';

type Step = 'payment' | 'delivery' | 'done';

interface Props {
  open: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
  projectName: string;
  onPaymentComplete: () => void;
}

const deliveryOptions = [
  { id: 'zip', icon: FileArchive, es: 'Paquete ZIP con todos los archivos', en: 'ZIP package with all files' },
  { id: 'link', icon: Link2, es: 'Enlace privado de preview (7 días)', en: 'Private preview link (7 days)' },
  { id: 'code', icon: Package, es: 'Código exportado (HTML/CSS/JS)', en: 'Exported code (HTML/CSS/JS)' },
  { id: 'email', icon: Mail, es: 'Envío por email a tu bandeja', en: 'Delivery to your email inbox' },
];

export default function StudioCheckoutModal({ open, onClose, lang, projectName, onPaymentComplete }: Props) {
  const [step, setStep] = useState<Step>('payment');
  const [selectedDelivery, setSelectedDelivery] = useState('zip');
  const [processing, setProcessing] = useState(false);
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripeNoteOverride, setStripeNoteOverride] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch('/api/stripe/status')
      .then((r) => r.json())
      .then((data) => {
        setStripeEnabled(Boolean(data.enabled));
        if (data.note) setStripeNoteOverride(data.note);
      })
      .catch(() => setStripeEnabled(false));
  }, [open]);

  const t = lang === 'es' ? {
    paymentTitle: 'Finalizar y pagar',
    paymentDesc: 'Tu web está lista. Completa el pago para desbloquear la entrega.',
    stripeNote: 'Integración Stripe preparada. Los cobros se activarán cuando la cuenta empresarial esté lista. Por ahora puedes simular el pago para probar el flujo.',
    plan: 'Plan Pro — 19€/mes',
    credits: '120 créditos/mes incluidos',
    simulate: 'Simular pago (modo demo)',
    stripeSoon: 'Pagar con Stripe (próximamente)',
    deliveryTitle: '¿Cómo quieres recibir tu web?',
    deliveryDesc: 'Elige el formato de entrega. Nosotros diseñamos; tú publicas en tu dominio.',
    confirm: 'Confirmar entrega',
    doneTitle: '¡Todo listo!',
    doneDesc: 'Tu web ha sido procesada para entrega. Recibirás los archivos según el método elegido.',
    close: 'Cerrar',
    domainNote: 'Recuerda: la publicación en tu dominio la haces tú con los archivos entregados.',
  } : {
    paymentTitle: 'Finalize and pay',
    paymentDesc: 'Your site is ready. Complete payment to unlock delivery.',
    stripeNote: 'Stripe integration is ready. Charges activate once the business account is set up. You can simulate payment to test the flow.',
    plan: 'Pro Plan — €19/mo',
    credits: '120 credits/month included',
    simulate: 'Simulate payment (demo mode)',
    stripeSoon: 'Pay with Stripe (coming soon)',
    deliveryTitle: 'How do you want to receive your site?',
    deliveryDesc: 'Choose delivery format. We design; you publish to your domain.',
    confirm: 'Confirm delivery',
    doneTitle: 'All set!',
    doneDesc: 'Your site has been queued for delivery. You will receive files via your chosen method.',
    close: 'Close',
    domainNote: 'Remember: you publish to your domain with the delivered files.',
  };

  const handleSimulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setPaid(true);
      onPaymentComplete();
      setStep('delivery');
      setProcessing(false);
      toast.success(lang === 'es' ? 'Pago simulado correctamente' : 'Payment simulated successfully');
    }, 1200);
  };

  const handleStripePayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'pro', projectName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Stripe no disponible');
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al iniciar pago');
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmDelivery = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/studio/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          deliveryMethod: selectedDelivery,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al programar entrega');
      setStep('done');
      toast.success(lang === 'es' ? 'Entrega programada' : 'Delivery scheduled', {
        description: lang === 'es'
          ? `Método: ${deliveryOptions.find(d => d.id === selectedDelivery)?.es}`
          : undefined,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('payment');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="font-bold text-lg text-slate-950">
                {step === 'payment' && t.paymentTitle}
                {step === 'delivery' && t.deliveryTitle}
                {step === 'done' && t.doneTitle}
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {step === 'payment' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">{t.paymentDesc}</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="font-semibold text-slate-900">{projectName}</div>
                    <div className="text-sm text-indigo-600 font-medium mt-1">{t.plan}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.credits}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
                    <ShieldCheck className="w-4 h-4 inline mr-1 -mt-0.5" />
                    {stripeNoteOverride || t.stripeNote}
                  </div>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={processing}
                    className="w-full btn-gradient py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-60 cursor-pointer"
                  >
                    {processing ? '...' : t.simulate}
                  </button>
                  <button
                    onClick={handleStripePayment}
                    disabled={processing || !stripeEnabled}
                    className="w-full py-3.5 rounded-2xl font-semibold text-sm border border-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    {stripeEnabled ? (lang === 'es' ? 'Pagar con Stripe' : 'Pay with Stripe') : t.stripeSoon}
                  </button>
                </div>
              )}

              {step === 'delivery' && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">{t.deliveryDesc}</p>
                  <div className="space-y-2">
                    {deliveryOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedDelivery(opt.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left text-sm transition cursor-pointer ${
                          selectedDelivery === opt.id
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <opt.icon className="w-5 h-5 shrink-0" />
                        {lang === 'es' ? opt.es : opt.en}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{t.domainNote}</p>
                  <button
                    onClick={handleConfirmDelivery}
                    disabled={processing}
                    className="w-full btn-gradient py-3.5 rounded-2xl font-semibold text-sm disabled:opacity-60 cursor-pointer"
                  >
                    {processing ? '...' : t.confirm}
                  </button>
                </div>
              )}

              {step === 'done' && (
                <div className="text-center space-y-4 py-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-7 h-7 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-600">{t.doneDesc}</p>
                  <button onClick={handleClose} className="btn-gradient px-8 py-3 rounded-2xl font-semibold text-sm cursor-pointer">
                    {t.close}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
