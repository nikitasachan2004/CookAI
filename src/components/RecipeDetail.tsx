import { useEffect, useState } from 'react';
import { getRecipe } from '../api';
import type { RecipeDetail as RecipeDetailType } from '../types';

type Props = {
  recipeId: string;
  onBack: () => void;
};

const GOAL_LABELS: Record<string, string> = {
  balanced:       'Balanced',
  healthy:        'Healthy',
  'weight-loss':  'Weight loss',
  'high-protein': 'High protein',
};

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function RecipeDetail({ recipeId, onBack }: Props) {
  const [recipe, setRecipe] = useState<RecipeDetailType | null>(null);
  const [error,  setError]  = useState<string | null>(null);

  useEffect(() => {
    setRecipe(null);
    setError(null);
    getRecipe(recipeId)
      .then((data) => setRecipe(data.recipe))
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load recipe.'));
  }, [recipeId]);

  return (
    <section className="screen-stack screen-enter">

      {/* ── Toolbar ─────────────────────────────────────── */}
      <div className="toolbar">
        <button type="button" className="secondary-button" onClick={onBack}>
          ← Back to results
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <p className="error-box" role="alert">{error}</p>
      )}

      {/* ── Loading skeleton ─────────────────────────────── */}
      {!recipe && !error && (
        <div style={{ display: 'grid', gap: 14 }} aria-busy="true" aria-label="Loading recipe">
          <div className="skeleton" style={{ height: 44, width: '58%', borderRadius: 'var(--radius-sm)' }} />
          <div className="skeleton" style={{ height: 88,  borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-lg)' }} />
          <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-lg)' }} />
        </div>
      )}

      {/* ── Recipe content ───────────────────────────────── */}
      {recipe && (
        <>
          {/* Header */}
          <div className="screen-heading">
            <p className="eyebrow">
              <span aria-hidden="true">🍴</span>
              {recipe.tags.map((t) => GOAL_LABELS[t] ?? t).join(' · ')}
            </p>
            <h1>{recipe.title}</h1>
            <p>{recipe.description}</p>
            <div className="detail-meta-bar">
              <span className="meta-tag time">⏱ {recipe.timeMinutes} min</span>
              <span className="meta-tag diff">{recipe.difficulty}</span>
              <span className="meta-tag">{recipe.ingredients.length} ingredients</span>
              {recipe.equipment.length > 0 && (
                <span className="meta-tag">
                  <span aria-hidden="true">🔧</span>
                  {recipe.equipment.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Detail sections */}
          <div className="detail-grid">

            {/* Before you start */}
            <section className="detail-section" aria-labelledby="prep-heading">
              <div className="detail-section-header">
                <h2 id="prep-heading">Before you start</h2>
                <span>Prep first</span>
              </div>
              <div className="detail-section-body">
                <ol className="prep-list">
                  {recipe.prepInstructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Ingredients */}
            <section className="detail-section" aria-labelledby="ingredients-heading">
              <div className="detail-section-header">
                <h2 id="ingredients-heading">Ingredients</h2>
                <span>{recipe.ingredients.length} items</span>
              </div>
              <div className="detail-section-body" style={{ padding: '0 var(--sp-6)' }}>
                <ul className="ingredient-list" aria-label="Ingredient list">
                  {recipe.ingredients.map((ing) => (
                    <li
                      key={`${ing.name}-${ing.quantity}`}
                      className="ingredient-row"
                    >
                      <span className="ingredient-name">
                        {ing.name.charAt(0).toUpperCase() + ing.name.slice(1)}
                        {ing.optional && (
                          <span className="optional-badge">optional</span>
                        )}
                      </span>
                      <span className="ingredient-qty">{ing.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Cooking steps */}
            <section className="detail-section" aria-labelledby="steps-heading">
              <div className="detail-section-header">
                <h2 id="steps-heading">Cooking steps</h2>
                <span>Follow in order</span>
              </div>
              <div className="detail-section-body">
                <ol className="step-list" aria-label="Cooking instructions">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="step-item">
                      <span className="step-number" aria-label={`Step ${index + 1}`}>
                        {index + 1}
                      </span>
                      <p className="step-text">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Cooking tips */}
            <section className="detail-section" aria-labelledby="tips-heading">
              <div className="detail-section-header">
                <h2 id="tips-heading">Cooking tips</h2>
                <span>Read before serving</span>
              </div>
              <div className="detail-section-body">
                <ul className="tip-list" aria-label="Cooking tips">
                  {recipe.cookingTips.map((tip, i) => (
                    <li key={i} className="tip-item">
                      <span className="tip-dot" aria-hidden="true" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Serving suggestion */}
            <section className="detail-section serving-card" aria-labelledby="serve-heading">
              <div className="detail-section-header">
                <h2 id="serve-heading">Serve</h2>
              </div>
              <div className="detail-section-body">
                <p className="serving-body">{recipe.servingSuggestion}</p>
              </div>
            </section>

          </div>

          {/* YouTube CTA */}
          <a
            className="youtube-button"
            href={recipe.youtubeSearchUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Watch a ${recipe.title} tutorial on YouTube (opens in new tab)`}
          >
            <YouTubeIcon />
            Watch a tutorial on YouTube
          </a>

        </>
      )}

    </section>
  );
}
