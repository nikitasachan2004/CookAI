import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecipes } from '../api';
import type { RecipeListItem } from '../types';

type Props = {
  onGetStarted: () => void;
};

/* ─── Per-recipe colour themes based on tags / id ──────────── */
const RECIPE_THEMES: Record<string, { from: string; to: string; emoji: string }> = {
  'egg-fried-rice':         { from: '#FFB84D', to: '#FF8A3D', emoji: '🍳' },
  'chicken-rice-bowl':      { from: '#60A5FA', to: '#3B82F6', emoji: '🍗' },
  'tomato-pasta':           { from: '#EF4444', to: '#DC2626', emoji: '🍝' },
  'bean-toast':             { from: '#FF8A3D', to: '#EA6D0F', emoji: '🫘' },
  'banana-oat-smoothie':    { from: '#FFB84D', to: '#F59E0B', emoji: '🍌' },
  'spinach-omelet':         { from: '#34D399', to: '#059669', emoji: '🥬' },
  'microwave-egg-rice':     { from: '#8B5CF6', to: '#7C3AED', emoji: '📡' },
  'lentil-tomato-soup':     { from: '#EF4444', to: '#B91C1C', emoji: '🥣' },
  'chickpea-spinach-pan':   { from: '#34D399', to: '#047857', emoji: '🌱' },
  'tuna-rice-bowl':         { from: '#60A5FA', to: '#1D4ED8', emoji: '🐟' },
  'potato-egg-hash':        { from: '#FFB84D', to: '#D97706', emoji: '🥔' },
  'banana-peanut-oats':     { from: '#FF8A3D', to: '#C2410C', emoji: '🥜' },
  'microwave-potato-beans': { from: '#8B5CF6', to: '#5B21B6', emoji: '🎃' },
  'tofu-broccoli-rice':     { from: '#34D399', to: '#065F46', emoji: '🥦' },
  'vegetable-omelet-wrap':  { from: '#FF5FA2', to: '#DB2777', emoji: '🫔' },
  'avocado-egg-toast':      { from: '#34D399', to: '#059669', emoji: '🥑' },
  'chicken-spinach-pasta':  { from: '#60A5FA', to: '#1D4ED8', emoji: '🍃' },
  'tomato-egg-drop-soup':   { from: '#EF4444', to: '#991B1B', emoji: '🍅' },
  'broccoli-cheese-rice':   { from: '#34D399', to: '#047857', emoji: '🧀' },
  'chickpea-cucumber-salad':{ from: '#FFB84D', to: '#92400E', emoji: '🥗' },
  'paneer-pepper-pan':      { from: '#FF8A3D', to: '#9A3412', emoji: '🫑' },
  'mushroom-spinach-toast': { from: '#8B5CF6', to: '#4C1D95', emoji: '🍄' },
  'corn-pea-rice':          { from: '#FFB84D', to: '#B45309', emoji: '🌽' },
  'chicken-lettuce-wraps':  { from: '#60A5FA', to: '#1E40AF', emoji: '🥬' },
  'apple-yogurt-oats':      { from: '#FF5FA2', to: '#BE185D', emoji: '🍎' },
  'bean-cheese-wrap':       { from: '#FF8A3D', to: '#7C2D12', emoji: '🧆' },
  'cabbage-egg-stir-fry':   { from: '#34D399', to: '#064E3B', emoji: '🥬' },
  'oven-potato-chicken':    { from: '#FFB84D', to: '#78350F', emoji: '🥧' },
  'blender-tomato-soup':    { from: '#EF4444', to: '#7F1D1D', emoji: '🌀' },
  'tofu-cabbage-wrap':      { from: '#8B5CF6', to: '#3730A3', emoji: '🌯' },
  'carrot-pea-pasta':       { from: '#FF8A3D', to: '#EA580C', emoji: '🥕' },
  'chicken-corn-soup':      { from: '#FFB84D', to: '#A16207', emoji: '🌽' },
  'peanut-banana-smoothie': { from: '#FF8A3D', to: '#B45309', emoji: '🥤' },
  'tomato-paneer-rice':     { from: '#EF4444', to: '#FF8A3D', emoji: '🫙' },
  'mushroom-egg-rice':      { from: '#8B5CF6', to: '#6D28D9', emoji: '🍄' },
  'coconut-lentil-rice':    { from: '#34D399', to: '#065F46', emoji: '🥥' },
};

