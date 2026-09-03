import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

// items: [{ label: 'Inici', to: '/' }, ..., { label: 'Actual', to: null }]
export default function Breadcrumb({ items }) {
  return (
    <nav className={styles.nav} aria-label="Ubicació">
      <ol className={styles.list}>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className={styles.item}>
              {it.to && !last
                ? <Link to={it.to}>{it.label}</Link>
                : <span aria-current={last ? 'page' : undefined}>{it.label}</span>}
              {!last && <span className={styles.sep} aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
