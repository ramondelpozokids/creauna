import type { BusinessProfile } from './businessProfiles';

export type FashionFullPageCtx = {
  brandName: string;
  tagline: string;
  badge: string;
  heroImage: string;
  lang: 'es' | 'en';
  profile: BusinessProfile | null;
};

type FashionProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  desc: string;
  sizes: string[];
};

const PEXELS = {
  hero: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&h=1080&q=80',
  p1: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1200&fit=crop',
  p2: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1200&fit=crop',
  p3: 'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1200&fit=crop',
  p4: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1200&fit=crop',
  p5: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1200&fit=crop',
  p6: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=1000&h=1200&fit=crop',
  look1: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&h=900&q=80',
  look2: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=1000&q=80',
  look3: 'https://images.pexels.com/photos/2983468/pexels-photo-2983468.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
};

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function productsForLang(lang: 'es' | 'en'): FashionProduct[] {
  const es = lang === 'es';
  return [
    {
      id: 1,
      name: es ? 'Abrigo de Lana Estructurado' : 'Structured Wool Coat',
      category: es ? 'Mujer' : 'Women',
      price: 450,
      image: PEXELS.p1,
      desc: es
        ? 'Lana italiana de origen sostenible. Corte oversize, solapas anchas y forro de seda.'
        : 'Sustainable Italian wool. Oversize cut, wide lapels and silk lining.',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 2,
      name: es ? 'Blusa de Seda Natural' : 'Natural Silk Blouse',
      category: es ? 'Mujer' : 'Women',
      price: 185,
      image: PEXELS.p2,
      desc: es
        ? 'Seda 100% natural con caída fluida. Cuello lazo y puños con botón de nácar.'
        : '100% natural silk with fluid drape. Tie neck and mother-of-pearl cuffs.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    {
      id: 3,
      name: es ? 'Chaqueta de Cuero Premium' : 'Premium Leather Jacket',
      category: es ? 'Hombre' : 'Men',
      price: 480,
      oldPrice: 600,
      image: PEXELS.p3,
      desc: es
        ? 'Cuero de cordero grabado, acabado mate. Forro acolchado y cremalleras de latón.'
        : 'Embossed lamb leather, matte finish. Quilted lining and aged brass zips.',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 4,
      name: es ? 'Bolso Tote de Piel' : 'Leather Tote Bag',
      category: es ? 'Accesorios' : 'Accessories',
      price: 320,
      image: PEXELS.p4,
      desc: es
        ? 'Piel de becerro granulada. Compartimento para portátil y color champagne.'
        : 'Grained calfskin. Laptop compartment and champagne tone.',
      sizes: [es ? 'Única' : 'One size'],
    },
    {
      id: 5,
      name: es ? 'Jersey de Cachemira' : 'Cashmere Sweater',
      category: es ? 'Hombre' : 'Men',
      price: 295,
      image: PEXELS.p5,
      desc: es
        ? 'Cachemira grado A hilada en Escocia. Cuello de pico y acabado en canalé.'
        : 'Grade-A cashmere spun in Scotland. V-neck and ribbed finish.',
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 6,
      name: es ? 'Vestido Midi Plisado' : 'Pleated Midi Dress',
      category: es ? 'Mujer' : 'Women',
      price: 210,
      image: PEXELS.p6,
      desc: es
        ? 'Tejido premium con plisado permanente. Cintura elástica y caída hasta la pantorrilla.'
        : 'Premium fabric with permanent pleats. Elastic waist and calf-length hem.',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 7,
      name: es ? 'Blazer Estructura Arena' : 'Sand Structured Blazer',
      category: es ? 'Mujer' : 'Women',
      price: 245,
      image: PEXELS.p2,
      desc: es ? 'Silueta entallada con hombro definido. Perfecto para capas editoriales.'
        : 'Tailored silhouette with defined shoulder. Perfect for editorial layering.',
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 8,
      name: es ? 'Zapatillas Cuero Blanco' : 'White Leather Sneakers',
      category: es ? 'Calzado' : 'Footwear',
      price: 165,
      image: PEXELS.p5,
      desc: es ? 'Cuero italiano y suela de goma premium. Minimalismo atemporal.'
        : 'Italian leather and premium rubber sole. Timeless minimalism.',
      sizes: ['39', '40', '41', '42', '43', '44'],
    },
  ];
}

