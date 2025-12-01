import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../api';
import { setToken } from '../auth';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import LoginSignupHeader from '../components/LoginSignupHeader';

const tabs = [
  { key: 'login', label: 'Login' },
  { key: 'signup', label: 'Signup' }
];

function AuthPage({ initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [token, setTokenState] = useState('');

  const [signupForm, setSignupForm] = useState({ username: '', email: '', password: '' });
  const [signupMsg, setSignupMsg] = useState('');
  const [signupErr, setSignupErr] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const currentHeader = useMemo(() => {
    if (tab === 'signup') {
      return {
        eyebrow: 'Signup',
        title: 'Create an account',
        description: 'Register with a username, email, and a password (min 6 chars).',
        accentClass: 'text-rose-300'
      };
    }
    return {
      eyebrow: 'Login',
      title: 'Welcome back',
      description: 'Use your email or username with your password.',
      accentClass: 'text-sky-300'
    };
  }, [tab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginErr('');
    setLoginMsg('');
    setTokenState('');

    const payload = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };

    try {
      const data = await login(payload);
      setLoginMsg(data.message || 'Login successful.');
      if (data.jwt_token) {
        setToken(data.jwt_token);
        setTokenState(data.jwt_token);
        navigate('/employees', { replace: true });
      }
    } catch (err) {
      setLoginErr(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSignupErr('');
    setSignupMsg('');
    try {
      const data = await signup(signupForm);
      setSignupMsg(data.message || 'Signup successful.');
      setSignupForm({ username: '', email: '', password: '' });
      setTab('login');
    } catch (err) {
      setSignupErr(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-1 items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <Card className={tab === 'signup' ? 'shadow-glow shadow-rose-500/10' : 'shadow-glow shadow-sky-500/10'}>
          <LoginSignupHeader
            {...currentHeader}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
          />

          <CardContent className="pb-10 flex flex-col items-center max-h-[540px] ">
            {tab === 'login' ? (
              <form className="w-full max-w-md grid gap-4" style={{ maxHeight: '520px' }} onSubmit={handleLogin}>
                <Label>
                  <span>Email or username</span>
                  <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </Label>

                <Label>
                  <span>Password</span>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </Label>

                <Button variant="primary" type="submit" className="mt-1" disabled={loading}>
                  {loading ? 'Signing in…' : 'Login'}
                </Button>

                {loginMsg && <div className="rounded-xl border border-emerald-300/50 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100">{loginMsg}</div>}
                {token && (
                  <div className="space-y-1 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-300">JWT token</p>
                    <code className="block break-all text-xs text-sky-200">{token}</code>
                  </div>
                )}
                {loginErr && <div className="rounded-xl border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100">{loginErr}</div>}
              </form>
            ) : (
              <form className="w-full max-w-md grid gap-4" style={{ maxHeight: '520px' }} onSubmit={handleSignup}>
                <Label>
                  <span>Username</span>
                  <Input
                    name="username"
                    type="text"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="yourname"
                    required
                  />
                </Label>

                <Label>
                  <span>Email</span>
                  <Input
                    name="email"
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="you@example.com"
                    required
                  />
                </Label>

                <Label>
                  <span>Password</span>
                  <Input
                    name="password"
                    type="password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </Label>

                <Button variant="danger" type="submit" className="mt-1" disabled={loading}>
                  {loading ? 'Creating…' : 'Create account'}
                </Button>

                {signupMsg && <div className="rounded-xl border border-emerald-300/50 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100">{signupMsg}</div>}
                {signupErr && <div className="rounded-xl border border-rose-300/60 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100">{signupErr}</div>}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AuthPage;
