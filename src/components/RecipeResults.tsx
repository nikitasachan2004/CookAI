import { useEffect, useState } from 'react';
import { matchRecipes } from '../api';
import type { Profile, RecipeSummary } from '../types';

type Props = {
  ingredients: string[];
  profile: Profile;
  onSelectRecipe: (id: string) => void;
  onBack: () => void;
  onNewSearch: () => void;
};

const TIER_META: Record<string, { label: string; symbol: string }> = {
  exact: { label: 'Exact match',  symbol: '✓' },
  near:  { label: 'Near match',   symbol: '~' },
  low:   { label: 'Low match',    symbol: '·' },
};

const GOAL_LABELS: Record<string, string> = {
  balanced:       'Balanced',
  healthy:        'Healthy',
  'weight-loss':  'Weight loss',
  'high-protein': 'High protein',
};

const DIFF_LABELS: Record<string, string> = {
  easy:   'Easy',
  medium: 'Medium',
};

const TIME_OPTIONS = [
  { label: 'Any time', value: undefined },
  { label: '≤ 10 min', value: 10 },
  { label: '≤ 20 min', value: 20 },
  { label: '≤ 30 min', value: 30 },
  { label: '≤ 45 min', value: 45 },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function RecipeResults({
  ingredients,
  profile,
  onSelectRecipe,
  onBack,
  onNewSearch,
}: Props) {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [maxMinutes, setMaxMinutes] = useState<number | undefined>(undefined);
  const [vegetarian, setVegetarian] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    matchRecipes({ ingredients, equipment: profile.equipment, goal: profile.goal, maxMinutes, vegetarian })
      .then((data) => {
        setRecipes(data.recipes);
        setTotal(data.total);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Recipe search failed.'))
      .finally(() => setLoading(false));
  }, [ingredients, profile.equipment, profile.goal, maxMinutes, vegetarian]);

  return (
    <section className="screen-stack screen-enter">

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="toolbar">
        <button type="button" className="secondary-button" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="secondary-button" onClick={onNewSearch}>
          New search
        </button>
      </div>

      {/* ── Heading ─────────────────────────────────────── */}
      <div className="screen-heading">
        <p className="eyebrow">
          <span aria-hidden="true">🍽️</span>
          Recipe matches
        </p>
        <h1>
          {loading
            ? 'Searching…'
            : total > 0
              ? `${total} recipe${total !== 1 ? 's' : ''} found`
              : 'No matches yet'}
        </h1>
        {!loading && total > 0 && (
          <p>
            Ranked by how closely they match your ingredients and goal.
          </p>
        )}
        <div className="results-ingredients-summary" aria-label="Your ingredients">
          {ingredients.map((ing) => (
            <span key={ing} className="static-chip">{ing}</span>
          ))}
        </div>
      </div>

      {/* ── Time & Diet filter ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>⏱ Time budget:</span>
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setMaxMinutes(opt.value)}
              className={`chip-button${maxMinutes === opt.value ? ' is-selected' : ''}`}
              aria-pressed={maxMinutes === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>🌱 Diet:</span>
          <button
            type="button"
            onClick={() => setVegetarian(!vegetarian)}
            className={`chip-button${vegetarian ? ' is-selected' : ''}`}
            aria-pressed={vegetarian}
          >
            Vegetarian
          </button>
        </div>
      </div>

      {/* ── Loading skeletons ────────────────────────────── */}
      {loading && (
        <div style={{ display: 'grid', gap: 12 }} aria-busy="true" aria-label="Loading recipes">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: 128, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <p className="error-box" role="alert">{error}</p>
      )}

      {/* ── Empty state ──────────────────────────────────── */}
      {!loading && !error && recipes.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">🍽️</span>
          <h2>No equipment-compatible matches</h2>
          <p>
            Try adding a few more ingredients, adjusting your time budget, or update your equipment
            in your profile to unlock more recipes.
          </p>
        </div>
      )}

      {/* ── Recipe cards ─────────────────────────────────── */}
      {!loading && !error && recipes.length > 0 && (
        <div className="result-list" role="list">
          {recipes.map((recipe) => {
            const tier = TIER_META[recipe.matchTier] ?? TIER_META.low;
            return (
              <button
                type="button"
                key={recipe.id}
                role="listitem"
                className={`recipe-card tier-${recipe.matchTier}`}
                onClick={() => onSelectRecipe(recipe.id)}
                aria-label={`${recipe.title} — ${tier.label}, ${Math.round(recipe.matchScore * 100)}% match`}
              >
                {/* Top line: badge + score */}
                <div className="card-topline">
                  <span className={`match-badge ${recipe.matchTier}`}>
                    {tier.symbol} {tier.label}
                  </span>
                  <div className="card-right">
                    <span className="match-score">{Math.round(recipe.matchScore * 100)}%</span>
                    <span className="card-arrow" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>

                <h2>{recipe.title}</h2>
                <p>{recipe.description}</p>

                {/* Meta tags */}
                <div className="meta-row">
                  <span className="meta-tag time">⏱ {recipe.timeMinutes} min</span>
                  <span className="meta-tag goal">
                    {GOAL_LABELS[recipe.goalTag] ?? recipe.goalTag}
                  </span>
                  <span className="meta-tag diff">
                    {DIFF_LABELS[recipe.difficulty] ?? recipe.difficulty}
                  </span>
                </div>

                {/* Substitution hints */}
                {recipe.substitutions && recipe.substitutions.length > 0 && (
                  <p className="missing-text" style={{ color: 'var(--color-warning, #b45309)' }}>
                    <span aria-hidden="true">🔄</span>
                    <span>
                      <strong>Swap:</strong> {recipe.substitutions.join(' · ')}
                    </span>
                  </p>
                )}

                {/* Missing ingredients */}
                {recipe.missingIngredients.length > 0 && (
                  <p className="missing-text">
                    <span aria-hidden="true">⚠</span>
                    <span>
                      <strong>Missing:</strong> {recipe.missingIngredients.join(', ')}
                    </span>
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

    </section>
  );
}
