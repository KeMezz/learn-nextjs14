const assert = require('node:assert/strict');
const { test, after } = require('node:test');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const path = require('node:path');
const filename = path.resolve(__dirname, '../apis/api.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
loaded._compile(compiled, filename);
const api = loaded.exports;
const { responses } = require('./fixtures.cjs');
const originalFetch = global.fetch;
const originalWarn = console.warn;
console.warn = () => {};
after(() => { global.fetch = originalFetch; console.warn = originalWarn; });
const endpoints = [
  ['getMovies', '', []], ['getMovie', '/123', null], ['getCredits', '/123/credits', []],
  ['getProviders', '/123/providers', {}], ['getSimilarMovies', '/123/similar', []], ['getVideos', '/123/videos', []],
];
for (const [name, suffix, empty] of endpoints) {
  test(`${name}: validates successful content, uses bounded no-store reads`, async () => {
    global.fetch = async (url, options) => {
      assert.equal(url, api.API_URL + suffix);
      assert.equal(options.cache, 'no-store');
      assert.equal(options.headers.Accept, 'application/json');
      assert.ok(options.signal instanceof AbortSignal);
      return Response.json(responses[suffix]);
    };
    assert.deepEqual(await api[name]('123'), { ok: true, data: responses[suffix] });
  });
  if (empty !== null) test(`${name}: preserves valid empty results`, async () => {
    global.fetch = async () => Response.json(empty);
    assert.deepEqual(await api[name]('123'), { ok: true, data: empty });
  });
  for (const [label, response] of [
    ['non-2xx JSON', () => Response.json({ error: 'unavailable' }, { status: 503 })],
    ['404 HTML', () => new Response('<html>error</html>', { status: 404, headers: { 'content-type': 'text/html' } })],
    ['200 HTML', () => new Response('<html>error</html>', { headers: { 'content-type': 'text/html' } })],
    ['missing content type', () => new Response(JSON.stringify(responses[suffix]))],
    ['malformed JSON', () => new Response('{', { headers: { 'content-type': 'application/json' } })],
    ['null JSON', () => Response.json(null)],
    ['wrong response shape', () => Response.json({ error: 'not the expected data' })],
    ['network failure', () => { throw new TypeError('fetch failed'); }],
    ['timeout', () => { throw new DOMException('Timed out', 'TimeoutError'); }],
  ]) test(`${name}: degrades on ${label}, then recovers on the next request`, async () => {
    global.fetch = async () => response();
    assert.deepEqual(await api[name]('123'), { ok: false });
    global.fetch = async () => Response.json(responses[suffix]);
    assert.deepEqual(await api[name]('123'), { ok: true, data: responses[suffix] });
  });
}
for (const [name, body] of [
  ['getMovies', [{ id: 1, title: 9 }]],
  ['getMovie', { ...responses['/123'], vote_average: '8.2' }],
  ['getMovie', { ...responses['/123'], overview: {} }],
  ['getMovie', { ...responses['/123'], homepage: [] }],
  ['getCredits', [{ ...responses['/123/credits'][0], name: null }]],
  ['getCredits', [{ ...responses['/123/credits'][0], profile_path: {} }]],
  ['getProviders', { US: null }],
  ['getProviders', { US: { rent: {} } }],
  ['getProviders', { US: { buy: [null] } }],
  ['getProviders', { US: { flatrate: [{ provider_id: 1, provider_name: 8 }] } }],
  ['getSimilarMovies', [null]],
  ['getVideos', [{ key: null, name: 'Invalid video' }]],
]) test(`${name}: rejects malformed nested content ${JSON.stringify(body)}`, async () => {
  global.fetch = async () => Response.json(body);
  assert.deepEqual(await api[name]('123'), { ok: false });
});
test('getMovie: accepts optional/null artwork and text without crashing consumers', async () => {
  global.fetch = async () => Response.json({ id: 123, title: 'Minimal movie', vote_average: 0 });
  assert.equal((await api.getMovie('123')).ok, true);
});
