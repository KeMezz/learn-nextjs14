import Movie from "@/components/movie";
import styles from "@/styles/similar.module.css";
import { getMovie, getSimilarMovies } from "@/apis/api";

export default async function SimilarPage({ params: { id } }) {
  const movie = await getMovie(id);
  const similarMovies = await getSimilarMovies(id);

  if (!similarMovies.length) {
    return <div className={styles.container}>No Similar Movies Found</div>;
  }

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
