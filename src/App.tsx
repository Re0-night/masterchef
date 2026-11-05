import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ImageUploadArea } from './components/ImageUploadArea';
import { IngredientsManager } from './components/IngredientsManager';
import { PreferencesFilter } from './components/PreferencesFilter';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CookingTipsSection } from './components/CookingTipsSection';
import { Footer } from './components/Footer';
import { INITIAL_INGREDIENTS, INITIAL_RECIPES } from './data/initialData';
import { Ingredient, Recipe, CookingPreferences, IngredientCategory, IngredientAdvisory } from './types';
import { Sparkles, ChefHat, AlertCircle, RefreshCw, Clock, MapPin, Utensils } from 'lucide-react';

function getMealTypeLabel(mealType: string) {
  switch (mealType) {
    case 'quick':
      return 'Nhanh gọn (<30p)';
    case 'healthy':
      return 'Thanh đạm / Eat Clean';
    case 'party':
      return 'Món nhậu / Cuối tuần';
    default:
      return 'Cơm gia đình';
  }
}

function getCookingTimeLabel(cookingTime: string) {
  switch (cookingTime) {
    case 'under_30':
      return 'Dưới 30 phút';
    case 'under_45':
      return 'Dưới 45 phút';
    default:
      return 'Thời gian linh hoạt';
  }
}

function getRegionLabel(region: string) {
  switch (region) {
    case 'north':
      return 'Miền Bắc';
    case 'central':
      return 'Miền Trung';
    case 'south':
      return 'Miền Nam';
    default:
      return '3 Miền';
  }
}

