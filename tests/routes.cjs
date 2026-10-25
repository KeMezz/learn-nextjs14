const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');

async function main() {
  const mocked = process.argv.includes('--mock');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'movie-routes-'));
  const modeFile = path.join(dir, 'mode');
  const callsFile = path.join(dir, 'calls.log');
  fs.writeFileSync(modeFile, 'success');
  fs.writeFileSync(callsFile, '');
  const socket = net.createServer();
  await new Promise((resolve) => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const args = mocked ? ['--require', path.join(__dirname, 'upstream-mock.cjs')] : [];
  args.push(require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port));
  const server = spawn(process.execPath, args, {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, NODE_OPTIONS: '', MOVIE_TEST_MODE_FILE: modeFile, MOVIE_TEST_CALLS_FILE: callsFile },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  server.stdout.on('data', (data) => { logs += data; });
  server.stderr.on('data', (data) => { logs += data; });
  const base = `http://127.0.0.1:${port}`;
  const routes = ['/', '/about-us', '/movies/123', '/movies/123/credits', '/movies/123/providers', '/movies/123/similar'];
  async function check(route, expected) {
    const response = await fetch(base + route, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    for (const value of expected) assert.ok(visible.includes(value), `${route}: missing ${value}`);
    assert.ok(!html.includes('NEXT_HTTP_ERROR_FALLBACK;500'), route);
    console.log(JSON.stringify({ mode: mocked ? fs.readFileSync(modeFile, 'utf8') : 'real-upstream', route, status: response.status, content: expected }));
  }

  function getRecordedCalls() {
    if (!fs.existsSync(callsFile)) return [];
    return fs.readFileSync(callsFile, 'utf8').trim().split('\n').filter(Boolean);
  }
  function resetRecordedCalls() {
    fs.writeFileSync(callsFile, '');
  }

  try {
    for (let i = 0; i < 100 && !logs.includes('Ready in'); i++) {
      if (server.exitCode !== null) throw new Error(logs);
      await delay(100);
    }
    if (!logs.includes('Ready in')) throw new Error(`Server not ready: ${logs}`);
    if (!mocked) {
      for (const route of routes) await check(route, route === '/about-us' ? ['About Us'] : ['temporarily unavailable.', 'Try again']);
      await check('/movies/123', ['<title>Movie unavailable | Next.js Movies</title>']);
    } else {
      const success = [
        ['Test Movie'], ['About Us'],
        ['<title>Test Movie | Next.js Movies</title>', 'Test Movie', '8.3', 'A test overview', 'https://example.com/movie', '/movies/123/credits', '/movies/123/providers', '/movies/123/similar', 'youtube.com/embed/test-video', 'Test Trailer'],
        ['Test Actor', 'Test Role', 'Acting'],
        ['Rent', 'Buy', 'Stream', 'Test Rental', 'Test Purchase', 'Test Stream'],
        ['Similar to Test Movie', 'Test Similar Movie', '/movies/456'],
      ];

      // Verify each route and assert memoization / deduping on /movies/123
      for (let i = 0; i < routes.length; i++) {
        if (routes[i] === '/movies/123') {
          // Request 1: Assert metadata + body share movie detail fetch per request (deduped upstream calls)
          resetRecordedCalls();
          await check(routes[i], success[i]);
          const calls1 = getRecordedCalls();
          const detailCalls1 = calls1.filter((c) => c === '/123');
          assert.equal(detailCalls1.length, 1, `Expected metadata+body to share 1 movie detail fetch, got ${detailCalls1.length}`);

          // Request 2: Assert separate next requests refetch (render-scoped memoization, not stale global cache)
          resetRecordedCalls();
          await check(routes[i], success[i]);
          const calls2 = getRecordedCalls();
          const detailCalls2 = calls2.filter((c) => c === '/123');
          assert.equal(detailCalls2.length, 1, `Expected separate next request to refetch movie detail once, got ${detailCalls2.length}`);
        } else {
          await check(routes[i], success[i]);
        }
      }

      // Outage: failure per request must also share fetch and not cache permanently
      fs.writeFileSync(modeFile, 'outage');
      resetRecordedCalls();
      await check('/movies/123', ['temporarily unavailable.', 'Try again']);
      const outageCalls = getRecordedCalls().filter((c) => c === '/123');
      assert.equal(outageCalls.length, 1, `Expected outage request to share 1 movie detail fetch, got ${outageCalls.length}`);
      for (const route of routes.filter((route) => route !== '/about-us' && route !== '/movies/123')) {
        await check(route, ['temporarily unavailable.', 'Try again']);
      }

      fs.writeFileSync(modeFile, 'empty');
      for (const route of routes.filter((route) => route !== '/about-us')) await check(route, ['found.', 'Try again']);

      fs.writeFileSync(modeFile, 'partial');
      await check('/movies/123', ['Movie details temporarily unavailable.', 'youtube.com/embed/test-video']);
      await check('/movies/123/similar', ['Similar movies', 'Test Similar Movie']);

      // Recovery: switching back to success must immediately recover on next request
      fs.writeFileSync(modeFile, 'success');
      resetRecordedCalls();
      await check('/movies/123', success[2]);
      const recoveryCalls = getRecordedCalls().filter((c) => c === '/123');
      assert.equal(recoveryCalls.length, 1, `Expected recovered request to refetch and succeed with 1 detail fetch, got ${recoveryCalls.length}`);
      for (let i = 0; i < routes.length; i++) {
        if (routes[i] === '/movies/123') continue;
        await check(routes[i], success[i]);
      }
    }
  } finally {
    server.kill('SIGTERM');
    await new Promise((resolve) => server.once('exit', resolve));
    fs.rmSync(dir, { recursive: true, force: true });
    console.error(logs);
  }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
