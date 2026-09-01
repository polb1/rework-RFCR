import { useState } from 'react';
import initial from '../../../data/sponsors.json';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const TIERS = [
  { key: 'principal', label: 'Principal' },
  { key: 'or',        label: 'Or' },
  { key: 'plata',     label: 'Plata' },
  { key: 'colab',     label: 'Col·laborador' },
];
const EMPTY = { name: '', logo: '/assets/sponsors/placeholder.svg', url: '', tier: 'colab' };

export default function SponsorsEditor({ token }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => { setEditing({ ...EMPTY }); setEditingIndex(-1); };
  const startEdit = (item, i) => { setEditing({ ...item }); setEditingIndex(i); };
  const cancel = () => { setEditing(null); setEditingIndex(-1); };

  const saveItem = () => {
    if (!editing.name.trim()) return;
    const next = editingIndex >= 0
      ? items.map((x, i) => i === editingIndex ? editing : x)
      : [...items, editing];
    setItems(next);
    cancel();
  };

  const removeItem = (i) => {
    if (!confirm(`Esborrar "${items[i].name}"?`)) return;
    setItems(items.filter((_, idx) => idx !== i));
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  const publish = async () => {
    setSaving(true); setStatus(null);
    try {
      await saveJson({ token, file: 'sponsors.json', content: items });
      setStatus({ type: 'ok', msg: 'Publicat! Vercel redeploya en pocs segons.' });
    } catch (e) { setStatus({ type: 'err', msg: `Error: ${e.message}` }); }
    finally { setSaving(false); }
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div><h1>Patrocinadors</h1><p>{items.length} entitats</p></div>
        <div className={s.actions}>
          <button className={s.btn} onClick={() => download('sponsors.json', items)}>Descarregar JSON</button>
          <button className={s.btn} onClick={startNew}>+ Nou patrocinador</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving}>{saving ? 'Publicant…' : 'Publicar canvis'}</button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}

      {editing && (
        <div className={s.form}>
          <div className={s.field}><label>Nom</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
          <div className={s.field}>
            <label>Nivell</label>
            <select value={editing.tier} onChange={e => setEditing({ ...editing, tier: e.target.value })}>
              {TIERS.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>
          <div className={s.field}><label>URL</label><input value={editing.url} onChange={e => setEditing({ ...editing, url: e.target.value })} placeholder="https://…" /></div>
          <div className={`${s.field} ${s.wide}`}><label>Logo (ruta)</label><input value={editing.logo} onChange={e => setEditing({ ...editing, logo: e.target.value })} placeholder="/assets/sponsors/…" /></div>
          <div className={`${s.field} ${s.wide} ${s.actions}`}>
            <button className={s.btn} onClick={cancel}>Cancel·lar</button>
            <button className={`${s.btn} ${s.primary}`} onClick={saveItem}>Aplicar</button>
          </div>
        </div>
      )}

      {TIERS.map(tier => {
        const rows = items.map((s, i) => ({ s, i })).filter(r => r.s.tier === tier.key);
        if (rows.length === 0) return null;
        return (
          <section key={tier.key} style={{ marginTop: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280' }}>
              {tier.label} ({rows.length})
            </h3>
            <div className={s.list}>
              {rows.map(({ s: sp, i }) => (
                <div key={i} className={s.row}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={sp.logo} alt="" style={{ width: 40, height: 40, objectFit: 'contain', background: '#F5F5F5', borderRadius: 4 }} />
                    <div>
                      <strong>{sp.name}</strong>
                      <small>{sp.url && sp.url !== '#' ? sp.url : 'sense URL'}</small>
                    </div>
                  </div>
                  <div className={s.rowActions}>
                    <button className={s.iconBtn} onClick={() => move(i, -1)} title="Amunt">↑</button>
                    <button className={s.iconBtn} onClick={() => move(i, 1)} title="Avall">↓</button>
                    <button className={s.iconBtn} onClick={() => startEdit(sp, i)}>Editar</button>
                    <button className={`${s.iconBtn} ${s.danger}`} onClick={() => removeItem(i)}>Esborrar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
