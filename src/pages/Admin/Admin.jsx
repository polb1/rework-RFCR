import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { getStoredToken, setStoredToken, parseJwt, isExpired, renderGoogleButton, signOut } from '../../lib/auth.js';
import NewsEditor from './editors/NewsEditor.jsx';
import PlayersEditor from './editors/PlayersEditor.jsx';
import ProductsEditor from './editors/ProductsEditor.jsx';
import SponsorsEditor from './editors/SponsorsEditor.jsx';
import BoardEditor from './editors/BoardEditor.jsx';
import HistoryEditor from './editors/HistoryEditor.jsx';
import GenericJsonEditor from './editors/GenericJsonEditor.jsx';
import styles from './Admin.module.css';

const ALLOWED_EMAILS = (import.meta.env.VITE_ADMIN_EMAIL || 'polboleda021@gmail.com')
  .split(',').map(e => e.trim().toLowerCase());

function isAllowed(claims) {
  return !!claims?.email && ALLOWED_EMAILS.includes(claims.email.toLowerCase());
}

function AuthGate({ onAuth, error }) {
  const btnRef = useRef(null);
  useEffect(() => {
    if (btnRef.current) renderGoogleButton(btnRef.current, onAuth);
  }, [onAuth]);

  return (
    <div className={styles.gate}>
      <div className={styles.gateBox}>
        <img src="/assets/badges/rfcr.webp" alt="" width="72" height="72" />
        <h1>Panell d'administració</h1>
        <p>Accés restringit. Inicia sessió amb el compte autoritzat.</p>
        <div ref={btnRef} />
        {error && <p className={styles.gateError}>{error}</p>}
        <Link to="/" className={styles.gateLink}>← Torna a la web</Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => {
    const t = getStoredToken();
    if (!t || isExpired(t)) return null;
    if (!isAllowed(parseJwt(t))) { setStoredToken(null); return null; }
    return t;
  });

  const claims = token ? parseJwt(token) : null;

  const handleAuth = (credential) => {
    const c = parseJwt(credential);
    if (!isAllowed(c)) {
      signOut();
      setError(`Compte no autoritzat: ${c?.email || 'desconegut'}`);
      return;
    }
    setError(null);
    setStoredToken(credential);
    setToken(credential);
  };

  const logout = () => {
    signOut();
    setToken(null);
  };

  if (!token) return <AuthGate onAuth={handleAuth} error={error} />;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img src="/assets/badges/rfcr.webp" alt="" width="36" height="36" />
          <div>
            <strong>RFCR Admin</strong>
            <span>{claims?.email}</span>
          </div>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/admin/news"      className={({ isActive }) => isActive ? styles.active : ''}>Notícies</NavLink>
          <NavLink to="/admin/players"   className={({ isActive }) => isActive ? styles.active : ''}>Jugadors</NavLink>
          <NavLink to="/admin/products"  className={({ isActive }) => isActive ? styles.active : ''}>Productes</NavLink>
          <NavLink to="/admin/sponsors"  className={({ isActive }) => isActive ? styles.active : ''}>Patrocinadors</NavLink>
          <NavLink to="/admin/matches"   className={({ isActive }) => isActive ? styles.active : ''}>Partits</NavLink>
          <NavLink to="/admin/standings" className={({ isActive }) => isActive ? styles.active : ''}>Classificació</NavLink>
          <NavLink to="/admin/board"     className={({ isActive }) => isActive ? styles.active : ''}>Directiva</NavLink>
          <NavLink to="/admin/history"   className={({ isActive }) => isActive ? styles.active : ''}>Història</NavLink>
        </nav>
        <div className={styles.foot}>
          <Link to="/">↗ Veure web</Link>
          <button onClick={logout}>Tancar sessió</button>
        </div>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/news" replace />} />
          <Route path="/news" element={<NewsEditor token={token} />} />
          <Route path="/players" element={<PlayersEditor token={token} />} />
          <Route path="/products" element={<ProductsEditor token={token} />} />
          <Route path="/sponsors" element={<SponsorsEditor token={token} />} />
          <Route path="/matches" element={<GenericJsonEditor token={token} file="matches.json" title="Partits" />} />
          <Route path="/standings" element={<GenericJsonEditor token={token} file="standings.json" title="Classificació" />} />
          <Route path="/board" element={<BoardEditor token={token} />} />
          <Route path="/history" element={<HistoryEditor token={token} />} />
          <Route path="*" element={<Navigate to="/admin/news" replace />} />
        </Routes>
      </main>
    </div>
  );
}
