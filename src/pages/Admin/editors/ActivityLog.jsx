import { useEffect, useState } from 'react';
import styles from './ActivityLog.module.css';

const RTF = new Intl.RelativeTimeFormat('ca', { numeric: 'auto' });

function relative(iso) {
  const diffSec = (new Date(iso).getTime() - Date.now()) / 1000;
  const abs = Math.abs(diffSec);
  if (abs < 60)     return RTF.format(Math.round(diffSec), 'second');
  if (abs < 3600)   return RTF.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400)  return RTF.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 604800) return RTF.format(Math.round(diffSec / 86400), 'day');
  return new Date(iso).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function absoluteTime(iso) {
  return new Date(iso).toLocaleString('ca-ES', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  });
}

function friendlyWho(who, source) {
  if (source === 'bot') return who;
  if (!who) return 'Administrador';
  // "polboleda021@gmail.com" → "Pol Boleda"
  const local = who.split('@')[0].replace(/\d+$/, '');
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return who.split('@')[0];
}

export default function ActivityLog() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/activity')
      .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
      .then(j => setEvents(j.events || []))
      .catch(e => setError(e.message));
  }, []);

  if (error) return <div className={styles.wrap}><h1>Activitat</h1><p className={styles.err}>Error carregant activitat: {error}</p></div>;
  if (!events) return <div className={styles.wrap}><h1>Activitat</h1><p className={styles.loading}>Carregant…</p></div>;

  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h1>Activitat recent</h1>
        <p>Últims canvis fets al panell d'administració i pel robot automàtic.</p>
      </header>

      {events.length === 0 && <p className={styles.empty}>Encara no hi ha activitat registrada.</p>}

      <ol className={styles.list}>
        {events.map(e => (
          <li key={e.sha} className={`${styles.item} ${e.source === 'bot' ? styles.bot : styles.admin}`}>
            <span className={styles.icon} aria-hidden="true">{e.icon}</span>
            <div className={styles.body}>
              <p className={styles.line}>
                <strong>{e.label}</strong>
                <span className={styles.sep}> · </span>
                <span className={styles.who}>{friendlyWho(e.who, e.source)}</span>
              </p>
              <p className={styles.time} title={absoluteTime(e.when)}>
                {relative(e.when)} <span className={styles.abs}>· {absoluteTime(e.when)}</span>
              </p>
            </div>
            <span className={styles.tag}>{e.source === 'bot' ? 'Automàtic' : 'Manual'}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
