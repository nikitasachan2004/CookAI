import { Link } from 'react-router-dom';

type Props = {
  onGetStarted: () => void;
};

/* ─── Inline SVG illustrations ──────────────────────────────── */

function IconCheck() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5.2L4.2 7.4L8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IllustrationIngredients() {
  return (
    <svg width="100%" viewBox="0 0 440 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Background blob — warm cream */}
      <ellipse cx="220" cy="190" rx="180" ry="130" fill="#FFF2DD" />

      {/* Cutting board */}
      <rect x="80" y="170" width="280" height="100" rx="14" fill="#E8D5B8" />
      <rect x="86" y="176" width="268" height="88" rx="10" fill="#F0E4CE" />
      {/* Board grain lines */}
      <line x1="120" y1="176" x2="120" y2="264" stroke="#D4C09A" strokeWidth="1.5" strokeDasharray="4 6" />
      <line x1="160" y1="176" x2="160" y2="264" stroke="#D4C09A" strokeWidth="1.5" strokeDasharray="4 6" />
      <line x1="200" y1="176" x2="200" y2="264" stroke="#D4C09A" strokeWidth="1.5" strokeDasharray="4 6" />
      <line x1="240" y1="176" x2="240" y2="264" stroke="#D4C09A" strokeWidth="1.5" strokeDasharray="4 6" />
      <line x1="280" y1="176" x2="280" y2="264" stroke="#D4C09A" strokeWidth="1.5" strokeDasharray="4 6" />
      <line x1="320" y1="176" x2="320" y2="264" stroke="#D4C09A" strokeWidth="1.5" strokeDasharray="4 6" />

      {/* Knife */}
      <g transform="translate(330, 130) rotate(30)">
        <rect x="0" y="0" width="8" height="70" rx="2" fill="#C8BFB8" />
        <rect x="0" y="0" width="8" height="46" rx="1" fill="#A09890" />
        <rect x="2" y="46" width="4" height="24" rx="2" fill="#6B5F58" />
      </g>

      {/* Tomato */}
      <circle cx="155" cy="215" r="28" fill="#EF4444" />
      <ellipse cx="155" cy="188" rx="8" ry="5" fill="#34D399" />
      <path d="M150 188 C148 180 155 175 162 180" stroke="#34D399" strokeWidth="2" fill="none" />
      <ellipse cx="147" cy="210" rx="5" ry="7" fill="#DC2626" opacity="0.4" />

      {/* Garlic bulb */}
      <ellipse cx="220" cy="220" rx="22" ry="20" fill="#FFF7EA" stroke="#EBDDC7" strokeWidth="1.5" />
      <path d="M210 210 Q220 200 230 210" stroke="#EBDDC7" strokeWidth="1.2" fill="none" />
      <path d="M213 215 Q220 206 227 215" stroke="#EBDDC7" strokeWidth="1.2" fill="none" />
      <rect x="218" y="198" width="4" height="10" rx="2" fill="#A3C77E" />

      {/* Lemon */}
      <ellipse cx="285" cy="218" rx="24" ry="20" fill="#FFB84D" />
      <ellipse cx="285" cy="218" rx="18" ry="14" fill="#FFC96B" />
      <circle cx="285" cy="198" r="4" fill="#D97706" />

      {/* Broccoli */}
      <circle cx="148" cy="156" r="16" fill="#34D399" />
      <circle cx="166" cy="150" r="14" fill="#6EE7B7" />
      <circle cx="154" cy="144" r="12" fill="#34D399" />
      <rect x="154" y="168" width="6" height="20" rx="3" fill="#059669" />

      {/* Pasta */}
      <g transform="translate(330, 185)">
        <ellipse cx="0" cy="0" rx="20" ry="28" fill="none" stroke="#FFB84D" strokeWidth="3" />
        <ellipse cx="0" cy="0" rx="12" ry="18" fill="none" stroke="#FFB84D" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="4" ry="8" fill="none" stroke="#FFB84D" strokeWidth="2" />
      </g>

      {/* Egg */}
      <ellipse cx="110" cy="220" rx="16" ry="20" fill="#FFFDF8" stroke="#EBDDC7" strokeWidth="1.5" />
      <ellipse cx="110" cy="224" rx="8" ry="8" fill="#FFB84D" />

      {/* Decorative dots — orange + purple + gold */}
      <circle cx="85" cy="155" r="4" fill="#FF8A3D" opacity="0.5" />
      <circle cx="370" cy="155" r="6" fill="#8B5CF6" opacity="0.35" />
      <circle cx="360" cy="260" r="5" fill="#FFB84D" opacity="0.55" />
      <circle cx="90" cy="260" r="4" fill="#FF5FA2" opacity="0.4" />
    </svg>
  );
}

