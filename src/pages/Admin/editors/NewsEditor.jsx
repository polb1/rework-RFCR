import { useState } from 'react';
import initialNews from '../../../data/news.json';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const EMPTY = { id: '', slug: '', title: '', excerpt: '', date: '', category: 'Primer equip', image: '', author: 'Redacció RFCR', body: [''] };

export default function NewsEditor({ token }) {
  const [items, setItems] = useState(initialNews);
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => setEditing({ ...EMPTY, id: `n${String(items.length + 1).padStart(2, '0')}` });
  const startEdit = (item) => setEditing({ ...item, body: item.body || [''] });
  const cancel = () => setEditing(null);

  const saveItem = () => {
    if (!editing.title || !editing.slug) return;
    const clean = { ...editing, body: editing.body.filter(Boolean) };
    const next = items.some(i => i.id === clean.id)
      ? items.map(i => i.id === clean.id ? clean : i)
      : [clean, ...items];
    setItems(next);
    setEditing(null);
  };

  const removeItem = (id) => {
    if (!confirm('Esborrar aquesta notícia?')) return;
    setItems(items.filter(i => i.id !== id));
  };

  const publish = async () => {
    setSaving(true); setStatus(null);
    try {
      await saveJson({ token, file: 'news.json', content: items });
      setStatus({ type: 'ok', msg: 'Publicat! Vercel farà el redeploy en pocs segons.' });
    } catch (e) {
      setStatus({ type: 'err', msg: `Error: ${e.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div>
          <h1>Notícies</h1>
          <p>{items.length} publicacions</p>
        </div>
        <div className={s.actions}>
          <button className={s.btn} onClick={() => download('news.json', items)}>Descarregar JSON</button>
          <button className={s.btn} onClick={startNew}>+ Nova notícia</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving}>
            {saving ? 'Publicant…' : 'Publicar canvis'}
          </button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}

      {editing && (
        <div className={s.form}>
          <div className={s.field}><label>ID</label><input value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} /></div>
          <div className={s.field}><label>Slug</label><input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide}`}><label>Títol</label><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
          <div className={s.field}><label>Data</label><input type="date" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} /></div>
          <div className={s.field}>
            <label>Categoria</label>
            <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
              {['Primer equip', 'Club', 'Botiga', 'Patrocinadors', 'Socis', 'Afició'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={s.field}><label>Autor</label><input value={editing.author} onChange={e => setEditing({ ...editing, author: e.target.value })} /></div>
          <div className={s.field}><label>Imatge (ruta)</label><input value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} placeholder="/assets/news/..." /></div>
          <div className={`${s.field} ${s.wide}`}><label>Extracte</label><textarea rows="2" value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} /></div>
          <div className={`${s.field} ${s.wide}`}>
            <label>Cos (un paràgraf per línia)</label>
            <textarea rows="8" value={editing.body.join('\n\n')} onChange={e => setEditing({ ...editing, body: e.target.value.split(/\n\s*\n/) })} />
          </div>
          <div className={`${s.field} ${s.wide} ${s.actions}`}>
            <button className={s.btn} onClick={cancel}>Cancel·lar</button>
            <button className={`${s.btn} ${s.primary}`} onClick={saveItem}>Aplicar</button>
          </div>
        </div>
      )}

      <div className={s.list} style={{ marginTop: editing ? '1.5rem' : 0 }}>
        {items.map(item => (
          <div key={item.id} className={s.row}>
            <div>
              <strong>{item.title}</strong>
              <small>{item.date} · {item.category} · {item.slug}</small>
            </div>
            <div className={s.rowActions}>
              <button className={s.iconBtn} onClick={() => startEdit(item)}>Editar</button>
              <button className={`${s.iconBtn} ${s.danger}`} onClick={() => removeItem(item.id)}>Esborrar</button>
            </div>
          </div>
        ))}
      </div>

      <p className={s.hint}>Els canvis només es publiquen quan cliques <em>Publicar canvis</em>. Es fa un commit a GitHub i Vercel redeploya automàticament.</p>
    </div>
  );
}
