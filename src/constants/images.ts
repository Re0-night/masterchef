/**
 * High-fidelity generated culinary assets and resilient fallback systems for SmartChef AI
 */

export const FALLBACK_DISH_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#134634"/>
      <stop offset="100%" stop-color="#0C3426"/>
    </linearGradient>
    <radialGradient id="bowl" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#E5DCB8"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <ellipse cx="400" cy="340" rx="190" ry="120" fill="#072218" opacity="0.5"/>
  <ellipse cx="400" cy="310" rx="170" ry="110" fill="url(#bowl)"/>
  <ellipse cx="400" cy="305" rx="145" ry="90" fill="#D97706" opacity="0.85"/>
  <ellipse cx="400" cy="305" rx="120" ry="70" fill="#92400E" opacity="0.75"/>
  <!-- Scallions & chili garnish -->
  <circle cx="360" cy="290" r="14" fill="#059669"/>
  <circle cx="430" cy="320" r="12" fill="#10B981"/>
  <circle cx="435" cy="280" r="10" fill="#DC2626"/>
  <circle cx="380" cy="325" r="11" fill="#EF4444"/>
  <!-- Steam lines -->
  <path d="M 370 200 Q 355 160 375 120" stroke="#FAF7F2" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
  <path d="M 400 190 Q 420 150 400 110" stroke="#FAF7F2" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
  <path d="M 430 205 Q 445 165 425 125" stroke="#FAF7F2" stroke-width="4" fill="none" opacity="0.6" stroke-linecap="round"/>
  <text x="400" y="490" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#FAF7F2" text-anchor="middle">Món Ngon Chuẩn Vị Việt</text>
  <text x="400" y="525" font-family="system-ui, sans-serif" font-size="14" font-weight="500" fill="#6EE7B7" text-anchor="middle" letter-spacing="2">SMARTCHEF AI · BẾP GIA ĐÌNH</text>
</svg>
`)}`;

export const FALLBACK_INGREDIENTS_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="800" height="600" fill="#F8F4EC"/>
  <rect x="140" y="90" width="520" height="420" rx="32" fill="#D9C9A8" stroke="#B8A47E" stroke-width="6"/>
  <!-- Cutting board handle -->
  <rect x="70" y="260" width="90" height="80" rx="20" fill="#D9C9A8" stroke="#B8A47E" stroke-width="6"/>
  <rect x="90" y="280" width="40" height="40" rx="12" fill="#F8F4EC"/>
  <!-- Ingredients on board -->
  <ellipse cx="440" cy="240" rx="90" ry="60" fill="#FCA5A5" stroke="#E11D48" stroke-width="3"/>
  <circle cx="280" cy="220" r="32" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>
  <circle cx="340" cy="200" r="30" fill="#FEF3C7" stroke="#D97706" stroke-width="3"/>
  <!-- Green herbs -->
  <path d="M 230 380 C 280 340, 380 360, 480 330" stroke="#059669" stroke-width="12" stroke-linecap="round"/>
  <path d="M 240 410 C 300 370, 420 380, 520 350" stroke="#10B981" stroke-width="10" stroke-linecap="round"/>
  <!-- Chilies -->
  <path d="M 460 380 Q 520 400 560 360" stroke="#DC2626" stroke-width="10" stroke-linecap="round" fill="none"/>
  <text x="400" y="475" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="#0C3426" text-anchor="middle">Nguyên Liệu Tươi Sạch</text>
  <text x="400" y="500" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#15803D" text-anchor="middle">SẴN SÀNG CHO MÂM CƠM VIỆT</text>
</svg>
`)}`;

// Canonical public paths that resolve in both dev and production dist
export const ASSET_IMAGES = {
  heroKitchen: '/images/hero_kitchen.jpg',
  sampleIngredients: '/images/sample_ingredients.jpg',
  dishThitKho: '/images/dish_thit_kho.jpg',
  dishCanhChua: '/images/dish_canh_chua.jpg',
  dishGoiCuon: '/images/dish_goi_cuon.jpg',
};

export function getRecipeImage(imageTag?: string, title?: string, category?: string): string {
  const t = title?.toLowerCase() || '';
  const c = category?.toLowerCase() || '';

  if (imageTag === 'dish_thit_kho_tau' || t.includes('kho') || t.includes('thịt') || c.includes('kho')) {
    return ASSET_IMAGES.dishThitKho;
  }
  if (imageTag === 'dish_canh_chua_ca' || t.includes('canh') || t.includes('súp') || c.includes('canh')) {
    return ASSET_IMAGES.dishCanhChua;
  }
  if (
    imageTag === 'dish_goi_cuon_springrolls' ||
    t.includes('cuốn') ||
    t.includes('gỏi') ||
    t.includes('chả') ||
    c.includes('cuốn')
  ) {
    return ASSET_IMAGES.dishGoiCuon;
  }

  // Default to savory dish or hero
  return ASSET_IMAGES.dishThitKho;
}

/**
 * Resilient image error fallback handler with zero broken frames
 */
export function handleImageFallback(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: 'dish' | 'ingredients' | 'kitchen' = 'dish'
) {
  const target = event.currentTarget;
  // Prevent infinite loop if fallback fails
  target.onerror = () => {
    target.onerror = null;
    target.src = fallbackType === 'ingredients' ? FALLBACK_INGREDIENTS_SVG : FALLBACK_DISH_SVG;
  };

  if (fallbackType === 'ingredients') {
    target.src = ASSET_IMAGES.sampleIngredients;
  } else if (fallbackType === 'kitchen') {
    target.src = ASSET_IMAGES.heroKitchen;
  } else {
    target.src = ASSET_IMAGES.dishThitKho;
  }
}
