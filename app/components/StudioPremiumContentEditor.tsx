'use client';

import { useCallback, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Info,
  Plus,
  Save,
  ScanLine,
  Star,
  Trash2,
  Trophy,
  UtensilsCrossed,
} from 'lucide-react';
import type {
  DailyMenuCard,
  FootballFeature,
  GalleryImage,
  MenuCategory,
  MenuHighlight,
  PremiumStarterContent,
  ReviewCard,
} from '../lib/studio/premiumContentTypes';
import {
  newDailyMenuCard,
  newFootballFeature,
  newGalleryImage,
  newMenuCategory,
  newMenuHighlight,
  newMenuItem,
  newReviewCard,
  normalizePremiumContent,
  slugifyId,
} from '../lib/studio/premiumContentTypes';

type Lang = 'es' | 'en';
export type PremiumEditorTab = 'menu' | 'highlights' | 'daily' | 'info' | 'football' | 'digital' | 'gallery';

const copy = {
  es: {
    menu: 'Carta',
    highlights: 'Destacados',
    daily: 'Menús del día',
    info: 'Información',
    football: 'Fútbol',
    digital: 'Carta QR / Reservas',
    gallery: 'Galería',
    back: 'Volver al chat',
    save: 'Aplicar cambios',
    addCategory: 'Añadir categoría',
    addDish: 'Añadir plato',
    addHighlight: 'Añadir destacado',
    addDailyMenu: 'Añadir menú',
    addPhoto: 'Añadir foto',
    addInclude: 'Añadir incluido',
    category: 'Categoría',
    dish: 'Plato',
    title: 'Título',
    description: 'Descripción',
    price: 'Precio',
    scheduleTitle: 'Horario / validez',
    scheduleDetail: 'Detalle horario',
    includes: 'Incluye',
    includeItem: 'Elemento incluido',
    photoUrl: 'URL de la imagen',
    photoAlt: 'Texto alternativo',
    emptyMenu: 'Añade al menos una categoría con platos.',
    emptyHighlights: 'Añade al menos un plato destacado.',
    emptyDaily: 'Añade al menos un menú del día.',
    emptyInfo: 'Añade al menos una línea en ubicación, horario, precios o especialidades.',
    emptyFootball: 'Completa el titular o añade al menos un bloque de la sección.',
    emptyGallery: 'Añade al menos una imagen a la galería.',
    location: 'Ubicación',
    hours: 'Horario',
    prices: 'Precios',
    specialties: 'Especialidades',
    line: 'Línea',
    addLine: 'Añadir línea',
    locationLink: 'Texto del enlace',
    statusOpen: 'Abierto ahora',
    statusClosed: 'Cerrado',
    statusText: 'Texto del estado',
    headline: 'Titular',
    introPrefix: 'Texto introductorio',
    highlightName: 'Nombre destacado',
    tagline: 'Frase principal',
    ctaText: 'Texto del botón',
    addFeature: 'Añadir bloque',
    iconClass: 'Clase del icono (Font Awesome)',
    emptyDigital: 'Completa la valoración Google o el titular de la carta QR.',
    googleRating: 'Valoración Google',
    googleReviews: 'Número de reseñas',
    badge24h: 'Texto badge 24h',
    qrHeadline: 'Titular carta QR',
    qrSubtitle: 'Subtítulo carta QR',
    qrUrl: 'URL del QR (carta online)',
    qrFeatures: 'Ventajas carta digital',
    reservaTitle: 'Titular reserva 24h',
    reservaText: 'Texto reserva 24h',
    reservaFeatures: 'Ventajas reserva online',
    reviewsTitle: 'Titular reseñas',
    reviewsSubtitle: 'Subtítulo reseñas',
    addReview: 'Añadir reseña',
    author: 'Autor',
    reviewBadge: 'Etiqueta',
    initials: 'Iniciales',
    stars: 'Estrellas (1-5)',
    reviewDate: 'Fecha',
    reviewText: 'Texto reseña',
    googleMapsUrl: 'Enlace Google Maps / reseñas',
    orderingEnabled: 'Pedidos por mesa activos',
    tableCount: 'Número de mesas',
    tableHeadline: 'Titular selector de mesas',
    tableSubtitle: 'Subtítulo selector de mesas',
    orderButton: 'Texto botón WhatsApp',
    moveUp: 'Subir',
    moveDown: 'Bajar',
  },
  en: {
    menu: 'Menu',
    highlights: 'Highlights',
    daily: 'Daily menus',
    info: 'Info',
    football: 'Football',
    digital: 'QR menu / Booking',
    gallery: 'Gallery',
    back: 'Back to chat',
    save: 'Apply changes',
    addCategory: 'Add category',
    addDish: 'Add dish',
    addHighlight: 'Add highlight',
    addDailyMenu: 'Add daily menu',
    addPhoto: 'Add photo',
    addInclude: 'Add included item',
    category: 'Category',
    dish: 'Dish',
    title: 'Title',
    description: 'Description',
    price: 'Price',
    scheduleTitle: 'Schedule / validity',
    scheduleDetail: 'Schedule detail',
    includes: 'Includes',
    includeItem: 'Included item',
    photoUrl: 'Image URL',
    photoAlt: 'Alt text',
    emptyMenu: 'Add at least one category with dishes.',
    emptyHighlights: 'Add at least one highlight.',
    emptyDaily: 'Add at least one daily menu.',
    emptyInfo: 'Add at least one line for location, hours, prices or specialties.',
    emptyFootball: 'Fill the headline or add at least one feature block.',
    emptyGallery: 'Add at least one gallery image.',
    location: 'Location',
    hours: 'Hours',
    prices: 'Prices',
    specialties: 'Specialties',
    line: 'Line',
    addLine: 'Add line',
    locationLink: 'Link text',
    statusOpen: 'Open now',
    statusClosed: 'Closed',
    statusText: 'Status text',
    headline: 'Headline',
    introPrefix: 'Intro text',
    highlightName: 'Highlighted name',
    tagline: 'Main tagline',
    ctaText: 'Button text',
    addFeature: 'Add block',
    iconClass: 'Icon class (Font Awesome)',
    emptyDigital: 'Fill Google rating or QR menu headline.',
    googleRating: 'Google rating',
    googleReviews: 'Review count',
    badge24h: '24h badge text',
    qrHeadline: 'QR menu headline',
    qrSubtitle: 'QR menu subtitle',
    qrUrl: 'QR target URL',
    qrFeatures: 'Digital menu benefits',
    reservaTitle: '24h booking headline',
    reservaText: '24h booking text',
    reservaFeatures: 'Online booking benefits',
    reviewsTitle: 'Reviews headline',
    reviewsSubtitle: 'Reviews subtitle',
    addReview: 'Add review',
    author: 'Author',
    reviewBadge: 'Badge label',
    initials: 'Initials',
    stars: 'Stars (1-5)',
    reviewDate: 'Date',
    reviewText: 'Review text',
    googleMapsUrl: 'Google Maps / reviews link',
    orderingEnabled: 'Table ordering enabled',
    tableCount: 'Number of tables',
    tableHeadline: 'Table selector headline',
    tableSubtitle: 'Table selector subtitle',
    orderButton: 'WhatsApp button text',
    moveUp: 'Up',
    moveDown: 'Down',
  },
} as const;

