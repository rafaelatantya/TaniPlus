import { useEffect, useRef, useState } from 'react';
import { Login, ProfileForm, Register, Verification, type LoginCredentials, type SignupDraft } from './components/Login';
import { BoxDetails, BoxSettings, createBoxesForUser, Dashboard, ProfileSettings, type BoxData } from './components/Dashboard';
import { authApi, type AuthUser } from './lib/auth';
import { readBoxNames, saveBoxName } from './lib/boxStorage';

export type Route = 'login' | 'register' | 'verify' | 'profile' | 'dashboard' | 'details' | 'box-settings' | 'settings';

function boxesFor(user: AuthUser) {
  const names = readBoxNames(user.id);
  return createBoxesForUser(user.id).map((box) => ({ ...box, name: names[box.id] ?? box.name }));
}

export function App() {
  const [route, setRoute] = useState<Route>('login');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [selectedBox, setSelectedBox] = useState<BoxData | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [signupDraft, setSignupDraft] = useState<SignupDraft>({ phone: '', email: '', password: '', name: '', location: '' });
  const onboardingComplete = useRef(false);

  useEffect(() => {
    authApi.session().then(({ user: activeUser }) => {
      setUser(activeUser); setBoxes(boxesFor(activeUser)); setRoute('dashboard');
      history.replaceState({ route: 'dashboard' }, '');
    }).catch(() => history.replaceState({ route: 'login' }, '')).finally(() => setCheckingSession(false));

    const onPopState = (event: PopStateEvent) => {
      const next = event.state?.route as Route | undefined;
      if (onboardingComplete.current && next && ['register', 'verify', 'profile'].includes(next)) {
        history.replaceState({ route: 'dashboard' }, ''); setRoute('dashboard'); return;
      }
      setRoute(next === 'details' ? 'dashboard' : next ?? 'login');
    };
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: Route, replace = false) => {
    history[replace ? 'replaceState' : 'pushState']({ route: next }, ''); setRoute(next);
  };
  const authenticate = (activeUser: AuthUser) => {
    setUser(activeUser); setBoxes(boxesFor(activeUser)); onboardingComplete.current = true;
    navigate('dashboard', true);
  };
  const login = async (credentials: LoginCredentials) => authenticate((await authApi.login(credentials)).user);
  const register = async (draft: SignupDraft) => authenticate((await authApi.register(draft)).user);
  const logout = async () => { await authApi.logout(); setUser(null); setBoxes([]); setSelectedBox(null); navigate('login', true); };
  const openBox = (box: BoxData) => { setSelectedBox(box); navigate('details'); };
  const renameBox = (name: string) => {
    if (!user || !selectedBox) return;
    saveBoxName(user.id, selectedBox.id, name);
    const updated = { ...selectedBox, name };
    setSelectedBox(updated); setBoxes((current) => current.map((box) => box.id === updated.id ? updated : box));
  };
  const safeOnboardingBack = (next: Route) => navigate(next, true);

  if (checkingSession) return <main className="app-shell" aria-busy="true" />;

  return (
    <main className="app-shell">
      {route === 'login' && <Login onLogin={login} onRegister={() => navigate('register')} />}
      {route === 'register' && <Register draft={signupDraft} onDraftChange={setSignupDraft} onLogin={() => navigate('login', true)} onNext={() => navigate('verify')} />}
      {route === 'verify' && <Verification onBack={() => safeOnboardingBack('register')} onNext={() => navigate('profile')} />}
      {route === 'profile' && <ProfileForm draft={signupDraft} onDraftChange={setSignupDraft} onBack={() => safeOnboardingBack('verify')} onComplete={register} />}
      {route === 'dashboard' && user && <Dashboard boxes={boxes} onOpenBox={openBox} onSettings={() => navigate('settings')} />}
      {route === 'details' && selectedBox && <BoxDetails box={selectedBox} onBack={() => navigate('dashboard', true)} onSettings={() => navigate('box-settings')} />}
      {route === 'box-settings' && selectedBox && <BoxSettings box={selectedBox} onBack={() => navigate('details', true)} onSave={renameBox} />}
      {route === 'settings' && user && <ProfileSettings user={user} onBack={() => navigate('dashboard', true)} onLogout={logout} />}
    </main>
  );
}
