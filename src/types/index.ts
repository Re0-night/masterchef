export type IngredientCategory =
  | 'meat'
  | 'seafood'
  | 'vegetable'
  | 'herb'
  | 'spice'
  | 'condiment'
  | 'staple'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  categoryName: string;
  estimatedQuantity?: string;
  freshness?: string;
  vietnameseCookingNotes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
  timerMinutes?: number;
}

export interface RecipeIngredientItem {
  item: string;
  amount: string;
  note?: string;
}

export interface Recipe {
  id: string;
  title: string;
  vietnameseName?: string;
  category: string;
  imageTag?: string;
  shortDescription: string;
  cookingTimeMinutes: number;
  prepTimeMinutes: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Kỳ công';
  servings: string;
  estimatedCalories?: string;
  flavorProfile?: string;
  availableIngredientsUsed: string[];
  pantrySeasonings: string[];
  missingIngredients?: string[];
  ingredientsList: RecipeIngredientItem[];
  steps: RecipeStep[];
  chefSecret: string;
  servingSuggestion: string;
}

export interface CookingPreferences {
  mealType: 'family' | 'quick' | 'healthy' | 'party';
  cookingTime: 'all' | 'under_30' | 'under_45';
  region: 'all' | 'north' | 'central' | 'south';
  difficulty: 'all' | 'easy' | 'medium';
}
