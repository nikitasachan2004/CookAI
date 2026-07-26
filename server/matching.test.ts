import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { getRecipe, matchRecipes, normalizeIngredient, initializeMatching } from './matching.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RecipeModel } from './models/Recipe.js';
import { recipes } from './data.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  for (const recipe of recipes) {
    const { id, ...rest } = recipe;
    await RecipeModel.updateOne(
      { _id: id },
      { $set: rest },
      { upsert: true }
    );
  }

  await initializeMatching();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('ingredient normalization', () => {
  it('maps aliases to canonical ingredient names', () => {
    expect(normalizeIngredient(' Eggs ')).toBe('egg');
    expect(normalizeIngredient('garbanzo beans')).toBe('chickpeas');
    expect(normalizeIngredient('soya sauce')).toBe('soy sauce');
  });

  it('returns null for unknown ingredients', () => {
    expect(normalizeIngredient('dragonfruit')).toBeNull();
  });
});

describe('recipe matching', () => {
  it('excludes recipes that require unavailable equipment', () => {
    const { recipes: results } = matchRecipes({
      ingredients: ['egg', 'rice', 'soy sauce', 'onion'],
      equipment: ['microwave'],
      goal: 'balanced',
    });

    expect(results.some((recipe) => recipe.id === 'microwave-egg-rice')).toBe(true);
    expect(results.some((recipe) => recipe.id === 'egg-fried-rice')).toBe(false);
  });

  it('returns near matches with missing required ingredients', () => {
    const { recipes: results } = matchRecipes({
      ingredients: ['egg', 'rice'],
      equipment: ['pan', 'stove'],
      goal: 'balanced',
    });

    const friedRice = results.find((recipe) => recipe.id === 'egg-fried-rice');
    expect(friedRice).toBeDefined();
    expect(friedRice?.missingIngredients).toContain('onion');
    expect(friedRice?.missingIngredients).toContain('soy sauce');
  });

  it('uses the selected goal as a ranking signal', () => {
    const { recipes: results } = matchRecipes({
      ingredients: ['chicken', 'lettuce', 'carrot', 'soy sauce'],
      equipment: ['pan', 'stove'],
      goal: 'weight-loss',
    });

    expect(results[0]?.id).toBe('chicken-lettuce-wraps');
  });
});

describe('recipe details', () => {
  it('returns beginner-friendly expanded cooking instructions', () => {
    const recipe = getRecipe('egg-fried-rice');

    expect(recipe?.instructions.length).toBeGreaterThanOrEqual(5);
    expect(recipe?.prepInstructions.length).toBeGreaterThanOrEqual(3);
    expect(recipe?.cookingTips.length).toBeGreaterThanOrEqual(3);
    expect(recipe?.instructions[0]).toContain('cold cooked rice');
    expect(recipe?.instructions.join(' ').length).toBeGreaterThan(500);
  });

  it('does not return the short placeholder method for tomato egg drop soup', () => {
    const recipe = getRecipe('tomato-egg-drop-soup');

    expect(recipe?.instructions.length).toBeGreaterThanOrEqual(5);
    expect(recipe?.instructions[0]).toContain('Chop tomatoes small');
    expect(recipe?.prepInstructions.join(' ')).toContain('tomato');
    expect(recipe?.servingSuggestion).toContain('Serve warm');
  });
});
