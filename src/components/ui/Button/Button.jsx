import styles from './Button.module.css';

export default function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`.trim();
  return <Tag className={cls} {...props} />;
}
