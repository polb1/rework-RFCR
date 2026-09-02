import { useEffect, useState } from 'react';
import styles from './ActivityLog.module.css';

// Data a partir de la qual comptem activitat (esborrat inicial del log).
const START_TS = new Date('2026-09-02T12:00:00Z').getTime();

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

function friendlyWho(entry) {
  if (entry.name) return entry.name;
  if (!entry.email) return 'Desconegut';
  const local = entry.email.split('@')[0].replace(/\d+$/, '');
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) return parts.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return entry.email.split('@')[0];
}

export default function ActivityLog() {
  const [edits, setEdits] = useState(null);
  const [access, setAccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/activity').then(r => r.ok ? r.json() : Promise.reject(new Error('activity ' + r.status))),
      fetch('/api/access').then(r => r.ok ? r.json() : Promise.reject(new Error('access ' + r.status))),
    ]).then(([a, b]) => {
      setEdits((a.events || []).filter(e => new Date(e.when).getTime() >= START_TS));
      setAccess((b.entries || []).filter(e => new Date(e.at).getTime() >= START_TS));
    }).catch(e => setError(e.message));
  }, []);

  if (error) return <Page><p className={styles.err}>Error carregant activitat: {error}</p></Page>;
  if (edits === null || access === null) return <Page><p className={styles.loading}>Carregant…</p></Page>;

  return (
    <Page>
      <Section title="Accessos" subtitle="Intents d'entrada al panell d'administració (permesos i denegats).">
        {access.length === 0 && <p className={styles.empty}>Encara no hi ha accessos registrats.</p>}
        <ol className={styles.list}>
          {access.map((a, i) => (
            <li key={i} className={`${styles.item} ${a.allowed ? styles.ok : styles.deny}`}>
              {a.picture
                ? <img src={a.picture} alt="" className={styles.avatar} />
                : <span className={styles.icon} aria-hidden="true">{a.allowed ? '✅' : '⛔'}</span>}
              <div className={styles.body}>
                <p className={styles.line}>
                  <strong>{friendlyWho(a)}</strong>
                  <span className={styles.sep}> · </span>
                  <span className={styles.who}>{a.email}</span>
                </p>
                <p className={styles.time} title={absoluteTime(a.at)}>
                  {relative(a.at)} <span className={styles.abs}>· {absoluteTime(a.at)}{a.ip ? ` · IP ${a.ip}` : ''}</span>
                </p>
              </div>
              <span className={styles.tag}>
                {a.allowed
                  ? (a.kind === 'session-open' ? 'Sessió' : 'Entra')
                  : 'Denegat'}
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Edicions" subtitle="Canvis fets al panell i pel robot automàtic RFEF.">
        {edits.length === 0 && <p className={styles.empty}>Encara no s'ha editat res.</p>}
        <ol className={styles.list}>
          {edits.map(e => (
            <li key={e.sha} className={`${styles.item} ${e.source === 'bot' ? styles.bot : styles.admin}`}>
              <span className={styles.icon} aria-hidden="true">{e.icon}</span>
              <div className={styles.body}>
                <p className={styles.line}>
                  <strong>{e.label}</strong>
                  <span className={styles.sep}> · </span>
                  <span className={styles.who}>{friendlyWho({ email: e.who, name: e.source === 'bot' ? e.who : null })}</span>
                </p>
                <p className={styles.time} title={absoluteTime(e.when)}>
                  {relative(e.when)} <span className={styles.abs}>· {absoluteTime(e.when)}</span>
                </p>
              </div>
              <span className={styles.tag}>{e.source === 'bot' ? 'Automàtic' : 'Manual'}</span>
            </li>
          ))}
        </ol>
      </Section>
    </Page>
  );
}

function Page({ children }) {
  return (
    <div className={styles.wrap}>
      <header className={styles.head}>
        <h1>Activitat</h1>
        <p>Registre d'accessos i canvis a la web.</p>
      </header>
      {children}
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      {subtitle && <p className={styles.sub}>{subtitle}</p>}
      {children}
    </section>
  );
}
