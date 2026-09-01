const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const STORAGE_KEY = 'rfcr_admin_id_token';

export function getStoredToken() {
  try { return sessionStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function setStoredToken(t) {
  try { t ? sessionStorage.setItem(STORAGE_KEY, t) : sessionStorage.removeItem(STORAGE_KEY); } catch {}
}

export function parseJwt(token) {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return null; }
}

export function isExpired(token) {
  const p = parseJwt(token);
  if (!p?.exp) return true;
  return Date.now() / 1000 > p.exp - 30;
}

export function renderGoogleButton(container, onCredential) {
  if (!CLIENT_ID) {
    container.innerHTML = '<p style="color:#EF4444">Falta VITE_GOOGLE_CLIENT_ID a .env.local</p>';
    return;
  }
  const tryInit = () => {
    if (!window.google?.accounts?.id) return setTimeout(tryInit, 100);
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: ({ credential }) => onCredential(credential),
      ux_mode: 'popup',
      auto_select: false,
    });
    window.google.accounts.id.renderButton(container, { theme: 'filled_black', size: 'large', text: 'signin_with', shape: 'rectangular' });
  };
  tryInit();
}

export function signOut() {
  setStoredToken(null);
  try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
}
