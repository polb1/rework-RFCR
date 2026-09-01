import styles from './Card.module.css';

export default function Card({ as: Tag = 'article', elevated = false, className = '', children, ...props }) {
  const cls = `${styles.card} ${elevated ? styles.elevated : ''} ${className}`.trim();
  return <Tag className={cls} {...props}>{children}</Tag>;
}
