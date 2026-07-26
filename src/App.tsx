import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import type { Profile } from './types';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import RecipesBrowsePage from './components/RecipesBrowsePage';
import Onboarding from './components/Onboarding';
import IngredientInput from './components/IngredientInput';
import RecipeResults from './components/RecipeResults';
import RecipeDetail from './components/RecipeDetail';
import { SignupEmail, VerifyOtp, SetPassword, Login } from './components/AuthScreens';
import { checkAuth, logout } from './api';

export type AppScreen = 'onboarding' | 'ingredients' | 'results' | 'detail' | 'signup-email' | 'verify-otp' | 'set-password' | 'login';

const GOAL_ICONS: Record<string, string> = {
  balanced:       '⚖️',
  healthy:        '🥗',
  'weight-loss':  '🎯',
  'high-protein': '💪',
};

const GOAL_LABELS: Record<string, string> = {
  balanced:       'Balanced',
  healthy:        'Healthy',
  'weight-loss':  'Weight loss',
  'high-protein': 'High protein',
};

/* ─── Brand mark SVG ────────────────────────────────────────── */
function BrandMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 2C9 2 13.5 5 13.5 9C13.5 11.5 11.5 13.5 9 13.5C6.5 13.5 4.5 11.5 4.5 9C4.5 5 9 2 9 2Z" fill="white" fillOpacity="0.95" />
      <path d="M9 13.5L9 16" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.6" />
      <circle cx="9" cy="9" r="2.2" fill="white" fillOpacity="0.35" />
    </svg>
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
}: {
  profile: Profile | null;
  appScreen: AppScreen | null;
  onEditProfile: () => void;
  onGoHome: () => void;
  user: any;
}) {
  const location = useLocation();
  const isAppRoute = location.pathname === '/app';
  const isLanding  = location.pathname === '/';

  return (
    <header className={`app-header${isAppRoute ? ' app-header--app' : ''}`}>
      <div className="header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button type="button" onClick={onGoHome} className="brand-button" aria-label="COOKAI — go to home">
            <span className="brand-mark" aria-hidden="true"><BrandMark /></span>COOKAI
          </button>
          <nav className="header-nav" aria-label="Site navigation">
            <Link to="/" className={`nav-link${location.pathname === '/' ? ' nav-link--active' : ''}`}>Home</Link>
            <Link to="/recipes" className={`nav-link${location.pathname === '/recipes' ? ' nav-link--active' : ''}`}>Recipes</Link>
            <Link to="/about" className={`nav-link${location.pathname === '/about' ? ' nav-link--active' : ''}`}>About</Link>
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
                    <span aria-hidden="true">{GOAL_ICONS[profile.goal]}</span> {GOAL_LABELS[profile.goal] ?? profile.goal}
                  </span>
                  <button type="button" onClick={onEditProfile} className="ghost-button">Edit profile</button>
                </>
              )}
            </>
          )}

          {user ? (
            <button type="button" onClick={async () => { await logout(); window.location.reload(); }} className="ghost-button">Log out ({user.email})</button>
          ) : (
            <Link to="/app?action=login" className="ghost-button">Log in</Link>
          )}
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
  const [ingredients, setIngredients]     = useState<string[]>([]);
  
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
        {screen === 'onboarding' && (
          <Onboarding initialProfile={profile ?? undefined} onSave={handleProfileSave} onBack={profile ? handleBack : undefined} />
        )}
        {screen === 'ingredients' && profile && (
          <IngredientInput profile={profile} onSearch={list => { setIngredients(list); setScreen('results'); }} />
        )}
        {screen === 'results' && profile && (
          <RecipeResults ingredients={ingredients} profile={profile} onSelectRecipe={id => { setSelectedId(id); setScreen('detail'); }} onBack={handleBack} onNewSearch={() => setScreen('ingredients')} />
        )}
        {screen === 'detail' && selectedRecipeId && (
          <RecipeDetail recipeId={selectedRecipeId} onBack={handleBack} />
        )}
        
        {screen === 'signup-email' && <SignupEmail onNext={(email) => { setSignupEmailState(email); setScreen('verify-otp'); }} onLoginClick={() => setScreen('login')} />}
        {screen === 'verify-otp' && <VerifyOtp email={signupEmailState} onNext={(token) => { setSetupTokenState(token); setScreen('set-password'); }} />}
        {screen === 'set-password' && <SetPassword email={signupEmailState} setupToken={setupTokenState} onSuccess={() => { window.location.href = '/app'; }} />}
        {screen === 'login' && <Login onSuccess={() => { window.location.href = '/app'; }} onSignupClick={() => setScreen('signup-email')} />}
      </div>
      <input type="hidden" id="__app_screen" value={screen} />
    </>
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

  if (!authState.loaded) return null;

  return (
    <div className="app-shell">
      <GlobalHeader profile={profile} appScreen={appScreen} onEditProfile={() => navigate('/app?edit=1')} onGoHome={() => navigate(location.pathname === '/app' && !profile ? '/' : profile ? '/app' : '/')} user={authState.user} />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={() => navigate('/app')} />} />
          <Route path="/about" element={<AboutPage onGetStarted={() => navigate('/app')} />} />
          <Route path="/recipes" element={<RecipesBrowsePage onGetStarted={() => navigate('/app')} />} />
          <Route path="/recipes/:recipeId" element={<div className="main-panel"><RecipeDetail recipeId={location.pathname.split('/').pop() ?? ''} onBack={() => navigate('/recipes')} /></div>} />
          <Route path="/app" element={<AppFlow profile={profile} onProfileChange={setProfile} />} />
          <Route path="*" element={<LandingPage onGetStarted={() => navigate('/app')} />} />
        </Routes>
      </main>
    </div>
  );
}
