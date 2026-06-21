import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { equipment, ingredients } from './data.js';
import { getAllRecipes, getRecipe, matchRecipes } from './matching.js';
import type { Goal } from './types.js';

// Express API boundary for profile persistence, catalogs, matching, and recipe details.
const app = express();
const profiles = new Map<string, { name: string; goal: Goal; equipment: string[] }>();
const goalSchema = z.enum(['balanced', 'healthy', 'weight-loss', 'high-protein']);
const profileSchema = z.object({ name: z.string().trim().min(1).max(40), goal: goalSchema, equipment: z.array(z.string().trim().min(1).max(30)).max(12) });
const matchSchema = z.object({
  userId: z.string().optional(),
  ingredients: z.array(z.string().trim().min(1).max(50)).min(1, 'Add at least one ingredient to search.').max(150, 'You can only select up to 150 ingredients.'),
  equipment: z.array(z.string().trim().min(1).max(30)).max(12).optional().default([]),
  goal: goalSchema.optional(),
  maxMinutes: z.number().int().min(5).max(240).optional(),
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '32kb' }));
app.get('/api/equipment', (_request, response) => response.json({ equipment }));
app.get('/api/ingredients', (_request, response) => {
  response.json({
    ingredients: ingredients.map(({ canonicalName, displayName }) => ({ canonicalName, displayName })),
  });
});
app.post('/api/profile', (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: 'Please provide a name, goal, and valid equipment list.' });
  const userId = request.header('x-user-id') ?? 'guest';
  profiles.set(userId, parsed.data);
  return response.status(200).json({ userId, profile: parsed.data });
});
app.post('/api/ingredients/match', (request, response) => {
  const parsed = matchSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid request.' });
  const saved = parsed.data.userId ? profiles.get(parsed.data.userId) : undefined;
  const result = matchRecipes({ ingredients: parsed.data.ingredients, equipment: parsed.data.equipment.length ? parsed.data.equipment : saved?.equipment ?? [], goal: parsed.data.goal ?? saved?.goal, maxMinutes: parsed.data.maxMinutes });
  return response.json(result);
});
app.get('/api/recipes', (_request, response) => {
  return response.json({ recipes: getAllRecipes() });
});
app.get('/api/recipes/:id', (request, response) => {
  const recipe = getRecipe(request.params.id);
  if (!recipe) return response.status(404).json({ error: 'Recipe not found.' });
  return response.json({
    recipe: {
      ...recipe,
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${recipe.title} recipe`)}`,
    },
  });
});
app.use((_request, response) => response.status(404).json({ error: 'Not found.' }));

const port = Number(process.env.PORT) || 3001;

app.listen(port, '0.0.0.0', () => console.log(`Cookai API listening on port ${port}`));
