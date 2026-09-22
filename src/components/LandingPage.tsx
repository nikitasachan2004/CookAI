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

/* ─── Image URLs for landing page visuals ── */
const IMAGES = {
  ingredients: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80&auto=format',
  recipe: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80&auto=format',
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format',
};

function ImageCard({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.2)',
        position: 'relative',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
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
              Built by a frustrated home cook
            </div>

            <h1 className="hero-headline">
              Stop staring at your fridge hoping a meal <em>appears</em>
            </h1>

            <p className="hero-subline">
              I built CookAI for one simple reason: I was tired of staring at a fridge full of random ingredients and ending up ordering takeout. Tell it what you actually have in your kitchen, and it’ll instantly find a recipe you can cook right now. No grocery runs. No more food waste.
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
              How it actually works (no magic, just math)
            </h2>
            <p className="section-subheading">
              I didn't want another app that gives me a recipe for a 5-course meal when all I have is pasta and cheese. Just tell the app what you have, and it handles the rest.
            </p>
          </div>

          <div className="how-steps">

            <article className="how-step">
              <div className="how-step-number" aria-hidden="true">1</div>
              <div>
                <div className="how-step-icon" aria-hidden="true">👤</div>
                <h3 className="how-step-title">Tell us your goal & gear</h3>
                <p className="how-step-desc">
                  Just want a quick high-protein meal? Only have a microwave and a pan? Let the app know so it stops suggesting 3-hour oven roasts.
                </p>
              </div>
            </article>

            <article className="how-step">
              <div className="how-step-number" aria-hidden="true">2</div>
              <div>
                <div className="how-step-icon" aria-hidden="true">🥦</div>
                <h3 className="how-step-title">Dump your fridge contents</h3>
                <p className="how-step-desc">
                  Just tap or type whatever you've got. Got half an onion, two eggs, and some rice? Add it all in. Don't overthink it.
                </p>
              </div>
            </article>

            <article className="how-step">
              <div className="how-step-number" aria-hidden="true">3</div>
              <div>
                <div className="how-step-icon" aria-hidden="true">🍽️</div>
                <h3 className="how-step-title">Get a recipe you can actually cook</h3>
                <p className="how-step-desc">
                  The engine instantly scores recipes based on what you have. No "missing ingredient" surprises halfway through cooking.
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
              <p className="section-label">Keep it simple</p>
              <div className="section-divider" />
              <h2 className="section-heading">
                Don't overthink it, just tell it what's there
              </h2>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-6)' }}>
                Pick from the list or just type whatever is sitting on your counter. Even if you just have eggs, rice, and soy sauce, there's a meal in there somewhere.
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
              <ImageCard src={IMAGES.ingredients} alt="Fresh cooking ingredients" />
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
              <ImageCard src={IMAGES.recipe} alt="Delicious pasta recipe" />
            </div>

            <div className="showcase-content">
              <p className="section-label">No BS matching</p>
              <div className="section-divider" />
              <h2 className="section-heading">
                Honest rankings, not a random list
              </h2>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-6)' }}>
                I hated when apps said "You have a match!" but I was missing the main ingredient. This app scores every recipe honestly so you always know where you stand.
              </p>

              <div style={{ display: 'grid', gap: 'var(--sp-3)', maxWidth: 380 }}>
                {[
                  { badge: 'Exact match', desc: 'You have every single thing. Go cook it right now.' },
                  { badge: 'Near match',  desc: 'You\'re missing a minor ingredient. Usually easy to skip or swap out.' },
                  { badge: 'Low match',   desc: 'You barely have the stuff for this, but hey, maybe you want to go to the store anyway.' },
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
            <p className="section-label">Why I built this</p>
            <div className="section-divider" />
            <h2 className="section-heading" id="features-title">
              Designed for real people in real kitchens
            </h2>
            <p className="section-subheading">
              No $10/month subscriptions, no ads, no life story before the recipe. Just a tool that solves the "what's for dinner" problem.
            </p>
          </div>

          <div className="feature-grid">

            <article className="feature-card feature-card--accent">
              <div className="feature-icon-wrap" aria-hidden="true">🎯</div>
              <h3 className="feature-title">Goal-aware matching</h3>
              <p className="feature-desc">
                Trying to eat healthy? Only want high-protein? The app actually respects your diet goals instead of ignoring them.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">🔧</div>
              <h3 className="feature-title">Equipment-aware filtering</h3>
              <p className="feature-desc">
                If you only have a stove and a single pan, the app won't tell you to use a blender. It's that simple.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon-wrap" aria-hidden="true">⚡</div>
              <h3 className="feature-title">Instant, no fluff</h3>
              <p className="feature-desc">
                I hate waiting for slow AI bots to type out a recipe. This uses a curated database and lightning-fast math to match you instantly.
              </p>
            </article>

            <article className="feature-card feature-card--accent">
              <div className="feature-icon-wrap" aria-hidden="true">📋</div>
              <h3 className="feature-title">Straight to the point</h3>
              <p className="feature-desc">
                No 5-page blogs about my grandmother's summer in Italy. Just the ingredients, the steps, and some practical tips.
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
                Works even if your kitchen is just a microwave
              </h2>
              <p className="section-subheading section-subheading--on-dark" style={{ marginBottom: 'var(--sp-7)' }}>
                I've lived in apartments where a hot plate was my only stove. Just check off what you actually own, and the app filters out everything else so you're not left frustrated.
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
              <ImageCard
                src={IMAGES.kitchen}
                alt="Modern kitchen equipment"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.15)' }}
              />
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
                Open your fridge.<br />Let's make dinner.
              </h2>
              <p className="cta-sub">
                No sign-ups required. Just type what you have and find out what you're eating tonight.
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
