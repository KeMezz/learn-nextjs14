import Movie from "@/components/movie";
import { API_URL } from "../../../(home)/page";
import styles from "@/styles/similar.module.css";
import { getMovie } from "@/components/movie-info";

export async function getSimilarMovies(id: string) {
  const response = await fetch(`${API_URL}/${id}/similar`);
  return await response.json();
}

export default async function SimilarPage({ params: { id } }) {
  const movie = await getMovie(id);
  const similarMovies = await getSimilarMovies(id);
  if (!similarMovies.length)
    return <div className={styles.container}>No Similar Movies Found</div>;
  return (
    <div className={styles.container}>
      <h2>Simillar with {movie.title}</h2>
      <div className={styles.movies}>
        {similarMovies.map((movie) => (
          <Movie
            key={movie.id}
            id={movie.id}
            title={movie.title}
            poster_path={movie.poster_path}
          />
        ))}
      </div>
    </div>
  );
}
