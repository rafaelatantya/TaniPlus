import type { SignupDraft } from '../components/Login';

export interface AuthUser {
  id: string;
  phone: string;
  email: string;
  name: string;
  location: string;
}

async function request<T>(options?: RequestInit): Promise<T> {
  const response = await fetch('/api/auth', {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error ?? 'Terjadi kesalahan. Silakan coba lagi.');
  return payload;
}

export const authApi = {
  session: () => request<{ user: AuthUser }>(),
  login: (data: { phone: string; email: string; password: string; remember: boolean }) =>
    request<{ user: AuthUser }>({ method: 'POST', body: JSON.stringify({ action: 'login', ...data }) }),
  register: (draft: SignupDraft) =>
    request<{ user: AuthUser }>({ method: 'POST', body: JSON.stringify({ action: 'register', ...draft }) }),
  logout: () => request<{ ok: true }>({ method: 'POST', body: JSON.stringify({ action: 'logout' }) }),
};
