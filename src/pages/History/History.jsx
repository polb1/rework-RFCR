import { useEffect, useRef, useState } from 'react';
import history from '../../data/history.json';
import Badge from '../../components/ui/Badge/Badge.jsx';
import styles from './History.module.css';

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start when top of section reaches 80% of viewport,
      // finish when bottom of section reaches 20% of viewport.
      const start = vh * 0.8;
      const end = -rect.height + vh * 0.2;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);

  return progress;
}

export default function History() {
  const timelineRef = useRef(null);
  const progress = useScrollProgress(timelineRef);

  const step = 220; // px between milestones
  const paddingTop = 40;
  const paddingBottom = 40;
  const height = paddingTop + step * (history.length - 1) + paddingBottom;
  const xLeft = 40;
  const xRight = 90;

  // Build a wavy path that alternates sides
  const points = history.map((_, i) => {
    const y = paddingTop + i * step;
    const x = i % 2 === 0 ? xLeft : xRight;
    return { x, y };
  });
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Badge variant="primary">Club</Badge>
        <h1 className={styles.title}>Història</h1>
        <p className={styles.sub}>Un segle de futbol a Reus</p>
      </header>

      <div className={styles.timelineWrap} ref={timelineRef} style={{ height }}>
        <svg
          className={styles.svg}
          width="120"
          height={height}
          viewBox={`0 0 120 ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={d} className={styles.pathBg} />
          <path
            d={d}
            className={styles.pathFg}
            pathLength="1"
            style={{ strokeDashoffset: 1 - progress }}
          />
          {points.map((p, i) => {
            const dotProgress = Math.max(0, Math.min(1, (progress * points.length - i)));
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={dotProgress > 0.1 ? 8 : 5}
                className={styles.dot}
                style={{
                  fill: dotProgress > 0.1 ? 'var(--color-primary)' : 'var(--color-border)',
                  transition: 'fill .3s, r .3s',
                }}
              />
            );
          })}
        </svg>

        <ol className={styles.entries} style={{ height }}>
          {history.map((h, i) => {
            const dotProgress = Math.max(0, Math.min(1, (progress * points.length - i)));
            const active = dotProgress > 0.1;
            return (
              <li
                key={i}
                className={`${styles.entry} ${active ? styles.entryActive : ''}`}
                style={{ top: paddingTop + i * step - 20 }}
              >
                <div className={styles.year}>{h.year}</div>
                <h3 className={styles.entryTitle}>{h.title}</h3>
                <p className={styles.text}>{h.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
