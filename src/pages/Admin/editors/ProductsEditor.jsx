import { useState } from 'react';
import initial from '../../../data/products.json';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const CATS = ['equipacio', 'roba', 'accessoris', 'infantil'];
const EMPTY = { id: '', slug: '', name: '', price: 0, image: '/assets/shop/placeholder.svg', category: 'equipacio', description: '' };

export default function ProductsEditor({ token }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => setEditing({ ...EMPTY, id: `pr${String(items.length + 1).padStart(2, '0')}` });
  const startEdit = (p) => setEditing({ ...p });

  const saveItem = () => {
    if (!editing.name || !editing.slug) return;
    const next = items.some(i => i.id === editing.id)
      ? items.map(i => i.id === editing.id ? editing : i)
      : [...items, editing];
    setItems(next); setEditing(null);
  };

  const removeItem = (id) => {
    if (!confirm('Esborrar aquest producte?')) return;
    setItems(items.filter(i => i.id !== id));
  };

  const publish = async () => {
    setSaving(true); setStatus(null);
    try {
      await saveJson({ token, file: 'products.json', content: items });
      setStatus({ type: 'ok', msg: 'Publicat!' });
    } catch (e) { setStatus({ type: 'err', msg: `Error: ${e.message}` }); }
    finally { setSaving(false); }
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div><h1>Productes</h1><p>{items.length} a la botiga</p></div>
        <div className={s.actions}>
          <button className={s.btn} onClick={() => download('products.json', items)}>Descarregar JSON</button>
          <button className={s.btn} onClick={startNew}>+ Nou producte</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving}>{saving ? 'Publicant…' : 'Publicar canvis'}</button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}

      {editing && (
        <div className={s.form}>
          <div className={s.field}><label>ID</label><input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} /></div>
          <div className={s.field}><label>Slug</label><input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide}`}><label>Nom</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
          <div className={s.field}><label>Preu (€)</label><input type="number" step="0.01" value={editing.price} onChange={e => setEditing({ ...editing, price: +e.target.value })} /></div>
          <div className={s.field}>
            <label>Categoria</label>
            <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={`${s.field} ${s.wide}`}><label>Imatge (ruta)</label><input value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide}`}><label>Descripció</label><textarea rows="3" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide} ${s.actions}`}>
            <button className={s.btn} onClick={() => setEditing(null)}>Cancel·lar</button>
            <button className={`${s.btn} ${s.primary}`} onClick={saveItem}>Aplicar</button>
          </div>
        </div>
      )}

      <div className={s.list} style={{ marginTop: editing ? '1.5rem' : 0 }}>
        {items.map(p => (
          <div key={p.id} className={s.row}>
            <div>
              <strong>{p.name}</strong>
              <small>{p.category} · {p.price.toFixed(2)}€ · {p.slug}</small>
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
