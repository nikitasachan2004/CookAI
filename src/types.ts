export type Goal = 'balanced' | 'healthy' | 'weight-loss' | 'high-protein';

export type EquipmentItem = {
  id: string;
  name: string;
};

export type IngredientOption = {
  canonicalName: string;
  displayName: string;
};

export type RecipeSummary = {
  id: string;
  title: string;
  description: string;
  goalTag: Goal;
  tags: Goal[];
  difficulty: 'easy' | 'medium';
  timeMinutes: number;
  matchScore: number;
  matchTier: 'exact' | 'near' | 'low';
  missingIngredients: string[];
  substitutions: string[];
};

export type RecipeListItem = {
  id: string;
  imageUrl?: string;
  title: string;
  description: string;
  tags: Goal[];
  difficulty: 'easy' | 'medium';
  timeMinutes: number;
  ingredientCount: number;
  equipment: string[];
};

export type RecipeDetail = {
  id: string;
  title: string;
  description: string;
  ingredients: { name: string; quantity: string; optional?: boolean }[];
  equipment: string[];
  prepInstructions: string[];
  instructions: string[];
  cookingTips: string[];
  servingSuggestion: string;
  tags: Goal[];
  difficulty: 'easy' | 'medium';
  timeMinutes: number;
  youtubeSearchUrl: string;
};

export type Profile = {
  name: string;
  goal: Goal;
  equipment: string[];
};
