import { useState } from 'react';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const DATA = {
  'sponsors.json':  () => import('../../../data/sponsors.json'),
  'matches.json':   () => import('../../../data/matches.json'),
  'standings.json': () => import('../../../data/standings.json'),
  'board.json':     () => import('../../../data/board.json'),
  'history.json':   () => import('../../../data/history.json'),
};

export default function GenericJsonEditor({ token, file, title }) {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!loaded) {
    DATA[file]().then(m => {
      setText(JSON.stringify(m.default, null, 2));
      setLoaded(true);
    });
    return <div className={s.page}><p>Carregant {file}…</p></div>;
  }

  const publish = async () => {
    let content;
    try { content = JSON.parse(text); }
    catch (e) { setStatus({ type: 'err', msg: `JSON invàlid: ${e.message}` }); return; }
    setSaving(true); setStatus(null);
    try {
      await saveJson({ token, file, content });
      setStatus({ type: 'ok', msg: 'Publicat!' });
    } catch (e) { setStatus({ type: 'err', msg: `Error: ${e.message}` }); }
    finally { setSaving(false); }
  };

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div><h1>{title}</h1><p>Edició directa de <code>{file}</code></p></div>
        <div className={s.actions}>
          <button className={s.btn} onClick={() => download(file, JSON.parse(text))}>Descarregar</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving}>{saving ? 'Publicant…' : 'Publicar canvis'}</button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={30}
        style={{
          width: '100%', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 13, padding: 16, borderRadius: 10, border: '1px solid #E5E7EB', background: '#fff', color: '#1A1A1A',
        }}
      />
      <p className={s.hint}>Editor JSON en cru. Cal mantenir l'estructura vàlida.</p>
    </div>
  );
}
