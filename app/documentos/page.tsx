'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Printer,
  FileText,
  Receipt,
  ArrowLeft,
  RotateCcw,
  Download,
} from 'lucide-react';
import { companyDefaults, serviceCatalog, type CatalogItem } from '../data/documentDefaults';

type LineItem = {
  id: string;
  concept: string;
  description: string;
  qty: number;
  unitPrice: number;
  unit: string;
};

type Party = {
  name: string;
  nif: string;
  email: string;
  phone: string;
  address: string;
};

type DocKind = 'presupuesto' | 'factura';
type InvoicePhase = 'anticipo' | 'saldo' | 'completa';

const STORAGE_KEY = 'creauna-documentos-v1';

function money(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultDocNumber(kind: DocKind) {
  const y = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 90) + 10);
  return kind === 'presupuesto' ? `PRE-${y}-${seq}` : `FAC-${y}-${seq}`;
}

function newLine(from?: Partial<LineItem>): LineItem {
  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    concept: from?.concept ?? '',
    description: from?.description ?? '',
    qty: from?.qty ?? 1,
    unitPrice: from?.unitPrice ?? 0,
    unit: from?.unit ?? 'ud',
  };
}

export default function DocumentosPage() {
  const [kind, setKind] = useState<DocKind>('presupuesto');
  const [invoicePhase, setInvoicePhase] = useState<InvoicePhase>('anticipo');
  const [docNumber, setDocNumber] = useState(() => defaultDocNumber('presupuesto'));
  const [date, setDate] = useState(todayISO);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState(companyDefaults.paymentTerms);
  const [issuer, setIssuer] = useState<Party>({
    name: companyDefaults.legalName,
    nif: companyDefaults.nif,
    email: companyDefaults.email,
    phone: companyDefaults.phone,
    address: companyDefaults.address,
  });
  const [client, setClient] = useState<Party>({
    name: '',
    nif: '',
    email: '',
    phone: '',
    address: '',
  });
  const [bankIban, setBankIban] = useState(companyDefaults.bank.iban);
  const [bankBic, setBankBic] = useState(companyDefaults.bank.bic);
  const [lines, setLines] = useState<LineItem[]>([
    newLine({
      concept: serviceCatalog[0].concept,
      description: serviceCatalog[0].description,
      unitPrice: serviceCatalog[0].unitPrice,
      unit: serviceCatalog[0].unit,
    }),
  ]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (data.kind === 'presupuesto' || data.kind === 'factura') setKind(data.kind);
      if (typeof data.docNumber === 'string') setDocNumber(data.docNumber);
      if (typeof data.date === 'string') setDate(data.date);
      if (typeof data.dueDate === 'string') setDueDate(data.dueDate);
      if (typeof data.notes === 'string') setNotes(data.notes);
      if (data.issuer && typeof data.issuer === 'object') setIssuer(data.issuer as Party);
      if (data.client && typeof data.client === 'object') setClient(data.client as Party);
      if (typeof data.bankIban === 'string') setBankIban(data.bankIban);
      if (typeof data.bankBic === 'string') setBankBic(data.bankBic);
      if (data.invoicePhase === 'anticipo' || data.invoicePhase === 'saldo' || data.invoicePhase === 'completa') {
        setInvoicePhase(data.invoicePhase);
      }
      if (Array.isArray(data.lines) && data.lines.length) setLines(data.lines as LineItem[]);
    } catch {
      /* ignore corrupt draft */
    }
  }, []);

  useEffect(() => {
    const payload = {
      kind,
      invoicePhase,
      docNumber,
      date,
      dueDate,
      notes,
      issuer,
      client,
      bankIban,
      bankBic,
      lines,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [kind, invoicePhase, docNumber, date, dueDate, notes, issuer, client, bankIban, bankBic, lines]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + Math.max(0, l.qty) * Math.max(0, l.unitPrice), 0),
    [lines]
  );
  const iva = subtotal * companyDefaults.ivaRate;
  const total = subtotal + iva;
  const half = total / 2;

  const chargeAmount = useMemo(() => {
    if (kind !== 'factura') return total;
    if (invoicePhase === 'anticipo' || invoicePhase === 'saldo') return half;
    return total;
  }, [kind, invoicePhase, total, half]);

  const addFromCatalog = (item: CatalogItem) => {
    setLines((prev) => [
      ...prev,
      newLine({
        concept: item.concept,
        description: item.description,
        unitPrice: item.unitPrice,
        unit: item.unit,
      }),
    ]);
  };

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLine = (id: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  };

  const switchKind = (next: DocKind) => {
    setKind(next);
    setDocNumber(defaultDocNumber(next));
    if (next === 'factura') {
      setNotes(
        invoicePhase === 'anticipo'
          ? `Factura de anticipo (50% del total). ${companyDefaults.paymentTerms}`
          : invoicePhase === 'saldo'
            ? `Factura de saldo (50% restante a la entrega). ${companyDefaults.paymentTerms}`
            : `Factura completa. ${companyDefaults.paymentTerms}`
      );
    } else {
      setNotes(companyDefaults.paymentTerms);
    }
  };

  const resetDraft = () => {
    if (!confirm('¿Borrar el borrador local y empezar de cero?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setKind('presupuesto');
    setInvoicePhase('anticipo');
    setDocNumber(defaultDocNumber('presupuesto'));
    setDate(todayISO());
    setNotes(companyDefaults.paymentTerms);
    setClient({ name: '', nif: '', email: '', phone: '', address: '' });
    setLines([
      newLine({
        concept: serviceCatalog[0].concept,
        description: serviceCatalog[0].description,
        unitPrice: serviceCatalog[0].unitPrice,
        unit: serviceCatalog[0].unit,
      }),
    ]);
  };

  const handlePrint = useCallback(() => window.print(), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="print:hidden border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="font-semibold text-lg tracking-tight">Documentos CREAUNA</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => switchKind('presupuesto')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border ${
                kind === 'presupuesto'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" /> Presupuesto
            </button>
            <button
              type="button"
              onClick={() => switchKind('factura')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border ${
                kind === 'factura'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <Receipt className="w-4 h-4" /> Factura
            </button>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-slate-200 bg-white text-slate-600"
            >
              <RotateCcw className="w-4 h-4" /> Reiniciar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white"
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-12 gap-6 print:block print:max-w-none print:p-0">
        {/* Editor */}
        <aside className="lg:col-span-5 space-y-5 print:hidden">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Documento</h2>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm space-y-1">
                <span className="text-slate-500">Número</span>
                <input
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                />
              </label>
              <label className="text-sm space-y-1">
                <span className="text-slate-500">Fecha</span>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </div>
            {kind === 'factura' && (
              <div className="space-y-2">
                <p className="text-sm text-slate-500">Tipo de cobro (método habitual 50/50)</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ['anticipo', 'Anticipo 50%'],
                      ['saldo', 'Saldo 50%'],
                      ['completa', 'Factura 100%'],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setInvoicePhase(value);
                        setNotes(
                          value === 'anticipo'
                            ? `Factura de anticipo (50% del total). ${companyDefaults.paymentTerms}`
                            : value === 'saldo'
                              ? `Factura de saldo (50% restante a la entrega). ${companyDefaults.paymentTerms}`
                              : `Factura completa. ${companyDefaults.paymentTerms}`
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        invoicePhase === value
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <label className="text-sm space-y-1 block">
                  <span className="text-slate-500">Vencimiento</span>
                  <input
                    type="date"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </label>
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Emisor</h2>
            {(['name', 'nif', 'email', 'phone', 'address'] as const).map((key) => (
              <input
                key={key}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder={
                  key === 'name'
                    ? 'Nombre / razón social'
                    : key === 'nif'
                      ? 'NIF / CIF'
                      : key === 'address'
                        ? 'Dirección'
                        : key
                }
                value={issuer[key]}
                onChange={(e) => setIssuer({ ...issuer, [key]: e.target.value })}
              />
            ))}
            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-100">
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="IBAN"
                value={bankIban}
                onChange={(e) => setBankIban(e.target.value)}
              />
              <input
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="BIC (opcional)"
                value={bankBic}
                onChange={(e) => setBankBic(e.target.value)}
              />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Cliente</h2>
            {(['name', 'nif', 'email', 'phone', 'address'] as const).map((key) => (
              <input
                key={key}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder={
                  key === 'name'
                    ? 'Nombre / empresa'
                    : key === 'nif'
                      ? 'NIF / CIF cliente'
                      : key === 'address'
                        ? 'Dirección'
                        : key
                }
                value={client[key]}
                onChange={(e) => setClient({ ...client, [key]: e.target.value })}
              />
            ))}
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Partidas</h2>
              <button
                type="button"
                onClick={() => setLines((p) => [...p, newLine()])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600"
              >
                <Plus className="w-3.5 h-3.5" /> Línea vacía
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {serviceCatalog.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addFromCatalog(item)}
                  className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700"
                  title={money(item.unitPrice)}
                >
                  + {item.concept.split('(')[0].trim()}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {lines.map((line) => (
                <div key={line.id} className="border border-slate-100 rounded-xl p-3 space-y-2 bg-slate-50/50">
                  <input
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-medium bg-white"
                    value={line.concept}
                    onChange={(e) => updateLine(line.id, { concept: e.target.value })}
                    placeholder="Concepto"
                  />
                  <textarea
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white resize-y min-h-[52px]"
                    value={line.description}
                    onChange={(e) => updateLine(line.id, { description: e.target.value })}
                    placeholder="Descripción"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
                      value={line.qty}
                      onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) || 0 })}
                      title="Cantidad"
                    />
                    <input
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white"
                      value={line.unit}
                      onChange={(e) => updateLine(line.id, { unit: e.target.value })}
                      title="Unidad"
                    />
                    <input
                      type="number"
                      min={0}
                      step={10}
                      className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white col-span-1"
                      value={line.unitPrice}
                      onChange={(e) => updateLine(line.id, { unitPrice: Number(e.target.value) || 0 })}
                      title="Precio unitario"
                    />
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-red-600"
                      title="Eliminar línea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Notas / condiciones</h2>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm min-h-[90px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <p className="text-xs text-slate-500 flex items-start gap-1.5">
              <Download className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              El borrador se guarda en este navegador. Usa «Imprimir / PDF» → Guardar como PDF.
            </p>
          </section>
        </aside>

        {/* Preview printable */}
        <main className="lg:col-span-7">
          <article
            id="doc-preview"
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-10 print:border-0 print:shadow-none print:rounded-none print:p-0"
          >
            <header className="flex items-start justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={companyDefaults.logoSrc}
                  alt="CREAUNA"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <div className="text-xl font-bold tracking-tight">{companyDefaults.brand}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{issuer.name || companyDefaults.legalName}</div>
                  {issuer.nif ? <div className="text-xs text-slate-500">NIF/CIF: {issuer.nif}</div> : null}
                  <div className="text-xs text-slate-500">{issuer.email}</div>
                  {issuer.phone ? <div className="text-xs text-slate-500">{issuer.phone}</div> : null}
                  {issuer.address ? <div className="text-xs text-slate-500">{issuer.address}</div> : null}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-600">
                  {kind === 'presupuesto' ? 'Presupuesto' : 'Factura'}
                </div>
                <div className="text-lg font-semibold mt-1">{docNumber}</div>
                <div className="text-xs text-slate-500 mt-1">Fecha: {date}</div>
                {kind === 'factura' ? (
                  <div className="text-xs text-slate-500">Vencimiento: {dueDate}</div>
                ) : (
                  <div className="text-xs text-slate-500">
                    Válido {companyDefaults.validityDays} días
                  </div>
                )}
                {kind === 'factura' ? (
                  <div className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {invoicePhase === 'anticipo'
                      ? 'Anticipo 50%'
                      : invoicePhase === 'saldo'
                        ? 'Saldo 50%'
                        : 'Importe íntegro'}
                  </div>
                ) : null}
              </div>
            </header>

            <section className="grid sm:grid-cols-2 gap-6 py-6">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Cliente
                </div>
                <div className="text-sm font-semibold">{client.name || '—'}</div>
                {client.nif ? <div className="text-xs text-slate-600">NIF/CIF: {client.nif}</div> : null}
                {client.email ? <div className="text-xs text-slate-600">{client.email}</div> : null}
                {client.phone ? <div className="text-xs text-slate-600">{client.phone}</div> : null}
                {client.address ? <div className="text-xs text-slate-600 whitespace-pre-wrap">{client.address}</div> : null}
              </div>
              <div className="text-sm text-slate-600 sm:text-right">
                <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
                  Condiciones de pago
                </div>
                <p className="text-xs leading-relaxed">{companyDefaults.paymentTerms}</p>
              </div>
            </section>

            <table className="w-full text-sm border-t border-slate-200">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="py-3 pr-2 font-semibold">Concepto</th>
                  <th className="py-3 px-2 font-semibold w-14 text-right">Cant.</th>
                  <th className="py-3 px-2 font-semibold w-20 text-right">Precio</th>
                  <th className="py-3 pl-2 font-semibold w-24 text-right">Importe</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const amount = line.qty * line.unitPrice;
                  return (
                    <tr key={line.id} className="border-b border-slate-50 align-top">
                      <td className="py-3 pr-2">
                        <div className="font-medium text-slate-900">{line.concept || '—'}</div>
                        {line.description ? (
                          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{line.description}</div>
                        ) : null}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums whitespace-nowrap">
                        {line.qty} {line.unit}
                      </td>
                      <td className="py-3 px-2 text-right tabular-nums">{money(line.unitPrice)}</td>
                      <td className="py-3 pl-2 text-right tabular-nums font-medium">{money(amount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Base imponible</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>IVA ({Math.round(companyDefaults.ivaRate * 100)}%)</span>
                  <span className="tabular-nums">{money(iva)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="tabular-nums">{money(total)}</span>
                </div>
                {kind === 'presupuesto' ? (
                  <div className="pt-3 space-y-1 text-xs text-slate-600 border-t border-dashed border-slate-200 mt-2">
                    <div className="flex justify-between">
                      <span>Anticipo 50% al aceptar</span>
                      <span className="tabular-nums font-semibold text-slate-900">{money(half)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saldo 50% a la entrega</span>
                      <span className="tabular-nums font-semibold text-slate-900">{money(half)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-dashed border-slate-200 mt-2">
                    <div className="flex justify-between font-bold text-indigo-700">
                      <span>A cobrar ahora</span>
                      <span className="tabular-nums">{money(chargeAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(bankIban || notes) && (
              <footer className="mt-8 pt-6 border-t border-slate-200 space-y-3 text-xs text-slate-600">
                {notes ? (
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                      Notas
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{notes}</p>
                  </div>
                ) : null}
                {bankIban ? (
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
                      Datos de pago
                    </div>
                    <p>
                      Titular: {companyDefaults.bank.holder}
                      <br />
                      IBAN: {bankIban}
                      {bankBic ? (
                        <>
                          <br />
                          BIC: {bankBic}
                        </>
                      ) : null}
                      <br />
                      Concepto: {docNumber} — {client.name || 'cliente'}
                    </p>
                  </div>
                ) : null}
                {kind === 'presupuesto' ? (
                  <p className="text-slate-400">
                    Este presupuesto no constituye factura. Al aceptar, se emitirá factura de anticipo (50%).
                  </p>
                ) : null}
              </footer>
            )}
          </article>
        </main>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
