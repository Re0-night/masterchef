/**
 * High-fidelity generated culinary assets for SmartChef AI
 */

export const ASSET_IMAGES = {
  heroKitchen: '/src/assets/images/hero_smartchef_kitchen_1793583366923.jpg',
  sampleIngredients: '/src/assets/images/sample_fresh_ingredients_1793583368413.jpg',
  dishThitKho: '/src/assets/images/dish_thit_kho_tau_1793583368801.jpg',
  dishCanhChua: '/src/assets/images/dish_canh_chua_ca_1793583370313.jpg',
  dishGoiCuon: '/src/assets/images/dish_goi_cuon_springrolls_1793583370025.jpg',
};

export function getRecipeImage(imageTag?: string, title?: string, category?: string): string {
  if (imageTag === 'dish_thit_kho_tau' || title?.toLowerCase().includes('kho') || title?.toLowerCase().includes('thịt')) {
    return ASSET_IMAGES.dishThitKho;
  }
  if (imageTag === 'dish_canh_chua_ca' || title?.toLowerCase().includes('canh') || title?.toLowerCase().includes('súp')) {
    return ASSET_IMAGES.dishCanhChua;
  }
  if (imageTag === 'dish_goi_cuon_springrolls' || title?.toLowerCase().includes('cuốn') || title?.toLowerCase().includes('gỏi') || title?.toLowerCase().includes('chả')) {
    return ASSET_IMAGES.dishGoiCuon;
  }
  if (category?.toLowerCase().includes('kho')) return ASSET_IMAGES.dishThitKho;
  if (category?.toLowerCase().includes('canh')) return ASSET_IMAGES.dishCanhChua;
  if (category?.toLowerCase().includes('cuốn')) return ASSET_IMAGES.dishGoiCuon;
  
  // Default to hero kitchen or thit kho
  return ASSET_IMAGES.heroKitchen;
}
