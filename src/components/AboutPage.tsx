import { Link } from 'react-router-dom';

type Props = {
  onGetStarted: () => void;
};

/* ─── Inline SVG illustrations ──────────────────────────────── */

function IllustrationMission() {
  return (
    <svg width="100%" viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Warm background card */}
      <rect x="20" y="20" width="440" height="320" rx="28" fill="#FFF2DD" />

      {/* Big pot centrepiece */}
      <g transform="translate(160, 60)">
        {/* Steam wisps */}
        <path d="M40 0 Q38 -14 42 -26" stroke="#FFB84D" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M60 0 Q58 -18 62 -32" stroke="#FF8A3D" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M80 0 Q82 -14 78 -26" stroke="#FFB84D" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        {/* Pot body */}
        <rect x="10" y="0" width="140" height="110" rx="14" fill="#5a5a6a" />
        <ellipse cx="80" cy="0" rx="70" ry="16" fill="#6a6a7a" />
        <ellipse cx="80" cy="0" rx="56" ry="11" fill="#7a7a8a" />
        {/* Lid */}
        <ellipse cx="80" cy="-6" rx="70" ry="16" fill="#7a7a8a" />
        <ellipse cx="80" cy="-8" rx="56" ry="11" fill="#8a8a9a" />
        <ellipse cx="80" cy="-14" rx="16" ry="7" fill="#9a9aaa" />
        {/* Handles */}
        <rect x="-18" y="40" width="28" height="14" rx="7" fill="#4a4a5a" />
        <rect x="150" y="40" width="28" height="14" rx="7" fill="#4a4a5a" />
        {/* Decorative band */}
        <rect x="10" y="60" width="140" height="4" rx="2" fill="#4a4a5a" opacity="0.4" />
      </g>

      {/* Ingredient orbits */}
      {/* Tomato */}
      <circle cx="110" cy="155" r="26" fill="#EF4444" />
      <ellipse cx="110" cy="130" rx="7" ry="5" fill="#34D399" />
      <ellipse cx="103" cy="149" rx="5" ry="6" fill="#DC2626" opacity="0.35" />

      {/* Lemon */}
      <ellipse cx="370" cy="145" rx="22" ry="18" fill="#FFB84D" />
      <ellipse cx="370" cy="145" rx="15" ry="12" fill="#FFC96B" />

      {/* Broccoli */}
      <circle cx="100" cy="260" r="15" fill="#34D399" />
      <circle cx="115" cy="254" r="13" fill="#6EE7B7" />
      <circle cx="107" cy="246" r="11" fill="#34D399" />
      <rect x="106" y="266" width="5" height="18" rx="2.5" fill="#059669" />

      {/* Pasta nest */}
      <g transform="translate(360, 230)">
        <ellipse cx="0" cy="0" rx="22" ry="28" fill="none" stroke="#FFB84D" strokeWidth="3" />
        <ellipse cx="0" cy="0" rx="13" ry="18" fill="none" stroke="#FFB84D" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="5" ry="8" fill="none" stroke="#FFB84D" strokeWidth="2" />
      </g>

      {/* Garlic */}
      <ellipse cx="245" cy="298" rx="20" ry="17" fill="#FFF7EA" stroke="#EBDDC7" strokeWidth="1.5" />
      <rect x="243" y="280" width="4" height="9" rx="2" fill="#A3C77E" />

      {/* Sparkle dots */}
      <circle cx="60" cy="90" r="5" fill="#FF8A3D" opacity="0.45" />
      <circle cx="420" cy="80" r="4" fill="#8B5CF6" opacity="0.40" />
      <circle cx="410" cy="300" r="6" fill="#FFB84D" opacity="0.50" />
      <circle cx="55" cy="310" r="4" fill="#FF5FA2" opacity="0.40" />
    </svg>
  );
}

