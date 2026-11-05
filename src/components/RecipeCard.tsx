import React, { useState } from 'react';
import { Clock, ArrowRight, CheckCircle2, Utensils, Sparkles } from 'lucide-react';
import { Recipe } from '../types';
import { getRecipeImage, handleImageFallback } from '../constants/images';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageUrl = getRecipeImage(recipe.imageTag, recipe.title, recipe.category);

  // Derive culinary origin badge for visual authenticity
  const titleLower = (recipe.title || '').toLowerCase();
  const descLower = (recipe.shortDescription || '').toLowerCase();
  const regionBadge =
    titleLower.includes('bắc') || descLower.includes('bắc') || titleLower.includes('phố cổ') || titleLower.includes('hà nội')
      ? 'Vị Bắc Bộ'
      : titleLower.includes('huế') || descLower.includes('huế') || titleLower.includes('miền trung')
        ? 'Xứ Huế'
        : titleLower.includes('nam bộ') || descLower.includes('nam bộ') || titleLower.includes('miền tây') || titleLower.includes('sài gòn')
          ? 'Nam Bộ'
          : 'Cơm Gia Đình';

  return (
    <article
      onClick={() => onSelect(recipe)}
      className="group bg-white rounded-3xl border border-[#E8DFD0] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Recipe Photo with Measured Contrast Scrim & Loading State */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FAF7F2]">
        {/* Shimmer skeleton while image loads */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-[#F5EFE6] to-stone-100 animate-pulse flex flex-col items-center justify-center text-stone-400 gap-2">
            <Utensils className="w-7 h-7 text-[#0C3426]/30 animate-bounce" />
            <span className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">
              SmartChef AI
            </span>
          </div>
        )}

        <img
          src={imageUrl}
          alt={recipe.title}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover group-hover:scale-108 transition-all duration-700 ease-out ${
            isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onError={(e) => {
            setIsImageLoaded(true);
            handleImageFallback(e, 'dish');
          }}
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-[#0C3426] shadow-sm border border-white/40">
            {recipe.category || 'Món ngon'}
          </div>

          <div className="bg-[#0C3426]/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-medium text-emerald-200 shadow-sm border border-emerald-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            {regionBadge}
          </div>
        </div>

        {/* Gradient Scrim & Bottom Ingredients Info */}
        <div className="absolute inset-x-0 bottom-0 pt-8 pb-3 px-3 bg-gradient-to-t from-stone-950/85 via-stone-900/40 to-transparent">
          {recipe.availableIngredientsUsed?.length > 0 ? (
            <div className="flex items-center justify-between text-white text-xs">
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium drop-shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Tận dụng {recipe.availableIngredientsUsed.length} nguyên liệu sẵn có
              </span>
              <span className="text-stone-200 text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm">
                {recipe.difficulty}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-white text-xs">
              <span className="text-emerald-300 font-medium">Đầu bếp khuyên dùng</span>
              <span className="text-stone-200 text-[11px]">{recipe.difficulty}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata unboxed text with bullet separators (anti-slop rule) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
            <span className="flex items-center gap-1 text-[#0C3426] font-semibold">
              <Clock className="w-3 h-3 text-emerald-700" />
              {recipe.cookingTimeMinutes} phút
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{recipe.difficulty}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{recipe.servings}</span>
          </div>

          <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors mb-2 leading-snug">
            {recipe.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {recipe.shortDescription}
          </p>

          {/* Flavor Profile Highlight */}
          {recipe.flavorProfile && (
            <p className="text-xs text-emerald-800 font-medium mb-4 italic line-clamp-1">
              « {recipe.flavorProfile} »
            </p>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="pt-4 border-t border-[#E8DFD0] flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500">
            {recipe.steps?.length || 3} bước nấu chi tiết
          </span>
          <span className="text-xs font-bold text-emerald-800 group-hover:text-emerald-950 flex items-center gap-1 transition-colors">
            Xem công thức & Nấu
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </article>
  );
};
