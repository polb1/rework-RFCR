import { useEffect, useState } from 'react';
import styles from './CookieBanner.module.css';

const STORAGE_KEY = 'rfcr_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch { /* localStorage bloquejat: no mostrem res */ }
  }, []);

  const set = (value) => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.wrap} role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc">
      <div className={styles.box}>
        <div>
          <h2 id="cookie-title" className={styles.title}>🍪 Cookies al Reus FC Reddis</h2>
          <p id="cookie-desc" className={styles.desc}>
            Aquesta web només utilitza cookies tècniques necessàries pel seu funcionament.
            No fem servir cap eina de tracking ni publicitat.
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => set('reject')}>
            Rebutjar
          </button>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => set('accept')}>
            D'acord
          </button>
        </div>
      </div>
    </div>
  );
}
