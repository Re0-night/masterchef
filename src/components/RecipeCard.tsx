import React from 'react';
import { Clock, ChefHat, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Recipe } from '../types';
import { getRecipeImage } from '../constants/images';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  const imageUrl = getRecipeImage(recipe.imageTag, recipe.title, recipe.category);

  return (
    <article
      onClick={() => onSelect(recipe)}
      className="group bg-white rounded-3xl border border-[#E8DFD0] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Recipe Photo with Measured Contrast Scrim */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Safe fallback
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Subtle Category Marker */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-[#0C3426] shadow-sm">
          {recipe.category || 'Món ngon'}
        </div>

        {/* Available Ingredients Ratio text */}
        {recipe.availableIngredientsUsed?.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Tận dụng {recipe.availableIngredientsUsed.length} nguyên liệu sẵn có
            </span>
            <span className="text-stone-300 text-[11px]">
              {recipe.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata unboxed text with bullet separators (anti-slop rule) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
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
            <p className="text-xs text-emerald-800 font-medium mb-4 italic">
              « {recipe.flavorProfile} »
            </p>
          )}
        </div>

        {/* Card Action Footer */}
        <div className="pt-4 border-t border-[#E8DFD0] flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-500">
            {recipe.steps?.length || 4} bước nấu
          </span>
          <span className="text-xs font-bold text-emerald-800 group-hover:text-emerald-950 flex items-center gap-1 transition-colors">
            Xem công thức & Nấu
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};
