import { useState } from 'react';
import initial from '../../../data/players.json';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const POSITIONS = ['Porter', 'Defensa', 'Migcampista', 'Davanter'];
const EMPTY = { id: '', slug: '', name: '', number: 0, position: 'Migcampista', photo: '/assets/players/placeholder.svg', birthYear: 2000, nationality: 'ES' };

export default function PlayersEditor({ token }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => setEditing({ ...EMPTY, id: `p${String(items.length + 1).padStart(2, '0')}` });
  const startEdit = (p) => setEditing({ ...p });
  const cancel = () => setEditing(null);

  const saveItem = () => {
    if (!editing.name || !editing.slug) return;
    const next = items.some(i => i.id === editing.id)
      ? items.map(i => i.id === editing.id ? editing : i)
      : [...items, editing];
    setItems(next);
    setEditing(null);
  };

  const removeItem = (id) => {
    if (!confirm('Esborrar aquest jugador?')) return;
    setItems(items.filter(i => i.id !== id));
  };

  const publish = async () => {
    setSaving(true); setStatus(null);
    try {
      await saveJson({ token, file: 'players.json', content: items });
      setStatus({ type: 'ok', msg: 'Publicat! Vercel redeploya en pocs segons.' });
    } catch (e) {
      setStatus({ type: 'err', msg: `Error: ${e.message}` });
    } finally { setSaving(false); }
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div><h1>Jugadors</h1><p>{items.length} de plantilla</p></div>
        <div className={s.actions}>
          <button className={s.btn} onClick={() => download('players.json', items)}>Descarregar JSON</button>
          <button className={s.btn} onClick={startNew}>+ Nou jugador</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving}>{saving ? 'Publicant…' : 'Publicar canvis'}</button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}

      {editing && (
        <div className={s.form}>
          <div className={s.field}><label>ID</label><input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} /></div>
          <div className={s.field}><label>Slug</label><input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
          <div className={s.field}><label>Nom</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
          <div className={s.field}><label>Dorsal</label><input type="number" value={editing.number} onChange={e => setEditing({ ...editing, number: +e.target.value })} /></div>
          <div className={s.field}>
            <label>Posició</label>
            <select value={editing.position} onChange={e => setEditing({ ...editing, position: e.target.value })}>
              {POSITIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className={s.field}><label>Any naixement</label><input type="number" value={editing.birthYear} onChange={e => setEditing({ ...editing, birthYear: +e.target.value })} /></div>
          <div className={s.field}><label>Nacionalitat (ISO)</label><input value={editing.nationality} onChange={e => setEditing({ ...editing, nationality: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide}`}><label>Foto (ruta)</label><input value={editing.photo} onChange={e => setEditing({ ...editing, photo: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide} ${s.actions}`}>
            <button className={s.btn} onClick={cancel}>Cancel·lar</button>
            <button className={`${s.btn} ${s.primary}`} onClick={saveItem}>Aplicar</button>
          </div>
        </div>
      )}

      <div className={s.list} style={{ marginTop: editing ? '1.5rem' : 0 }}>
        {items.map(p => (
          <div key={p.id} className={s.row}>
            <div>
              <strong>#{p.number} {p.name}</strong>
              <small>{p.position} · {p.nationality} · {p.slug}</small>
            </div>
            <div className={s.rowActions}>
              <button className={s.iconBtn} onClick={() => startEdit(p)}>Editar</button>
              <button className={`${s.iconBtn} ${s.danger}`} onClick={() => removeItem(p.id)}>Esborrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