const FALLBACK_THEME = { from: '#FF8A3D', to: '#8B5CF6', emoji: '🍴' };

const GOAL_LABELS: Record<string, string> = {
  balanced:       'Balanced',
  healthy:        'Healthy',
  'weight-loss':  'Weight loss',
  'high-protein': 'High protein',
};

const GOAL_COLORS: Record<string, { bg: string; color: string }> = {
  balanced:       { bg: '#EDE9FE', color: '#7C3AED' },
  healthy:        { bg: '#D1FAE5', color: '#065F46' },
  'weight-loss':  { bg: '#DBEAFE', color: '#1D4ED8' },
  'high-protein': { bg: '#FFF2DD', color: '#C2410C' },
};

const EQUIP_ICONS: Record<string, string> = {
  stove:     '🔥',
  oven:      '🥧',
  microwave: '📡',
  blender:   '🌀',
  pan:       '🍳',
  pot:       '🫕',
};

const ALL_GOALS = ['balanced', 'healthy', 'weight-loss', 'high-protein'] as const;
type GoalFilter = typeof ALL_GOALS[number] | 'all';

const COLORS = [
  { from: '#FFB84D', to: '#FF8A3D' },
  { from: '#60A5FA', to: '#3B82F6' },
  { from: '#EF4444', to: '#DC2626' },
  { from: '#34D399', to: '#059669' },
  { from: '#8B5CF6', to: '#7C3AED' },
  { from: '#FF5FA2', to: '#DB2777' },
];

function getTheme(id: string) {
  if (RECIPE_THEMES[id]) return RECIPE_THEMES[id];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = COLORS[Math.abs(hash) % COLORS.length];
  return { ...color, emoji: '🍴' };
}

/* ─── Recipe photo banner ───────────────────────────────────── */
function RecipePhotoBanner({ id, title, imageUrl }: { id: string; title: string; imageUrl?: string }) {
  const theme = getTheme(id);
  return (
    <div
      className="browse-card-photo"
      style={{ background: `linear-gradient(145deg, ${theme.from}, ${theme.to})` }}
      aria-hidden="true"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="browse-card-image"
          loading="lazy"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
      )}
      {/* Decorative blobs */}
      <div className="browse-card-blob browse-card-blob--top" />
      <div className="browse-card-blob browse-card-blob--bottom" />
      {/* Subtle title watermark */}
      <span className="browse-card-watermark">{title}</span>
    </div>
  );
}

