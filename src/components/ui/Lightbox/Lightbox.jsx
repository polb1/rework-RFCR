import { useEffect } from 'react';
import styles from './Lightbox.module.css';

export default function Lightbox({ src, alt = '', onClose }) {
  useEffect(() => {
    if (!src) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true" aria-label="Imatge ampliada">
      <button type="button" className={styles.close} onClick={onClose} aria-label="Tancar">×</button>
      <img src={src} alt={alt} className={styles.img} onClick={e => e.stopPropagation()} />
    </div>
  );
}
