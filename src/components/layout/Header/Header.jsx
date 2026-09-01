import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { primaryNav, secondaryNav, ctas } from '../../../data/navigation.js';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => { setOpen(false); setMoreOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [moreOpen]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Reus FC Reddis — inici">
          <img src="/assets/badges/logo-horizontal.webp" alt="Reus FC Reddis" className={styles.logoWordmark} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegació principal">
          <ul>
            {primaryNav.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className={styles.moreWrap} ref={moreRef}>
              <button
                type="button"
                className={styles.navLink}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen(v => !v)}
              >
                Més <span aria-hidden="true" className={styles.chev}>▾</span>
              </button>
              {moreOpen && (
                <div className={styles.dropdown} role="menu">
                  {secondaryNav.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className={({ isActive }) => isActive ? `${styles.dropItem} ${styles.active}` : styles.dropItem}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <a
            href={ctas.tickets.href}
            target="_blank"
            rel="noopener"
            className={`${styles.cta} ${styles.ctaPrimary}`}
            aria-label={ctas.tickets.label}
          >
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 5v2M15 11v2M15 17v2"/>
              <path d="M4 7a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V7z"/>
            </svg>
            <span className={styles.ctaLabel}>{ctas.tickets.label}</span>
          </a>
          <Link
            to={ctas.member.to}
            className={`${styles.cta} ${styles.ctaSecondary}`}
            aria-label={ctas.member.label}
          >
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className={styles.ctaLabel}>Soci</span>
          </Link>
          <button
            type="button"
            className={styles.burger}
            aria-label={open ? 'Tancar menú' : 'Obrir menú'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-hidden={!open}
      >
        <nav aria-label="Navegació mòbil">
          <ul className={styles.mobileList}>
            {primaryNav.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className={styles.mobileSep} aria-hidden="true">Més seccions</li>
            {secondaryNav.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.active}` : styles.mobileLink}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={styles.mobileActions}>
            <a href={ctas.tickets.href} target="_blank" rel="noopener" className={`${styles.cta} ${styles.ctaPrimary}`}>
              {ctas.tickets.label}
            </a>
            <Link to={ctas.member.to} className={`${styles.cta} ${styles.ctaSecondary}`}>
              {ctas.member.label}
            </Link>
          </div>
        </nav>
      </div>
      {open && <button aria-hidden="true" tabIndex={-1} className={styles.backdrop} onClick={() => setOpen(false)} />}
    </header>
  );
}
