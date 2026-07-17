import { useEffect, useRef, useState } from 'react';
import { Login, ProfileForm, Register, Verification, type SignupDraft } from './components/Login';
import { BoxDetails, BoxSettings, Dashboard, ProfileSettings, type BoxData } from './components/Dashboard';

export type Route = 'login' | 'register' | 'verify' | 'profile' | 'dashboard' | 'details' | 'box-settings' | 'settings';

export function App() {
  const [route, setRoute] = useState<Route>('login');
  const [selectedBox, setSelectedBox] = useState<BoxData | null>(null);
  const [signupDraft, setSignupDraft] = useState<SignupDraft>({ phone: '', email: '', password: '', name: '', location: '' });
  const onboardingComplete = useRef(false);

  useEffect(() => {
    history.replaceState({ route: 'login' }, '');
    const onPopState = (event: PopStateEvent) => {
      const next = event.state?.route as Route | undefined;
      if (onboardingComplete.current && next && ['register', 'verify', 'profile'].includes(next)) {
        history.replaceState({ route: 'dashboard', onboardingComplete: true }, '');
        setRoute('dashboard');
        return;
      }
      setRoute(next === 'details' ? 'dashboard' : next ?? 'login');
    };
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (next: Route, replace = false) => {
    const method = replace ? 'replaceState' : 'pushState';
    history[method]({ route: next }, '');
    setRoute(next);
  };
  const openBox = (box: BoxData) => { setSelectedBox(box); navigate('details'); };
  const finishOnboarding = () => {
    onboardingComplete.current = true;
    history.replaceState({ route: 'dashboard', onboardingComplete: true }, '');
    setRoute('dashboard');
  };
  const safeOnboardingBack = (next: Route) => navigate(next, true);

  return (
    <main className="app-shell">
      {route === 'login' && <Login onLogin={() => navigate('dashboard', true)} onRegister={() => navigate('register')} />}
      {route === 'register' && <Register draft={signupDraft} onDraftChange={setSignupDraft} onLogin={() => navigate('login', true)} onNext={() => navigate('verify')} />}
      {route === 'verify' && <Verification onBack={() => safeOnboardingBack('register')} onNext={() => navigate('profile')} />}
      {route === 'profile' && <ProfileForm draft={signupDraft} onDraftChange={setSignupDraft} onBack={() => safeOnboardingBack('verify')} onComplete={finishOnboarding} />}
      {route === 'dashboard' && <Dashboard onOpenBox={openBox} onSettings={() => navigate('settings')} />}
      {route === 'details' && selectedBox && <BoxDetails box={selectedBox} onBack={() => navigate('dashboard', true)} onSettings={() => navigate('box-settings')} />}
      {route === 'box-settings' && selectedBox && <BoxSettings box={selectedBox} onBack={() => navigate('details', true)} />}
      {route === 'settings' && <ProfileSettings onBack={() => navigate('dashboard', true)} onLogout={() => navigate('login', true)} />}
    </main>
  );
}
