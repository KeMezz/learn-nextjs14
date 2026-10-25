export const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

export async function getMovies() {
  return await fetch(API_URL, { cache: "force-cache" }).then((res) => res.json());
}

export async function getCredits(id: string) {
  const response = await fetch(`${API_URL}/${id}/credits`, { cache: "force-cache" });
  return await response.json();
}

export async function getProviders(id: string) {
  const response = await fetch(`${API_URL}/${id}/providers`, { cache: "force-cache" });
  return await response.json();
}

export async function getSimilarMovies(id: string) {
  const response = await fetch(`${API_URL}/${id}/similar`, { cache: "force-cache" });
  return await response.json();
}

export async function getMovie(id: string) {
  const response = await fetch(`${API_URL}/${id}`, { cache: "force-cache" });
  return await response.json();
}

export async function getVideos(id: string) {
  const response = await fetch(`${API_URL}/${id}/videos`, { cache: "force-cache" });
  return await response.json();
}
