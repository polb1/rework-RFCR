import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { mainNav, ctas } from '../../../data/navigation.js';
import styles from './Header.module.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Reus FC Reddis — inici">
          <img src="/assets/badges/rfcr.webp" alt="" className={styles.logoBadge} />
          <img src="/assets/badges/logo-horizontal.webp" alt="Reus FC Reddis" className={styles.logoWordmark} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegació principal">
          <ul>
            {mainNav.map(item => (
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
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={ctas.tickets.href} target="_blank" rel="noopener" className={`${styles.cta} ${styles.ctaPrimary}`}>
            {ctas.tickets.label}
          </a>
          <Link to={ctas.member.to} className={`${styles.cta} ${styles.ctaSecondary}`}>
            {ctas.member.label}
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
            {mainNav.map(item => (
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
