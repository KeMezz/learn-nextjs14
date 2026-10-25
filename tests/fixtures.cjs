// Synthetic responses used only by tests; application code always uses API_URL.
const movie = { id: 123, title: 'Test Movie', poster_path: '/test-poster.jpg', vote_average: 8.25, overview: 'A test overview', homepage: 'https://example.com/movie' };
const provider = (id, name) => ({ provider_id: id, provider_name: name, logo_path: '/provider.jpg' });
module.exports = {
  movie,
  responses: {
    '': [movie],
    '/123': movie,
    '/123/credits': [{ id: 1, name: 'Test Actor', character: 'Test Role', known_for_department: 'Acting', profile_path: null }],
    '/123/providers': { US: { rent: [provider(1, 'Test Rental')], buy: [provider(2, 'Test Purchase')], flatrate: [provider(3, 'Test Stream')] } },
    '/123/similar': [{ id: 456, title: 'Test Similar Movie', poster_path: null }],
    '/123/videos': [{ key: 'test-video', name: 'Test Trailer' }],
  },
};