/* ─── Single recipe card ────────────────────────────────────── */
function RecipeCard({ recipe, onSelect }: { recipe: RecipeListItem; onSelect: (id: string) => void }) {
  const primaryTag = recipe.tags[0];
  const tagStyle = GOAL_COLORS[primaryTag] ?? { bg: '#FFF2DD', color: '#C2410C' };

  return (
    <article
      className="browse-card"
      role="link"
      tabIndex={0}
      onClick={() => onSelect(recipe.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(recipe.id);
        }
      }}
    >
      <RecipePhotoBanner id={recipe.id} title={recipe.title} imageUrl={recipe.imageUrl} />

      <div className="browse-card-body">
        {/* Tags row */}
        <div className="browse-card-tags">
          {recipe.tags.slice(0, 2).map((tag) => {
            const s = GOAL_COLORS[tag] ?? tagStyle;
            return (
              <span
                key={tag}
                className="browse-card-tag"
                style={{ background: s.bg, color: s.color }}
              >
                {GOAL_LABELS[tag] ?? tag}
              </span>
            );
          })}
        </div>

        <h3 className="browse-card-title">{recipe.title}</h3>
        <p className="browse-card-desc">{recipe.description}</p>

        {/* Meta row */}
        <div className="browse-card-meta">
          <span className="meta-tag time">⏱ {recipe.timeMinutes} min</span>
          <span className="meta-tag diff">
            {recipe.difficulty === 'easy' ? 'Easy' : 'Medium'}
          </span>
          <span className="meta-tag">
            {recipe.ingredientCount} ingredient{recipe.ingredientCount !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Equipment chips */}
        {recipe.equipment.length > 0 && (
          <div className="browse-card-equipment">
            {recipe.equipment.map((eq) => (
              <span key={eq} className="browse-equip-chip">
                <span aria-hidden="true">{EQUIP_ICONS[eq] ?? '🔧'}</span>
                {eq}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function RecipesBrowsePage({ onGetStarted }: Props) {
  const navigate = useNavigate();
  const [recipes, setRecipes]       = useState<RecipeListItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [filter, setFilter]         = useState<GoalFilter>('all');
  const [search, setSearch]         = useState('');

  useEffect(() => {
    setLoading(true);
    getAllRecipes()
      .then((data) => setRecipes(data.recipes))
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load recipes.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes.filter((r) => {
    const matchesGoal   = filter === 'all' || r.tags.includes(filter as typeof ALL_GOALS[number]);
    const matchesSearch = search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesGoal && matchesSearch;
  });

  return (
    <div className="screen-enter">

      {/* ══════════════════════════════════════════
          PAGE HERO
      ══════════════════════════════════════════ */}
      <section className="browse-hero" aria-label="Recipes library">
        <div className="container">
          <div className="section-header-block section-header-block--center" style={{ marginBottom: 'var(--sp-8)' }}>
            <div className="hero-eyebrow" style={{ alignSelf: 'center' }}>
              <span className="hero-eyebrow-dot" />
              Recipe Library
            </div>
            <h1 className="browse-hero-headline">
              {recipes.length > 0 ? `${recipes.length} recipes` : 'All recipes'},<br />
              zero grocery runs
            </h1>
            <p className="browse-hero-sub">
              Every recipe is matched to ingredients you already have.
              Filter by goal, search by name, or just browse — then hit
              "Get started" to find your perfect match.
            </p>
          </div>

          {/* Search + filter bar */}
          <div className="browse-controls">
            <div className="browse-search-wrap">
              <span className="browse-search-icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="Search recipes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="browse-search-input"
                aria-label="Search recipes"
              />
            </div>

            <div className="browse-filter-row" role="group" aria-label="Filter by goal">
              {(['all', ...ALL_GOALS] as GoalFilter[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFilter(g)}
                  className={`browse-filter-chip${filter === g ? ' is-active' : ''}`}
                >
                  {g === 'all' ? '✨ All' : GOAL_LABELS[g]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECIPE GRID
      ══════════════════════════════════════════ */}
      <section className="landing-section" style={{ paddingTop: 'var(--sp-7)' }} aria-label="Recipe grid">
        <div className="container">

          {/* Loading */}
          {loading && (
            <div className="browse-skeleton-grid" aria-busy="true" aria-label="Loading recipes">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="browse-skeleton-card">
                  <div className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />
                  <div style={{ padding: 'var(--sp-5)', display: 'grid', gap: 10 }}>
                    <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 'var(--radius-full)' }} />
                    <div className="skeleton" style={{ height: 20, width: '80%', borderRadius: 'var(--radius-sm)' }} />
                    <div className="skeleton" style={{ height: 14, borderRadius: 'var(--radius-sm)' }} />
                    <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 'var(--radius-sm)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="error-box" role="alert" style={{ maxWidth: 480, margin: '0 auto' }}>{error}</p>
          )}

          {/* Empty filtered state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">🍽️</span>
              <h2>No recipes match that filter</h2>
              <p>Try a different goal or clear the search.</p>
              <button
                type="button"
                className="primary-button"
                style={{ marginTop: 'var(--sp-5)' }}
                onClick={() => { setFilter('all'); setSearch(''); }}
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <>
              <p className="browse-result-count" aria-live="polite">
                Showing {filtered.length} of {recipes.length} recipes
                {filter !== 'all' && ` · ${GOAL_LABELS[filter]}`}
                {search.trim() && ` · "${search}"`}
              </p>
              <div className="browse-grid">
                  {filtered.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onSelect={(id) => navigate(`/recipes/${id}`)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════════ */}
      <section className="browse-cta-band" aria-label="Get started">
        <div className="container">
          <div className="browse-cta-inner">
            <div>
              <h2 className="browse-cta-headline">
                Found something you want to cook?
              </h2>
              <p className="browse-cta-sub">
                Tell COOKAI what you have and it'll instantly rank every
                recipe against your actual ingredients.
              </p>
            </div>
            <button
              type="button"
              className="primary-button primary-button--lg"
              onClick={onGetStarted}
            >
              Match my ingredients →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" role="contentinfo">
        <div className="footer-inner">
          <span className="footer-copy">© {new Date().getFullYear()} COOKAI. Cook smarter, not harder.</span>
          <span className="footer-copy">Built for home cooks everywhere.</span>
        </div>
      </footer>

    </div>
  );
}
