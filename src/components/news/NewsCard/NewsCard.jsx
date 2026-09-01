import { Link } from 'react-router-dom';
import Badge from '../../ui/Badge/Badge.jsx';
import { formatDateShort } from '../../../utils/dates.js';
import styles from './NewsCard.module.css';

export default function NewsCard({ item }) {
  return (
    <article className={styles.card}>
      <Link to={`/actualitat/${item.slug}`} className={styles.imgLink} aria-label={item.title}>
        <img src={item.image} alt="" className={styles.img} loading="lazy" />
      </Link>
      <div className={styles.body}>
        <div className={styles.meta}>
          <Badge variant="primary">{item.category}</Badge>
          <time dateTime={item.date} className={styles.date}>{formatDateShort(item.date)}</time>
        </div>
        <h3 className={styles.title}>
          <Link to={`/actualitat/${item.slug}`}>{item.title}</Link>
        </h3>
        <p className={styles.excerpt}>{item.excerpt}</p>
      </div>
    </article>
  );
}
