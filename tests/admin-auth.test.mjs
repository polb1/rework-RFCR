// Tests de seguretat de l'admin: només els correus d'ADMIN_EMAIL poden escriure o llegir.
// Google i GitHub es simulen amb un fetch fals. Executa: npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import save from '../api/save.js';
import access from '../api/access.js';

Object.assign(process.env, {
  GITHUB_TOKEN: 'gh', GITHUB_REPO: 'a/b', GOOGLE_CLIENT_ID: 'cid', ADMIN_EMAIL: 'admin@x.com',
});

let puts;
beforeEach(() => {
  puts = 0;
  globalThis.fetch = async (url, opts) => {
    if (url.includes('tokeninfo')) {
      const email = url.includes('admin') ? 'admin@x.com' : 'evil@x.com';
      return { ok: true, json: async () => ({ aud: 'cid', email, email_verified: 'true' }) };
    }
    if (opts?.method === 'PUT') { puts++; return { ok: true, json: async () => ({ commit: { sha: 's' } }) }; }
    return { ok: false, status: 404 };
  };
});

const res = () => {
  const r = { status(c) { r.code = c; return r; }, json(b) { r.body = b; return r; }, setHeader() {} };
  return r;
};

test('save: un correu que no és admin no pot escriure', async () => {
  const r = res();
  await save({ method: 'POST', body: { token: 'evil', file: 'news.json', content: [] } }, r);
  assert.equal(r.code, 403);
  assert.equal(puts, 0);
});

test('save: un admin sí que pot escriure', async () => {
  const r = res();
  await save({ method: 'POST', body: { token: 'admin', file: 'news.json', content: [] } }, r);
  assert.equal(r.code, 200);
  assert.equal(puts, 1);
});

test('save: rebutja noms de fitxer amb camins', async () => {
  const r = res();
  await save({ method: 'POST', body: { token: 'admin', file: '../x.json', content: [] } }, r);
  assert.equal(r.code, 400);
});

test('access: un no-admin no deixa cap commit', async () => {
  const r = res();
  await access({ method: 'POST', headers: {}, body: { token: 'evil' } }, r);
  assert.equal(r.code, 403);
  assert.equal(puts, 0);
});

test('access: llegir el registre demana ser admin', async () => {
  const anon = res();
  await access({ method: 'GET', headers: {} }, anon);
  assert.equal(anon.code, 403);
  const ok = res();
  await access({ method: 'GET', headers: { authorization: 'Bearer admin' } }, ok);
  assert.equal(ok.code, 200);
});
