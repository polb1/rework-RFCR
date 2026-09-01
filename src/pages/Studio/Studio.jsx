import { lazy, Suspense } from 'react';
import config from '../../../sanity.config.js';

const StudioComp = lazy(() => import('sanity').then(m => ({ default: m.Studio })));

export default function Studio() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      <Suspense fallback={<div style={{ padding: 24 }}>Carregant Studio…</div>}>
        <StudioComp config={config} />
      </Suspense>
    </div>
  );
}