export default function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [analysisSummary, setAnalysisSummary] = useState<string>(
    'AI đã nhận diện được 6 nhóm nguyên liệu tươi: thịt ba rọi, trứng gà, hành lá, ớt hiểm, củ hành tỏi và gừng chanh.'
  );
  const [cookingOverview, setCookingOverview] = useState<string>(
    'Nguyên liệu rất tươi ngon, thích hợp nấu món kho đậm đà, món canh thanh nhiệt hoặc món cuốn tươi.'
  );
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [ingredientAdvisory, setIngredientAdvisory] = useState<IngredientAdvisory | null>(null);

  // Loading States
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preferences
  const [preferences, setPreferences] = useState<CookingPreferences>({
    mealType: 'family',
    cookingTime: 'all',
    region: 'all',
    difficulty: 'all',
  });

  // Section Refs
  const scanSectionRef = useRef<HTMLDivElement | null>(null);
  const ingredientsSectionRef = useRef<HTMLDivElement | null>(null);
  const recipesSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * 1. Vision AI: Upload or Camera captured image handler
   */
  const handleImageSelected = async (base64Image: string) => {
    setIsAnalyzingImage(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/identify-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: base64Image.includes('png') ? 'image/png' : 'image/jpeg',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi khi phân tích hình ảnh');
      }

      const data = await response.json();

      if (data.ingredients && Array.isArray(data.ingredients) && data.ingredients.length > 0) {
        // Assign random IDs if missing
        const formatted: Ingredient[] = data.ingredients.map((ing: any, idx: number) => ({
          id: ing.id || `ing-scan-${Date.now()}-${idx}`,
          name: ing.name,
          category: (ing.category as IngredientCategory) || 'other',
          categoryName: ing.categoryName || 'Thực phẩm',
          estimatedQuantity: ing.estimatedQuantity || '',
          freshness: ing.freshness || 'Tươi mới',
          vietnameseCookingNotes: ing.vietnameseCookingNotes || '',
        }));

        setIngredients(formatted);
        setAnalysisSummary(data.summary || 'Đã nhận diện thành công các nguyên liệu trong ảnh.');
        setCookingOverview(data.cookingSuggestionsOverview || '');

        // Smooth scroll to ingredients section
        setTimeout(() => {
          scrollToSection('ingredients-section');
        }, 300);
      } else {
        setErrorMessage('Không tìm thấy nguyên liệu rõ ràng trong bức ảnh. Bạn có thể chụp lại gần hơn hoặc tự nhập thêm bên dưới nhé!');
      }
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setErrorMessage(
        err.message || 'Không thể kết nối đến máy chủ AI. Bạn hãy thử lại ảnh khác hoặc thêm nguyên liệu thủ công.'
      );
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Request race-condition guard
  const activeRequestIdRef = useRef<number>(0);

  /**
   * 2. Recipe AI: Generate 3 Tailored Vietnamese Recipes
   */
  const handleGenerateRecipes = async (targetPrefs?: CookingPreferences, shouldScroll = false) => {
    if (ingredients.length === 0) {
      setErrorMessage('Vui lòng thêm ít nhất 1 nguyên liệu trước khi tạo công thức.');
      return;
    }

    const activePrefs = targetPrefs || preferences;
    const currentReqId = ++activeRequestIdRef.current;

    setIsGeneratingRecipes(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.map((i) => i.name),
          preferences: activePrefs,
          previousRecipeTitles: recipes.map((r) => r.title),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Lỗi khi tạo công thức');
      }

      const data = await response.json();

      // Guard: discard if user made a newer filter selection
      if (currentReqId !== activeRequestIdRef.current) {
        return;
      }

      if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        setRecipes(data.recipes);
        if (data.ingredientAdvisory) {
          setIngredientAdvisory(data.ingredientAdvisory);
        } else {
          setIngredientAdvisory(null);
        }
        if (shouldScroll) {
          setTimeout(() => {
            scrollToSection('recipes-section');
          }, 250);
        }
      } else {
        throw new Error('Chưa tạo được công thức phù hợp, vui lòng thử lại.');
      }
    } catch (err: any) {
      if (currentReqId === activeRequestIdRef.current) {
        console.error('Recipe generation error:', err);
        setErrorMessage(err.message || 'Hệ thống gợi ý món ăn đang bận. Bạn hãy thử lại sau ít giây nhé!');
      }
    } finally {
      if (currentReqId === activeRequestIdRef.current) {
        setIsGeneratingRecipes(false);
      }
    }
  };

  /**
   * Auto-refresh recipes when user changes any filter
   */
  const handlePreferencesChange = (newPrefs: CookingPreferences) => {
    setPreferences(newPrefs);
  };

  // Ingredient list manipulations
  const handleAddIngredient = (name: string, category: IngredientCategory, quantity?: string) => {
    const newItem: Ingredient = {
      id: `ing-manual-${Date.now()}`,
      name,
      category,
      categoryName: category === 'condiment' ? 'Gia vị' : category === 'herb' ? 'Rau thơm' : 'Nguyên liệu',
      estimatedQuantity: quantity,
      freshness: 'Sẵn sàng nấu',
    };
    setIngredients((prev) => [...prev, newItem]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateIngredient = (id: string, name: string, quantity?: string) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name, estimatedQuantity: quantity } : item))
    );
  };

  const handleClearAllIngredients = () => {
    setIngredients([]);
    setAnalysisSummary('');
    setCookingOverview('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800 font-sans selection:bg-emerald-800 selection:text-white">
      {/* 3-Zone Strict Top Bar */}
      <Navbar
        onStartScanning={() => scrollToSection('scan-section')}
        onNavigateSection={scrollToSection}
        hasRecipes={recipes.length > 0}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onStartScanning={() => scrollToSection('scan-section')}
          onExploreRecipes={() => scrollToSection('recipes-section')}
        />

        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <p>{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-900 underline ml-4 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Image Upload & Vision Analysis */}
        <section id="scan-section" ref={scanSectionRef} className="py-10 border-t border-[#E8DFD0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Bước 1: Chụp hoặc Tải ảnh thực phẩm
              </span>
            </div>

            <ImageUploadArea
              onImageSelected={handleImageSelected}
              isAnalyzing={isAnalyzingImage}
            />
          </div>
        </section>

        {/* Step 2: Ingredients Review & Edit */}
        <section id="ingredients-section" ref={ingredientsSectionRef} className="py-10 border-t border-[#E8DFD0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Bước 2: Kiểm tra & Chỉnh sửa danh sách nguyên liệu
              </span>
            </div>

            <IngredientsManager
              ingredients={ingredients}
              analysisSummary={analysisSummary}
              cookingOverview={cookingOverview}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onUpdateIngredient={handleUpdateIngredient}
              onClearAll={handleClearAllIngredients}
            />

            {/* Meal Preferences & Generation Filter */}
            <PreferencesFilter
              preferences={preferences}
              onChangePreferences={handlePreferencesChange}
              onGenerateRecipes={(prefs) => handleGenerateRecipes(prefs, true)}
              isGenerating={isGeneratingRecipes}
              ingredientCount={ingredients.length}
            />
          </div>
        </section>

        {/* Step 3: Recipes Showcase */}
        <section id="recipes-section" ref={recipesSectionRef} className="py-12 border-t border-[#E8DFD0] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8DFD0]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Bước 3: Mâm cơm gợi ý cho bạn
                  </span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-stone-900">
                  {recipes.length > 0
                    ? `SmartChef AI gợi ý ${recipes.length} món ăn phù hợp`
                    : 'Gợi ý món ăn từ nguyên liệu'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Chọn món bạn muốn nấu để xem hướng dẫn chi tiết, định lượng gia vị và bấm giờ nấu trực tiếp.
                </p>

                {/* Active Filter Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs">
                    <Utensils className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{getMealTypeLabel(preferences.mealType)}</span>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 font-semibold text-xs flex items-center gap-1.5 shadow-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{getCookingTimeLabel(preferences.cookingTime)}</span>
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-stone-600" />
                    <span>{getRegionLabel(preferences.region)}</span>
                  </span>
                </div>
              </div>

              {recipes.length > 0 && (
                <button
                  onClick={() => handleGenerateRecipes(preferences, false)}
                  disabled={isGeneratingRecipes}
                  className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE8DA] text-stone-700 font-semibold text-xs rounded-xl border border-[#D9CFC1] transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingRecipes ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingRecipes ? 'Đang cập nhật...' : 'Đổi món khác'}</span>
                </button>
              )}
            </div>

            {/* Advisory Banner if ingredients are limited (Requirement 8) */}
            {ingredientAdvisory && ingredientAdvisory.isInsufficient && (
              <div className="mb-8 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-amber-950">
                      Gợi ý bổ sung nguyên liệu từ Bếp Trưởng SmartChef AI
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                      {ingredientAdvisory.message}
                    </p>
                    {ingredientAdvisory.suggestedAdditions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                          Đề xuất thêm:
                        </span>
                        {ingredientAdvisory.suggestedAdditions.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold shadow-2xs"
                          >
                            + {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator Banner while Generating */}
            {isGeneratingRecipes && (
              <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#0C3426] flex items-center justify-between shadow-xs animate-pulse">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-emerald-700 animate-spin shrink-0" />
                  <p className="text-xs sm:text-sm font-semibold">
                    Đang đồng bộ thực đơn: <span className="text-emerald-800 font-bold">{getMealTypeLabel(preferences.mealType)}</span> · <span className="text-emerald-800 font-bold">{getCookingTimeLabel(preferences.cookingTime)}</span> · <span className="text-emerald-800 font-bold">{getRegionLabel(preferences.region)}</span>
                  </p>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold hidden sm:inline">SmartChef AI Active</span>
              </div>
            )}

            {/* Loading Skeleton Cards when Generating */}
            {isGeneratingRecipes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl border border-[#E8DFD0] overflow-hidden p-6 animate-pulse shadow-xs"
                  >
                    <div className="aspect-4/3 w-full bg-stone-100 rounded-2xl mb-5 flex items-center justify-center">
                      <ChefHat className="w-8 h-8 text-stone-400 animate-bounce" />
                    </div>
                    <div className="h-4 bg-stone-200 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-stone-200 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-stone-200 rounded w-full mb-2" />
                    <div className="h-4 bg-stone-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : recipes.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-[#E8DFD0] rounded-3xl p-8">
                <ChefHat className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
                  Chưa có công thức nào được tạo
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6">
                  Hãy nhấn nút "Gợi ý món ăn" ở trên để SmartChef AI sáng tạo các công thức chuẩn vị từ nguyên liệu của bạn.
                </p>
                <button
                  onClick={() => handleGenerateRecipes(preferences, true)}
                  disabled={isGeneratingRecipes || ingredients.length === 0}
                  className="px-6 py-3 bg-[#0C3426] hover:bg-[#134634] text-white font-semibold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Sáng tạo món ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSelect={(rec) => setSelectedRecipe(rec)}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

        {/* Cooking Tips Section */}
        <CookingTipsSection />
      </main>

      {/* Recipe Detail Full View / Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