function IllustrationRecipeCard() {
  return (
    <svg width="100%" viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Card shadow */}
      <rect x="24" y="28" width="312" height="224" rx="22" fill="rgba(31,23,42,0.07)" />
      {/* Card base */}
      <rect x="20" y="20" width="312" height="224" rx="22" fill="#FFFDF8" />
      <rect x="20" y="20" width="312" height="224" rx="22" stroke="#EBDDC7" strokeWidth="1.5" />

      {/* Orange accent left strip */}
      <rect x="20" y="20" width="4" height="224" rx="2" fill="#FF8A3D" />

      {/* Header band — warm cream */}
      <rect x="24" y="20" width="308" height="64" rx="20" fill="#FFF2DD" />
      <rect x="24" y="52" width="308" height="32" fill="#FFF2DD" />

      {/* Match badge — green success */}
      <rect x="36" y="34" width="90" height="22" rx="11" fill="#D1FAE5" />
      <text x="46" y="49" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#065F46" letterSpacing="0.06em">✓ EXACT MATCH</text>

      {/* Score */}
      <text x="296" y="49" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#A09AAC" textAnchor="end">96%</text>

      {/* Recipe title */}
      <text x="36" y="90" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="800" fill="#1F172A" letterSpacing="-0.02em">Garlic Tomato Pasta</text>

      {/* Description */}
      <text x="36" y="110" fontFamily="Inter, sans-serif" fontSize="11" fill="#5B5563">A simple, flavourful pasta ready in 20 minutes.</text>

      {/* Meta tags */}
      <rect x="36" y="124" width="66" height="20" rx="10" fill="#DBEAFE" />
      <text x="46" y="137" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#1D4ED8">⏱ 20 MIN</text>

      <rect x="108" y="124" width="66" height="20" rx="10" fill="#EDE9FE" />
      <text x="118" y="137" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#7C3AED">BALANCED</text>

      <rect x="180" y="124" width="44" height="20" rx="10" fill="#FFF2DD" />
      <text x="190" y="137" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#5B5563">EASY</text>

      {/* Divider */}
      <line x1="36" y1="156" x2="316" y2="156" stroke="#EBDDC7" strokeWidth="1" />

      {/* Ingredients section label */}
      <text x="36" y="174" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="800" fill="#A09AAC" letterSpacing="0.09em">INGREDIENTS</text>

      {/* Ingredient chips */}
      {[
        { x: 36,  label: 'Pasta' },
        { x: 96,  label: 'Tomato' },
        { x: 166, label: 'Garlic' },
        { x: 228, label: 'Olive oil' },
      ].map((ing) => (
        <g key={ing.label}>
          <rect x={ing.x} y="182" width={ing.label.length * 7 + 20} height="20" rx="10" fill="#FFF2DD" stroke="#EBDDC7" strokeWidth="1" />
          <text x={ing.x + 10} y="195" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill="#5B5563">{ing.label}</text>
        </g>
      ))}

      {/* View button — orange CTA */}
      <rect x="36" y="214" width="118" height="24" rx="12" fill="#FF8A3D" />
      <text x="95" y="230" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="white" textAnchor="middle">View Recipe →</text>
    </svg>
  );
}

