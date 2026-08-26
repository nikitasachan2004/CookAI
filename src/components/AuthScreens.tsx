import { useState, useEffect } from 'react';
import { signup, verifyOtp, setPassword, login, resendOtp } from '../api';

export function SignupEmail({ onNext, onLoginClick }: { onNext: (email: string) => void, onLoginClick: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(email);
      onNext(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="screen-heading">
          <h1>Create an account</h1>
          <p>Save your profile and recipes across devices.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 24 }}>
          <div className="field">
            <label>Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              className="text-input"
              required 
            />
          </div>
          <button type="submit" className="primary-button full-button" disabled={loading}>
            {loading ? 'Sending...' : 'Continue'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <button type="button" onClick={onLoginClick} className="text-link">Log in</button>
        </p>
      </div>
    </div>
  );
}

export function VerifyOtp({ email, onNext }: { email: string, onNext: (setupToken: string) => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await verifyOtp(email, code);
      onNext(res.setupToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      await resendOtp(email);
      setCooldown(60);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="screen-heading">
          <h1>Check your email</h1>
          <p>We sent a 6-digit code to <strong>{email}</strong>.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 24 }}>
          <div className="field">
            <label>Verification Code</label>
            <input 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              placeholder="000000" 
              className="text-input"
              style={{ textAlign: 'center', letterSpacing: '0.25em', fontSize: '1.25rem' }}
              maxLength={6}
              required 
            />
          </div>
          <button type="submit" className="primary-button full-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        <p className="auth-footer">
          Didn't get it? {cooldown > 0 ? <span style={{ color: 'var(--text-muted)' }}>Wait {cooldown}s</span> : <button type="button" onClick={handleResend} className="text-link" disabled={loading}>Resend</button>}
        </p>
      </div>
    </div>
  );
}

export function SetPassword({ email, setupToken, onSuccess }: { email: string, setupToken: string, onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await setPasswordApi(email, setupToken, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="screen-heading">
          <h1>Set a password</h1>
          <p>Choose a secure password to finalize your account.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 24 }}>
          <div className="field">
            <label>Password (min 8 characters)</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="text-input"
              minLength={8}
              required 
            />
          </div>
          <button type="submit" className="primary-button full-button" disabled={loading}>
            {loading ? 'Saving...' : 'Set Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Rename api function locally to avoid clash
import { setPassword as setPasswordApi } from '../api';

export function Login({ onSuccess, onSignupClick }: { onSuccess: () => void, onSignupClick: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPasswordState] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="screen-heading">
          <h1>Welcome back</h1>
          <p>Log in to access your profile and saved recipes.</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="form-stack" style={{ marginTop: 24 }}>
          <div className="field">
            <label>Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              className="text-input"
              required 
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPasswordState(e.target.value)} 
              placeholder="••••••••" 
              className="text-input"
              required 
            />
          </div>
          <button type="submit" className="primary-button full-button" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <button type="button" onClick={onSignupClick} className="text-link">Sign up</button>
        </p>
      </div>
    </div>
  );
}