function IllustrationTeam() {
  return (
    <svg width="100%" viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Background */}
      <rect x="20" y="20" width="440" height="260" rx="28" fill="#F5F3FF" />

      {/* Three avatar cards */}
      {[
        { x: 60,  gradient: ['#FF8A3D','#FF5FA2'], letter: 'A', role: 'Chef Logic' },
        { x: 185, gradient: ['#8B5CF6','#60A5FA'], letter: 'B', role: 'Taste Engine' },
        { x: 310, gradient: ['#34D399','#60A5FA'], letter: 'C', role: 'Kitchen AI' },
      ].map((av) => (
        <g key={av.letter} transform={`translate(${av.x}, 50)`}>
          {/* Card */}
          <rect x="0" y="0" width="110" height="140" rx="20" fill="white" />
          <rect x="0" y="0" width="110" height="140" rx="20" stroke="#EBDDC7" strokeWidth="1.5" />
          {/* Avatar circle */}
          <defs>
            <linearGradient id={`grad-${av.letter}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={av.gradient[0]} />
              <stop offset="100%" stopColor={av.gradient[1]} />
            </linearGradient>
          </defs>
          <circle cx="55" cy="52" r="30" fill={`url(#grad-${av.letter})`} />
          <text x="55" y="59" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="800" fill="white">{av.letter}</text>
          {/* Role badge */}
          <rect x="10" y="96" width="90" height="22" rx="11" fill="#FFF2DD" />
          <text x="55" y="111" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="700" fill="#FF8A3D">{av.role}</text>
        </g>
      ))}

      {/* Connecting dots */}
      <circle cx="175" cy="120" r="5" fill="#EBDDC7" />
      <circle cx="300" cy="120" r="5" fill="#EBDDC7" />

      {/* Bottom caption */}
      <rect x="150" y="215" width="180" height="26" rx="13" fill="#FFF2DD" />
      <text x="240" y="232" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="#FF8A3D">Built with ❤️ for home cooks</text>
    </svg>
  );
}

function IllustrationValues() {
  return (
    <svg width="100%" viewBox="0 0 480 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="20" width="440" height="240" rx="28" fill="#ECFDF5" />

      {/* Three value icons in a row */}
      {[
        { x: 80,  icon: '🎯', label: 'Zero Waste',     sub: 'Use what you have',    bg: '#FFF2DD', border: '#EBDDC7' },
        { x: 200, icon: '⚡', label: 'Instant Matches', sub: 'Results in seconds',  bg: '#F5F3FF', border: '#C4B5FD' },
        { x: 320, icon: '🌿', label: 'Goal Aware',      sub: 'Eats your way',       bg: '#ECFDF5', border: '#6EE7B7' },
      ].map((v) => (
        <g key={v.label} transform={`translate(${v.x}, 50)`}>
          <rect x="0" y="0" width="120" height="140" rx="20" fill={v.bg} />
          <rect x="0" y="0" width="120" height="140" rx="20" stroke={v.border} strokeWidth="1.5" />
          {/* Icon circle */}
          <rect x="35" y="16" width="50" height="50" rx="14" fill="white" />
          <text x="60" y="49" textAnchor="middle" fontSize="24">{v.icon}</text>
          {/* Label */}
          <text x="60" y="88" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800" fill="#1F172A">{v.label}</text>
          <text x="60" y="104" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" fill="#5B5563">{v.sub}</text>
        </g>
      ))}
    </svg>
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
              Our Story
            </div>
            <h1 className="about-hero-headline">
              We believe great meals shouldn't require a trip to the store
            </h1>
            <p className="about-hero-sub">
              COOKAI started from a simple frustration: too many recipe apps assume
              you already have the perfect pantry. We built something different — a
              tool that works backwards from what you <em>actually</em> have.
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
            <IllustrationMission />
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
                Less food waste. More good food.
              </h2>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-6)' }}>
                The average household throws away nearly a third of the food they buy.
                Most of that waste happens because people don't know what to cook with
                what's already in front of them.
              </p>
              <p className="section-subheading" style={{ marginBottom: 'var(--sp-7)' }}>
                COOKAI's matching engine flips the script. You tell us what you have,
                we rank every recipe by how closely it fits — exact matches first,
                near matches next, so nothing gets wasted and nothing feels like a
                compromise.
              </p>
              <div className="about-pill-row">
                {['Zero grocery runs', 'No food waste', 'Instant results', 'Any kitchen'].map((pill) => (
                  <span key={pill} className="about-value-pill">{pill}</span>
                ))}
              </div>
            </div>
            <div className="showcase-visual" aria-hidden="true">
              <IllustrationMission />
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
              Smart matching, built by hand
            </h2>
            <p className="section-subheading" style={{ maxWidth: '52ch', margin: '0 auto' }}>
              No AI hallucinations. No generated nonsense. Every recipe was crafted
              by a real cook, and every match is scored by a deterministic engine
              that respects your actual constraints.
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
                title: 'Zero latency matching',
                desc: 'The matching runs server-side in a single fast pass. No AI generation time, no streaming, just instant ranked results.',
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
              <IllustrationValues />
            </div>
            <div className="showcase-content">
              <p className="section-label">What we stand for</p>
              <div className="section-divider" />
              <h2 className="section-heading">
                Three things we'll never compromise on
              </h2>
              <div className="about-values-list">
                {[
                  {
                    num: '01',
                    title: 'Honest results',
                    body: 'We never show you a recipe you can\'t cook. If you\'re missing ingredients, we tell you clearly — we don\'t hide it behind a "close enough".',
                  },
                  {
                    num: '02',
                    title: 'No noise',
                    body: 'No ads, no affiliate links, no sponsored recipes. Just a focused tool that does one thing well.',
                  },
                  {
                    num: '03',
                    title: 'Real recipes',
                    body: 'Every recipe was written and tested by a human. Practical quantities, clear steps, and cooking tips that actually help.',
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
          TEAM
      ══════════════════════════════════════════ */}
      <section className="landing-section landing-section--dark" aria-labelledby="team-title">
        <div className="dark-band-decor" aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header-block section-header-block--center">
            <p className="section-label section-label--on-dark">The team</p>
            <div className="section-divider section-divider--center" />
            <h2 className="section-heading section-heading--on-dark" id="team-title">
              Built by people who cook
            </h2>
            <p className="section-subheading section-subheading--on-dark" style={{ maxWidth: '46ch', margin: '0 auto var(--sp-10)' }}>
              We're not a massive startup. We're a small crew who got tired of
              food waste and wanted a smarter kitchen tool.
            </p>
          </div>

          <div className="about-team-grid">
            {[
              { name: 'Alex Chen',     role: 'Matching Engine',  emoji: '🧮', bio: 'Built the ingredient scoring system and equipment filter. Makes fried rice at midnight.', accent: '#FF8A3D' },
              { name: 'Priya Mehta',   role: 'Recipe Curator',   emoji: '👩‍🍳', bio: 'Wrote and tested every recipe. Specialises in pantry cooking and high-protein meals.', accent: '#8B5CF6' },
              { name: 'Jordan Park',   role: 'Product Design',   emoji: '🎨', bio: 'Designed the UI from scratch. Believes cooking apps should feel like a game, not a chore.', accent: '#34D399' },
            ].map((member) => (
              <article key={member.name} className="about-team-card">
                <div className="about-team-avatar" style={{ background: `linear-gradient(145deg, ${member.accent}, ${member.accent}99)` }}>
                  <span aria-hidden="true">{member.emoji}</span>
                </div>
                <h3 className="about-team-name">{member.name}</h3>
                <span className="about-team-role" style={{ color: member.accent }}>{member.role}</span>
                <p className="about-team-bio">{member.bio}</p>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--sp-8)' }} aria-hidden="true">
            <IllustrationTeam />
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
