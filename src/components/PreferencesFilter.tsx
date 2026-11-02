import React, { useState, useEffect } from 'react';
import { Sparkles, Utensils, Clock, MapPin, ChefHat, RefreshCw } from 'lucide-react';
import { CookingPreferences } from '../types';

interface PreferencesFilterProps {
  preferences: CookingPreferences;
  onChangePreferences: (prefs: CookingPreferences) => void;
  onGenerateRecipes: () => void;
  isGenerating: boolean;
  ingredientCount: number;
}

const CULINARY_TIPS = [
  'Đang kết hợp nguyên liệu tươi với nước mắm và tiêu đen...',
  'Đang cân bằng tỷ lệ mặn ngọt chuẩn vị mâm cơm Việt...',
  'Đang tính toán nhiệt độ canh lửa để thịt chín mềm, bóng bẩy...',
  'Đang tối ưu thời gian nấu nướng dưới 35 phút cho bạn...',
  'Đang thiết kế thực đơn hài hòa món mặn, món canh và món xào...',
];

export const PreferencesFilter: React.FC<PreferencesFilterProps> = ({
  preferences,
  onChangePreferences,
  onGenerateRecipes,
  isGenerating,
  ingredientCount,
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CULINARY_TIPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const updateField = <K extends keyof CookingPreferences>(key: K, value: CookingPreferences[K]) => {
    onChangePreferences({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <div className="w-full bg-[#FAF7F2] rounded-3xl border border-[#E8DFD0] p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8DFD0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Tùy biến khẩu vị
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
            Bạn muốn nấu mâm cơm hôm nay như thế nào?
          </h3>
        </div>

        {/* Generate Button (Desktop top action) */}
        <button
          onClick={onGenerateRecipes}
          disabled={isGenerating || ingredientCount === 0}
          className="px-6 py-3.5 bg-[#0C3426] hover:bg-[#134634] disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
              <span>Đang gợi ý món ngon...</span>
            </>
          ) : (
            <>
              <ChefHat className="w-4 h-4 text-emerald-300" />
              <span>Gợi ý 3–5 món ngon ngay ({ingredientCount} nguyên liệu)</span>
            </>
          )}
        </button>
      </div>

      {/* Filter Row 1: Meal Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-700" />
            Kiểu bữa ăn
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-[#E8DFD0]">
            <button
              type="button"
              onClick={() => updateField('mealType', 'family')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.mealType === 'family'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Cơm gia đình
            </button>
            <button
              type="button"
              onClick={() => updateField('mealType', 'quick')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.mealType === 'quick'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Nhanh gọn (&lt;30p)
            </button>
            <button
              type="button"
              onClick={() => updateField('mealType', 'healthy')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.mealType === 'healthy'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Thanh đạm / Eat Clean
            </button>
            <button
              type="button"
              onClick={() => updateField('mealType', 'party')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.mealType === 'party'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Món nhậu / Cuối tuần
            </button>
          </div>
        </div>

        {/* Filter Row 2: Cooking Time */}
        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Clock className="w-3.5 h-3.5 text-emerald-700" />
            Thời gian nấu
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-xl border border-[#E8DFD0]">
            <button
              type="button"
              onClick={() => updateField('cookingTime', 'all')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.cookingTime === 'all'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => updateField('cookingTime', 'under_30')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.cookingTime === 'under_30'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Dưới 30p
            </button>
            <button
              type="button"
              onClick={() => updateField('cookingTime', 'under_45')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                preferences.cookingTime === 'under_45'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Dưới 45p
            </button>
          </div>
        </div>

        {/* Filter Row 3: Regional Taste */}
        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            Phong vị vùng miền
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-white rounded-xl border border-[#E8DFD0]">
            <button
              type="button"
              onClick={() => updateField('region', 'all')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer truncate ${
                preferences.region === 'all'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Toàn quốc
            </button>
            <button
              type="button"
              onClick={() => updateField('region', 'north')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer truncate ${
                preferences.region === 'north'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Bắc
            </button>
            <button
              type="button"
              onClick={() => updateField('region', 'central')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer truncate ${
                preferences.region === 'central'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Trung
            </button>
            <button
              type="button"
              onClick={() => updateField('region', 'south')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer truncate ${
                preferences.region === 'south'
                  ? 'bg-[#0C3426] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Nam
            </button>
          </div>
        </div>
      </div>

      {/* Culinary Thinking Ticker when generating */}
      {isGenerating && (
        <div className="mt-6 p-4 rounded-2xl bg-white border border-emerald-200/80 flex items-center gap-3 animate-pulse">
          <ChefHat className="w-5 h-5 text-emerald-700 animate-bounce" />
          <p className="text-xs sm:text-sm font-medium text-[#0C3426]">
            {CULINARY_TIPS[tipIndex]}
          </p>
        </div>
      )}
    </div>
  );
};
