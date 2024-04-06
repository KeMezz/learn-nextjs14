export const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

export async function getMovies() {
  return await fetch(API_URL).then((res) => res.json());
}

export async function getCredits(id: string) {
  const response = await fetch(`${API_URL}/${id}/credits`);
  return await response.json();
}

export async function getProviders(id: string) {
  const response = await fetch(`${API_URL}/${id}/providers`);
  return await response.json();
}

export async function getSimilarMovies(id: string) {
  const response = await fetch(`${API_URL}/${id}/similar`);
  return await response.json();
}

export async function getMovie(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  return await response.json();
}

export async function getVideos(id: string) {
  const response = await fetch(`${API_URL}/${id}/videos`);
  return await response.json();
}
