import { useState, useCallback, useEffect, useRef, Suspense, lazy } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import type { Profile } from './types';

const LandingPage = lazy(() => import('./components/LandingPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const RecipesBrowsePage = lazy(() => import('./components/RecipesBrowsePage'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const IngredientInput = lazy(() => import('./components/IngredientInput'));
const RecipeResults = lazy(() => import('./components/RecipeResults'));
const RecipeDetail = lazy(() => import('./components/RecipeDetail'));

const SignupEmail = lazy(() => import('./components/AuthScreens').then(module => ({ default: module.SignupEmail })));
const VerifyOtp = lazy(() => import('./components/AuthScreens').then(module => ({ default: module.VerifyOtp })));
const SetPassword = lazy(() => import('./components/AuthScreens').then(module => ({ default: module.SetPassword })));
const Login = lazy(() => import('./components/AuthScreens').then(module => ({ default: module.Login })));
const ChatBot = lazy(() => import('./components/ChatBot').then(module => ({ default: module.ChatBot })));
import { ManualModal } from './components/ManualModal';

import { checkAuth, logout } from './api';
import { Scale, Leaf, Target, BicepsFlexed } from 'lucide-react';

export type AppScreen = 'onboarding' | 'ingredients' | 'results' | 'detail' | 'signup-email' | 'verify-otp' | 'set-password' | 'login';

const GOAL_ICONS: Record<string, any> = {
  balanced:       Scale,
  healthy:        Leaf,
  'weight-loss':  Target,
  'high-protein': BicepsFlexed,
};

const GOAL_LABELS: Record<string, string> = {
  balanced:       'Balanced',
  healthy:        'Healthy',
  'weight-loss':  'Weight loss',
  'high-protein': 'High protein',
};

/* ─── Brand mark ────────────────────────────────────────────── */
function BrandMark() {
  return (
    <img
      src="/logo.png"
      alt="CookAI Logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  );
}

/* ─── In-app step breadcrumb ────────────────────────────────── */
function AppProgress({ screen }: { screen: AppScreen }) {
  const steps: { key: AppScreen; label: string }[] = [
    { key: 'onboarding',  label: 'Profile' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'results',     label: 'Results' },
    { key: 'detail',      label: 'Recipe' },
  ];
  const activeIdx = steps.findIndex((s) => s.key === screen);
  if (activeIdx === -1) return null;
  return (
    <nav className="app-progress" aria-label="App progress">
      {steps.map((step, idx) => (
        <span
          key={step.key}
          className={[
            'app-progress-step',
            idx === activeIdx ? 'is-active' : '',
            idx < activeIdx  ? 'is-done'   : '',
          ].filter(Boolean).join(' ')}
          aria-current={idx === activeIdx ? 'step' : undefined}
        >
          {step.label}
          {idx < steps.length - 1 && <span className="app-progress-sep" aria-hidden="true" />}
        </span>
      ))}
    </nav>
  );
}

/* ─── Global header ─────────────────────────────────────────── */
function GlobalHeader({
  profile,
  appScreen,
  onEditProfile,
  onGoHome,
  user,
  authLoaded,
  onOpenManual,
}: {
  profile: Profile | null;
  appScreen: AppScreen | null;
  onEditProfile: () => void;
  onGoHome: () => void;
  user: any;
  authLoaded?: boolean;
  onOpenManual: () => void;
}) {
  const location = useLocation();
  const isAppRoute = location.pathname === '/app';
  const isLanding  = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click and Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`app-header${isAppRoute ? ' app-header--app' : ''}${isLanding ? ' app-header--landing' : ''}`}>
      <div className="header-liquid-pill" ref={pillRef}>
        <div className="header-liquid-glass" />
        <div className="header-inner">
          <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <button type="button" onClick={onGoHome} className="brand-button" aria-label="COOKAI — go to home">
              <span className="brand-mark" aria-hidden="true"><BrandMark /></span>COOKAI
            </button>
            <nav className="header-nav desktop-only" aria-label="Site navigation">
              <Link to="/" className={`nav-link${location.pathname === '/' ? ' nav-link--active' : ''}`}>Home</Link>
              <Link to="/recipes" className={`nav-link${location.pathname === '/recipes' ? ' nav-link--active' : ''}`}>Recipes</Link>
              <Link to="/about" className={`nav-link${location.pathname === '/about' ? ' nav-link--active' : ''}`}>About</Link>
              <button type="button" onClick={onOpenManual} className="nav-link nav-link--button">Manual</button>
            </nav>
          </div>

          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!isAppRoute && isLanding && (
              <Link to="/app" className="primary-button" style={{ padding: '9px 22px', minHeight: 40, fontSize: 'var(--text-sm)' }}>
                Get started
              </Link>
            )}

            {isAppRoute && appScreen && (
              <>
                <AppProgress screen={appScreen} />
                {profile && (
                  <>
                    <span className="profile-pill">
                      <span className="profile-pill-dot" aria-hidden="true" />
                      {profile.name} &nbsp;·&nbsp;
                      {(() => {
                        const Icon = GOAL_ICONS[profile.goal] || Target;
                        return <span aria-hidden="true"><Icon size={16} /></span>;
                      })()} {GOAL_LABELS[profile.goal] ?? profile.goal}
                    </span>
                    <button type="button" onClick={onEditProfile} className="ghost-button">Edit profile</button>
                  </>
                )}
              </>
            )}

            {!authLoaded ? (
              <Link to="/app?action=login" className="ghost-button desktop-only">Log in</Link>
            ) : user ? (
              <div className="user-menu desktop-only">
                <button type="button" className="avatar-btn" aria-label="User menu">
                  {user.email[0].toUpperCase()}
                </button>
                <div className="dropdown-menu">
                  <div className="dropdown-email">{user.email}</div>
                  <button type="button" onClick={async () => { await logout(); window.location.reload(); }} className="dropdown-btn text-danger">Log out</button>
                </div>
              </div>
            ) : (
              <Link to="/app?action=login" className="ghost-button desktop-only">Log in</Link>
            )}

            <button 
              type="button" 
              className="mobile-menu-btn mobile-only" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-overlay"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown inside header-liquid-pill */}
        <div id="mobile-nav-overlay" className={`mobile-menu-overlay ${mobileMenuOpen ? 'is-open' : ''}`}>
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link${location.pathname === '/' ? ' nav-link--active' : ''}`}>Home</Link>
            <Link to="/recipes" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link${location.pathname === '/recipes' ? ' nav-link--active' : ''}`}>Recipes</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`mobile-nav-link${location.pathname === '/about' ? ' nav-link--active' : ''}`}>About</Link>
            <button type="button" onClick={() => { onOpenManual(); setMobileMenuOpen(false); }} className="mobile-nav-link" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', font: 'inherit' }}>Manual</button>
            {isAppRoute && profile && (
              <button type="button" onClick={() => { onEditProfile(); setMobileMenuOpen(false); }} className="mobile-nav-link" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', font: 'inherit' }}>Edit profile ({profile.name})</button>
            )}
            <hr className="mobile-nav-divider" />
            {!authLoaded ? null : user ? (
              <>
                <div className="mobile-nav-user">{user.email}</div>
                <button type="button" onClick={async () => { setMobileMenuOpen(false); await logout(); window.location.reload(); }} className="mobile-nav-link text-danger" style={{ textAlign: 'left' }}>Log out</button>
              </>
            ) : (
              <Link to="/app?action=login" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">Log in</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ─── In-app flow ── */
function AppFlow({ profile: initialProfile, onProfileChange }: { profile: Profile | null; onProfileChange: (profile: Profile) => void }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [screen, setScreen]               = useState<AppScreen>('onboarding');
  const [profile, setProfile]             = useState<Profile | null>(initialProfile);
  const [selectedRecipeId, setSelectedId] = useState<string | null>(null);
  const [ingredients, setIngredients]     = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cookai_ingredients');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  
  const [signupEmailState, setSignupEmailState] = useState('');
  const [setupTokenState, setSetupTokenState] = useState('');

  useEffect(() => {
    if (profile && screen === 'onboarding') setScreen('ingredients');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('edit') === '1') setScreen('onboarding');
    else if (params.get('action') === 'login') setScreen('login');
    else if (params.get('action') === 'signup') setScreen('signup-email');
  }, [location.search]);

  const handleProfileSave = useCallback((p: Profile) => {
    setProfile(p);
    onProfileChange(p);
    localStorage.setItem('cookai_profile', JSON.stringify(p));
    navigate('/app', { replace: true });
    setScreen('ingredients');
  }, [navigate, onProfileChange]);

  const handleBack = useCallback(() => {
    if (screen === 'detail')       setScreen('results');
    else if (screen === 'results') setScreen('ingredients');
    else if (screen === 'ingredients') setScreen('onboarding');
    else if (['signup-email', 'login', 'verify-otp', 'set-password'].includes(screen)) setScreen(profile ? 'ingredients' : 'onboarding');
    else navigate('/');
  }, [screen, navigate, profile]);

  return (
    <>
      <div className="main-panel">
        <Suspense fallback={<div className="loading-spinner" />}>
          {screen === 'onboarding' && (
            <Onboarding initialProfile={profile ?? undefined} onSave={handleProfileSave} onBack={profile ? handleBack : undefined} />
          )}
          {screen === 'ingredients' && profile && (
            <IngredientInput profile={profile} initialIngredients={ingredients} onSearch={list => { setIngredients(list); setScreen('results'); }} />
          )}
          {screen === 'results' && profile && (
            <RecipeResults ingredients={ingredients} profile={profile} onSelectRecipe={id => { setSelectedId(id); setScreen('detail'); }} onBack={handleBack} onNewSearch={() => setScreen('ingredients')} />
          )}
          {screen === 'detail' && selectedRecipeId && (
            <RecipeDetail recipeId={selectedRecipeId} onBack={handleBack} />
          )}
          
          {screen === 'signup-email' && <SignupEmail onSuccess={() => { window.location.href = '/app'; }} onLoginClick={() => setScreen('login')} />}
          {screen === 'verify-otp' && <VerifyOtp email={signupEmailState} onNext={(token) => { setSetupTokenState(token); setScreen('set-password'); }} />}
          {screen === 'set-password' && <SetPassword email={signupEmailState} setupToken={setupTokenState} onSuccess={() => { window.location.href = '/app'; }} />}
          {screen === 'login' && <Login onSuccess={() => { window.location.href = '/app'; }} onSignupClick={() => setScreen('signup-email')} />}
        </Suspense>
      </div>
      <input type="hidden" id="__app_screen" value={screen} />
    </>
  );
}

function RecipeDetailRoute() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  return (
    <div className="main-panel">
      <RecipeDetail recipeId={recipeId ?? ''} onBack={() => navigate('/recipes')} />
    </div>
  );
}

