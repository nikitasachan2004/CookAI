import { useEffect, useMemo, useState } from 'react';
import { getIngredients } from '../api';
import type { IngredientOption, Profile } from '../types';

type Props = {
  profile: Profile;
  onSearch: (ingredients: string[]) => void;
};

const CATEGORIES: { label: string; icon: string; items: string[] }[] = [
  {
    label: 'Proteins',
    icon: '🥩',
    items: ['egg', 'chicken', 'beef', 'pork', 'tuna', 'salmon', 'shrimp', 'tofu', 'paneer', 'beans', 'chickpeas', 'lentils'],
  },
  {
    label: 'Grains & carbs',
    icon: '🌾',
    items: ['rice', 'pasta', 'bread', 'oats', 'flour', 'tortilla', 'potato', 'sweet potato'],
  },
  {
    label: 'Vegetables',
    icon: '🥦',
    items: [
      'onion', 'tomato', 'spinach', 'bell pepper', 'broccoli', 'mushroom',
      'carrot', 'cabbage', 'peas', 'corn', 'lettuce', 'cucumber', 'avocado',
      'zucchini', 'eggplant'
    ],
  },
  {
    label: 'Dairy',
    icon: '🧀',
    items: ['cheese', 'mozzarella', 'yogurt', 'milk', 'soy milk', 'butter', 'cream'],
  },
  {
    label: 'Fruits & pantry',
    icon: '🍋',
    items: ['banana', 'apple', 'lemon', 'coconut milk', 'peanut butter', 'honey', 'soy sauce'],
  },
  {
    label: 'Spices & herbs',
    icon: '🌶️',
    items: ['garlic', 'ginger', 'basil', 'cumin', 'coriander', 'turmeric', 'garam masala', 'mustard seeds', 'chili powder'],
  },
];

const GOAL_LABELS: Record<string, string> = {
  balanced:       'Balanced',
  healthy:        'Healthy',
  'weight-loss':  'Weight loss',
  'high-protein': 'High protein',
};

export default function IngredientInput({ profile, onSearch }: Props) {
  const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
  const [selected,          setSelected]          = useState<string[]>([]);
  const [draft,             setDraft]             = useState('');
  const [error,             setError]             = useState<string | null>(null);

  useEffect(() => {
    getIngredients()
      .then((data) => setIngredientOptions(data.ingredients))
      .catch(() => { /* silently fall back to hardcoded category lists */ });
  }, []);

  const displayNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of ingredientOptions) {
      map.set(item.canonicalName, item.displayName);
    }
    return map;
  }, [ingredientOptions]);

  const addIngredient = (value: string) => {
    const cleaned = value.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cleaned) return;
    setSelected((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
    setDraft('');
    setError(null);
  };

  const removeIngredient = (value: string) => {
    setSelected((prev) => prev.filter((i) => i !== value));
  };

  const submitSearch = () => {
    if (!selected.length) {
      setError('Add at least one ingredient to find recipes.');
      return;
    }
    onSearch(selected);
  };

  return (
    <section className="screen-stack screen-enter">

      {/* ── Heading ─────────────────────────────────────── */}
      <div className="screen-heading">
        <p className="eyebrow">
          <span aria-hidden="true">🎯</span>
          {GOAL_LABELS[profile.goal] ?? profile.goal}
        </p>
        <h1>What's in your kitchen?</h1>
        <p>
          Pick or type your ingredients — COOKAI will find practical
          matches for your kitchen equipment.
        </p>
      </div>

      <div className="form-stack">

        {/* ── Free-text input ──────────────────────────── */}
        <div className="field">
          <label htmlFor="ingredient-input">Add an ingredient</label>
          <div className="input-row">
            <input
              id="ingredient-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addIngredient(draft); }
              }}
              placeholder="Type anything, e.g. garlic"
              className="text-input"
              maxLength={50}
              autoComplete="off"
              aria-describedby={error ? 'ingredient-error' : undefined}
            />
            <button
              type="button"
              className="secondary-button"
              onClick={() => addIngredient(draft)}
              aria-label="Add typed ingredient"
            >
              Add
            </button>
          </div>
        </div>

        {/* ── Categorised chips ────────────────────────── */}
        <div className="ingredient-categories">
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <p className="ingredient-category-label" aria-hidden="true">
                {cat.icon} {cat.label}
              </p>
              <div className="chip-row" role="group" aria-label={`${cat.label} ingredients`}>
                {cat.items.map((name) => {
                  const display    = displayNames.get(name) ?? name.charAt(0).toUpperCase() + name.slice(1);
                  const isSelected = selected.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => isSelected ? removeIngredient(name) : addIngredient(name)}
                      className={`chip-button${isSelected ? ' is-selected' : ''}`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5.2L4.2 7.4L8 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {display}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Selected tray ────────────────────────────── */}
        <div
          className={`selected-panel${selected.length > 0 ? ' has-items' : ''}`}
          aria-live="polite"
          aria-label="Selected ingredients"
        >
          {selected.length === 0 ? (
            <p className="muted-text" style={{ textAlign: 'center', paddingTop: 2 }}>
              No ingredients selected yet — pick from the lists above or type one in.
            </p>
          ) : (
            <>
              <p className="selected-count">
                {selected.length} ingredient{selected.length !== 1 ? 's' : ''} selected
              </p>
              <div className="chip-row">
                {selected.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => removeIngredient(item)}
                    className="chip-button is-selected"
                    aria-label={`Remove ${displayNames.get(item) ?? item}`}
                  >
                    {displayNames.get(item) ?? item}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" style={{ opacity: 0.75 }}>
                      <path d="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Error ────────────────────────────────────── */}
        {error && (
          <p className="error-box" id="ingredient-error" role="alert">{error}</p>
        )}

        {/* ── Submit ───────────────────────────────────── */}
        <button
          type="button"
          className="primary-button full-button"
          onClick={submitSearch}
          disabled={selected.length === 0}
        >
          Find recipes
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </div>
    </section>
  );
}