/** SPA eCommerce moda premium — superior a plantillas por sección: carrito, checkout Stripe, ficha producto. */
export function buildFashionFullPageHtml(ctx: FashionFullPageCtx): string {
  const es = ctx.lang === 'es';
  const brand = esc(ctx.brandName.toUpperCase().slice(0, 24) || 'MAISON');
  const tagline = esc(ctx.tagline);
  const badge = esc(ctx.badge);
  const heroImg = esc(ctx.heroImage || PEXELS.hero);
  const productsJson = JSON.stringify(productsForLang(ctx.lang)).replace(/</g, '\\u003c');
  const cartKey = `maison_cart_${brand.replace(/\W/g, '').toLowerCase() || 'default'}`;

  const t = {
    shopCollection: es ? 'Comprar Colección' : 'Shop Collection',
    newCollection: es ? 'Nueva Colección' : 'New Collection',
    editorial: es ? 'Selección editorial' : 'Editorial selection',
    lookbook: es ? 'Lookbook' : 'Lookbook',
    lookbookSub: es ? 'Campaña Otoño / Invierno · Fotografía de moda' : 'AW Campaign · Fashion photography',
    brands: es ? 'Marcas internacionales' : 'International brands',
    newsletter: es ? 'Newsletter exclusiva' : 'Exclusive newsletter',
    newsletterSub: es ? '10% en tu primera compra · Acceso anticipado a drops.' : '10% off first order · Early access to drops.',
    subscribe: es ? 'Suscribirme' : 'Subscribe',
    cart: es ? 'Carrito' : 'Bag',
    emptyCart: es ? 'Su carrito está vacío.' : 'Your bag is empty.',
    keepShopping: es ? 'Seguir Comprando' : 'Continue shopping',
    checkout: es ? 'Finalizar Compra' : 'Checkout',
    shipping: es ? 'Información de Envío' : 'Shipping information',
    payment: es ? 'Método de Pago' : 'Payment method',
    payNow: es ? 'Pagar Ahora' : 'Pay now',
    processing: es ? 'Procesando…' : 'Processing…',
    thanks: es ? 'Gracias por su compra' : 'Thank you for your order',
    orderOk: es ? 'Su pedido ha sido procesado con éxito.' : 'Your order was processed successfully.',
    backStore: es ? 'Volver a la Tienda' : 'Back to store',
    addToCart: es ? 'Añadir al Carrito' : 'Add to bag',
    quickView: es ? 'Vista Rápida' : 'Quick view',
    size: es ? 'Talla' : 'Size',
    backShop: es ? 'Volver a la tienda' : 'Back to shop',
    orderSummary: es ? 'Resumen del Pedido' : 'Order summary',
    subtotal: es ? 'Subtotal' : 'Subtotal',
    shippingLabel: es ? 'Envío' : 'Shipping',
    free: es ? 'Gratuito' : 'Free',
    tax: es ? 'Impuestos (IVA incl.)' : 'Tax (VAT incl.)',
    taxCalc: es ? 'Calculado al finalizar' : 'Calculated at checkout',
    total: es ? 'Total' : 'Total',
    toastAdded: es ? 'Producto añadido al carrito' : 'Added to bag',
    trust1: es ? 'Envío express 24–48h' : 'Express shipping 24–48h',
    trust2: es ? 'Devoluciones 30 días' : '30-day returns',
    trust3: es ? 'Pago seguro Stripe' : 'Secure Stripe checkout',
    footerAbout: es
      ? 'Redefiniendo el lujo moderno con diseño editorial, artesanía impecable y tecnología de conversión.'
      : 'Redefining modern luxury with editorial design, impeccable craft and conversion technology.',
    buy: es ? 'Comprar' : 'Shop',
    help: es ? 'Asistencia' : 'Help',
    legal: es ? 'Legal' : 'Legal',
  };

  const brands = ['COS', 'Massimo Dutti', 'Zara', 'Hugo Boss', 'Gucci', 'Dior', 'Nike', 'Adidas'];

  return `<!DOCTYPE html>
<html lang="${ctx.lang}" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brand} | ${es ? 'eCommerce de Élite' : 'Elite eCommerce'}</title>
  <meta name="description" content="${tagline}">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"><\/script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { 'maison-bg': '#FAFAFA', 'maison-text': '#111111', 'maison-accent': '#C4A484', 'maison-dark': '#1A202C', 'maison-olive': '#556B2F' },
          fontFamily: { serif: ['"Playfair Display"', 'serif'], sans: ['"Inter"', 'sans-serif'] },
          animation: { 'fade-in': 'fadeIn 0.5s ease-out forwards', 'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' },
          keyframes: {
            fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
            slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
          }
        }
      }
    }
  <\/script>
  <style>
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #FAFAFA; }
    ::-webkit-scrollbar-thumb { background: #C4A484; border-radius: 3px; }
    .view-section { display: none; }
    .view-section.active { display: block; animation: fadeIn 0.5s ease-out; }
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .marquee-track { animation: marquee 28s linear infinite; }
  </style>
</head>
<body class="bg-maison-bg text-maison-text font-sans antialiased selection:bg-maison-accent selection:text-white flex flex-col min-h-screen">

  <div class="bg-maison-dark text-white text-[10px] tracking-[0.25em] uppercase py-2.5 px-4 text-center">
    ${t.trust1} · ${t.trust2} · ${t.trust3}
  </div>

  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
      <button type="button" onclick="navigateTo('home')" class="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-maison-text hover:text-maison-accent transition-colors shrink-0">${brand}</button>
      <nav class="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[10px] font-medium tracking-widest uppercase">
        <button type="button" onclick="navigateTo('home')" class="hover:text-maison-accent transition-colors">${es ? 'Inicio' : 'Home'}</button>
        <button type="button" onclick="filterCategory('${es ? 'Mujer' : 'Women'}')" class="hover:text-maison-accent transition-colors">${es ? 'Mujer' : 'Women'}</button>
        <button type="button" onclick="filterCategory('${es ? 'Hombre' : 'Men'}')" class="hover:text-maison-accent transition-colors">${es ? 'Hombre' : 'Men'}</button>
        <button type="button" onclick="filterCategory('${es ? 'Accesorios' : 'Accessories'}')" class="hover:text-maison-accent transition-colors">${es ? 'Accesorios' : 'Accessories'}</button>
        <button type="button" onclick="document.getElementById('lookbook')?.scrollIntoView({behavior:'smooth'})" class="hover:text-maison-accent transition-colors">${t.lookbook}</button>
      </nav>
      <div class="flex items-center space-x-3 sm:space-x-5 shrink-0">
        <span class="hidden md:flex items-center border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-400 gap-2">
          <i data-lucide="search" class="w-3.5 h-3.5"></i>
          <span class="tracking-wide">${es ? 'Buscar' : 'Search'}</span>
        </span>
        <button type="button" class="hidden sm:block hover:text-maison-accent transition-colors" aria-label="Account"><i data-lucide="user" class="w-5 h-5"></i></button>
        <button type="button" onclick="navigateTo('cart')" class="relative hover:text-maison-accent transition-colors" aria-label="${t.cart}">
          <i data-lucide="shopping-bag" class="w-5 h-5"></i>
          <span id="cart-badge" class="absolute -top-1.5 -right-1.5 bg-maison-text text-white text-[9px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full opacity-0 transition-opacity">0</span>
        </button>
      </div>
    </div>
  </header>

  <main class="flex-grow">
    <div id="view-home" class="view-section active">
      <section class="relative h-[88vh] min-h-[520px] w-full overflow-hidden flex items-center justify-center bg-gray-900">
        <img src="${heroImg}" class="absolute inset-0 w-full h-full object-cover opacity-70" alt="${brand}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${PEXELS.hero}'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-slide-up">
          <p class="text-[10px] font-medium tracking-[0.35em] uppercase mb-6 text-maison-accent">${badge}</p>
          <h1 class="font-serif text-4xl sm:text-6xl md:text-7xl leading-[1.08] mb-6">${es ? 'La esencia del' : 'The essence of'}<br><i class="font-light">${es ? 'movimiento' : 'movement'}</i></h1>
          <p class="text-sm sm:text-base text-white/80 max-w-xl mx-auto mb-10 font-light leading-relaxed">${tagline}</p>
          <button type="button" onclick="document.getElementById('products-grid').scrollIntoView({behavior:'smooth'})" class="bg-white text-maison-text px-10 py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-maison-accent hover:text-white transition-all duration-500">${t.shopCollection}</button>
        </div>
      </section>

      <section class="py-6 border-b border-gray-100 overflow-hidden bg-white">
        <div class="marquee-track flex whitespace-nowrap gap-16 text-xs tracking-[0.35em] uppercase text-gray-400 font-medium">
          ${[...brands, ...brands].map((b) => `<span>${b}</span>`).join('')}
        </div>
      </section>

      <section id="lookbook" class="py-20 md:py-28 max-w-[1400px] mx-auto px-6">
        <div class="text-center mb-12">
          <p class="text-[10px] tracking-[0.35em] uppercase text-maison-accent mb-3">${t.lookbook}</p>
          <h2 class="font-serif text-3xl md:text-5xl text-maison-text">${t.lookbookSub}</h2>
          <div class="w-12 h-px bg-maison-accent mx-auto mt-6"></div>
        </div>
        <div class="grid md:grid-cols-12 gap-4">
          <div class="md:col-span-7 rounded-sm overflow-hidden bg-gray-100 aspect-[4/5] md:aspect-auto md:min-h-[520px]">
            <img src="${PEXELS.look1}" class="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" alt="" loading="lazy" referrerpolicy="no-referrer">
          </div>
          <div class="md:col-span-5 grid gap-4">
            <div class="rounded-sm overflow-hidden bg-gray-100 aspect-square"><img src="${PEXELS.look2}" class="w-full h-full object-cover" alt="" loading="lazy" referrerpolicy="no-referrer"></div>
            <div class="rounded-sm overflow-hidden bg-gray-100 aspect-square"><img src="${PEXELS.look3}" class="w-full h-full object-cover" alt="" loading="lazy" referrerpolicy="no-referrer"></div>
          </div>
        </div>
      </section>

      <section id="products-grid" class="py-20 md:py-28 max-w-[1400px] mx-auto px-6">
        <div class="text-center mb-14">
          <p class="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-3">${t.editorial}</p>
          <h2 class="font-serif text-4xl md:text-5xl text-maison-text mb-4">${t.newCollection}</h2>
          <div class="w-12 h-px bg-maison-accent mx-auto"></div>
        </div>
        <div id="products-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14"></div>
      </section>

      <section class="bg-maison-dark text-white py-16 md:py-20 px-6">
        <div class="max-w-xl mx-auto text-center">
          <h2 class="font-serif text-2xl md:text-3xl mb-3">${t.newsletter}</h2>
          <p class="text-white/60 text-sm mb-8">${t.newsletterSub}</p>
          <div class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Email" class="flex-1 bg-white/10 border border-white/20 rounded-sm px-4 py-3 text-sm placeholder:text-white/40 focus:outline-none focus:border-maison-accent">
            <button type="button" class="px-8 py-3 bg-maison-accent text-maison-dark text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-colors">${t.subscribe}</button>
          </div>
        </div>
      </section>
    </div>

    <div id="view-product" class="view-section">
      <div class="max-w-[1400px] mx-auto px-6 py-12">
        <button type="button" onclick="navigateTo('home')" class="flex items-center text-[10px] font-medium tracking-widest uppercase text-gray-500 hover:text-maison-text mb-8 transition-colors">
          <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> ${t.backShop}
        </button>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div class="bg-gray-100 aspect-[3/4] overflow-hidden rounded-sm">
            <img id="detail-image" src="" class="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" alt="">
          </div>
          <div class="flex flex-col justify-center">
            <p id="detail-category" class="text-[10px] font-medium tracking-widest uppercase text-maison-accent mb-3"></p>
            <h1 id="detail-name" class="font-serif text-3xl md:text-5xl text-maison-text mb-4"></h1>
            <p id="detail-price" class="text-2xl font-light text-maison-text mb-6"></p>
            <p id="detail-desc" class="text-gray-600 leading-relaxed mb-8 font-light"></p>
            <div class="mb-8">
              <label class="text-[10px] font-semibold tracking-widest uppercase mb-3 block">${t.size}</label>
              <div class="flex flex-wrap gap-3" id="detail-sizes"></div>
            </div>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <div class="flex items-center border border-gray-300 w-fit">
                <button type="button" onclick="adjustDetailQty(-1)" class="px-4 py-3 hover:bg-gray-100 transition-colors">-</button>
                <span id="detail-qty" class="px-4 py-3 text-sm font-medium w-12 text-center">1</span>
                <button type="button" onclick="adjustDetailQty(1)" class="px-4 py-3 hover:bg-gray-100 transition-colors">+</button>
              </div>
              <button type="button" onclick="addToCartFromDetail()" class="flex-1 bg-maison-text text-white py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-maison-accent transition-colors">${t.addToCart}</button>
            </div>
            <div class="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-500">
              <p class="flex items-center"><i data-lucide="truck" class="w-4 h-4 mr-3"></i> ${es ? 'Envío gratuito en pedidos superiores a 200€' : 'Free shipping on orders over €200'}</p>
              <p class="flex items-center"><i data-lucide="shield-check" class="w-4 h-4 mr-3"></i> Stripe · PayPal · Apple Pay</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="view-cart" class="view-section">
      <div class="max-w-[1000px] mx-auto px-6 py-16">
        <h1 class="font-serif text-4xl text-maison-text mb-12 text-center">${t.cart}</h1>
        <div id="cart-empty-msg" class="hidden text-center py-20">
          <i data-lucide="shopping-bag" class="w-16 h-16 mx-auto text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-6">${t.emptyCart}</p>
          <button type="button" onclick="navigateTo('home')" class="bg-maison-text text-white px-8 py-3 text-[10px] font-semibold tracking-widest uppercase hover:bg-maison-accent transition-colors">${t.keepShopping}</button>
        </div>
        <div id="cart-content" class="hidden">
          <div id="cart-items" class="space-y-8 mb-12"></div>
          <div class="bg-gray-50 p-8 md:p-12 border border-gray-100 rounded-sm">
            <h3 class="font-serif text-2xl mb-6">${t.orderSummary}</h3>
            <div class="space-y-3 text-sm mb-6 pb-6 border-b border-gray-200">
              <div class="flex justify-between"><span class="text-gray-600">${t.subtotal}</span><span id="cart-subtotal" class="font-medium">0,00 €</span></div>
              <div class="flex justify-between"><span class="text-gray-600">${t.shippingLabel}</span><span class="font-medium">${t.free}</span></div>
              <div class="flex justify-between"><span class="text-gray-600">${t.tax}</span><span class="font-medium">${t.taxCalc}</span></div>
            </div>
            <div class="flex justify-between items-center mb-8">
              <span class="text-lg font-semibold">${t.total}</span>
              <span id="cart-total" class="text-2xl font-serif font-semibold">0,00 €</span>
            </div>
            <button type="button" onclick="navigateTo('checkout')" class="w-full bg-maison-text text-white py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-maison-accent transition-colors">${t.checkout}</button>
          </div>
        </div>
      </div>
    </div>

    <div id="view-checkout" class="view-section">
      <div class="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 class="font-serif text-3xl mb-8">${t.shipping}</h2>
          <form id="checkout-form" class="space-y-6">
            <div class="grid grid-cols-2 gap-6">
              <div><label class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2 block">${es ? 'Nombre' : 'First name'}</label><input type="text" required class="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-maison-accent"></div>
              <div><label class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2 block">${es ? 'Apellidos' : 'Last name'}</label><input type="text" required class="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-maison-accent"></div>
            </div>
            <div><label class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2 block">Email</label><input type="email" required class="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-maison-accent"></div>
            <div><label class="text-[10px] font-semibold tracking-widest uppercase text-gray-500 mb-2 block">${es ? 'Dirección' : 'Address'}</label><input type="text" required class="w-full bg-transparent border-b border-gray-300 py-2 focus:outline-none focus:border-maison-accent"></div>
            <h2 class="font-serif text-3xl mb-6 mt-12">${t.payment}</h2>
            <div class="space-y-3">
              <label class="flex items-center p-4 border border-gray-200 cursor-pointer hover:border-maison-accent transition-colors rounded-sm"><input type="radio" name="payment" value="card" checked class="mr-4 accent-maison-text"><span class="flex items-center text-sm"><i data-lucide="credit-card" class="w-5 h-5 mr-3"></i> Stripe · ${es ? 'Tarjeta' : 'Card'}</span></label>
              <label class="flex items-center p-4 border border-gray-200 cursor-pointer hover:border-maison-accent transition-colors rounded-sm"><input type="radio" name="payment" value="paypal" class="mr-4 accent-maison-text"><span class="flex items-center text-sm"><i data-lucide="wallet" class="w-5 h-5 mr-3"></i> PayPal</span></label>
              <label class="flex items-center p-4 border border-gray-200 cursor-pointer hover:border-maison-accent transition-colors rounded-sm"><input type="radio" name="payment" value="bizum" class="mr-4 accent-maison-text"><span class="flex items-center text-sm"><i data-lucide="smartphone" class="w-5 h-5 mr-3"></i> Bizum</span></label>
            </div>
            <button type="submit" class="w-full bg-maison-text text-white py-4 mt-8 text-[10px] font-semibold tracking-widest uppercase hover:bg-maison-accent transition-colors flex items-center justify-center">
              <span id="pay-btn-text">${t.payNow}</span>
              <i data-lucide="loader-2" id="pay-spinner" class="w-4 h-4 ml-2 animate-spin hidden"></i>
            </button>
          </form>
        </div>
        <div class="bg-gray-50 p-8 h-fit border border-gray-100 rounded-sm">
          <h3 class="font-serif text-2xl mb-6">${t.orderSummary}</h3>
          <div id="checkout-summary-items" class="space-y-4 mb-6 max-h-60 overflow-y-auto"></div>
          <div class="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span class="text-lg font-semibold">${t.total}</span>
            <span id="checkout-total" class="text-2xl font-serif font-semibold">0,00 €</span>
          </div>
        </div>
      </div>
    </div>

    <div id="view-success" class="view-section">
      <div class="max-w-2xl mx-auto px-6 py-32 text-center">
        <div class="w-20 h-20 bg-maison-olive/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <i data-lucide="check" class="w-10 h-10 text-maison-olive"></i>
        </div>
        <h1 class="font-serif text-4xl md:text-5xl text-maison-text mb-4">${t.thanks}</h1>
        <p class="text-gray-500 mb-2">${t.orderOk}</p>
        <p class="text-sm font-medium tracking-widest uppercase text-maison-text mb-12">${es ? 'Nº de Pedido' : 'Order'}: <span id="order-number" class="text-maison-accent"></span></p>
        <button type="button" onclick="navigateTo('home')" class="bg-maison-text text-white px-10 py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-maison-accent transition-colors">${t.backStore}</button>
      </div>
    </div>
  </main>

  <footer class="bg-maison-bg border-t border-gray-200 pt-16 pb-8 px-6 mt-auto">
    <div class="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div>
        <span class="font-serif text-2xl font-semibold tracking-tight text-maison-text block mb-4">${brand}</span>
        <p class="text-sm text-gray-500 leading-relaxed">${t.footerAbout}</p>
      </div>
      <div><h4 class="text-[10px] font-semibold tracking-widest uppercase mb-4">${t.buy}</h4><ul class="space-y-2 text-sm text-gray-500"><li>${es ? 'Mujer' : 'Women'}</li><li>${es ? 'Hombre' : 'Men'}</li><li>${es ? 'Accesorios' : 'Accessories'}</li></ul></div>
      <div><h4 class="text-[10px] font-semibold tracking-widest uppercase mb-4">${t.help}</h4><ul class="space-y-2 text-sm text-gray-500"><li>${es ? 'Envíos' : 'Shipping'}</li><li>${es ? 'Devoluciones' : 'Returns'}</li><li>${es ? 'Guía de tallas' : 'Size guide'}</li></ul></div>
      <div><h4 class="text-[10px] font-semibold tracking-widest uppercase mb-4">${t.legal}</h4><ul class="space-y-2 text-sm text-gray-500"><li>${es ? 'Privacidad' : 'Privacy'}</li><li>${es ? 'Cookies' : 'Cookies'}</li></ul></div>
    </div>
    <div class="max-w-[1400px] mx-auto border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
      <p>© ${new Date().getFullYear()} ${brand}. ${es ? 'Todos los derechos reservados.' : 'All rights reserved.'} · Powered by CREAUNA</p>
    </div>
  </footer>

  <div id="toast" class="fixed bottom-8 right-8 bg-maison-text text-white px-6 py-4 text-sm font-medium shadow-2xl transform translate-y-24 opacity-0 transition-all duration-500 z-50 flex items-center rounded-sm">
    <i data-lucide="check-circle" class="w-5 h-5 mr-3 text-maison-accent"></i>
    <span id="toast-message">${t.toastAdded}</span>
  </div>

  <script>
    const products = ${productsJson};
    const CART_KEY = ${JSON.stringify(cartKey)};
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    let currentDetailProduct = null;
    let detailQty = 1;
    let selectedSize = null;

    document.addEventListener('DOMContentLoaded', () => {
      if (window.lucide) lucide.createIcons();
      renderProducts(products);
      updateCartBadge();
    });

    function formatPrice(n) { return n.toFixed(2).replace('.', ',') + ' €'; }

    function navigateTo(viewId) {
      document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
      document.getElementById('view-' + viewId).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.lucide) lucide.createIcons();
      if (viewId === 'cart') renderCart();
      if (viewId === 'checkout') renderCheckoutSummary();
    }

    function filterCategory(category) {
      renderProducts(products.filter(p => p.category === category));
      navigateTo('home');
      setTimeout(() => document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' }), 120);
    }

    function renderProducts(list) {
      const container = document.getElementById('products-container');
      if (!container) return;
      container.innerHTML = list.map(p => \`
        <div class="group cursor-pointer" onclick="openProduct(\${p.id})">
          <div class="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4 rounded-sm">
            <img src="\${p.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="\${p.name}" loading="lazy" referrerpolicy="no-referrer">
            \${p.oldPrice ? '<div class="absolute top-4 left-4 bg-maison-olive text-white px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">Sale</div>' : ''}
            <button type="button" class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur text-maison-text py-3 text-[10px] font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-maison-text hover:text-white">${t.quickView}</button>
          </div>
          <p class="text-[10px] text-gray-500 tracking-widest uppercase">\${p.category}</p>
          <h3 class="font-medium text-maison-text group-hover:text-maison-accent transition-colors mt-1">\${p.name}</h3>
          <p class="text-sm font-semibold mt-1">\${p.oldPrice ? '<span class="line-through text-gray-400 mr-2 font-normal">' + formatPrice(p.oldPrice) + '</span>' : ''}\${formatPrice(p.price)}</p>
        </div>\`).join('');
    }

    function openProduct(id) {
      currentDetailProduct = products.find(p => p.id === id);
      if (!currentDetailProduct) return;
      detailQty = 1;
      selectedSize = currentDetailProduct.sizes[0];
      document.getElementById('detail-image').src = currentDetailProduct.image;
      document.getElementById('detail-category').textContent = currentDetailProduct.category;
      document.getElementById('detail-name').textContent = currentDetailProduct.name;
      document.getElementById('detail-price').textContent = formatPrice(currentDetailProduct.price);
      document.getElementById('detail-desc').textContent = currentDetailProduct.desc;
      document.getElementById('detail-qty').textContent = detailQty;
      document.getElementById('detail-sizes').innerHTML = currentDetailProduct.sizes.map((size, idx) =>
        \`<button type="button" onclick="selectSize('\${size}', this)" class="w-12 h-12 border \${idx === 0 ? 'border-maison-text bg-maison-text text-white' : 'border-gray-300 text-gray-600 hover:border-maison-text'} text-xs font-medium transition-all flex items-center justify-center">\${size}</button>\`
      ).join('');
      navigateTo('product');
    }

    function selectSize(size, btn) {
      selectedSize = size;
      document.querySelectorAll('#detail-sizes button').forEach(b => {
        b.className = 'w-12 h-12 border border-gray-300 text-gray-600 hover:border-maison-text text-xs font-medium transition-all flex items-center justify-center';
      });
      btn.className = 'w-12 h-12 border border-maison-text bg-maison-text text-white text-xs font-medium transition-all flex items-center justify-center';
    }

    function adjustDetailQty(delta) {
      detailQty = Math.max(1, detailQty + delta);
      document.getElementById('detail-qty').textContent = detailQty;
    }

    function addToCartFromDetail() {
      if (currentDetailProduct) addToCart(currentDetailProduct.id, selectedSize, detailQty);
    }

    function addToCart(productId, size, qty) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      const existing = cart.find(item => item.id === productId && item.size === size);
      if (existing) existing.qty += qty;
      else cart.push({ id: productId, name: product.name, price: product.price, image: product.image, size, qty });
      saveCart();
      updateCartBadge();
      showToast(product.name + ' ✓');
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      saveCart();
      renderCart();
      updateCartBadge();
    }

    function updateCartQty(index, delta) {
      cart[index].qty = Math.max(1, cart[index].qty + delta);
      saveCart();
      renderCart();
    }

    function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

    function updateCartBadge() {
      const badge = document.getElementById('cart-badge');
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      badge.textContent = totalQty;
      badge.style.opacity = totalQty > 0 ? '1' : '0';
    }

    function getCartTotal() { return cart.reduce((sum, item) => sum + item.price * item.qty, 0); }

    function renderCart() {
      const container = document.getElementById('cart-items');
      const emptyMsg = document.getElementById('cart-empty-msg');
      const content = document.getElementById('cart-content');
      if (cart.length === 0) {
        emptyMsg.classList.remove('hidden');
        content.classList.add('hidden');
        return;
      }
      emptyMsg.classList.add('hidden');
      content.classList.remove('hidden');
      container.innerHTML = cart.map((item, index) => \`
        <div class="flex gap-6 py-6 border-b border-gray-100">
          <img src="\${item.image}" class="w-24 h-32 object-cover bg-gray-100 rounded-sm" alt="">
          <div class="flex-1 flex flex-col justify-between">
            <div class="flex justify-between items-start gap-4">
              <div><h3 class="font-serif text-lg text-maison-text">\${item.name}</h3><p class="text-sm text-gray-500 mt-1">${t.size}: \${item.size}</p></div>
              <button type="button" onclick="removeFromCart(\${index})" class="text-gray-400 hover:text-red-500"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div class="flex justify-between items-end">
              <div class="flex items-center border border-gray-300 rounded-sm">
                <button type="button" onclick="updateCartQty(\${index}, -1)" class="px-3 py-1">-</button>
                <span class="px-3 py-1 text-sm w-10 text-center">\${item.qty}</span>
                <button type="button" onclick="updateCartQty(\${index}, 1)" class="px-3 py-1">+</button>
              </div>
              <span class="font-medium">\${formatPrice(item.price * item.qty)}</span>
            </div>
          </div>
        </div>\`).join('');
      const total = getCartTotal();
      document.getElementById('cart-subtotal').textContent = formatPrice(total);
      document.getElementById('cart-total').textContent = formatPrice(total);
      if (window.lucide) lucide.createIcons();
    }

    function renderCheckoutSummary() {
      const container = document.getElementById('checkout-summary-items');
      container.innerHTML = cart.map(item => \`
        <div class="flex justify-between text-sm gap-4">
          <span class="text-gray-700 truncate">\${item.qty}× \${item.name}</span>
          <span class="font-medium shrink-0">\${formatPrice(item.price * item.qty)}</span>
        </div>\`).join('');
      document.getElementById('checkout-total').textContent = formatPrice(getCartTotal());
    }

    document.getElementById('checkout-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const btnText = document.getElementById('pay-btn-text');
      const spinner = document.getElementById('pay-spinner');
      btnText.textContent = ${JSON.stringify(t.processing)};
      spinner.classList.remove('hidden');
      setTimeout(() => {
        cart = [];
        saveCart();
        updateCartBadge();
        document.getElementById('order-number').textContent = 'MSN-' + Math.floor(100000 + Math.random() * 900000);
        btnText.textContent = ${JSON.stringify(t.payNow)};
        spinner.classList.add('hidden');
        this.reset();
        navigateTo('success');
      }, 2000);
    });

    function showToast(message) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-message').textContent = message;
      toast.classList.remove('translate-y-24', 'opacity-0');
      setTimeout(() => toast.classList.add('translate-y-24', 'opacity-0'), 3000);
    }
  <\/script>
</body>
</html>`;
}
