export type Goal = 'balanced' | 'healthy' | 'weight-loss' | 'high-protein';

export type Ingredient = {
  canonicalName: string;
  displayName: string;
  aliases: string[];
};

export type Equipment = {
  id: string;
  name: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: { name: string; quantity: string; optional?: boolean }[];
  equipment: string[];
  instructions: string[];
  tags: Goal[];
  difficulty: 'easy' | 'medium';
  timeMinutes: number;
};

export type RecipeDetail = Recipe & {
  prepInstructions: string[];
  cookingTips: string[];
  servingSuggestion: string;
};