function IllustrationEquipment() {
  return (
    <svg width="100%" viewBox="0 0 380 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Background wash — warm cream */}
      <rect x="20" y="20" width="340" height="220" rx="24" fill="#FFF2DD" />

      {/* Pan */}
      <g transform="translate(50, 60)">
        <ellipse cx="70" cy="90" rx="55" ry="18" fill="#B8A98C" opacity="0.3" />
        <rect x="20" y="55" width="100" height="34" rx="6" fill="#3a3a4a" />
        <ellipse cx="70" cy="55" rx="50" ry="10" fill="#4a4a5a" />
        <ellipse cx="70" cy="55" rx="38" ry="7" fill="#2a2a38" />
        {/* Handle */}
        <rect x="120" y="64" width="52" height="12" rx="6" fill="#5a5050" />
        <rect x="168" y="66" width="14" height="8" rx="4" fill="#4a4040" />
      </g>

      {/* Pot */}
      <g transform="translate(220, 50)">
        <ellipse cx="60" cy="110" rx="50" ry="16" fill="#B8A98C" opacity="0.3" />
        <rect x="12" y="55" width="96" height="52" rx="8" fill="#5a5a6a" />
        <ellipse cx="60" cy="55" rx="48" ry="10" fill="#6a6a7a" />
        <ellipse cx="60" cy="55" rx="36" ry="7" fill="#7a7a8a" />
        {/* Lid */}
        <ellipse cx="60" cy="48" rx="48" ry="10" fill="#7a7a8a" />
        <ellipse cx="60" cy="46" rx="36" ry="7" fill="#8a8a9a" />
        <ellipse cx="60" cy="40" rx="10" ry="5" fill="#9a9aaa" />
        {/* Handles */}
        <rect x="-6" y="70" width="18" height="10" rx="5" fill="#4a4a5a" />
        <rect x="110" y="70" width="18" height="10" rx="5" fill="#4a4a5a" />
      </g>

      {/* Stove burner glow — orange */}
      <ellipse cx="120" cy="190" rx="40" ry="12" fill="#FF8A3D" opacity="0.22" />
      <ellipse cx="120" cy="190" rx="24" ry="7" fill="#FF8A3D" opacity="0.32" />

      {/* Decorative check badges — warm green */}
      <g transform="translate(54, 28)">
        <rect x="0" y="0" width="64" height="22" rx="11" fill="#D1FAE5" />
        <text x="10" y="15" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#065F46">✓ Stove</text>
      </g>
      <g transform="translate(234, 22)">
        <rect x="0" y="0" width="52" height="22" rx="11" fill="#D1FAE5" />
        <text x="10" y="15" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#065F46">✓ Pot</text>
      </g>
      <g transform="translate(144, 200)">
        <rect x="0" y="0" width="56" height="22" rx="11" fill="#D1FAE5" />
        <text x="10" y="15" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#065F46">✓ Pan</text>
      </g>
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function LandingPage({ onGetStarted }: Props) {
  return (
    <div className="screen-enter">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="landing-hero" aria-label="Hero">
        <div className="hero-inner">

          {/* Left: copy */}
          <div className="hero-content">
            <div className="hero-eyebrow" aria-hidden="true">
              <span className="hero-eyebrow-dot" />
              Smart Recipe Matching
            </div>

            <h1 className="hero-headline">
              Cook great meals with what you <em>already have</em>
            </h1>

            <p className="hero-subline">
              Tell COOKAI what's in your kitchen. In seconds, you get
              real, practical recipes matched to your exact ingredients
              and equipment — no grocery run required.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="primary-button primary-button--lg"
                onClick={onGetStarted}
              >
                Start cooking free
                <IconArrow />
              </button>
              <Link to="/recipes" className="secondary-button secondary-button--lg">
                Browse recipes
              </Link>
            </div>

            <div className="hero-trust" aria-label="Product highlights">
              <span className="trust-item">
                <span className="trust-check" aria-hidden="true">
                  <IconCheck />
                </span>
                No account needed
              </span>
              <span className="trust-divider" aria-hidden="true" />
              <span className="trust-item">
                <span className="trust-check" aria-hidden="true">
                  <IconCheck />
                </span>
                Works with any kitchen
              </span>
              <span className="trust-divider" aria-hidden="true" />
              <span className="trust-item">
                <span className="trust-check" aria-hidden="true">
                  <IconCheck />
                </span>
                Instant results
              </span>
            </div>
          </div>

          {/* Right: visual */}
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card-cluster">

              {/* Floating top badge */}
              <div className="hero-float-badge hero-float-badge--top">
                <span className="hero-float-badge-icon">🥚</span>
                <div className="hero-float-badge-text">
                  <span className="hero-float-badge-label">Eggs</span>
                  <span className="hero-float-badge-sub">Ingredient matched</span>
                </div>
              </div>

              {/* Main recipe card mockup */}
              <div className="hero-recipe-card">
                <div className="hero-recipe-card-tag">
                  <span>✓</span>
                  Exact match · 96%
                </div>
                <h2 className="hero-recipe-card-title">Garlic Tomato Pasta</h2>
                <p className="hero-recipe-card-desc">
                  A quick, flavourful weeknight dinner using pantry staples.
                </p>

                <div className="hero-ingredients-row">
                  {['🍝 Pasta', '🍅 Tomato', '🧄 Garlic', '🫒 Olive oil', '🌿 Basil'].map((ing) => (
                    <span key={ing} className="hero-ingredient-chip">{ing}</span>
                  ))}
                </div>

                <div className="hero-recipe-meta">
                  <div className="hero-recipe-meta-left">
                    <span className="meta-tag time">⏱ 20 min</span>
                    <span className="meta-tag">Easy</span>
                  </div>
                  <span className="hero-match-pill">
                    ✓ All ingredients matched
                  </span>
                </div>
              </div>

              {/* Floating bottom badge */}
              <div className="hero-float-badge hero-float-badge--bottom">
                <span className="hero-float-badge-icon">🍳</span>
                <div className="hero-float-badge-text">
                  <span className="hero-float-badge-label">Pan required</span>
                  <span className="hero-float-badge-sub">Equipment verified</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="landing-section landing-section--alt" id="how-it-works" aria-labelledby="how-title">
        <div className="container">

          <div className="section-header-block section-header-block--center">
            <p className="section-label">How it works</p>
            <div className="section-divider section-divider--center" />
            <h2 className="section-heading" id="how-title">
              From fridge to fork in three steps
            </h2>
            <p className="section-subheading">
              No scrolling through irrelevant recipes. No guessing substitutions.
              Just tell us what you have and we handle the rest.
            </p>
          </div>

          <div className="how-steps">

            <article className="how-step">
              <div className="how-step-number" aria-hidden="true">1</div>
              <div>
                <div className="how-step-icon" aria-hidden="true">👤</div>
                <h3 className="how-step-title">Set your profile</h3>
                <p className="how-step-desc">
                  Tell us your name, your meal goal — balanced, healthy, high
                  protein, or weight-loss — and which kitchen equipment you own.
                  Takes under a minute.
                </p>
              </div>
            </article>

            <article className="how-step">
              <div className="how-step-number" aria-hidden="true">2</div>
              <div>
                <div className="how-step-icon" aria-hidden="true">🥦</div>
                <h3 className="how-step-title">Pick your ingredients</h3>
                <p className="how-step-desc">
                  Browse organised ingredient categories or type anything
                  freeform. Select everything currently in your fridge, pantry,
                  or on your counter.
                </p>
              </div>
            </article>

            <article className="how-step">
              <div className="how-step-number" aria-hidden="true">3</div>
              <div>
                <div className="how-step-icon" aria-hidden="true">🍽️</div>
                <h3 className="how-step-title">Get matched recipes</h3>
                <p className="how-step-desc">
                  COOKAI instantly ranks recipes by match quality — exact,
                  near, and partial matches — filtered by your equipment and
                  aligned to your goal.
                </p>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          INGREDIENT VISUAL + COPY SPLIT
      ══════════════════════════════════════════ */}
      <section className="landing-section" aria-label="Ingredient selection">
        <div className="container">
          <div className="showcase-split">

            <div className="showcase-content">
              <p className="section-label">Everything in your kitchen</p>
              <div className="section-divider" />
              <h2 className="section-heading">
                Browse by category, or just type it in
              </h2>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-6)' }}>
                Proteins, grains, vegetables, dairy, fruits — ingredients are
                organised so you can quickly check what you have. Or type
                anything and we'll match it.
              </p>

              <div className="ingredient-cluster" style={{ maxWidth: 360, marginBottom: 'var(--sp-7)' }}>
                {[
                  { icon: '🥚', name: 'Eggs' },
                  { icon: '🍅', name: 'Tomato' },
                  { icon: '🧄', name: 'Garlic' },
                  { icon: '🍗', name: 'Chicken' },
                  { icon: '🥦', name: 'Broccoli' },
                  { icon: '🌾', name: 'Rice' },
                  { icon: '🧀', name: 'Cheese' },
                  { icon: '🫒', name: 'Olive oil' },
                  { icon: '🥛', name: 'Milk' },
                ].map((item) => (
                  <div key={item.name} className="ingredient-tile">
                    <span className="ingredient-tile-icon" aria-hidden="true">{item.icon}</span>
                    <span className="ingredient-tile-name">{item.name}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={onGetStarted}
              >
                Try it now
                <IconArrow />
              </button>
            </div>

            <div className="showcase-visual" aria-hidden="true">
              <IllustrationIngredients />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECIPE RESULTS SPLIT
      ══════════════════════════════════════════ */}
      <section className="landing-section landing-section--alt" aria-label="Recipe results">
        <div className="container">
          <div className="showcase-split showcase-split--reverse">

            <div className="showcase-visual" aria-hidden="true">
              <IllustrationRecipeCard />
            </div>

            <div className="showcase-content">
              <p className="section-label">Smart matching engine</p>
              <div className="section-divider" />
              <h2 className="section-heading">
                Ranked results, not a random list
              </h2>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-6)' }}>
                Every recipe is scored against your exact ingredients. Exact
                matches rise to the top. Near-matches show what's missing.
                Low matches are clearly labeled — so you always know where
                you stand.
              </p>

              <div style={{ display: 'grid', gap: 'var(--sp-3)', maxWidth: 380 }}>
                {[
                  { badge: 'Exact match', desc: 'You have every ingredient. Ready to cook right now.' },
                  { badge: 'Near match',  desc: 'Missing one or two items. Easy to adapt or grab quickly.' },
                  { badge: 'Low match',   desc: 'Fewer ingredients overlap, but still worth browsing.' },
                ].map((tier) => (
                  <div
                    key={tier.badge}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--sp-3)',
                      padding: 'var(--sp-4)',
                      background: 'var(--surface)',
                      border: '1.5px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <span
                      className="match-badge"
                      style={{
                        background: tier.badge === 'Exact match' ? 'var(--tier-exact-bg)' : tier.badge === 'Near match' ? 'var(--tier-near-bg)' : 'var(--tier-low-bg)',
                        color: tier.badge === 'Exact match' ? 'var(--tier-exact-text)' : tier.badge === 'Near match' ? 'var(--tier-near-text)' : 'var(--tier-low-text)',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {tier.badge === 'Exact match' ? '✓' : tier.badge === 'Near match' ? '~' : '·'}{' '}
                      {tier.badge}
                    </span>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-soft)', lineHeight: 1.6 }}>
                      {tier.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════ */}
      <section className="landing-section" aria-labelledby="features-title">
        <div className="container">

          <div className="section-header-block">
            <p className="section-label">Why COOKAI</p>
            <div className="section-divider" />
            <h2 className="section-heading" id="features-title">
              Built for the way real kitchens work
            </h2>
            <p className="section-subheading">
              No subscription, no bloated recipe database, no ads.
              Just a sharp, focused tool that does one thing brilliantly.
            </p>
          </div>

          <div className="feature-grid">

            <article className="feature-card feature-card--accent">
              <div className="feature-icon-wrap" aria-hidden="true">🎯</div>
              <h3 className="feature-title">Goal-aware matching</h3>
              <p className="feature-desc">
                Set a meal goal and COOKAI filters results accordingly.
                High-protein, weight-loss, healthy, or balanced —
                every suggestion aligns with how you want to eat.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">🔧</div>
              <h3 className="feature-title">Equipment-aware filtering</h3>
              <p className="feature-desc">
                Tell us you only have a microwave and a pan. COOKAI
                will never show you recipes that need an oven or
                blender you don't own.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">⚡</div>
              <h3 className="feature-title">Instant, no fluff</h3>
              <p className="feature-desc">
                Results appear in milliseconds. No loading spinners,
                no waiting on AI generation — just fast, reliable
                matching from a curated recipe library.
              </p>
            </article>

            <article className="feature-card feature-card--accent">
              <div className="feature-icon-wrap" aria-hidden="true">📋</div>
              <h3 className="feature-title">Full recipe detail</h3>
              <p className="feature-desc">
                Each recipe includes prep instructions, a full
                ingredient list with quantities, step-by-step cooking
                guide, pro tips, and a serving suggestion.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EQUIPMENT SECTION (dark band)
      ══════════════════════════════════════════ */}
      <section className="landing-section landing-section--dark" aria-label="Equipment compatibility">
        <div className="dark-band-decor" aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="showcase-split" style={{ alignItems: 'center' }}>

            <div className="showcase-content">
              <p className="section-label section-label--on-dark">Kitchen tools</p>
              <div className="section-divider" />
              <h2 className="section-heading section-heading--on-dark">
                Works with whatever you have in your kitchen
              </h2>
              <p className="section-subheading section-subheading--on-dark" style={{ marginBottom: 'var(--sp-7)' }}>
                Stove, oven, pan, pot, microwave, blender — just tell us
                what's available. Recipes that need tools you don't have
                are automatically excluded, so every suggestion is
                actually cookable for you.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-8)' }}>
                {[
                  { icon: '🔥', name: 'Stove' },
                  { icon: '🥧', name: 'Oven' },
                  { icon: '📡', name: 'Microwave' },
                  { icon: '🌀', name: 'Blender' },
                  { icon: '🍳', name: 'Pan' },
                  { icon: '🫕', name: 'Pot' },
                ].map((eq) => (
                  <span
                    key={eq.name}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 16px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.80)',
                    }}
                  >
                    <span aria-hidden="true">{eq.icon}</span>
                    {eq.name}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="btn-on-dark"
                onClick={onGetStarted}
              >
                Set up my kitchen
                <IconArrow />
              </button>
            </div>

            <div className="showcase-visual" aria-hidden="true">
              <IllustrationEquipment />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="landing-cta" aria-labelledby="cta-title">
        <div className="container--sm">
          <div className="cta-card">
            <div className="cta-card-content">
              <h2 className="cta-headline" id="cta-title">
                Open your fridge.<br />Start cooking.
              </h2>
              <p className="cta-sub">
                No sign-up. No subscription. Just tell COOKAI what you
                have and get practical recipes in seconds.
              </p>
              <div className="cta-actions">
                <button
                  type="button"
                  className="btn-on-dark"
                  onClick={onGetStarted}
                >
                  Get started — it's free
                  <IconArrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="landing-footer" role="contentinfo">
        <div className="footer-inner">
          <span className="footer-copy">
            © {new Date().getFullYear()} COOKAI. Cook smarter, not harder.
          </span>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: 'var(--sp-4)' }}>
            <Link to="/recipes" className="footer-copy" style={{ textDecoration: 'none' }}>Recipes</Link>
            <Link to="/about"   className="footer-copy" style={{ textDecoration: 'none' }}>About</Link>
          </nav>
        </div>
      </footer>

    </div>
  );
}
