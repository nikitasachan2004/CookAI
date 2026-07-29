import type { EquipmentItem, IngredientOption, Profile, RecipeDetail, RecipeListItem, RecipeSummary } from './types';

// Thin client for the COOKAI REST API used by the MVP screens.
const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `Request failed with ${response.status}`);
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

export function getEquipment() {
  return fetchJson<{ equipment: EquipmentItem[] }>('/equipment');
}

export function getIngredients() {
  return fetchJson<{ ingredients: IngredientOption[] }>('/ingredients');
}

export function saveProfile(profile: Profile, userId?: string) {
  const headers: Record<string, string> = {};
  if (userId) headers['x-user-id'] = userId;
  return fetchJson<{ userId: string; profile: Profile }>('/profile', {
    method: 'POST',
    body: JSON.stringify(profile),
    headers,
  });
}

export function matchRecipes(params: {
  ingredients: string[];
  equipment?: string[];
  goal?: string;
  userId?: string;
  maxMinutes?: number;
  vegetarian?: boolean;
}) {
  return fetchJson<{ total: number; recipes: RecipeSummary[] }>('/ingredients/match', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export function getRecipe(id: string) {
  return fetchJson<{ recipe: RecipeDetail }>(`/recipes/${id}`);
}

export function getAllRecipes() {
  return fetchJson<{ recipes: RecipeListItem[] }>('/recipes');
}

export function checkAuth() {
  return fetchJson<{ userId: string; email: string }>('/auth/me');
}

export function signup(email: string) {
  return fetchJson('/auth/signup', { method: 'POST', body: JSON.stringify({ email }) });
}

export function resendOtp(email: string) {
  return fetchJson('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) });
}

export function verifyOtp(email: string, code: string) {
  return fetchJson<{ setupToken: string }>('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code }) });
}

export function setPassword(email: string, setupToken: string, password: string) {
  return fetchJson<{ userId: string; email: string }>('/auth/set-password', { method: 'POST', body: JSON.stringify({ email, setupToken, password }) });
}

export function login(email: string, password: string) {
  return fetchJson<{ userId: string; email: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function logout() {
  return fetchJson('/auth/logout', { method: 'POST' });
}