/* ─── Root App ──────────────────────────────────────────────── */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('cookai_profile');
      return saved ? (JSON.parse(saved) as Profile) : null;
    } catch { return null; }
  });

  const [appScreen, setAppScreen] = useState<AppScreen | null>(null);
  const [authState, setAuthState] = useState<{ loaded: boolean, user: any }>({ loaded: false, user: null });
  const [isManualOpen, setIsManualOpen] = useState(false);

  useEffect(() => {
    checkAuth().then(res => {
      setAuthState({ loaded: true, user: res });
    }).catch(() => {
      setAuthState({ loaded: true, user: null });
    });
  }, []);

  useEffect(() => {
    if (location.pathname !== '/app') { setAppScreen(null); return; }
    const el = document.getElementById('__app_screen') as HTMLInputElement | null;
    if (el) setAppScreen(el.value as AppScreen);
    const id = setInterval(() => {
      const el2 = document.getElementById('__app_screen') as HTMLInputElement | null;
      if (el2) setAppScreen(el2.value as AppScreen);
    }, 120);
    return () => clearInterval(id);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <GlobalHeader profile={profile} appScreen={appScreen} onEditProfile={() => navigate('/app?edit=1')} onGoHome={() => navigate(location.pathname === '/app' && !profile ? '/' : profile ? '/app' : '/')} user={authState.user} authLoaded={authState.loaded} onOpenManual={() => setIsManualOpen(true)} />
      <main id="main-content">
        <Suspense fallback={<div className="loading-spinner" />}>
          <Routes>
            <Route path="/" element={<LandingPage onGetStarted={() => navigate('/app')} />} />
            <Route path="/about" element={<AboutPage onGetStarted={() => navigate('/app')} />} />
            <Route path="/recipes" element={<RecipesBrowsePage onGetStarted={() => navigate('/app')} />} />
            <Route path="/recipes/:recipeId" element={<RecipeDetailRoute />} />
            <Route path="/app" element={<AppFlow profile={profile} onProfileChange={setProfile} />} />
            <Route path="*" element={<LandingPage onGetStarted={() => navigate('/app')} />} />
          </Routes>
        </Suspense>
      </main>
      <ManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>
    </div>
  );
}

