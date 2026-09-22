import { Link } from 'react-router-dom';

type Props = {
  onGetStarted: () => void;
};

/* ─── Image URLs for about page visuals ── */
const ABOUT_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80&auto=format',
  mission: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format',
  values: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80&auto=format',
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

/* ─── Stat counter card ─────────────────────────────────────── */
function StatCard({ number, label, emoji }: { number: string; label: string; emoji: string }) {
  return (
    <div className="about-stat-card">
      <span className="about-stat-emoji" aria-hidden="true">{emoji}</span>
      <span className="about-stat-number">{number}</span>
      <span className="about-stat-label">{label}</span>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────── */
export default function AboutPage({ onGetStarted }: Props) {
  return (
    <div className="screen-enter">

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <section className="about-hero" aria-label="About COOKAI">
        <div className="about-hero-inner container">
          <div className="about-hero-content">
            <div className="hero-eyebrow" style={{ marginBottom: 'var(--sp-5)' }}>
              <span className="hero-eyebrow-dot" />
              The Story
            </div>
            <h1 className="about-hero-headline">
              I built COOKAI because I was tired of staring at a full fridge and having "nothing to eat".
            </h1>
            <p className="about-hero-sub">
              Hi, I'm Nikita. Like a lot of people, I hate wasting food, but I also hate running to the grocery store at 7 PM. Every recipe app I tried assumed I had a perfectly stocked pantry. I wanted an app that worked backwards: tell it what you actually have, and it tells you what you can make right now.
            </p>
            <div className="hero-actions" style={{ marginTop: 'var(--sp-7)' }}>
              <button type="button" className="primary-button primary-button--lg" onClick={onGetStarted}>
                Try COOKAI free
              </button>
              <Link to="/recipes" className="secondary-button secondary-button--lg">
                Browse recipes
              </Link>
            </div>
          </div>
          <div className="about-hero-visual" aria-hidden="true">
            <ImageCard src={ABOUT_IMAGES.hero} alt="Fresh food ingredients" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section className="about-stats-bar" aria-label="Key stats">
        <div className="container">
          <div className="about-stats-grid">
            <StatCard number="30+"  label="Curated recipes"      emoji="🍽️" />
            <StatCard number="4"    label="Dietary goals"        emoji="🎯" />
            <StatCard number="6"    label="Equipment types"      emoji="🍳" />
            <StatCard number="0"    label="Sign-ups required"    emoji="🔓" />
            <StatCard number="∞"    label="Ingredient combos"    emoji="🧪" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION SECTION
      ══════════════════════════════════════════ */}
      <section className="landing-section" aria-labelledby="mission-title">
        <div className="container">
          <div className="showcase-split">
            <div className="showcase-content">
              <p className="section-label">Our mission</p>
              <div className="section-divider" />
              <h2 className="section-heading" id="mission-title">
                Cooking shouldn't feel like an impossible puzzle.
              </h2>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-6)' }}>
                We've all been there: you have chicken, rice, and a random bell pepper. You search online, find a great recipe, and then realize it requires oyster sauce, fresh ginger, and sesame oil. You don't have them. So you order takeout. Again.
              </p>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-7)' }}>
                That cycle is exactly why I built the matching engine for COOKAI. It doesn't just give you vague ideas; it strictly scores every recipe against your actual kitchen inventory. Exact matches always come first, so you never have to guess or compromise.
              </p>
              <div className="about-pill-row">
                {['Zero grocery runs', 'No food waste', 'Instant results', 'Any kitchen'].map((pill) => (
                  <span key={pill} className="about-value-pill">{pill}</span>
                ))}
              </div>
            </div>
            <div className="showcase-visual" aria-hidden="true">
              <ImageCard src={ABOUT_IMAGES.mission} alt="Fresh ingredients on cutting board" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT'S BUILT
      ══════════════════════════════════════════ */}
      <section className="landing-section landing-section--alt" aria-labelledby="built-title">
        <div className="container">
          <div className="section-header-block section-header-block--center">
            <p className="section-label">Under the hood</p>
            <div className="section-divider section-divider--center" />
            <h2 className="section-heading" id="built-title">
              No AI hallucinations. Just smart logic.
            </h2>
            <p className="section-subheading" style={{ maxWidth: '52ch', margin: '0 auto' }}>
              As a developer, I didn't want to build another chatbot that spits out hallucinatory recipes that taste terrible. I built a deterministic, math-based scoring engine that respects your actual real-world cooking constraints.
            </p>
          </div>

          <div className="about-tech-grid">
            {[
              {
                icon: '🧮',
                title: 'Weighted match scoring',
                desc: 'Recipes are scored by ingredient overlap percentage. Exact matches (100%) surface first. Near matches show exactly what you\'re missing.',
                accent: 'var(--orange-100)',
                border: 'var(--orange-400)',
              },
              {
                icon: '🔧',
                title: 'Equipment-aware filter',
                desc: 'A recipe that needs an oven you don\'t have is never shown. Equipment constraints are applied before scoring, not after.',
                accent: 'var(--purple-50)',
                border: 'var(--purple-500)',
              },
              {
                icon: '🎯',
                title: 'Goal alignment',
                desc: 'Choose balanced, healthy, weight-loss, or high-protein. Every result is filtered to recipes tagged with your goal.',
                accent: 'var(--green-50)',
                border: 'var(--green-500)',
              },
              {
                icon: '⚡',
                title: 'Fast & Deterministic',
                desc: 'The matching runs instantly in a single fast pass. There is no waiting for a slow AI text-generator to finish typing out a recipe.',
                accent: 'var(--blue-50)',
                border: 'var(--blue-500)',
              },
            ].map((card) => (
              <article
                key={card.title}
                className="about-tech-card"
                style={{ background: card.accent, borderColor: card.border }}
              >
                <div className="about-tech-icon" aria-hidden="true">{card.icon}</div>
                <h3 className="about-tech-title">{card.title}</h3>
                <p className="about-tech-desc">{card.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════ */}
      <section className="landing-section" aria-label="Our values">
        <div className="container">
          <div className="showcase-split showcase-split--reverse">
            <div className="showcase-visual" aria-hidden="true">
              <ImageCard src={ABOUT_IMAGES.values} alt="Chef cooking in kitchen" />
            </div>
            <div className="showcase-content">
              <p className="section-label">What we stand for</p>
              <div className="section-divider" />
              <h2 className="section-heading">
                Things I'll never compromise on
              </h2>
              <div className="about-values-list">
                {[
                  {
                    num: '01',
                    title: 'Honest results',
                    body: 'I will never show you a recipe you can\'t cook and pretend you can. If you\'re missing ingredients, the app tells you clearly instead of hiding it behind a "close enough" tag.',
                  },
                  {
                    num: '02',
                    title: 'No noise',
                    body: 'No annoying pop-up ads, no 10-page life stories before the recipe, and no affiliate links. Just a clean, focused tool that gets you cooking.',
                  },
                  {
                    num: '03',
                    title: 'Real food',
                    body: 'I\'m focusing on real, practical meals. Food that real people can actually make on a busy Tuesday night without needing a culinary degree.',
                  },
                ].map((v) => (
                  <div key={v.num} className="about-value-item">
                    <span className="about-value-num">{v.num}</span>
                    <div>
                      <h3 className="about-value-title">{v.title}</h3>
                      <p className="about-value-body">{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className="landing-cta" aria-labelledby="about-cta-title">
        <div className="container--sm">
          <div className="cta-card">
            <div className="cta-card-content">
              <h2 className="cta-headline" id="about-cta-title">
                Ready to cook smarter?
              </h2>
              <p className="cta-sub">
                Open your fridge, tell COOKAI what's inside, and get
                practical recipes matched to you in seconds.
              </p>
              <div className="cta-actions">
                <button type="button" className="btn-on-dark" onClick={onGetStarted}>
                  Get started — it's free
                </button>
                <Link to="/recipes" className="secondary-button secondary-button--lg">
                  Browse all recipes
                </Link>
              </div>
            </div>
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
