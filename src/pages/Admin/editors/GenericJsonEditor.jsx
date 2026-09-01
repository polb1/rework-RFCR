import { useEffect, useState } from 'react';
import sponsors from '../../../data/sponsors.json';
import matches from '../../../data/matches.json';
import standings from '../../../data/standings.json';
import board from '../../../data/board.json';
import history from '../../../data/history.json';
import { saveJson, download } from './shared.js';
import s from './editor.module.css';

const SOURCES = {
  'sponsors.json':  sponsors,
  'matches.json':   matches,
  'standings.json': standings,
  'board.json':     board,
  'history.json':   history,
};

export default function GenericJsonEditor({ token, file, title }) {
  const source = SOURCES[file];
  const [text, setText] = useState(() => JSON.stringify(source, null, 2));
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setText(JSON.stringify(SOURCES[file], null, 2));
    setStatus(null);
    setError(null);
  }, [file]);

  const validate = (value) => {
    try {
      JSON.parse(value);
      setError(null);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  };

  const onChange = (e) => {
    const v = e.target.value;
    setText(v);
    validate(v);
  };

  const publish = async () => {
    if (!validate(text)) return;
    setSaving(true); setStatus(null);
    try {
      const content = JSON.parse(text);
      await saveJson({ token, file, content });
      setStatus({ type: 'ok', msg: 'Publicat! Vercel farà el redeploy en pocs segons.' });
    } catch (e) {
      setStatus({ type: 'err', msg: `Error: ${e.message}` });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setText(JSON.stringify(SOURCES[file], null, 2));
    setError(null); setStatus(null);
  };

  const format = () => {
    try {
      setText(JSON.stringify(JSON.parse(text), null, 2));
      setError(null);
    } catch (e) { setError(e.message); }
  };

  const count = (() => {
    try { const v = JSON.parse(text); return Array.isArray(v) ? v.length : Object.keys(v).length; }
    catch { return '?'; }
  })();

  return (
    <div className={s.page}>
      <header className={s.head}>
        <div>
          <h1>{title}</h1>
          <p>{count} entrades · <code>src/data/{file}</code></p>
        </div>
        <div className={s.actions}>
          <button className={s.btn} onClick={reset}>Revertir</button>
          <button className={s.btn} onClick={format}>Formatar</button>
          <button className={s.btn} onClick={() => download(file, JSON.parse(text))} disabled={!!error}>Descarregar</button>
          <button className={`${s.btn} ${s.primary}`} onClick={publish} disabled={saving || !!error}>
            {saving ? 'Publicant…' : 'Publicar canvis'}
          </button>
        </div>
      </header>

      {status && <div className={`${s.status} ${status.type === 'ok' ? s.ok : s.err}`}>{status.msg}</div>}
      {error && <div className={`${s.status} ${s.err}`}>JSON invàlid: {error}</div>}

      <textarea
        value={text}
        onChange={onChange}
        spellCheck={false}
        style={{
          width: '100%',
          minHeight: '60vh',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 13,
          lineHeight: 1.5,
          padding: 16,
          borderRadius: 10,
          border: `1px solid ${error ? '#EF4444' : '#E5E7EB'}`,
          background: '#fff',
          color: '#1A1A1A',
          resize: 'vertical',
          whiteSpace: 'pre',
          overflowX: 'auto',
        }}
      />
      <p className={s.hint}>Editor JSON en cru. Cal mantenir l'estructura vàlida. Els canvis només es guarden quan cliques <em>Publicar</em>.</p>
    </div>
  );
}
