import { Link } from 'react-router-dom';
import { mainNav, clubNav, legalNav, social } from '../../../data/navigation.js';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>RFCR</span>
          <p className={styles.brandName}>Reus FC Reddis</p>
          <p className={styles.tagline}>Orgullosos dels colors.</p>
        </div>

        <FooterCol title="Navegació" items={mainNav} />
        <FooterCol title="Club" items={clubNav} />
        <FooterCol title="Legal" items={legalNav} />

        <div className={styles.col}>
          <h3 className={styles.colTitle}>Segueix-nos</h3>
          <ul className={styles.social}>
            {social.map(s => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noopener">{s.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} Reus FC Reddis. Tots els drets reservats.</p>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div className={styles.col}>
      <h3 className={styles.colTitle}>{title}</h3>
      <ul className={styles.links}>
        {items.map(i => (
          <li key={i.to}><Link to={i.to}>{i.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
