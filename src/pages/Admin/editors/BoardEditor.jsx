import { useState } from 'react';
import initial from '../../../data/board.json';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const EMPTY = { name: '', role: '' };

export default function BoardEditor({ token }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => { setEditing({ ...EMPTY }); setEditingIndex(-1); };
  const startEdit = (item, i) => { setEditing({ ...item }); setEditingIndex(i); };
  const cancel = () => { setEditing(null); setEditingIndex(-1); };

  const saveItem = () => {
    if (!editing.role.trim()) return;
    const next = editingIndex >= 0
      ? items.map((x, i) => i === editingIndex ? editing : x)
      : [...items, editing];
    setItems(next);
    cancel();
  };

  const removeItem = (i) => {
    if (!confirm(`Esborrar "${items[i].role}"?`)) return;
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
      await saveJson({ token, file: 'board.json', content: items });
      setStatus({ type: 'ok', msg: 'Publicat!' });
    } catch (e) { setStatus({ type: 'err', msg: `Error: ${e.message}` }); }
    finally { setSaving(false); }
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div><h1>Directiva</h1><p>{items.length} càrrecs</p></div>
        <div className={s.actions}>
          <button className={s.btn} onClick={() => download('board.json', items)}>Descarregar JSON</button>
          <button className={s.btn} onClick={startNew}>+ Nou càrrec</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving}>{saving ? 'Publicant…' : 'Publicar canvis'}</button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}

      {editing && (
        <div className={s.form}>
          <div className={s.field}><label>Càrrec</label><input value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="President, Vicepresidència…" /></div>
          <div className={s.field}><label>Nom</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Nom complet o 'Junta Directiva'" /></div>
          <div className={`${s.field} ${s.wide} ${s.actions}`}>
            <button className={s.btn} onClick={cancel}>Cancel·lar</button>
            <button className={`${s.btn} ${s.primary}`} onClick={saveItem}>Aplicar</button>
          </div>
        </div>
      )}

      <div className={s.list} style={{ marginTop: editing ? '1.5rem' : 0 }}>
        {items.map((m, i) => (
          <div key={i} className={s.row}>
            <div>
              <strong>{m.role}</strong>
              <small>{m.name}</small>
            </div>
            <div className={s.rowActions}>
              <button className={s.iconBtn} onClick={() => move(i, -1)} title="Amunt">↑</button>
              <button className={s.iconBtn} onClick={() => move(i, 1)} title="Avall">↓</button>
              <button className={s.iconBtn} onClick={() => startEdit(m, i)}>Editar</button>
              <button className={`${s.iconBtn} ${s.danger}`} onClick={() => removeItem(i)}>Esborrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