type Props = {
  lang: Lang;
  tab: PremiumEditorTab;
  content: PremiumStarterContent;
  onTabChange: (tab: PremiumEditorTab) => void;
  onBack: () => void;
  onSave: (content: PremiumStarterContent, tab: PremiumEditorTab) => void;
  isSaving?: boolean;
};

export default function StudioPremiumContentEditor({
  lang,
  tab,
  content,
  onTabChange,
  onBack,
  onSave,
  isSaving,
}: Props) {
  const t = copy[lang];
  const [draft, setDraft] = useState<PremiumStarterContent>(() =>
    normalizePremiumContent(JSON.parse(JSON.stringify(content)) as PremiumStarterContent)
  );
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(draft.menu[0]?.id ?? null);

  const updateCategory = useCallback((categoryId: string, patch: Partial<MenuCategory>) => {
    setDraft((prev) => ({
      ...prev,
      menu: prev.menu.map((cat) => (cat.id === categoryId ? { ...cat, ...patch } : cat)),
    }));
  }, []);

  const updateItem = useCallback(
    (categoryId: string, itemId: string, patch: Partial<{ name: string; description: string; price: string }>) => {
      setDraft((prev) => ({
        ...prev,
        menu: prev.menu.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                items: cat.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
              }
            : cat
        ),
      }));
    },
    []
  );

  const updateHighlight = (id: string, patch: Partial<MenuHighlight>) => {
    setDraft((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  };

  const updateDaily = (id: string, patch: Partial<DailyMenuCard>) => {
    setDraft((prev) => ({
      ...prev,
      dailyMenus: prev.dailyMenus.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  };

  const updateDailyItem = (cardId: string, index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      dailyMenus: prev.dailyMenus.map((d) =>
        d.id === cardId
          ? { ...d, items: d.items.map((item, i) => (i === index ? value : item)) }
          : d
      ),
    }));
  };

  const addCategory = () => {
    const cat = newMenuCategory(lang === 'es' ? 'Nueva categoría' : 'New category');
    setDraft((prev) => ({ ...prev, menu: [...prev.menu, cat] }));
    setOpenCategoryId(cat.id);
  };

  const removeCategory = (categoryId: string) => {
    setDraft((prev) => ({ ...prev, menu: prev.menu.filter((cat) => cat.id !== categoryId) }));
  };

  const addItem = (categoryId: string) => {
    setDraft((prev) => ({
      ...prev,
      menu: prev.menu.map((cat) =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, newMenuItem('')] } : cat
      ),
    }));
  };

  const removeItem = (categoryId: string, itemId: string) => {
    setDraft((prev) => ({
      ...prev,
      menu: prev.menu.map((cat) =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) } : cat
      ),
    }));
  };

  const addHighlight = () => {
    setDraft((prev) => ({ ...prev, highlights: [...prev.highlights, newMenuHighlight('')] }));
  };

  const removeHighlight = (id: string) => {
    setDraft((prev) => ({ ...prev, highlights: prev.highlights.filter((h) => h.id !== id) }));
  };

  const addDailyMenu = () => {
    setDraft((prev) => ({
      ...prev,
      dailyMenus: [...prev.dailyMenus, newDailyMenuCard(lang === 'es' ? 'Menú del Día' : 'Daily menu')],
    }));
  };

  const removeDailyMenu = (id: string) => {
    setDraft((prev) => ({ ...prev, dailyMenus: prev.dailyMenus.filter((d) => d.id !== id) }));
  };

  const addDailyInclude = (cardId: string) => {
    setDraft((prev) => ({
      ...prev,
      dailyMenus: prev.dailyMenus.map((d) =>
        d.id === cardId ? { ...d, items: [...d.items, lang === 'es' ? 'Nuevo incluido' : 'New included item'] } : d
      ),
    }));
  };

  const removeDailyInclude = (cardId: string, index: number) => {
    setDraft((prev) => ({
      ...prev,
      dailyMenus: prev.dailyMenus.map((d) =>
        d.id === cardId ? { ...d, items: d.items.filter((_, i) => i !== index) } : d
      ),
    }));
  };

  const updateGallery = (imageId: string, patch: Partial<GalleryImage>) => {
    setDraft((prev) => ({
      ...prev,
      gallery: prev.gallery.map((img) => (img.id === imageId ? { ...img, ...patch } : img)),
    }));
  };

  const moveGallery = (index: number, direction: -1 | 1) => {
    setDraft((prev) => {
      const next = [...prev.gallery];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, gallery: next };
    });
  };

  const addGalleryImage = () => {
    setDraft((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        newGalleryImage(
          'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
          lang === 'es' ? 'Nueva foto' : 'New photo'
        ),
      ],
    }));
  };

  const removeGalleryImage = (imageId: string) => {
    setDraft((prev) => ({ ...prev, gallery: prev.gallery.filter((img) => img.id !== imageId) }));
  };

  const updateInfoLine = (field: 'locationLines' | 'hoursLines' | 'priceLines' | 'specialtyItems', index: number, value: string) => {
    setDraft((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [field]: prev.info[field].map((line, i) => (i === index ? value : line)),
      },
    }));
  };

  const addInfoLine = (field: 'locationLines' | 'hoursLines' | 'priceLines' | 'specialtyItems') => {
    setDraft((prev) => ({
      ...prev,
      info: { ...prev.info, [field]: [...prev.info[field], ''] },
    }));
  };

  const removeInfoLine = (field: 'locationLines' | 'hoursLines' | 'priceLines' | 'specialtyItems', index: number) => {
    setDraft((prev) => ({
      ...prev,
      info: { ...prev.info, [field]: prev.info[field].filter((_, i) => i !== index) },
    }));
  };

  const updateInfo = (patch: Partial<PremiumStarterContent['info']>) => {
    setDraft((prev) => ({ ...prev, info: { ...prev.info, ...patch } }));
  };

  const updateFootball = (patch: Partial<PremiumStarterContent['football']>) => {
    setDraft((prev) => ({ ...prev, football: { ...prev.football, ...patch } }));
  };

  const updateFootballFeature = (id: string, patch: Partial<FootballFeature>) => {
    setDraft((prev) => ({
      ...prev,
      football: {
        ...prev.football,
        features: prev.football.features.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      },
    }));
  };

  const addFootballFeature = () => {
    setDraft((prev) => ({
      ...prev,
      football: { ...prev.football, features: [...prev.football.features, newFootballFeature('')] },
    }));
  };

  const removeFootballFeature = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      football: { ...prev.football, features: prev.football.features.filter((f) => f.id !== id) },
    }));
  };

  const updateDigital = (patch: Partial<PremiumStarterContent['digital']>) => {
    setDraft((prev) => ({ ...prev, digital: { ...prev.digital, ...patch } }));
  };

  const updateDigitalList = (
    field: 'qrFeatures' | 'reservaFeatures',
    index: number,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      digital: {
        ...prev.digital,
        [field]: prev.digital[field].map((line, i) => (i === index ? value : line)),
      },
    }));
  };

  const addDigitalListItem = (field: 'qrFeatures' | 'reservaFeatures') => {
    setDraft((prev) => ({
      ...prev,
      digital: { ...prev.digital, [field]: [...prev.digital[field], ''] },
    }));
  };

  const removeDigitalListItem = (field: 'qrFeatures' | 'reservaFeatures', index: number) => {
    setDraft((prev) => ({
      ...prev,
      digital: { ...prev.digital, [field]: prev.digital[field].filter((_, i) => i !== index) },
    }));
  };

  const updateReview = (id: string, patch: Partial<ReviewCard>) => {
    setDraft((prev) => ({
      ...prev,
      digital: {
        ...prev.digital,
        reviews: prev.digital.reviews.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      },
    }));
  };

  const addReview = () => {
    setDraft((prev) => ({
      ...prev,
      digital: { ...prev.digital, reviews: [...prev.digital.reviews, newReviewCard('')] },
    }));
  };

  const removeReview = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      digital: { ...prev.digital, reviews: prev.digital.reviews.filter((r) => r.id !== id) },
    }));
  };

  const trimLines = (lines: string[]) => lines.map((line) => line.trim()).filter(Boolean);

  const handleSave = () => {
    const normalized = normalizePremiumContent({
      menu: draft.menu
        .map((cat) => ({
          ...cat,
          id: slugifyId(cat.id || cat.name),
          name: cat.name.trim(),
          items: cat.items
            .filter((item) => item.name.trim())
            .map((item) => ({
              ...item,
              name: item.name.trim(),
              description: item.description?.trim() || undefined,
              price: item.price?.trim() || undefined,
            })),
        }))
        .filter((cat) => cat.name && cat.items.length > 0),
      highlights: draft.highlights
        .filter((h) => h.title.trim())
        .map((h) => ({
          ...h,
          title: h.title.trim(),
          description: h.description.trim(),
        })),
      dailyMenus: draft.dailyMenus
        .filter((d) => d.title.trim() && d.price.trim())
        .map((d) => ({
          ...d,
          title: d.title.trim(),
          price: d.price.trim(),
          scheduleTitle: d.scheduleTitle.trim(),
          scheduleDetail: d.scheduleDetail.trim(),
          items: d.items.map((i) => i.trim()).filter(Boolean),
        })),
      info: {
        ...draft.info,
        locationLines: trimLines(draft.info.locationLines),
        hoursLines: trimLines(draft.info.hoursLines),
        priceLines: trimLines(draft.info.priceLines),
        specialtyItems: trimLines(draft.info.specialtyItems),
        locationLinkText: draft.info.locationLinkText.trim() || 'Cómo llegar →',
        hoursStatusText: draft.info.hoursStatusText.trim() || (draft.info.hoursStatusOpen ? 'Abierto ahora' : 'Cerrado'),
      },
      football: {
        ...draft.football,
        headline: draft.football.headline.trim(),
        introPrefix: draft.football.introPrefix.trim(),
        highlightName: draft.football.highlightName.trim(),
        tagline: draft.football.tagline.trim(),
        ctaText: draft.football.ctaText.trim(),
        features: draft.football.features
          .filter((f) => f.title.trim())
          .map((f) => ({
            ...f,
            title: f.title.trim(),
            description: f.description.trim(),
            icon: f.icon.trim() || 'fas fa-futbol',
          })),
      },
      digital: {
        ...draft.digital,
        googleRating: draft.digital.googleRating.trim(),
        googleReviewCount: draft.digital.googleReviewCount.trim(),
        badge24hText: draft.digital.badge24hText.trim(),
        qrHeadline: draft.digital.qrHeadline.trim(),
        qrSubtitle: draft.digital.qrSubtitle.trim(),
        qrTargetUrl: draft.digital.qrTargetUrl.trim() || '#menu',
        qrFeatures: trimLines(draft.digital.qrFeatures),
        reservaBannerTitle: draft.digital.reservaBannerTitle.trim(),
        reservaBannerText: draft.digital.reservaBannerText.trim(),
        reservaFeatures: trimLines(draft.digital.reservaFeatures),
        reviewsHeadline: draft.digital.reviewsHeadline.trim(),
        reviewsSubtitle: draft.digital.reviewsSubtitle.trim(),
        googleMapsUrl: draft.digital.googleMapsUrl.trim(),
        orderingEnabled: draft.digital.orderingEnabled,
        tableCount: Math.max(1, Math.min(50, Number(draft.digital.tableCount) || 10)),
        tableSectionHeadline: draft.digital.tableSectionHeadline.trim(),
        tableSectionSubtitle: draft.digital.tableSectionSubtitle.trim(),
        orderSendButtonText: draft.digital.orderSendButtonText.trim() || 'Enviar pedido por WhatsApp',
        reviews: draft.digital.reviews
          .filter((r) => r.author.trim() && r.text.trim())
          .map((r) => ({
            ...r,
            author: r.author.trim(),
            badge: r.badge.trim(),
            initials: r.initials.trim().slice(0, 2).toUpperCase(),
            stars: Math.min(5, Math.max(1, r.stars)),
            date: r.date.trim(),
            text: r.text.trim(),
          })),
      },
      gallery: draft.gallery
        .filter((img) => img.url.trim())
        .map((img) => ({ ...img, url: img.url.trim(), alt: img.alt.trim() || img.url.trim() })),
    });
    onSave(normalized, tab);
  };

  const canSave =
    tab === 'menu'
      ? draft.menu.some((c) => c.items.some((i) => i.name.trim()))
      : tab === 'highlights'
        ? draft.highlights.some((h) => h.title.trim())
        : tab === 'daily'
          ? draft.dailyMenus.some((d) => d.title.trim() && d.price.trim())
          : tab === 'info'
            ? trimLines(draft.info.locationLines).length > 0 ||
              trimLines(draft.info.hoursLines).length > 0 ||
              trimLines(draft.info.priceLines).length > 0 ||
              trimLines(draft.info.specialtyItems).length > 0
            : tab === 'football'
              ? draft.football.headline.trim().length > 0 ||
                draft.football.features.some((f) => f.title.trim())
              : tab === 'digital'
                ? draft.digital.googleRating.trim().length > 0 ||
                  draft.digital.qrHeadline.trim().length > 0 ||
                  draft.digital.reviews.some((r) => r.author.trim() && r.text.trim())
                : draft.gallery.some((g) => g.url.trim());

  const tabBtn = (id: PremiumEditorTab, label: string, icon: ReactNode) => (
    <button
      type="button"
      onClick={() => onTabChange(id)}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer whitespace-nowrap ${
        tab === id ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full min-h-[420px] bg-white">
      <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <div className="flex flex-wrap gap-2">
          {tabBtn('menu', t.menu, <UtensilsCrossed className="w-3.5 h-3.5" />)}
          {tabBtn('highlights', t.highlights, <Star className="w-3.5 h-3.5" />)}
          {tabBtn('daily', t.daily, <CalendarDays className="w-3.5 h-3.5" />)}
          {tabBtn('info', t.info, <Info className="w-3.5 h-3.5" />)}
          {tabBtn('football', t.football, <Trophy className="w-3.5 h-3.5" />)}
          {tabBtn('digital', t.digital, <ScanLine className="w-3.5 h-3.5" />)}
          {tabBtn('gallery', t.gallery, <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />)}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
        {tab === 'menu' && (
          <>
            {draft.menu.length === 0 && <p className="text-sm text-slate-500">{t.emptyMenu}</p>}
            {draft.menu.map((category) => {
              const open = openCategoryId === category.id;
              return (
                <div key={category.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenCategoryId(open ? null : category.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-left cursor-pointer"
                  >
                    <span className="font-medium text-slate-900">{category.name || t.category}</span>
                    <span className="text-xs text-slate-500">{category.items.length} platos</span>
                  </button>
                  {open && (
                    <div className="p-4 space-y-4 border-t border-slate-100">
                      <label className="block text-sm">
                        <span className="text-slate-600">{t.category}</span>
                        <input
                          value={category.name}
                          onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                      </label>
                      {category.items.map((item) => (
                        <div key={item.id} className="rounded-xl border border-slate-100 p-3 space-y-2 bg-slate-50/50">
                          <div className="flex gap-2">
                            <input
                              value={item.name}
                              onChange={(e) => updateItem(category.id, item.id, { name: e.target.value })}
                              placeholder={t.dish}
                              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                            <input
                              value={item.price ?? ''}
                              onChange={(e) => updateItem(category.id, item.id, { price: e.target.value })}
                              placeholder={t.price}
                              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(category.id, item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            value={item.description ?? ''}
                            onChange={(e) => updateItem(category.id, item.id, { description: e.target.value })}
                            placeholder={t.description}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => addItem(category.id)}
                          className="flex items-center gap-1 text-sm text-amber-800 hover:underline cursor-pointer"
                        >
                          <Plus className="w-4 h-4" /> {t.addDish}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCategory(category.id)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer ml-auto"
                        >
                          <Trash2 className="w-4 h-4" /> {lang === 'es' ? 'Eliminar categoría' : 'Delete category'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={addCategory}
              className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.addCategory}
            </button>
          </>
        )}

        {tab === 'highlights' && (
          <>
            {draft.highlights.length === 0 && <p className="text-sm text-slate-500">{t.emptyHighlights}</p>}
            {draft.highlights.map((highlight) => (
              <div key={highlight.id} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <input
                  value={highlight.title}
                  onChange={(e) => updateHighlight(highlight.id, { title: e.target.value })}
                  placeholder={t.title}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
                />
                <textarea
                  value={highlight.description}
                  onChange={(e) => updateHighlight(highlight.id, { description: e.target.value })}
                  placeholder={t.description}
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(highlight.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> {lang === 'es' ? 'Eliminar' : 'Delete'}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHighlight}
              className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.addHighlight}
            </button>
          </>
        )}

        {tab === 'daily' && (
          <>
            {draft.dailyMenus.length === 0 && <p className="text-sm text-slate-500">{t.emptyDaily}</p>}
            {draft.dailyMenus.map((card) => (
              <div key={card.id} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <input
                  value={card.title}
                  onChange={(e) => updateDaily(card.id, { title: e.target.value })}
                  placeholder={t.title}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
                />
                <input
                  value={card.price}
                  onChange={(e) => updateDaily(card.id, { price: e.target.value })}
                  placeholder={t.price}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={card.scheduleTitle}
                  onChange={(e) => updateDaily(card.id, { scheduleTitle: e.target.value })}
                  placeholder={t.scheduleTitle}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={card.scheduleDetail}
                  onChange={(e) => updateDaily(card.id, { scheduleDetail: e.target.value })}
                  placeholder={t.scheduleDetail}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <div>
                  <p className="text-xs text-slate-500 mb-2">{t.includes}</p>
                  {card.items.map((item, index) => (
                    <div key={`${card.id}-${index}`} className="flex gap-2 mb-2">
                      <input
                        value={item}
                        onChange={(e) => updateDailyItem(card.id, index, e.target.value)}
                        placeholder={t.includeItem}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeDailyInclude(card.id, index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDailyInclude(card.id)}
                    className="flex items-center gap-1 text-sm text-amber-800 hover:underline cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> {t.addInclude}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeDailyMenu(card.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> {lang === 'es' ? 'Eliminar menú' : 'Delete menu'}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDailyMenu}
              className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.addDailyMenu}
            </button>
          </>
        )}

        {tab === 'info' && (
          <>
            {!trimLines(draft.info.locationLines).length &&
              !trimLines(draft.info.hoursLines).length &&
              !trimLines(draft.info.priceLines).length &&
              !trimLines(draft.info.specialtyItems).length && (
                <p className="text-sm text-slate-500">{t.emptyInfo}</p>
              )}
            {(
              [
                { field: 'locationLines' as const, label: t.location },
                { field: 'hoursLines' as const, label: t.hours },
                { field: 'priceLines' as const, label: t.prices },
                { field: 'specialtyItems' as const, label: t.specialties },
              ] as const
            ).map(({ field, label }) => (
              <div key={field} className="rounded-2xl border border-slate-200 p-4 space-y-2">
                <p className="text-sm font-medium text-slate-900">{label}</p>
                {draft.info[field].map((line, index) => (
                  <div key={`${field}-${index}`} className="flex gap-2">
                    <input
                      value={line}
                      onChange={(e) => updateInfoLine(field, index, e.target.value)}
                      placeholder={t.line}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeInfoLine(field, index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addInfoLine(field)}
                  className="flex items-center gap-1 text-sm text-amber-800 hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> {t.addLine}
                </button>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <label className="block text-sm">
                <span className="text-slate-600">{t.locationLink}</span>
                <input
                  value={draft.info.locationLinkText}
                  onChange={(e) => updateInfo({ locationLinkText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.info.hoursStatusOpen}
                  onChange={(e) => updateInfo({ hoursStatusOpen: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span>{draft.info.hoursStatusOpen ? t.statusOpen : t.statusClosed}</span>
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">{t.statusText}</span>
                <input
                  value={draft.info.hoursStatusText}
                  onChange={(e) => updateInfo({ hoursStatusText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </>
        )}

        {tab === 'football' && (
          <>
            {!draft.football.headline.trim() && draft.football.features.length === 0 && (
              <p className="text-sm text-slate-500">{t.emptyFootball}</p>
            )}
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <input
                value={draft.football.headline}
                onChange={(e) => updateFootball({ headline: e.target.value })}
                placeholder={t.headline}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
              />
              <input
                value={draft.football.introPrefix}
                onChange={(e) => updateFootball({ introPrefix: e.target.value })}
                placeholder={t.introPrefix}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.football.highlightName}
                onChange={(e) => updateFootball({ highlightName: e.target.value })}
                placeholder={t.highlightName}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.football.tagline}
                onChange={(e) => updateFootball({ tagline: e.target.value })}
                placeholder={t.tagline}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.football.ctaText}
                onChange={(e) => updateFootball({ ctaText: e.target.value })}
                placeholder={t.ctaText}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            {draft.football.features.map((feature) => (
              <div key={feature.id} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <input
                  value={feature.icon}
                  onChange={(e) => updateFootballFeature(feature.id, { icon: e.target.value })}
                  placeholder={t.iconClass}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={feature.title}
                  onChange={(e) => updateFootballFeature(feature.id, { title: e.target.value })}
                  placeholder={t.title}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) => updateFootballFeature(feature.id, { description: e.target.value })}
                  placeholder={t.description}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeFootballFeature(feature.id)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> {lang === 'es' ? 'Eliminar' : 'Delete'}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFootballFeature}
              className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.addFeature}
            </button>
          </>
        )}

        {tab === 'digital' && (
          <>
            {!draft.digital.googleRating.trim() && !draft.digital.qrHeadline.trim() && (
              <p className="text-sm text-slate-500">{t.emptyDigital}</p>
            )}
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">{lang === 'es' ? 'Pedidos por mesa (WhatsApp)' : 'Table orders (WhatsApp)'}</p>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.digital.orderingEnabled}
                  onChange={(e) => updateDigital({ orderingEnabled: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span>{t.orderingEnabled}</span>
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">{t.tableCount}</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={draft.digital.tableCount}
                  onChange={(e) => updateDigital({ tableCount: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <input
                value={draft.digital.tableSectionHeadline}
                onChange={(e) => updateDigital({ tableSectionHeadline: e.target.value })}
                placeholder={t.tableHeadline}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.digital.tableSectionSubtitle}
                onChange={(e) => updateDigital({ tableSectionSubtitle: e.target.value })}
                placeholder={t.tableSubtitle}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.digital.orderSendButtonText}
                onChange={(e) => updateDigital({ orderSendButtonText: e.target.value })}
                placeholder={t.orderButton}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Google & confianza</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm">
                  <span className="text-slate-600">{t.googleRating}</span>
                  <input
                    value={draft.digital.googleRating}
                    onChange={(e) => updateDigital({ googleRating: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">{t.googleReviews}</span>
                  <input
                    value={draft.digital.googleReviewCount}
                    onChange={(e) => updateDigital({ googleReviewCount: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-slate-600">{t.badge24h}</span>
                <input
                  value={draft.digital.badge24hText}
                  onChange={(e) => updateDigital({ badge24hText: e.target.value })}
                  placeholder="Reserva online"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Carta digital QR</p>
              <input
                value={draft.digital.qrHeadline}
                onChange={(e) => updateDigital({ qrHeadline: e.target.value })}
                placeholder={t.qrHeadline}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.digital.qrSubtitle}
                onChange={(e) => updateDigital({ qrSubtitle: e.target.value })}
                placeholder={t.qrSubtitle}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.digital.qrTargetUrl}
                onChange={(e) => updateDigital({ qrTargetUrl: e.target.value })}
                placeholder={t.qrUrl}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <p className="text-xs text-slate-500">{t.qrFeatures}</p>
              {draft.digital.qrFeatures.map((item, index) => (
                <div key={`qr-${index}`} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateDigitalList('qrFeatures', index, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => removeDigitalListItem('qrFeatures', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addDigitalListItem('qrFeatures')} className="flex items-center gap-1 text-sm text-amber-800 hover:underline cursor-pointer">
                <Plus className="w-4 h-4" /> {t.addLine}
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Reservas 24h</p>
              <input
                value={draft.digital.reservaBannerTitle}
                onChange={(e) => updateDigital({ reservaBannerTitle: e.target.value })}
                placeholder={t.reservaTitle}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <textarea
                value={draft.digital.reservaBannerText}
                onChange={(e) => updateDigital({ reservaBannerText: e.target.value })}
                placeholder={t.reservaText}
                rows={3}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none"
              />
              <p className="text-xs text-slate-500">{t.reservaFeatures}</p>
              {draft.digital.reservaFeatures.map((item, index) => (
                <div key={`res-${index}`} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateDigitalList('reservaFeatures', index, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => removeDigitalListItem('reservaFeatures', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addDigitalListItem('reservaFeatures')} className="flex items-center gap-1 text-sm text-amber-800 hover:underline cursor-pointer">
                <Plus className="w-4 h-4" /> {t.addLine}
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-900">Reseñas Google</p>
              <input
                value={draft.digital.reviewsHeadline}
                onChange={(e) => updateDigital({ reviewsHeadline: e.target.value })}
                placeholder={t.reviewsTitle}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.digital.reviewsSubtitle}
                onChange={(e) => updateDigital({ reviewsSubtitle: e.target.value })}
                placeholder={t.reviewsSubtitle}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={draft.digital.googleMapsUrl}
                onChange={(e) => updateDigital({ googleMapsUrl: e.target.value })}
                placeholder={t.googleMapsUrl}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              {draft.digital.reviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-slate-100 p-3 space-y-2 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-2">
                    <input value={review.author} onChange={(e) => updateReview(review.id, { author: e.target.value })} placeholder={t.author} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input value={review.initials} onChange={(e) => updateReview(review.id, { initials: e.target.value })} placeholder={t.initials} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  </div>
                  <input value={review.badge} onChange={(e) => updateReview(review.id, { badge: e.target.value })} placeholder={t.reviewBadge} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" min={1} max={5} step={0.5} value={review.stars} onChange={(e) => updateReview(review.id, { stars: Number(e.target.value) })} placeholder={t.stars} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    <input value={review.date} onChange={(e) => updateReview(review.id, { date: e.target.value })} placeholder={t.reviewDate} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  </div>
                  <textarea value={review.text} onChange={(e) => updateReview(review.id, { text: e.target.value })} placeholder={t.reviewText} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none" />
                  <button type="button" onClick={() => removeReview(review.id)} className="flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer">
                    <Trash2 className="w-4 h-4" /> {lang === 'es' ? 'Eliminar' : 'Delete'}
                  </button>
                </div>
              ))}
              <button type="button" onClick={addReview} className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:underline cursor-pointer">
                <Plus className="w-4 h-4" /> {t.addReview}
              </button>
            </div>
          </>
        )}

        {tab === 'gallery' && (
          <>
            {draft.gallery.length === 0 && <p className="text-sm text-slate-500">{t.emptyGallery}</p>}
            {draft.gallery.map((image, index) => (
              <div key={image.id} className="flex gap-3 rounded-2xl border border-slate-200 p-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  {image.url ? (
                    <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <input
                    value={image.url}
                    onChange={(e) => updateGallery(image.id, { url: e.target.value })}
                    placeholder={t.photoUrl}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    value={image.alt}
                    onChange={(e) => updateGallery(image.id, { alt: e.target.value })}
                    placeholder={t.photoAlt}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveGallery(index, -1)}
                    className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 cursor-pointer"
                    title={t.moveUp}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === draft.gallery.length - 1}
                    onClick={() => moveGallery(index, 1)}
                    className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 cursor-pointer"
                    title={t.moveDown}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(image.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addGalleryImage}
              className="flex items-center gap-2 text-sm font-medium text-amber-800 hover:underline cursor-pointer"
            >
              <Plus className="w-4 h-4" /> {t.addPhoto}
            </button>
          </>
        )}
      </div>

      <div className="px-5 py-4 border-t border-slate-100 shrink-0">
        <button
          type="button"
          disabled={!canSave || isSaving}
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 text-white py-3 font-semibold hover:bg-amber-700 disabled:opacity-40 cursor-pointer"
        >
          <Save className="w-4 h-4" /> {t.save}
        </button>
      </div>
    </div>
  );
}
