import { Link } from 'react-router-dom';
import { ctas } from '../../../data/navigation.js';
import styles from './CtaTriple.module.css';

const ITEMS = [
  {
    key: 'tickets',
    href: ctas.tickets.href,
    external: true,
    icon: '🎟',
    title: 'Entrades',
    sub: 'Compra la teva localitat pel pròxim partit al Municipal',
    cta: 'Compra online',
  },
  {
    key: 'member',
    to: ctas.member.to,
    icon: '⚜',
    title: 'Fes-te soci',
    sub: 'Abonaments 2026-27 i avantatges exclusius',
    cta: 'Info abonaments',
  },
  {
    key: 'shop',
    to: '/botiga',
    icon: '👕',
    title: 'Botiga oficial',
    sub: 'Equipacions, edició Gaudí i merchandising',
    cta: 'Vesteix els colors',
  },
];

export default function CtaTriple() {
  return (
    <section className={styles.section} aria-label="Accions ràpides">
      <div className={`container ${styles.grid}`}>
        {ITEMS.map(item => {
          const inner = (
            <>
              <span className={styles.icon} aria-hidden="true">{item.icon}</span>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.sub}>{item.sub}</p>
                <span className={styles.cta}>{item.cta} →</span>
              </div>
            </>
          );
          return item.external ? (
            <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.card}>
              {inner}
            </a>
          ) : (
            <Link key={item.key} to={item.to} className={styles.card}>{inner}</Link>
          );
        })}
      </div>
    </section>
  );
}
