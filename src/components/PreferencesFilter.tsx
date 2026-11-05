import React, { useState, useEffect } from 'react';
import { Sparkles, Utensils, Clock, MapPin, ChefHat, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CookingPreferences } from '../types';

interface PreferencesFilterProps {
  preferences: CookingPreferences;
  onChangePreferences: (prefs: CookingPreferences) => void;
  onGenerateRecipes: (prefs?: CookingPreferences) => void;
  isGenerating: boolean;
  ingredientCount: number;
}

const CULINARY_TIPS = [
  'Đang kết hợp nguyên liệu tươi với nước mắm cốt và tiêu sọ...',
  'Đang cân bằng tỷ lệ mặn ngọt chuẩn phong vị vùng miền bạn chọn...',
  'Đang tính toán nhiệt độ canh lửa để thịt chín mềm, màu sắc bắt mắt...',
  'Đang tối ưu thời gian nấu nướng chính xác theo yêu cầu...',
  'Đang thiết kế mâm cơm hài hòa món mặn, món canh và món xào...',
];

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
      return 'Toàn quốc (3 Miền)';
  }
}

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
    const nextPrefs: CookingPreferences = {
      ...preferences,
      [key]: value,
    };
    onChangePreferences(nextPrefs);
    // Immediately update recommendations with the selected option
    onGenerateRecipes(nextPrefs);
  };

  return (
    <div className="w-full bg-[#FAF7F2] rounded-3xl border border-[#E8DFD0] p-6 sm:p-8 shadow-xs">
      {/* Top Header & Desktop Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E8DFD0]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Tùy biến khẩu vị & thời gian
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Bạn muốn nấu mâm cơm hôm nay như thế nào?
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Chọn các tiêu chí bên dưới hoặc nhấn nút để AI sáng tạo công thức chuẩn vị ngay.
          </p>
        </div>

        {/* Generate Button (Top action) */}
        <button
          onClick={() => onGenerateRecipes(preferences)}
          disabled={isGenerating || ingredientCount === 0}
          className="px-6 py-3.5 bg-[#0C3426] hover:bg-[#134634] active:scale-98 disabled:opacity-40 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 shrink-0 cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
              <span>Đang gợi ý món ăn...</span>
            </>
          ) : (
            <>
              <ChefHat className="w-4 h-4 text-emerald-300" />
              <span>Gợi ý món ăn ({ingredientCount} nguyên liệu)</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Core Filter Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filter Row 1: Meal Type */}
        <div>
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-700" />
            Kiểu bữa ăn
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-xl border border-[#E8DFD0]">
            <button
              type="button"
              onClick={() => updateField('mealType', 'family')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.mealType === 'family'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Cơm gia đình
            </button>
            <button
              type="button"
              onClick={() => updateField('mealType', 'quick')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.mealType === 'quick'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Nhanh gọn (&lt;30p)
            </button>
            <button
              type="button"
              onClick={() => updateField('mealType', 'healthy')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.mealType === 'healthy'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Thanh đạm / Eat Clean
            </button>
            <button
              type="button"
              onClick={() => updateField('mealType', 'party')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.mealType === 'party'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
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
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.cookingTime === 'all'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => updateField('cookingTime', 'under_30')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.cookingTime === 'under_30'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Dưới 30p
            </button>
            <button
              type="button"
              onClick={() => updateField('cookingTime', 'under_45')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                preferences.cookingTime === 'under_45'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
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
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer truncate ${
                preferences.region === 'all'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Toàn quốc
            </button>
            <button
              type="button"
              onClick={() => updateField('region', 'north')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer truncate ${
                preferences.region === 'north'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Miền Bắc
            </button>
            <button
              type="button"
              onClick={() => updateField('region', 'central')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer truncate ${
                preferences.region === 'central'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Miền Trung
            </button>
            <button
              type="button"
              onClick={() => updateField('region', 'south')}
              className={`px-2 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer truncate ${
                preferences.region === 'south'
                  ? 'bg-[#0C3426] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Miền Nam
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action & Current Filter Confirmation Bar */}
      <div className="mt-6 pt-5 border-t border-[#E8DFD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-stone-600 flex-wrap">
          <span className="font-semibold text-stone-800">Tiêu chí đang chọn:</span>
          <span className="px-2.5 py-1 rounded-md bg-white border border-[#E8DFD0] text-emerald-900 font-medium">
            {getMealTypeLabel(preferences.mealType)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white border border-[#E8DFD0] text-amber-900 font-medium">
            {getCookingTimeLabel(preferences.cookingTime)}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white border border-[#E8DFD0] text-stone-800 font-medium">
            {getRegionLabel(preferences.region)}
          </span>
        </div>

        <button
          onClick={() => onGenerateRecipes(preferences)}
          disabled={isGenerating || ingredientCount === 0}
          className="px-6 py-2.5 bg-[#0C3426] hover:bg-[#134634] active:scale-98 disabled:opacity-40 text-white font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-300" />
              <span>Đang xử lý thực đơn...</span>
            </>
          ) : (
            <>
              <ChefHat className="w-3.5 h-3.5 text-emerald-300" />
              <span>Gợi ý món ăn ngay</span>
            </>
          )}
        </button>
      </div>

      {/* Culinary Thinking Ticker when generating */}
      {isGenerating && (
        <div className="mt-4 p-4 rounded-2xl bg-white border border-emerald-200/80 flex items-center gap-3 animate-pulse shadow-xs">
          <ChefHat className="w-5 h-5 text-emerald-700 animate-bounce shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-[#0C3426]">
            {CULINARY_TIPS[tipIndex]}
          </p>
        </div>
      )}
    </div>
  );
};
