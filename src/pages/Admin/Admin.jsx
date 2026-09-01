import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { getStoredToken, setStoredToken, parseJwt, isExpired, renderGoogleButton, signOut } from '../../lib/auth.js';
import NewsEditor from './editors/NewsEditor.jsx';
import PlayersEditor from './editors/PlayersEditor.jsx';
import ProductsEditor from './editors/ProductsEditor.jsx';
import GenericJsonEditor from './editors/GenericJsonEditor.jsx';
import styles from './Admin.module.css';

function AuthGate({ onAuth }) {
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
        <Link to="/" className={styles.gateLink}>← Torna a la web</Link>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => {
    const t = getStoredToken();
    return t && !isExpired(t) ? t : null;
  });

  const claims = token ? parseJwt(token) : null;

  const handleAuth = (credential) => {
    setStoredToken(credential);
    setToken(credential);
  };

  const logout = () => {
    signOut();
    setToken(null);
  };

  if (!token) return <AuthGate onAuth={handleAuth} />;

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
          <NavLink to="news"     className={({ isActive }) => isActive ? styles.active : ''}>Notícies</NavLink>
          <NavLink to="players"  className={({ isActive }) => isActive ? styles.active : ''}>Jugadors</NavLink>
          <NavLink to="products" className={({ isActive }) => isActive ? styles.active : ''}>Productes</NavLink>
          <NavLink to="sponsors" className={({ isActive }) => isActive ? styles.active : ''}>Patrocinadors</NavLink>
          <NavLink to="matches"  className={({ isActive }) => isActive ? styles.active : ''}>Partits</NavLink>
          <NavLink to="standings" className={({ isActive }) => isActive ? styles.active : ''}>Classificació</NavLink>
          <NavLink to="board"    className={({ isActive }) => isActive ? styles.active : ''}>Directiva</NavLink>
          <NavLink to="history"  className={({ isActive }) => isActive ? styles.active : ''}>Història</NavLink>
        </nav>
        <div className={styles.foot}>
          <Link to="/">↗ Veure web</Link>
          <button onClick={logout}>Tancar sessió</button>
        </div>
      </aside>

      <main className={styles.main}>
        <Routes>
          <Route index element={<Navigate to="news" replace />} />
          <Route path="news" element={<NewsEditor token={token} />} />
          <Route path="players" element={<PlayersEditor token={token} />} />
          <Route path="products" element={<ProductsEditor token={token} />} />
          <Route path="sponsors" element={<GenericJsonEditor token={token} file="sponsors.json" title="Patrocinadors" fields={['name','logo','url','tier']} />} />
          <Route path="matches" element={<GenericJsonEditor token={token} file="matches.json" title="Partits" />} />
          <Route path="standings" element={<GenericJsonEditor token={token} file="standings.json" title="Classificació" />} />
          <Route path="board" element={<GenericJsonEditor token={token} file="board.json" title="Directiva" fields={['name','role']} />} />
          <Route path="history" element={<GenericJsonEditor token={token} file="history.json" title="Història" fields={['year','title','text']} />} />
        </Routes>
      </main>
    </div>
  );
}
