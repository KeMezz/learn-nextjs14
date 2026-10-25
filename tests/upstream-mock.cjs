// Preloaded only by test:routes:mock, never by build or the application.
const fs = require('node:fs');
const path = require('node:path');
const { responses } = require('./fixtures.cjs');
const fetch = global.fetch;

const callsFile = process.env.MOVIE_TEST_CALLS_FILE || (
  process.env.MOVIE_TEST_MODE_FILE
    ? path.join(path.dirname(process.env.MOVIE_TEST_MODE_FILE), 'calls.log')
    : null
);

global.fetch = async (input, options) => {
  const url = new URL(typeof input === 'string' ? input : input.url || input.toString());
  if (url.origin !== 'https://nomad-movies.nomadcoders.workers.dev') return fetch(input, options);
  const suffix = url.pathname.slice('/movies'.length);
  if (callsFile) {
    try {
      fs.appendFileSync(callsFile, `${suffix}\n`);
    } catch (_) {}
  }
  const mode = fs.readFileSync(process.env.MOVIE_TEST_MODE_FILE, 'utf8');
  if (mode === 'outage') return new Response('<html>Upstream error</html>', { status: 404 });
  if (mode === 'empty' && suffix !== '/123') return Response.json(suffix.endsWith('/providers') ? {} : []);
  if (mode === 'partial' && suffix === '/123') return Response.json(null);
  return Response.json(responses[suffix]);
};
