import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import logo from '../assets/taniplus-logo.png';
import texture from '../assets/auth-texture.jpg';
import { Checkbox } from './Checkbox';
import { TextField } from './TextField';

export interface SignupDraft { phone: string; email: string; password: string; name: string; location: string }

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <section className="auth-screen auth-flow" style={{ '--texture': `url(${texture})` } as React.CSSProperties}>
      <header className="auth-hero">
        <img src={logo} alt="TaniPlus" />
      </header>
      <div className="auth-sheet">{children}</div>
    </section>
  );
}

function AuthTabs({ active, onLogin, onRegister }: { active: 'login' | 'register'; onLogin: () => void; onRegister: () => void }) {
  return <div className="auth-tabs" role="tablist" aria-label="Akun"><button className={active === 'login' ? 'active' : ''} onClick={onLogin} role="tab" aria-selected={active === 'login'}>Masuk</button><button className={active === 'register' ? 'active' : ''} onClick={onRegister} role="tab" aria-selected={active === 'register'}>Daftar</button></div>;
}

export function Login({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [remember, setRemember] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onLogin(); };
  return <AuthShell><AuthTabs active="login" onLogin={onLogin} onRegister={onRegister} /><form className="auth-form" onSubmit={submit}><TextField label="Nomor Telepon *" placeholder="08123xxxxx" type="tel" inputMode="tel" pattern="[0-9+ -]{8,15}" required /><TextField label="Email" placeholder="abcd@gmail.com" type="email" autoComplete="email" /><TextField label="Password" placeholder="Masukkan password" type="password" minLength={6} autoComplete="current-password" required /><div className="form-options"><Checkbox checked={remember} onChange={setRemember} label="Ingat saya" /><button type="button" className="text-button">Lupa password?</button></div><button className="primary-button" type="submit">Masuk</button></form></AuthShell>;
}

interface RegisterProps { draft: SignupDraft; onDraftChange: (draft: SignupDraft) => void; onLogin: () => void; onNext: () => void }
export function Register({ draft, onDraftChange, onLogin, onNext }: RegisterProps) {
  const update = (field: keyof SignupDraft, value: string) => onDraftChange({ ...draft, [field]: value });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onNext(); };
  return <AuthShell><AuthTabs active="register" onLogin={onLogin} onRegister={() => undefined} /><form className="auth-form register-form" onSubmit={submit}><TextField label="Nomor Telepon *" value={draft.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08123xxxxx" type="tel" inputMode="tel" pattern="[0-9+ -]{8,15}" required /><button className="primary-button" type="submit">Kirim Kode Verifikasi</button></form></AuthShell>;
}

export function Verification({ onNext }: { onBack: () => void; onNext: () => void }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(30);
  const [status, setStatus] = useState('');
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => { if (seconds <= 0) return; const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  const setDigit = (index: number, raw: string) => {
    const numeric = raw.replace(/\D/g, '');
    if (numeric.length > 1) {
      const incoming = numeric.slice(0, 4 - index).split('');
      setDigits((current) => current.map((digit, position) => incoming[position - index] ?? digit));
      refs.current[Math.min(index + incoming.length, 4) - 1]?.focus();
      return;
    }
    const value = numeric.slice(-1);
    setDigits((current) => current.map((digit, position) => position === index ? value : digit));
    if (value && index < 3) refs.current[index + 1]?.focus();
  };
  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus(); if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus(); if (event.key === 'ArrowRight' && index < 3) refs.current[index + 1]?.focus(); };
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => { const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4); if (!pasted) return; event.preventDefault(); const next = Array.from({ length: 4 }, (_, index) => pasted[index] ?? ''); setDigits(next); refs.current[Math.min(pasted.length, 4) - 1]?.focus(); };
  const resend = () => { setDigits(['', '', '', '']); setSeconds(30); setStatus('Kode baru telah dikirim'); refs.current[0]?.focus(); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (digits.every((digit) => /^\d$/.test(digit))) onNext(); };
  return <AuthShell><form className="flow-form verification-form" onSubmit={submit}><h1>Cek SMS yang terkirim</h1><div className="otp-grid">{digits.map((digit, index) => <input key={index} ref={(node) => { refs.current[index] = node; }} value={digit} onChange={(e) => setDigit(index, e.target.value)} onKeyDown={(e) => onKeyDown(index, e)} onPaste={onPaste} inputMode="numeric" pattern="[0-9]*" maxLength={1} autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`Digit kode ${index + 1}`} />)}</div><div className="resend-row"><span>Tidak menerima kode?</span><button type="button" onClick={resend} disabled={seconds > 0}>{seconds > 0 ? `Kirim ulang (${seconds})` : 'Kirim ulang'}</button></div><button className="primary-button" type="submit" disabled={!digits.every(Boolean)}>Masuk</button><span className="sr-only" aria-live="polite">{status}</span></form></AuthShell>;
}

interface ProfileProps { draft: SignupDraft; onDraftChange: (draft: SignupDraft) => void; onBack: () => void; onComplete: () => void }
export function ProfileForm({ draft, onDraftChange, onComplete }: ProfileProps) {
  const update = (field: keyof SignupDraft, value: string) => onDraftChange({ ...draft, [field]: value });
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const clean = { ...draft, name: draft.name.trim(), location: draft.location.trim(), email: draft.email.trim() }; if (clean.name.length >= 2 && clean.location.length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) { onDraftChange(clean); onComplete(); } };
  return <AuthShell><form className="flow-form profile-flow" onSubmit={submit}><h1>Lengkapi profil</h1><div className="profile-fields"><TextField label="Nama" value={draft.name} onChange={(e) => update('name', e.target.value)} placeholder="Ayubi Fathan" autoComplete="name" minLength={2} required /><TextField label="Lokasi" value={draft.location} onChange={(e) => update('location', e.target.value)} placeholder="Provinsi, Daerah" minLength={3} required /><TextField label="Email" value={draft.email} onChange={(e) => update('email', e.target.value)} placeholder="abcd@gmail.com" type="email" autoComplete="email" required /></div><button className="primary-button" type="submit">Simpan</button></form></AuthShell>;
}
